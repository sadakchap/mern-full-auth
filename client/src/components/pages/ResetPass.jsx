import React, { useEffect, useState } from 'react';
import authSvg from '../../assets/auth_svg.svg'
import { ToastContainer, toast } from 'react-toastify';
import { isAuth } from '../../helpers/auth';
import axios from 'axios';
import { Redirect } from 'react-router-dom';


const ResetPass = ({ match }) => {
    const [formData, setFormData] = useState({
        password: '',
        passwordConfirm: '',
        token: ''
    });

    const { password, passwordConfirm, token } = formData;

    useEffect(() => {
        const token = match.params.token;
        if(token){
            setFormData({
                ...formData,
                token
            });
        }
    }, []);

    const handleChange = name => e => {
        setFormData({
            ...formData,
            [name]: e.target.value
        })
    };

    const handleSubmit = e => {
        e.preventDefault();
        if(!password || (password !== passwordConfirm)){
            return toast.error('Passwords must match');
        }

        axios.put(`${process.env.REACT_APP_API_URL}/password/reset`, { newPassword: password, resetPasswordLink: token })
            .then(res => {
                //
                if(res.data.error){
                    return toast.error(res.data.error);
                }
                setFormData({
                    ...formData,
                    password: '',
                    passwordConfirm: '',
                    token: ''
                });
                return toast.success(res.data.message);
            })
            .catch((err) => {
                console.log(err);
                if(err.response) return toast.error(err.response.data.error)
                return toast.error('Sorry, something went wrong!')
            })
    }

    

    return (
        <div className="min-h-screen bg-gray-100 text-gray-900 flex justify-center">
            {isAuth() ? <Redirect to="/" /> : null}
            <ToastContainer />
            <div className="max-w-screen-lg m-0 sm:m-20 bg-white shadow sm:rounded-lg flex justify-center flex-1">
                <div className="lg:w-1/2 xl:w-5/12 p-6 sm:p-12">
                    <div className="mt-12 flex flex-col items-center">
                        <h1 className="text-2xl xl:text-3xl font-extrabold">
                            Reset your password
                        </h1>
                        <form className="w-full flex-1 mt-8 text-indigo-500" onSubmit={handleSubmit}>
                            <div className="mx-auto max-w-xs relative">
                                <input 
                                    type="password"
                                    placeholder="Password"
                                    onChange={handleChange('password')}
                                    value={password}
                                    className="w-full px-8 py-4 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white mt-5"
                                />
                                <input 
                                    type="password"
                                    placeholder="Password Confirm"
                                    onChange={handleChange('passwordConfirm')}
                                    value={passwordConfirm}
                                    className="w-full px-8 py-4 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white mt-5"
                                />
                                <button type="submit" className="mt-5 tracking-wide font-semibold bg-indigo-500 text-gray-100 w-full py-4 rounded-lg hover:bg-indigo-700">Register</button>
                            </div>
                        </form>
                    </div>
                </div>
                <div className="flex-1 bg-indigo-100 text-center hidden lg:flex">
                    <div className="m-12 xl:m-16 w-full bg-contain bg-center bg-no-repeat" style={{ backgroundImage: `url(${authSvg})`}}></div>
                </div>
            </div>
        </div>
    )
}

export default ResetPass;