import axios from 'axios';

const API_URL = `${import.meta.env.VITE_BACKEND_URI}/api`; // Update with your API base URL

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

// User Authentication
export const registerUser = async (userData) => {
  return await api.post('/auth/register', userData);
};

export const loginUser = async (userData) => {
  return await api.post('/auth/login', userData);
};
export const getUser = async (userId) => {
    return await api.get(`/auth/getuser/${userId}`); // Fetch user by ID
  };

// Medicine Schedule
export const createMedicine = async (medicineData) => {
  return await api.post('/medicine/create', medicineData);
};

export const getMedicines = async () => {
  return await api.get('/medicine/get');
};

export const createLog = async (logData) => {
    return await api.post('/log/createlogs', logData); // Corrected endpoint
  };
  
  export const getAcknowledgmentLogs = async () => {
    return await api.get('/log/getlogs'); // Corrected endpoint
  };
  
  export const getLogById = async (id) => {
    return await api.get(`/log/getlogs/${id}`); // Fetch log by ID
  };
  
  export const updateLog = async (id, logData) => {
    return await api.put(`/log/updatelogs/${id}`, logData); // Update log by ID
  };
  
  export const deleteLog = async (id) => {
    return await api.delete(`/log/updatelogs/${id}`); // Delete log by ID
  };
  
  export const getFilteredLogs = async (filters) => {
    return await api.get(`/log/filtered`, { params: filters }); // Fetch filtered logs
  };