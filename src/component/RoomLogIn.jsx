import React,{useEffect, useState} from "react";
import {signOut} from 'firebase/auth';
import { auth } from "../firebase-config";
import Cookies from "universal-cookie";
import Chat from "./Chat";
import ProfilePages from "./ProfilePages";
 import { constants } from "../constants";

const RoomLogin = (props) =>{
    const {setIsAuthenticated,isAuthenticated} = props;
    const cookies = new Cookies();
    const[userName,setUserName] = useState('');
    const[roomName,setRoomName] = useState('');
//    const singOutFromGoogle = async() =>{
//       await signOut(auth);
//       cookies.remove('auth-token');
//       setIsAuthenticated(null);

//    }

   const xorDecrypt = (encrypted, key) =>{
    const keyCodes = Array.from(key).map(c => c.charCodeAt(0));
    let decrypted = '';
    for (let i = 0; i < encrypted.length; i += 2) {
      const hexChunk = encrypted.substr(i, 2);
      const charCode = parseInt(hexChunk, 16) ^ keyCodes[(i / 2) % keyCodes.length];
      decrypted += String.fromCharCode(charCode);
    }
    // console.log("decrypted",decrypted);
    const value = decrypted.split(',');
    setUserName(value[0]);
    setRoomName(value[1]);
    return decrypted;
  }

  useEffect(()=>{
     xorDecrypt(isAuthenticated,constants["secretKey"]);
  },[]);

   const getSignOut=()=>{
     cookies.remove('auth-token');
     setIsAuthenticated(null);
   }
    return (
        <>
        <div className="h-screen sm:p-[2rem] flex">
          <div className="hidden md:flex w-1/2 h-full flex-col">
          <ProfilePages getSignOut={getSignOut}></ProfilePages>
          </div>
          <div className="w-full md:w-1/2 h-full flex flex-col">
          <Chat userName={userName} roomName={roomName}></Chat>
          </div>
        </div>
        </>
    );
}
export default RoomLogin;