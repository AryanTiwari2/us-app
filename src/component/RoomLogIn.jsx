import React from "react";
import {signOut} from 'firebase/auth';
import { auth } from "../firebase-config";
import Cookies from "universal-cookie";

const RoomLogin = (props) =>{
    const {setIsAuthenticated} = props;
    const cookies = new Cookies();
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
    return decrypted;
  }
   const getSignOut=()=>{
     cookies.remove('auth-token');
     setIsAuthenticated(null);
   }
    return (
        <>
        <button onClick={getSignOut} className="cursor-pointer">Logout</button>
        <p>See you in next version</p>
        </>
    );
}
export default RoomLogin;