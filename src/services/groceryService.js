import axiosInstance from "../network/axios-instance";

export const fetchGroceriesList = async () => {
    return await axiosInstance.get("grocery/list");
}
