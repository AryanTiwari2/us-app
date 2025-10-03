import React,{useState,useEffect} from "react";
import { apiConfig, UserType } from "../constants";

const Admin = ({userType,setCurrPage}) =>{
    if(userType != UserType.ADMIN){
        setCurrPage('profile');
    }

    const createRoom = async (roomName , roomType)=>{
        try{
            const token = cookies.get(cookieName.authToken);
        const config = {
            url: apiConfig.backendbaseUrl+ apiConfig.path.createRoom,
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'token': token
            },
            data: {
              roomName: roomName,
              roomType: roomType
            }
        }
        const response = await axios(config)
        return response.data;
        }catch(error){
            console.log(error);
            return;
        }
      }

    const updateRoom = async (roomName , roomType)=>{
        try{
            const token = cookies.get(cookieName.authToken);
        const config = {
            url: apiConfig.backendbaseUrl+ apiConfig.path.updateRoom,
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'token': token
            },
            data: {
              roomName: roomName,
              roomType: roomType
            }
        }
        const response = await axios(config)
        return response.data;
        }catch(error){
            console.log(error);
            return;
        }
      }

      const updateUserRoom = async (userName , roomName)=>{
        try{
            const token = cookies.get(cookieName.authToken);
        const config = {
            url: apiConfig.backendbaseUrl+ apiConfig.path.updateUserRoom,
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'token': token
            },
            data: {
              username: userName,
              roomName: [roomName]
            }
        }
        const response = await axios(config)
        return response.data;
        }catch(error){
            console.log(error);
            return;
        }
      }

      const removeUserRoom = async (userName , roomName)=>{
        try{
            const token = cookies.get(cookieName.authToken);
        const config = {
            url: apiConfig.backendbaseUrl+ apiConfig.path.removeUserRoom,
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'token': token
            },
            data: {
              username: userName,
              roomName: [roomName]
            }
        }
        const response = await axios(config)
        return response.data;
        }catch(error){
            console.log(error);
            return;
        }
      }

    
    return (
    <div className="">
      <button>THIS IS THE Admin PAGE</button>
    </div>
   )
}
export default Admin;