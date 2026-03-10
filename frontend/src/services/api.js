import axios from 'axios';

const API_URL = '/api';

const api = axios.create({
    baseURL: API_URL,
});

export const tripService = {
    getTrips: () => api.get('/trips'),
    getTrip: (id) => api.get(`/trips/${id}`),
    joinTrip: (code) => api.get(`/trips/join/${code}`),
    createTrip: (data) => api.post('/trips', data),
    deleteTrip: (id) => api.delete(`/trips/${id}`),
};

export const placeService = {
    getPlaces: (tripId) => api.get(`/places/${tripId}`),
    createPlace: (formData) => api.post('/places', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    }),
    deletePlace: (id) => api.delete(`/places/${id}`),
};

export const expenseService = {
    getExpenses: (tripId) => api.get(`/expenses/${tripId}`),
    createExpense: (data) => api.post('/expenses', data),
    deleteExpense: (id) => api.delete(`/expenses/${id}`),
};

export const timelineService = {
    getTimeline: (tripId) => api.get(`/timeline/${tripId}`),
    createTimeline: (data) => api.post('/timeline', data),
    deleteTimeline: (id) => api.delete(`/timeline/${id}`),
};

export default api;
