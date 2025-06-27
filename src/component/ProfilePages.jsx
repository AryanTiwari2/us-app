import React,{useState,useEffect} from "react";
import { colorMap } from "../constants";

const ProfilePages = ({getSignOut}) =>{
        const [color , setColor] = useState('green');
        const [backgroudColor,setBackgroudColor] = useState('');
        const [borderColor,setBorderColor] = useState('');
        useEffect(()=>{
            setBackgroudColor(colorMap[color].background);
            setBorderColor(colorMap[color].bg)
        },[color]);
   return (
    <div className={`${borderColor} rounded-sm p-4`}>
      <button onClick={getSignOut}>signout</button>
    </div>
   )
}
export default ProfilePages;