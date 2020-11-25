import axiosInstance from "./axiosApi";

class Auth{
    constructor() {
        this.authenticated = false;
    }

    async checkAuthentication (cb) {
        try {
            await axiosInstance.get('api/v1/device')
            this.authenticated = true;
        } catch (error) {
            this.authenticated = false;
        }    
        cb();         
    }

    login(cb) {
        this.authenticated = true;
        cb();
    }

    logout(cb) {
        this.authenticated = false;
        cb();        
    }

    isAuthenticated() {
        return this.authenticated;
    }

}

export default new Auth()