import React, { useState } from "react";
import { auth, provider } from "../firebase-config";
import { signInWithPopup } from 'firebase/auth';
import Cookies from "universal-cookie";
import signInBackground from '../assets/signInBackground.jpg'
import logo1 from '../assets/logo1.png';
import googleLogo from '../assets/google.png'

const SignIn = (props) => {
    const { setIsAuthenticated } = props;
    const cookies = new Cookies();
    const signUserUsingGoogle = async () => {
        const response = await signInWithPopup(auth, provider);
        cookies.set('auth-token', response.user.refreshToken);
        setIsAuthenticated(response.user.refreshToken);
    }

    return (
        <>
            <div className="overflow-hidden h-screen sm:p-[2rem] flex items-center justify-center">
                <div className="flex justify-center items-center h-full w-full shadow-lg">
                    <div className="relative bg-pink-50 flex-1 bg-blue-300 h-32 flex justify-center items-center"
                        style={{ height: 'calc(100vh - 4rem)' }}>
                        <div className="absolute flex justify-center items-center top-10 gap-1">
                            <img src={logo1} className="w-[60px]"/>
                            <p className="grechen-fuemen-regular text-[40px]" style={{ color: "#E1BA9E" }}><span style={{color:"#9FA8DA"}}>Us</span>App</p>
                        </div>
                        <div>
                        <div className="flex flex-col items-center justify-center text-center">
                          <h1 className="darumadrop-one-regular text-[45px] sm:text-[65px]">Meet US!</h1>
                          <p className="text-pink-800 text-sm pl-2 pr-2">Sign in and let's make this journey together even more beautiful 🐼 </p>
                        </div>
                        <div className="flex flex-col items-center justify-center text-center mt-8">
                            <button onClick={signUserUsingGoogle} className="flex justify-center items-center gap-2 border-1 border-stone-400 pt-2 pb-2 pl-8 pr-8 rounded-xl shadow-lg cursor-pointer bg-slate-50">
                                <img src={googleLogo} className="w-[30px]"/>
                                <p className="text-[20px] text-slate-500">Google</p>
                            </button>
                        </div>
                        <div className="flex flex-col items-center justify-center text-center mt-4">
                            <p className="text-[15px] text-slate-500 italic">Login using your google account</p>
                        </div>
                        </div>
                    </div>
                    <div className={`hidden sm:block relative flex-1 flex justify-center h-screen items-center bg-cover bg-center overflow-hidden`}
                        style={{
                            backgroundImage: `url(${signInBackground})`,
                            backgroundRepeat: 'no-repeat',
                            backgroundSize: 'cover',
                            height: 'calc(100vh - 4rem)',
                        }} >
                        <a href="https://github.com/AryanTiwari2"><h1 className="kanit-bold absolute bottom-0 left-0 m-4 cursor-pointer">@Build By US</h1></a>
                    </div>
                </div>
            </div>
        </>
    );
}
export default SignIn;