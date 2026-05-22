const REVERSE_GEOCODING_ENDPOINT = 'https://nominatim.openstreetmap.org/reverse'

export async function resolveCurrentBrowserAddress(locale = 'es') {
    if (!navigator.geolocation) {
        throw new Error('Browser geolocation is unavailable.')
    }

    const coords = await getCurrentPosition()
    const latitude = Number(coords.latitude.toFixed(6))
    const longitude = Number(coords.longitude.toFixed(6))
    const addressLine = await reverseGeocodeAddress(latitude, longitude, locale)

    return {
        latitude,
        longitude,
        addressLine
    }
}

function getCurrentPosition() {
    return new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(
            ({ coords }) => resolve(coords),
            reject,
            { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
        )
    })
}

async function reverseGeocodeAddress(latitude, longitude, locale) {
    const params = new URLSearchParams({
        format: 'jsonv2',
        addressdetails: '1',
        lat: String(latitude),
        lon: String(longitude),
        'accept-language': resolveReverseGeocodingLanguage(locale)
    })

    const response = await fetch(`${REVERSE_GEOCODING_ENDPOINT}?${params.toString()}`)

    if (!response.ok) {
        throw new Error('Reverse geocoding request failed.')
    }

    const result = await response.json()
    return toReadableAddressLine(result)
}

function resolveReverseGeocodingLanguage(locale) {
    return String(locale ?? 'es').startsWith('es') ? 'es' : 'en'
}

function toReadableAddressLine(result) {
    const address = result?.address ?? {}
    const street = [
        address.road
            ?? address.pedestrian
            ?? address.footway
            ?? address.residential
            ?? address.path,
        address.house_number
    ].filter(Boolean).join(' ')

    const parts = [
        street || address.amenity || address.building,
        address.neighbourhood || address.suburb || address.quarter,
        address.city || address.town || address.village || address.county,
        address.state,
        address.country
    ].filter(Boolean)

    if (parts.length > 0) return parts.join(', ')
    if (result?.display_name) return result.display_name

    throw new Error('Reverse geocoding returned no readable address.')
}
