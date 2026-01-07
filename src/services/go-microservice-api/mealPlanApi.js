import { goHttpClient } from '../baseApi';

export const MealPlanService = {
    getMealPlans: async () => {
        const response = await goHttpClient.get('/api/v1/meal-plans');
        return response.data;
    },

    createMealPlan: async (mealPlanData) => {
        const response = await goHttpClient.post('/api/v1/meal-plans', mealPlanData);
        return response.data;
    },

    getMealPlanById: async (id) => {
        const response = await goHttpClient.get(`/api/v1/meal-plans/${id}`);
        return response.data;
    },

    updateMealPlan: async (id, mealPlanData) => {
        const response = await goHttpClient.put(`/api/v1/meal-plans/${id}`, mealPlanData);
        return response.data;
    },

    deleteMealPlan: async (id) => {
        const response = await goHttpClient.delete(`/api/v1/meal-plans/${id}`);
        return response.data;
    }
};
