const BASE_URL = import.meta.env.VITE_API_URL;

const api = async (path, options = {}) => {
  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: { 'Content-Type': 'application/json', ...(options.headers || {}) }
  });
  return res;
};

export default api;
