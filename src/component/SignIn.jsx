import React, { useState } from "react";
import { auth, provider } from "../firebase-config";
import { signInWithPopup } from 'firebase/auth';
import Cookies from "universal-cookie";
import signInBackground from '../assets/signInBackground.jpg'
import logo1 from '../assets/logo1.png';
import googleLogo from '../assets/google.png';
import { apiConfig, constants, cookieName } from "../constants";
import { showAlert } from "../utils";
import show from "../assets/show.png";
import hide from "../assets/hide.png";
import axios from "axios";

const SignIn = (props) => {
    const { setIsAuthenticated } = props;
    const cookies = new Cookies();
    const [userName, setUserName] = useState('');
    const [password, setPassword] = useState('');
    const [roomName, setRoomName] = useState('');
    const [confirmPassword, setConfirmPassword] = useState(''); 
    const [showPassword,setShowPassword] = useState(false);
    const [showConfirmPassword,setShowConfirmPassword] = useState(false);
    const [loading , setLoading] = useState(false);
    const [isLoginFlow, setIsLoginFlow] = useState(true);

    const  loginUserIntoSystem = async (userName, password , roomName) => {
        try{
            const config = {
                url: apiConfig.backendbaseUrl + apiConfig.path.login,
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                data: {
                    username : userName,
                    password : password,
                    roomName: roomName
                }
            }
            const response = await axios(config)
            return response.data;
        }catch(error){
            console.log(error);
            showAlert({
                type: "error",
                message: error?.response?.data?.message
            });
            return;
        }
    }

    const  signUpUserIntoSystem = async (userName, password ,confirmPassword ,roomName) => {
        try{
            const config = {
                url: apiConfig.backendbaseUrl + apiConfig.path.signIn,
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                data: {
                    username : userName,
                    password : password,
                    roomName: roomName,
                    confirmPassword: confirmPassword
                }
            }
            const response = await axios(config)
            return response.data;
        }catch(error){
            console.log(error);
            showAlert({
                type: "error",
                message: error?.response?.data?.message
            });
            return;
        }
    }

    const signInUserWithUserNamePassword = async ()=>{
        setLoading(true);
        if(!userName || !password || !roomName) return;
        const responseBody = await loginUserIntoSystem(userName, password, roomName);
        setLoading(false);
        if(responseBody){
            cookies.set(cookieName.authToken, responseBody?.token);
            setIsAuthenticated(responseBody?.token);
        }
    }

    const signUpNewUserWithUserNamePassword = async ()=>{
        if(!userName || !password || !roomName || !confirmPassword) return;
        if(password !== confirmPassword){
            setLoading(false);
            showAlert({
                type: "error",
                message: "Confirm Passwords do not match"
            })
            return;
        }
        setLoading(true);
        const responseBody = await signUpUserIntoSystem(userName, password,confirmPassword, roomName);
        setLoading(false);
        if(responseBody){
            cookies.set(cookieName.authToken, responseBody?.token);
            setIsAuthenticated(responseBody?.token);
        }
    }

    const toggleBetweenLoginFlow = () => {
        if(isLoginFlow){
             setRoomName('public');
        }else{
            setRoomName('');
        }
        setIsLoginFlow(!isLoginFlow);
        setPassword('');
        setConfirmPassword('');
        setUserName('');
    }

    return (
        <>
           {
                loading && (
                    <div className="loader-overlay">
                        <div className="spinner"></div>
                    </div>
                )
           }
            <div className="overflow-hidden h-screen sm:p-[2rem] flex items-center justify-center">
                <div className="flex justify-center items-center h-full w-full shadow-lg">
                    <div className="relative bg-pink-50 flex-1 bg-blue-300 h-32 flex justify-center items-center"
                        style={{ height: 'calc(100vh - 4rem)' }}>
                        <div className="absolute flex justify-center items-center top-10 gap-1">
                            <img src={logo1} className="w-[60px]" />
                            <p className="grechen-fuemen-regular text-[40px]" style={{ color: "#E1BA9E" }}><span style={{ color: "#9FA8DA" }}>Us</span>App</p>
                        </div>
                        <div>
                            <div className="flex flex-col items-center justify-center text-center">
                                <h1 className="darumadrop-one-regular text-[45px] sm:text-[65px]">Meet US!</h1>
                                <p className="text-pink-800 text-sm pl-2 pr-2">Sign in and let's make this journey together even more beautiful 🐼 </p>
                            </div>
                            {/* <div className="flex flex-col items-center justify-center text-center mt-8">
                                <button onClick={signUserUsingGoogle} className="flex justify-centeri tems-center gap-2 border-1 border-stone-400 pt-2 pb-2 pl-8 pr-8 rounded-xl shadow-lg cursor-pointer bg-slate-50">
                                    <img src={googleLogo} className="w-[30px]" />
                                    <p className="text-[20px] text-slate-500">Google</p>
                                </button>
                            </div> */}
                            <div className="flex flex-col items-center justify-center text-center mt-8">
                                <input required type="text" placeholder="User Name" className="flex justify-center items-center border-1 sm:w-[350px] w-[250px] border-stone-400 pt-2 pb-2 pl-2 pr-2 rounded-xl shadow-sm cursor-pointer bg-slate-50" onChange={(e) => { setUserName(e.target.value) }} value={userName} />
                            </div>
                            <div className="relative flex items-center justify-center text-center mt-2">
                                <input required type={showPassword ? "text" : "password"} placeholder="Password" className="flex justify-center border-1 sm:w-[350px] w-[250px] border-stone-400 pt-2 pb-2 pl-2 pr-2 rounded-xl shadow-sm cursor-pointer bg-slate-50" onChange={(e) => { setPassword(e.target.value) }} value={password} />
                                <img src={showPassword ? show : hide}  className="absolute sm:ml-[290px] ml-[200px] top-1/2 transform -translate-y-1/2 sm:w-[30px] w-[20px] cursor-pointer" alt="" onClick={()=>{setShowPassword(!showPassword)}} />
                            </div>
                            {
                                !isLoginFlow && (
                                    <div className="relative flex items-center justify-center text-center mt-2">
                                        <input required type={showConfirmPassword ? "text" : "password"} placeholder="Confirm Password" className="flex justify-center border-1 sm:w-[350px] w-[250px] border-stone-400 pt-2 pb-2 pl-2 pr-2 rounded-xl shadow-sm cursor-pointer bg-slate-50" onChange={(e) => { setConfirmPassword(e.target.value) }} value={confirmPassword} />
                                        <img src={showConfirmPassword ? show : hide} className="absolute sm:ml-[290px] ml-[200px] top-1/2 transform -translate-y-1/2 sm:w-[30px] w-[20px] cursor-pointer" alt="" onClick={() => { setShowConfirmPassword(!showConfirmPassword) }} />
                                    </div>
                                )
                            }
                            <div className="flex flex-col items-center justify-center text-center mt-2">
                                <input required type="text" placeholder={isLoginFlow ?"Room Name" : "Room Name  Ex: public"} className="flex justify-center items-center border-1 sm:w-[350px] w-[250px] border-stone-400 pt-2 pb-2 pl-2 pr-2 rounded-xl shadow-sm cursor-pointer bg-slate-50" onChange={(e) => { setRoomName(e.target.value) }} value={roomName} />
                            </div>
                            {isLoginFlow ? <div className="flex flex-col items-center justify-center text-center mt-2">
                                <button onClick={signInUserWithUserNamePassword} className={`flex justify-center items-center gap-2 border border-stone-400 sm:w-[350px] w-[250px] pt-2 pb-2 pl-8 pr-8 rounded-xl shadow-sm cursor-pointer ${(!userName || !password || !roomName)? 'bg-slate-400' : 'bg-blue-400'} text-center text-white`} disabled={!userName || !password || !roomName} >Log In</button>
                            </div>
                            : <div className="flex flex-col items-center justify-center text-center mt-2">
                                <button onClick={signUpNewUserWithUserNamePassword} className={`flex justify-center items-center gap-2 border border-stone-400 sm:w-[350px] w-[250px] pt-2 pb-2 pl-8 pr-8 rounded-xl shadow-sm cursor-pointer ${(!userName || !password || !roomName || !confirmPassword)? 'bg-slate-400' : 'bg-blue-400'} text-center text-white`} disabled={!userName || !password || !roomName || !confirmPassword} >Sign Up</button>
                            </div>
                            }
                            <div className="flex flex-col items-center justify-center text-center mt-4">
                                <p className="text-[10px] text-blue-500 italic cursor-pointer" onClick={() => { toggleBetweenLoginFlow() }}>{isLoginFlow ? "Don't have an account? Sign Up" : "Have an account? Log In"}</p>
                            </div>
                            <div className="flex flex-col items-center justify-center text-center mt-4">
                                <p className="text-[15px] text-slate-500 italic">Applied terms and conditions</p>
                            </div>
                        </div>
                    </div>
                    <div className={`hidden md:block relative flex-1 flex justify-center h-screen items-center bg-cover bg-center overflow-hidden`}
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