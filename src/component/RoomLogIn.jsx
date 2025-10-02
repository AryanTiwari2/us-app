import React,{useEffect, useState} from "react";
import {signOut} from 'firebase/auth';
import { auth } from "../firebase-config";
import Cookies from "universal-cookie";
import Chat from "./Chat";
import ProfilePages from "./ProfilePages";
import Movies from "./Movies";
import Plans from "./Plans";
 import { apiConfig, constants } from "../constants";
import SideDrawer from "./SideDrawer";
import { cookieName } from "../constants";
import axios from "axios";
import Rooms from "./Rooms";
import Admin from "./Admin";
import Moderator from "./Moderator";

const RoomLogin = (props) =>{
    const {setIsAuthenticated,isAuthenticated} = props;
    const [color, setColor] = useState('primary');
    const cookies = new Cookies();
    const[userName,setUserName] = useState('');
    const[userType , setUserType] = useState('');
    const[roomName,setRoomName] = useState('');
    const [currPage,setCurrPage] = useState('profile');
    const [loading , setLoading] = useState(false);

  const fetchData = async ()=>{
    try{
      const token = cookies.get(cookieName.authToken);
    const config = {
        url: apiConfig.backendbaseUrl + apiConfig.path.parseToken,
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'token': token
        },
    }
    const response = await axios(config)
    return response.data;
    }catch(error){
        console.log(error);
        return;
    }
  }

  const getUserInfo = async ()=>{
    setLoading(true);
    const responseBody = await fetchData();
    setLoading(false);
    if(!responseBody){
      setIsAuthenticated(null);
      return;
    }
    setUserName(responseBody["username"]);
    setRoomName(responseBody["roomName"]);
    setUserType(responseBody["userType"]);
  }

  useEffect(()=>{
     getUserInfo();
  },[]);

   const getSignOut=()=>{
     cookies.remove(cookieName.authToken);
     setIsAuthenticated(null);
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
        <div className="h-screen sm:p-[2rem] flex">
          <SideDrawer color={color} setCurrPage={setCurrPage} getSignOut={getSignOut} currPage={currPage} userType={userType}></SideDrawer>
          {currPage==="profile" && <div className="w-full md:w-1/2 h-full flex flex-col">
          <ProfilePages ></ProfilePages>
          </div>}
          {currPage==="chat" && <div className="w-full md:w-1/2 h-full flex flex-col">
          <Chat color={color}setColor={setColor} userName={userName} roomName={roomName}></Chat>
          </div>}
          {currPage==="movie" && <div className="w-full md:w-1/2 h-full flex flex-col">
          <Movies ></Movies>
          </div>}
          {currPage==="plan" && <div className="w-full md:w-1/2 h-full flex flex-col">
          <Plans ></Plans>
          </div>}
          {currPage==="rooms" && <div className="w-full md:w-1/2 h-full flex flex-col">
          <Rooms ></Rooms>
          </div>}
          {currPage==="admin" && <div className="w-full md:w-1/2 h-full flex flex-col">
          <Admin ></Admin>
          </div>}
          {currPage==="moderator" && <div className="w-full md:w-1/2 h-full flex flex-col">
          <Moderator ></Moderator>
          </div>}
          <div className="hidden md:flex w-1/2 h-full flex-col">
          <Chat color={color}setColor={setColor} userName={userName} roomName={roomName}></Chat>
          </div>
        </div>
        </>
    );
}
export default RoomLogin;