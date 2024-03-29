import axios from 'axios'

import getBaseUrl from './localSettings'
const baseURL = getBaseUrl();

const axiosInstance = axios.create({
    baseURL: baseURL,
    timeout: 60000,
    headers: {
        'Authorization': "JWT " + localStorage.getItem('access_token'),
        'Content-Type': 'application/json',
        'accept': 'application/json'
    }
});


axiosInstance.interceptors.response.use(
    response => response,
    error => {
        const originalRequest = error.config;

        // Prevent infinite loops
        if (error.response.status === 401 && originalRequest.url === '/user/token/refresh/') {
            // window.location.href = '/user/login/';                  
            return Promise.reject(error);
        }

        if (error.response.data.code === "token_not_valid" &&
            error.response.status === 401 && 
            error.response.statusText === "Unauthorized") 
        {
            const refreshToken = localStorage.getItem('refresh_token');
            if (refreshToken){
                const tokenParts = JSON.parse(atob(refreshToken.split('.')[1]));
                const now = Math.ceil(Date.now() / 1000); // exp date in token is expressed in seconds, while now() returns milliseconds
                if (tokenParts.exp > now) {
                    return axiosInstance
                    .post('/user/token/refresh/', {refresh: refreshToken})
                    .then((response) => {
                        localStorage.setItem('access_token', response.data.access);
                        localStorage.setItem('refresh_token', response.data.refresh);
                        axiosInstance.defaults.headers['Authorization'] = "JWT " + response.data.access;
                        originalRequest.headers['Authorization'] = "JWT " + response.data.access;
                        return axiosInstance(originalRequest);
                    })
                    .catch(err => {
                        console.log(err)
                    });
                } else {
                    console.log("Refresh token is expired", tokenParts.exp, now);
                    // window.location.href = 'user/login/';
                }
            } else {
                console.log("Refresh token not available.")
                // window.location.href = 'user/login/';
            }
        }
      
      // specific error handling done elsewhere
      return Promise.reject(error);
  }
);


export default axiosInstance