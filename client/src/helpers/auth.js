import cookie from 'js-cookie';

// SET cookie
export const setCookie = (key, value) => {
    if(window !== 'undefined'){
        cookie.set(key, value, { expires: 1 })
    }
};

// REMOVE Cookie
export const removeCookie = (key) => {
    if(window !== 'undefined'){
        cookie.remove(key)
    }
};

// GET cookie
export const getCookie = (key) => {
    if(window !== 'undefined'){
        return cookie.get(key)
    }
};

export const setLocalStorage = (key, value) => {
    if(window !== 'undefined'){
        localStorage.setItem(key, JSON.stringify(value));
    }
};

// Remove from localstorage
export const removeLocalStorage = (key) => {
    if(window !== 'undefined'){
        localStorage.removeItem(key);
    }
};

// Get user info from localstorage
export const isAuth = () => {
    if(window !== 'undefined'){
        const cookieChecked = cookie.get('token');
        if(cookieChecked){
            if(localStorage.getItem('user')){
                return JSON.parse(localStorage.getItem('user'));
            }else{
                return false;
            }
        }
    }
};

// Auth user after login
export const authenticate = (res, next) => {
    setCookie('token', res.data.token);
    setLocalStorage('user', res.data.user);
    next();
};

// SignOut
export const signout = next => {
    removeCookie('token');
    removeLocalStorage('user');
    next();
};

// update user data in localstorage
export const updateUser = (res, next) => {
    if(window !== 'undefined'){
        let auth = JSON.parse(localStorage.getItem('user'));
        auth = res.data;
        localStorage.setItem('user', JSON.stringify(auth));
    }
    next();
}

