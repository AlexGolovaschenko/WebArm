import axiosInstance from "./axiosApi";

class Auth{
    constructor() {
        this.authenticated = false;
        this.onLogin = ()=>{};
        this.onLogout = ()=>{};
        this.onUserInfoReaded = ()=>{};
    }

    async checkAuthentication (cb) {
        try {
            const response = await axiosInstance.get('/user/token/check/')
            if (response) {
                this._onLogin();
            } else {
                this._onLogout();
            }
        } catch (error) {
            this._onLogout();
        }    
        cb();         
    }

    async login(username, password, cb) {
        try {
            const response = await axiosInstance.post('/user/token/obtain/', {
              username: username,
              password: password
            });
            axiosInstance.defaults.headers['Authorization'] = "JWT " + response.data.access;
            localStorage.setItem('access_token', response.data.access);
            localStorage.setItem('refresh_token', response.data.refresh);
            this._onLogin();
            cb();
        } catch (error) {
            throw error;
        }
    }

    async logout(cb) {
        try {
            await axiosInstance.post('user/token/blacklist/', {
                "refresh_token": localStorage.getItem("refresh_token")
            });
            localStorage.removeItem('access_token');
            localStorage.removeItem('refresh_token');
            axiosInstance.defaults.headers['Authorization'] = null;
        } catch (error) {
            console.log(error);
        }
        this._onLogout();
        cb();        
    }

    isAuthenticated() {
        return this.authenticated;
    }

    async readUserInfo(){
        const request = await axiosInstance.get('/user/info/')
        this.onUserInfoReaded( { ...request.data } )
    }

    clearUserInfo(){
        this.userInfo = {}
    }

    _onLogin () {
        this.authenticated = true;
        this.onLogin();
        this.readUserInfo();
    }
    _onLogout () {
        this.authenticated = false;
        this.onLogout();
        this.clearUserInfo();        
    }
}

export default new Auth()