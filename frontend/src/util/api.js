import axios from "axios";

const baseURL =
    process.env.NODE_ENV === "development"
        ? "https://localhost:3001/api"
        : "https://www.netdiaryapp.com/api";

const api = axios.create({
    baseURL: "https://www.netdiaryapp.com/api",
});
export default api;