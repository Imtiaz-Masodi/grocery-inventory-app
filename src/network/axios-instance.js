import axios from "axios";

const apiBaseUrl = 'http://localhost:3300/';
const axiosDefaultConfig = {
	baseURL: apiBaseUrl,
	headers: {
		'Content-Type': 'application/json',
	},
};

const axiosInstance = axios.create(axiosDefaultConfig);

export default axiosInstance;
