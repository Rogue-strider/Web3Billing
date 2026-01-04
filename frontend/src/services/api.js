// import axios from "axios";

// const api = axios.create({
//   baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
// });

// // 🔐 Access token attach
// api.interceptors.request.use((config) => {
//   const token = localStorage.getItem("accessToken");
//   if (token) {
//     config.headers.Authorization = `Bearer ${token}`;
//   }
//   return config;
// });

// export default api;


import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
});

// 🔐 JWT ATTACH (THIS WAS THE BUG)
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken"); // 🔥 FIX HERE
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;

