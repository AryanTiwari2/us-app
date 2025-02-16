import React from "react";
import {signOut} from 'firebase/auth';
import { auth } from "../firebase-config";
import Cookies from "universal-cookie";

const RoomLogin = (props) =>{
    const {setIsAuthenticated} = props;
    const cookies = new Cookies();
   const singOutFromGoogle = async() =>{
      await signOut(auth);
      cookies.remove('auth-token');
      setIsAuthenticated(null);

   }
    return (
        <>
        <button onClick={singOutFromGoogle} className="cursor-pointer">Logout</button>
        <p>See you in next version</p>
        </>
    );
}
export default RoomLogin;