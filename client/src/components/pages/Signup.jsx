import React, { useState } from 'react';
import authSvg from '../../assets/auth_svg.svg'
import { ToastContainer, toast } from 'react-toastify';
import { authenticate, isAuth } from '../../helpers/auth';
import axios from 'axios';
import { Redirect } from 'react-router-dom';


const Signup = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        passwordConfirm: ''
    });

    const { email, name, password, passwordConfirm } = formData;

    const handleChange = name => e => {
        setFormData({
            ...formData,
            [name]: e.target.value
        })
    };

    const handleSubmit = e => {
        e.preventDefault();
        if(!email || !name || !password){
            return toast.error('All fields are neccessary');
        }
        if(password !== passwordConfirm){
            return toast.error('Passwords must match');
        }

        axios.post(`${process.env.REACT_APP_API_URL}/signup`, { name, email, password })
            .then(res => {
                //
                if(res.data.error){
                    return toast.error(res.data.error);
                }
                setFormData({
                    ...formData,
                    name: '',
                    email: '',
                    password: '',
                    passwordConfirm: ''
                });
                return toast.success(res.data.message);
            })
            .catch((err) => {
                console.log(err);
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
                            Sign up for Dashera
                        </h1>
                        <form className="w-full flex-1 mt-8 text-indigo-500" onSubmit={handleSubmit}>
                            <div className="mx-auto max-w-xs relative">
                                <input 
                                    type="text"
                                    placeholder="Name"
                                    onChange={handleChange('name')}
                                    value={name}
                                    className="w-full px-8 py-4 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white"
                                />
                                <input 
                                    type="email"
                                    placeholder="Email"
                                    onChange={handleChange('email')}
                                    value={email}
                                    className="w-full px-8 py-4 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white mt-5"
                                />
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
                            <div className="my-12 border-b text-center">
                                <div className="leading-none px-2 inline-block text-sm text-gray-600 tracking-wide font-medium bg-white transform translate-y-1/2">
                                    Or sign up with email or social login
                                </div>
                            </div>
                            <div className="flex flex-col items-center">
                                <a href="/" className="w-full max-w-xs font-bold shadow-sm rounded-lg py-3 bg-indigo-100 text-gray-800 flex items-center justify-center transition-all duration-300 ease-in-out focus:outline-none hover:shadow focus:shadow-sm focus:shadow-outline mt-5">Sign In</a>
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

export default Signup;