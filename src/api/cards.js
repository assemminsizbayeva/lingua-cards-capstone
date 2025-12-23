import axios from "axios";
import { API_CONFIG, ENDPOINTS, getAuthHeader } from "./config.js";

const api = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
});

export const cardAPI = {
  getAllCards: async (userId) => {
    const response = await api.get(`${ENDPOINTS.CARDS}?userId=${userId}`);
    return response.data;
  },

  getCard: async (id) => {
    const response = await api.get(`${ENDPOINTS.CARDS}/${id}`);
    return response.data;
  },

  createCard: async (card) => {
    const response = await api.post(ENDPOINTS.CARDS, card, {
      headers: getAuthHeader(),
    });
    return response.data;
  },

  updateCard: async (id, updates) => {
    const response = await api.put(`${ENDPOINTS.CARDS}/${id}`, updates, {
      headers: getAuthHeader(),
    });
    return response.data;
  },

  deleteCard: async (id) => {
    await api.delete(`${ENDPOINTS.CARDS}/${id}`, {
      headers: getAuthHeader(),
    });
  },

  batchCreateCards: async (cards) => {
    const response = await api.post(ENDPOINTS.BATCH_CARDS, { cards }, {
      headers: getAuthHeader(),
    });
    return response.data;
  },

  getDueForReview: async (userId) => {
    const response = await api.get(`${ENDPOINTS.CARDS}?userId=${userId}&nextReview_lte=${new Date().toISOString()}`);
    return response.data;
  },
};
