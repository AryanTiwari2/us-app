import React,{useState,useEffect} from "react";

const TextBox = ({message,userName, currUserName,messageColor}) =>{
   const isCurrentUser = userName === currUserName;

  return (
    <div className={`flex flex-col ${isCurrentUser ? 'items-end' : 'items-start'} mb-3`}>
      <div
        className={`max-w-xs px-4 py-2 rounded-lg shadow ${!isCurrentUser && 'border'}`}
        style={{color:`${isCurrentUser ? 'white': messageColor}` , background:`${isCurrentUser ? messageColor : 'white'}`}}
      >
        <p className="text-sm">{message}</p>
      </div>
      <p className="text-xs mb-1 text-gray-400">{userName}</p>
    </div>
  );
}
export default TextBox;