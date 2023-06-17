import axios from "axios";

const api = axios.create({
    baseURL: "http://netdiaryapp.com/api/",
});

export default api;