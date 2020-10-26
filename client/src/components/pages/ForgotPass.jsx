import React, { useState } from 'react';
import forget from '../../assets/4.svg'
import { ToastContainer, toast } from 'react-toastify';
import { isAuth } from '../../helpers/auth';
import axios from 'axios';
import { Redirect } from 'react-router-dom';



const ForgotPass = () => {
    const [formData, setFormData] = useState({
        email: ''
    });

    const { email } = formData;
    

    const handleChange = name => e => {
        setFormData({
            ...formData,
            [name]: e.target.value
        })
    };

    const handleSubmit = e => {
        e.preventDefault();
        if(!email){
            return toast.error('Email is required field');
        }

        axios.put(`${process.env.REACT_APP_API_URL}/passwords/forget`, { email })
            .then(res => {
                if(res.data.error){
                    return toast.error(res.data.error);
                }
                return toast.success('Please check you Inbox!');
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
                            Forget Password
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
                                <button type="submit" className="mt-5 tracking-wide font-semibold bg-indigo-500 text-gray-100 w-full py-4 rounded-lg hover:bg-indigo-700">Sumit</button>
                            </div>
                        </form>
                    </div>
                </div>
                <div className="flex-1 bg-indigo-100 text-center hidden lg:flex">
                    <div className="m-12 xl:m-16 w-full bg-contain bg-center bg-no-repeat" style={{ backgroundImage: `url(${forget})`}}></div>
                </div>
            </div>
        </div>
    )
}

export default ForgotPass;