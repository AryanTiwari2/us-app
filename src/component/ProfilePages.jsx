import React, { useState, useEffect } from "react";
import ThemePicker from "./ThemePicker";

const ProfilePages = ({ }) => {
  return (
    <div className="rounded-xs flex justify-center h-full" style={{ background: 'pink' }}>
      <div className="mt-4 w-full">
        <div className="flex items-center justify-center bg-pink p-6 rounded-lg max-w-xl">
          <div className="flex flex-col items-center z-1">
            <img
              src="https://picsum.photos/200/200"
              className="md:h-32 md:w-32 h-28 w-28 rounded-full object-cover border-4 border-[#FFF8F9]"
              alt="profile"
            />
            <p className="permanent-marker-ultralight text-[#FFF8F9] text-[10px]">Change picture</p>
          </div>
          <div className="flex flex-col items-end justify-start">
            <p className="permanent-marker-ultralight text-[#FFF8F9] text-[10px] -mt-[20px]">Edit name</p>
            <div className="flex flex-col items-start">
              <div className="flex flex-col bg-[#FFF8F9] rounded-xl px-6 py-4 flex-1 relative items-end z-0 ml-[-25px]">
                <h1 className="text-2xl font-bold text-pink-400 permanent-marker-regular">HELLO KITTY</h1>
              </div>
              <p className="permanent-marker-ultralight text-[#FFF8F9] text-[10px] -mb-[10px]">He/She</p>
            </div>
          </div>
        </div>


        <div className="w-full h-1 bg-[#FFF8F9]"></div>


        <div className="flex flex-col items-center">
          <p className="text-[24px] text-[#FFF8F9] permanent-marker-light"><span className="permanent-marker-regular">Username :</span> @username123</p>
          <p className="text-[24px] text-[#FFF8F9] permanent-marker-light"><span className="permanent-marker-regular">Room :</span> Room 101</p>

          <div className="relative bg-pink-200 flex flex-col justify-center items-center ml-2 mr-2 mt-4">
            <h2 className="text-pink-400 text-lg font-bold mb-2 bg-[#FFF8F9] w-full px-6 py-2 text-center rounded-lg -mb-[10px] permanent-marker-light">About me
              <i class="fa-solid fa-pen text-sm ml-2"></i>
            </h2>
            <div className="bg-[#FFF8F9] w-full max-w-lg rounded-lg -mt-[20px] pl-2 pr-2 pb-4 pt-2">
              <p className="text-gray-600 text-sm permanent-marker-ultralight">
                This is my cute hand-drawn style text box ✨sddfffffffffffffffffwsdsfsdfdfdfgdfgdfgdgdgffg
              </p>
            </div>
          </div>

          <p className="text-[24px] text-[#FFF8F9] permanent-marker-regular">You can find me: </p>

          {/* Social Links */}
          <div className="flex space-x-6 mt-4">
            <a href="#" className="text-[#FFF8F9] text-3xl float">
              <i className="fa-brands fa-twitter"></i>
            </a>
            <a href="#" className="text-[#FFF8F9] text-3xl float">
              <i className="fa-brands fa-instagram"></i>
            </a>
            <a href="#" className="text-[#FFF8F9] text-3xl float">
              <i className="fa-brands fa-github"></i>
            </a>
            <a href="#" className="text-[#FFF8F9] text-3xl float">
              <i className="fa-brands fa-facebook"></i>
            </a>
          </div>
          <ThemePicker></ThemePicker>
        </div>

      </div>
    </div>
  )
}
export default ProfilePages;