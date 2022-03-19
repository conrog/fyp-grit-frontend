import axios from "axios";

const API_URL = process.env.REACT_APP_GRIT_API;

//For mobile testing
// const API_URL_LOCAL = process.env.REACT_APP_GRIT_API_LOCAL_NETWORK;

const api = axios.create({
  baseURL: `${API_URL}`,
});

export default api;
