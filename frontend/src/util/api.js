import axios from "axios";

const baseURL =
    process.env.REACT_APP_NODE_ENV === "development"
        ? "https://localhost:3001/api"
        : "https://www.netdiaryapp.com/api";

const api = axios.create({
    baseURL: baseURL,
});
export default api;