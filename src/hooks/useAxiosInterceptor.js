import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API_BASE_URL from "../config/api";
import axios from 'axios';

const useAxiosInterceptor = () => {
    const navigate = useNavigate();
    const api = axios.create({
        baseURL: `${API_BASE_URL}`,
    });

    useEffect(() => {
        const interceptor = api.interceptors.response.use(
            res => res,
            err => {
                if (err.response?.status === 401) {
                    navigate('/login');
                }
                return Promise.reject(err);
            }
        );

        return () => api.interceptors.response.eject(interceptor);
    }, [navigate]);
};

export default useAxiosInterceptor;
