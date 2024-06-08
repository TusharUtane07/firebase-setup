import { createUserWithEmailAndPassword } from 'firebase/auth';
import React, { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import {auth} from '../firebase/firebase'

const Signup = () => {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

	const navigate = useNavigate();
	const signUpUser = async(e) => {
		e.preventDefault();
		await createUserWithEmailAndPassword(auth, email, password)
			.then(() => {
				navigate("/login");
				console.log("Sign up Successfull!!");
			})
			.catch((error) => {
				console.log(error.message);
			});
	};

  return (
    <section className="bg-gray-50 ">
    <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
    <div className="">
        <h1 className='font-bold text-3xl mt-20 mb-10 uppercase'> Sign Up</h1>
    </div>
        <div className="w-full bg-white rounded-lg shadow sm:max-w-md xl:p-0 ">
            <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                <h1 className="text-xl text-center uppercase  font-bold leading-tight tracking-tight text-gray-900 md:text-2xl ">
                    Create your free account
                </h1>
                <form className="space-y-4 md:space-y-6">
                    <div>
                        <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 ">Your email</label>
                        <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" name="email" id="email" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5   " placeholder="name@company.com" required=""/>
                    </div>
                    <div>
                        <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 ">Password</label>
                        <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" name="password" id="password" placeholder="••••••••" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5   " required=""/>
                    </div>
                    {/* <div className="flex items-center justify-between">
                        <div className="flex items-start">
                            <div className="flex items-center h-5">
                              <input id="remember" aria-describedby="remember" type="checkbox" className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-primary-300  " required=""/>
                            </div>
                            <div className="ml-3 text-sm">
                              <label htmlFor="remember" className="text-gray-500 ">Remember me</label>
                            </div>
                        </div>
                        <a href="#" className="text-sm font-medium text-primary-600 hover:underline ">Forgot password?</a>
                    </div> */}
                    <div className='w-full text-center'>
                    <button className='font-bold bg-black text-white px-5 py-1 rounded-md' onClick={signUpUser}>Sign Up</button>
                    </div>
                    <p className="text-sm font-light text-gray-500 ">
                        Already have an Account? <NavLink to={'/login'} className="font-medium text-primary-600 hover:underline ">Sign in</NavLink>
                    </p>
                </form>
            </div>
        </div>
    </div>
  </section>
  )
}

export default Signup