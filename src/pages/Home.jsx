import React from "react";
import SignIn from "../component/SignIn";
import RoomLogin from "../component/RoomLogIn";

const Home = (props)=>{
  const {isAuthenticated,setIsAuthenticated} = props;
    return (
        <>
        {
          !isAuthenticated ? 
          <SignIn setIsAuthenticated = {setIsAuthenticated}/>:
          <RoomLogin isAuthenticated = {isAuthenticated} setIsAuthenticated = {setIsAuthenticated}/>
        }
        </>
    )
}

export default Home;