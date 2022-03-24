import axios from "axios";

// const API_URL = process.env.REACT_APP_GRIT_API;

//For mobile testing
const API_URL = process.env.REACT_APP_GRIT_API_LOCAL_NETWORK;

const api = axios.create({
  baseURL: `${API_URL}`,
});

api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response.status === 401) {
      sessionStorage.removeItem("token");
      window.location.reload();
    } else {
      return Promise.reject(error);
    }
  }
);

export default api;
