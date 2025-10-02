import React, { useState, useEffect } from "react";

const TextBox = ({ message, userName, currUserName, messageColor, createdAt, clientCreatedAt }) => {
  const isCurrentUser = userName === currUserName;
  let formattedTime = "";
  if (createdAt?.seconds) {
    const date = new Date(createdAt.seconds * 1000 + createdAt.nanoseconds / 1e6);
    formattedTime = date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  }
  else {
    formattedTime = new Date(clientCreatedAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    console.log("this:",formattedTime);
  }

  return (
    <div className={`flex flex-col ${isCurrentUser ? 'items-end' : 'items-start'} mb-3`}>
      <div
        className={`max-w-xs px-3 py-2 rounded-lg shadow flex items-end gap-2 ${!isCurrentUser && 'border'}`}
        style={{
          color: `${isCurrentUser ? 'white' : messageColor}`,
          background: `${isCurrentUser ? messageColor : 'white'}`
        }}
      >
        <p className="text-[14px] flex-1">{message}</p>
        {(createdAt || clientCreatedAt) && (
          <p className={`text-[9px] italic ${currUserName === userName ? 'text-gray-200' : 'text-gray-400'} whitespace-nowrap`}>
            {formattedTime}
          </p>
        )}
      </div>
      <p className="text-xs mb-1 text-gray-400">{userName}</p>
    </div>

  );
}
export default TextBox;