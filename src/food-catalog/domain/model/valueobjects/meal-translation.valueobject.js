const MEAL_TRANSLATIONS = {
    en: {
        1: {
            nombre: 'Mixed sandwich with juice',
            complemento: 'Toasted bread with ham, cheese, coffee, and juice'
        },
        2: {
            nombre: 'Ham and cheese croissant',
            complemento: 'Croissant filled with ham and cheese'
        },
        3: {
            nombre: 'Pork sandwich with tamal',
            complemento: 'Pork, sweet potato, onion relish, tamal, and coffee'
        },
        4: {
            nombre: 'Roast beef sandwich with juice',
            complemento: 'Bread with beef, potatoes, and strawberry juice'
        },
        5: {
            nombre: 'Peruvian chicken rice',
            complemento: 'Chicken, green rice, and onion relish'
        },
        6: {
            nombre: 'Classic lomo saltado',
            complemento: 'Sauteed beef, rice, and golden potatoes'
        },
        7: {
            nombre: 'Aji de gallina',
            complemento: 'Chicken in yellow chili cream with rice'
        },
        8: {
            nombre: 'Beef stew with beans',
            complemento: 'Braised beef, beans, rice, and potato'
        },
        9: {
            nombre: 'Quinoa salad',
            complemento: 'Quinoa, cucumber, tomato, and fresh herbs'
        },
        10: {
            nombre: 'Creole beef soup',
            complemento: 'Tomato broth, noodles, beef, and egg'
        },
        11: {
            nombre: 'Fish fillet',
            complemento: 'Grilled fish with salad'
        },
        12: {
            nombre: 'Quinoa tortilla',
            complemento: 'Quinoa tortilla with onion relish'
        }
    }
}

export function localizeMeal(meal, locale) {
    const language = String(locale ?? '').split('-')[0]
    const translation = MEAL_TRANSLATIONS[language]?.[meal?.id]

    if (!translation) return meal

    return {
        ...meal,
        nombre: translation.nombre,
        complemento: translation.complemento
    }
}
