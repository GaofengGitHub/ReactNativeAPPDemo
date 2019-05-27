import  request from "./RequestUtil"; 
import * as urls from '../constants/Urls';
import storeSimple from 'react-native-simple-store';
import {refreshTokenTimer} from '../actions/main';
import {store} from '../root';

export const getSerVersion = (successCB, errorCB) => {
    const url= urls.APP_UPDATE_SERVER;
    request.request(url, 'GET','json', '').then(    
        (data) => { 
            successCB && successCB(data);
        }
    ).catch((err) => { errorCB(err)}) 
}

export const login = (body,successCB, errorCB) => { 
    const url= urls.API_CONFIG.login;
    request.request(url, 'POST','form', body).then(    
        (data) => {
            successCB && successCB(data);
        }
    ).catch((err) => { errorCB(err)}) 
}

export const validateHaveChildren = (successCB, errorCB) => { 
    const url= urls.API_CONFIG.validateHaveChildren;
    storeSimple.get('userInfo').then((userInfo) => {
        request.request(url, 'POST','form', '',userInfo.token).then(    
            (data) => {
                store.dispatch(refreshTokenTimer());
                successCB && successCB(data);
            }
        ).catch((err) => { errorCB(err)}) 
    })
}

export const tokenExchange = (successCB, errorCB) => { 
    const url= urls.API_CONFIG.tokenExchange;
    storeSimple.get('userInfo').then((userInfo) => {
        request.request(url, 'POST','form', '',userInfo.token).then(    
            (data) => {
                successCB && successCB(data);
            }
        ).catch((err) => { errorCB(err)}) 
    })
}

export const getNewsList = (nextUrl,successCB, errorCB) => { 
    const url= nextUrl||urls.API_CONFIG.getNewsList;
    storeSimple.get('userInfo').then((userInfo) => {
        request.request(url, 'POST','form', '',userInfo.token).then(    
            (data) => {
                store.dispatch(refreshTokenTimer());
                successCB && successCB(data);
            }
        ).catch((err) => { errorCB(err)}) 
    })
}

export const sendCheckMsg = (phone, smsType,successCB, errorCB) => { 
    const url= urls.API_CONFIG.sendCheckMsg;
    request.request(url, 'POST','formData', {
        phone: phone,
        smsType: smsType
    }).then(    
        (data) => {
            successCB && successCB(data);
        }
    ).catch((err) => { errorCB(err)}) 
}

export const userRegister = (phone, verificationCode,userPassword,successCB, errorCB) => { 
    const url= urls.API_CONFIG.userRegister;
    request.request(url, 'POST','formData', {
        phone: phone,
        verificationCode: verificationCode,
        userPassword:userPassword
    }).then(    
        (data) => {
            successCB && successCB(data);
        }
    ).catch((err) => { errorCB(err)}) 
}

export const forgotPwd = (phone, verificationCode,userPassword,successCB, errorCB) => { 
    const url= urls.API_CONFIG.forgotPwd;
    request.request(url, 'POST','formData', {
        verificationCode: verificationCode,
        loginName: phone,
        userPassword:userPassword
    }).then(    
        (data) => {
            successCB && successCB(data);
        }
    ).catch((err) => { errorCB(err)}) 
}

export const lonlatToLocation = (lon, lat,successCB, errorCB) => { 
    const url= urls.TENGXUN_MAP_URL+lat+','+lon;
    request.request(url, 'GET','json', '').then(    
        (data) => {
            successCB && successCB(data);
        }
    ).catch((err) => { errorCB(err)}) 
}

export const getWeather = (cityName,successCB, errorCB) => { 
    const url= urls.API_CONFIG.getWeather;
    storeSimple.get('userInfo').then((userInfo) => {
        request.request(url, 'POST','formData', {cityName:cityName},userInfo.token).then(    
            (data) => {
                store.dispatch(refreshTokenTimer());
                successCB && successCB(data);
            }
        ).catch((err) => { errorCB(err)}) 
    })
}

export const getByClass = (nextUrl,classId,successCB, errorCB) => { 
    const url= nextUrl||urls.API_CONFIG.getByClass;
    storeSimple.get('userInfo').then((userInfo) => {
        request.request(url, 'POST','formData', {classId:classId},userInfo.token).then(    
            (data) => {
                store.dispatch(refreshTokenTimer());
                successCB && successCB(data);
            }
        ).catch((err) => { errorCB(err)}) 
    })
}

export const getUserInfo = (userId,successCB, errorCB) => { 
    const url= urls.API_CONFIG.getUserInfo;
    storeSimple.get('userInfo').then((userInfo) => {
        request.request(url, 'POST','formData', {userId:userId},userInfo.token).then(    
            (data) => {
                store.dispatch(refreshTokenTimer());
                successCB && successCB(data);
            }
        ).catch((err) => { errorCB(err)}) 
    })
}