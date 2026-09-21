import axios from 'axios';

const API_BASE = '/api';

export const fetchServices = async (params = {}) => {
  const res = await axios.get(`${API_BASE}/services`, { params });
  return res.data;
};

export const fetchServiceDetails = async (id) => {
  const res = await axios.get(`${API_BASE}/services/${id}`);
  return res.data;
};

export const createService = async (serviceData) => {
  const res = await axios.post(`${API_BASE}/services`, serviceData);
  return res.data;
};

export const fetchDestinations = async () => {
  const res = await axios.get(`${API_BASE}/destinations`);
  return res.data;
};

export const runTrustScoreCheck = async (serviceId) => {
  const res = await axios.post(`${API_BASE}/trust-score`, { service_id: serviceId });
  return res.data;
};

export const runPriceCheck = async (data) => {
  const res = await axios.post(`${API_BASE}/price-check`, data);
  return res.data;
};

export const runReviewAnalysis = async (serviceId) => {
  const res = await axios.post(`${API_BASE}/review-analysis`, { service_id: serviceId });
  return res.data;
};

export const generateTrip = async (data) => {
  const res = await axios.post(`${API_BASE}/trip-recommendation`, data);
  return res.data;
};

export const fetchTrustNetwork = async (destination = 'All') => {
  const res = await axios.get(`${API_BASE}/trust-network`, { params: { destination } });
  return res.data;
};

export const fetchHeatmapData = async (destination = 'All') => {
  const res = await axios.get(`${API_BASE}/heatmap`, { params: { destination } });
  return res.data;
};

export const fetchDemandTrends = async (destination = 'All') => {
  const res = await axios.get(`${API_BASE}/demand`, { params: { destination } });
  return res.data;
};

export const fetchBusinessInsights = async () => {
  const res = await axios.get(`${API_BASE}/business-insights`);
  return res.data;
};

export const fetchAuthorityDashboard = async (destination = 'All') => {
  const res = await axios.get(`${API_BASE}/authority-dashboard`, { params: { destination } });
  return res.data;
};

export const submitFeedback = async (data) => {
  const res = await axios.post(`${API_BASE}/feedback`, data);
  return res.data;
};

export const loginUser = async (credentials) => {
  const res = await axios.post(`${API_BASE}/auth/login`, credentials);
  return res.data;
};

export const registerUser = async (userData) => {
  const res = await axios.post(`${API_BASE}/auth/register`, userData);
  return res.data;
};
