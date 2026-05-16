export const SUBSCRIPTION_PLANS = [
    {
        code: 'Essential',
        nameKey: 'subscriptionPlans.essential.name',
        descriptionKey: 'subscriptionPlans.essential.description',
        mealsPerDay: 1,
        monthlyPrice: 149
    },
    {
        code: 'Balance',
        nameKey: 'subscriptionPlans.balance.name',
        descriptionKey: 'subscriptionPlans.balance.description',
        mealsPerDay: 2,
        monthlyPrice: 249
    },
    {
        code: 'Full',
        nameKey: 'subscriptionPlans.full.name',
        descriptionKey: 'subscriptionPlans.full.description',
        mealsPerDay: 3,
        monthlyPrice: 349
    }
]

export function getSubscriptionPlan(code) {
    const normalizedCode = normalizeSubscriptionCode(code)
    return SUBSCRIPTION_PLANS.find(plan => plan.code === normalizedCode) ?? SUBSCRIPTION_PLANS[2]
}

export function normalizeSubscriptionCode(code) {
    switch (String(code ?? '').toLowerCase()) {
        case 'essential':
        case 'standard':
            return 'Essential'
        case 'balance':
        case 'breakfastlunch':
        case 'lunchdinner':
            return 'Balance'
        case 'full':
            return 'Full'
        default:
            return 'Full'
    }
}
