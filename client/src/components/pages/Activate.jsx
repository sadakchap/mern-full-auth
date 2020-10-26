import React, { useState, useEffect } from 'react';
import activate from '../../assets/3.svg'
import { ToastContainer, toast } from 'react-toastify';
import { authenticate, isAuth } from '../../helpers/auth';
import axios from 'axios';
import { Redirect, useHistory } from 'react-router-dom';

const Activate = ({ match }) => {

    const [token, setToken] = useState('');
    const history = useHistory();

    useEffect(() => {
        const token = match.params.token;
        if(token){
            setToken(token);
        }
    }, []);

    const handleSubmit = e => {
        e.preventDefault();
        axios.post(`${process.env.REACT_APP_API_URL}/activate`, { token })
            .then((res) => {
                setToken('');
                toast.success(res.data.message);
                setTimeout(() => {
                    history.push('/');
                }, 3000);
            })
            .catch((err) => {
                if(err.response)
                    return toast.error(err.response.data.error.message)
                toast.error('Sorry, something went wrong!')
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
                           Confirm your email
                        </h1>
                        <form onSubmit={handleSubmit} className="w-full flex-1 mt-8 text-indigo-500">
                            <button type="submit" className="mt-5 tracking-wide font-semibold bg-indigo-500 text-gray-100 w-full py-4 rounded-lg hover:bg-indigo-700">Confirm</button>
                        </form>
                    </div>
                </div>
                <div className="flex-1 bg-indigo-100 text-center hidden lg:flex">
                    <div className="m-12 xl:m-16 w-full bg-contain bg-center bg-no-repeat" style={{ backgroundImage: `url(${activate})`}}></div>
                </div>
            </div>
        </div>
    )
}

export default Activate
