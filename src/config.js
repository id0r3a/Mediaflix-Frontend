const API_URL =
  import.meta.env.MODE === "development"
    ? "https://localhost:7026"
    : "https://your-production-url.com"; // byt ut i produktion

export default API_URL;
