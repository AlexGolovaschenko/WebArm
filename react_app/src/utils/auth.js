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
            await axiosInstance.get('user/token/check')
            this.onLogin();
            this.readUserInfo();
            this.authenticated = true;
        } catch (error) {
            this.onLogout();
            this.clearUserInfo();
            this.authenticated = false;
        }    
        cb();         
    }

    login(cb) {
        this.authenticated = true;
        this.onLogin();
        this.readUserInfo();
        cb();
    }

    logout(cb) {
        this.authenticated = false;
        this.onLogout();
        this.clearUserInfo();
        cb();        
    }

    isAuthenticated() {
        return this.authenticated;
    }

    async readUserInfo(){
        const request = await axiosInstance.get('user/info/')
        this.onUserInfoReaded( { ...request.data } )
    }

    clearUserInfo(){
        this.userInfo = {}
    }

}

export default new Auth()