import React, { useState } from 'react';
import login from '../../assets/login.svg'
import { ToastContainer, toast } from 'react-toastify';
import { authenticate, isAuth } from '../../helpers/auth';
import axios from 'axios';
import { Redirect, useHistory } from 'react-router-dom';


const Signin = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });

    const { email, password} = formData;
    const history = useHistory();

    const handleChange = name => e => {
        setFormData({
            ...formData,
            [name]: e.target.value
        })
    };

    const handleSubmit = e => {
        e.preventDefault();
        if(!email || !password){
            return toast.error('All fields are neccessary');
        }

        axios.post(`${process.env.REACT_APP_API_URL}/signin`, { email, password })
            .then(res => {
                if(res.data.error){
                    return toast.error(res.data.error);
                }
                authenticate(res, () => {
                    setFormData({
                        ...formData,
                        email: '',
                        password: ''
                    });
                    toast.success('Sign in successfull');
                });

                isAuth() && isAuth().role === 1 ? history.push('/admin') : history.push('/private');
                toast.success(`Hey, ${res.data.user.name}, Welcome back!`);
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
                            Sign In for Dashera
                        </h1>
                        <form className="w-full flex-1 mt-8 text-indigo-500" onSubmit={handleSubmit}>
                            <div className="mx-auto max-w-xs relative">
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
                                <button type="submit" className="mt-5 tracking-wide font-semibold bg-indigo-500 text-gray-100 w-full py-4 rounded-lg hover:bg-indigo-700">Sign in</button>
                                <a href="/user/password/forgot" className="no-underline hover:underline text-indigo-500 text-sm  mt-2">Forgot Password?</a>
                            </div>
                            <div className="my-12 border-b text-center">
                                <div className="leading-none px-2 inline-block text-sm text-gray-600 tracking-wide font-medium bg-white transform translate-y-1/2">
                                    Or sign up
                                </div>
                            </div>
                            <div className="flex flex-col items-center">
                                <a href="/signup" className="w-full max-w-xs font-bold shadow-sm rounded-lg py-3 bg-indigo-100 text-gray-800 flex items-center justify-center transition-all duration-300 ease-in-out focus:outline-none hover:shadow focus:shadow-sm focus:shadow-outline mt-5">Sign Up</a>
                            </div>
                        </form>
                    </div>
                </div>
                <div className="flex-1 bg-indigo-100 text-center hidden lg:flex">
                    <div className="m-12 xl:m-16 w-full bg-contain bg-center bg-no-repeat" style={{ backgroundImage: `url(${login})`}}></div>
                </div>
            </div>
        </div>
    )
}

export default Signin;