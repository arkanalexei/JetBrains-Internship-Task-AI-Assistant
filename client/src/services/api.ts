import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";
import { message as antdMessage } from "antd";

// Create an instance of axios with default configuration
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

// Function to fetch data from a given resource
export const apiFetcher = (resource: string) =>
  api.get(resource).then((res) => res.data);

// Request interceptor to attach Authorization token if available
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
    const token = encodeURIComponent(
      localStorage.getItem("username") || "Anonymous"
    );
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError): Promise<AxiosError> => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle 401 Unauthorized errors and API downtime
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error: AxiosError) => {
    // Handle 401 Unauthorized errors
    if (error.response?.status === 401) {
      localStorage.removeItem("username");
      window.location.href = "/";
    }

    // Handle API downtime or network errors
    if (error.code === "ECONNABORTED" || !error.response) {
      antdMessage.error(
        "Unable to connect to the server. Please try again later."
      );
    }

    return Promise.reject(error);
  }
);

// Export the api instance as default
export default api;
