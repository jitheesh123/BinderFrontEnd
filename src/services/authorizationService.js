/* eslint-disable no-unused-vars */
import axios from "axios";
import { API_ROUTE, ORIGIN_URL } from "../config/contstants";
import ToastMsg from "../components/common/ToastMessage";

export const logbookGateWay = axios.create({
    baseURL: API_ROUTE,
    timeout: 300000,
    withCredentials: true,
    headers: {}
});

logbookGateWay.interceptors.response.use(
    res => {
        return res;
    },
    function (res) {
        if (res.response && res.response.status === 401) {
            localStorage.clear();
            window.location.href = "/";
        }
        if (res.response && res.response.status === 400) {
            ToastMsg(res.response.data?.message || "Something went wrong!", "info");
        }
        return res;
    }
);

logbookGateWay.interceptors.request.use(function (config) {
    const token = localStorage.getItem("logbook-token");
    config.headers = {
        ...config.headers,
        Authorization: `Bearer ${token}`,
        "Access-Control-Allow-Origin": ORIGIN_URL
    };
    return config;
});

// export const restCountriesGateWay = axios.create({
//     baseURL: "https://restcountries.eu",
//     timeout: 20000
// });
