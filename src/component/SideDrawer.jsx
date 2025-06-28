import { useState } from "react";
import logo1 from '../assets/logo1.png'

export default function SideDrawer({setCurrPage,getSignOut,currPage}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Floating Toggle Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed top-4 left-4 z-50 text-white p-2 rounded-lg transition cursor-pointer"
      >
        <i class="fa-solid fa-bars"></i>
      </button>

      {/* Overlay (optional) */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-opacity-40 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Side Drawer */}
      <div
        className={`fixed top-0 left-0 h-full w-64 bg-white shadow-lg z-50 transform transition-transform ${isOpen ? "translate-x-0" : "-translate-x-full"
          }`}
      >
        <div className="flex justify-start gap-2 items-center p-2">
          <div className="flex justify-center items-center top-10 gap-1 p-2 cursor-pointer">
            <img src={logo1} className="w-12" />
            <p className="grechen-fuemen-regular text-[2rem]" style={{ color: "#E1BA9E" }}><span style={{ color: "#9FA8DA" }}>Us</span>App</p>
          </div>
        </div>
        <div className="flex flex-col gap-2 p-4">

          <button className={`flex justify-start gap-8 items-center p-2 rounded hover:bg-gray-300 cursor-pointer ${currPage==='profile' && 'bg-gray-200'}`}
          onClick={()=>{setCurrPage('profile'); setIsOpen(false);} }
          >
            <i class="fa-solid fa-user"></i>
            <p className="libre-baskerville-bold text-lg">Profile</p>
          </button>

          <button className={`md:hidden flex justify-start gap-8 items-center p-2 rounded hover:bg-gray-300 cursor-pointer ${currPage==='chat' && 'bg-gray-200'}`}
          onClick={()=>{setCurrPage('chat'); setIsOpen(false);}}
          >
            <i class="fa-brands fa-rocketchat"></i>
            <p className="libre-baskerville-bold text-lg">Chat</p>
          </button>

          <button className={`flex justify-start gap-8 items-center p-2 rounded hover:bg-gray-300 cursor-pointer ${currPage==='movie' && 'bg-gray-200'}`}
          onClick={()=>{setCurrPage('movie'); setIsOpen(false);}}
          >
            <i class="fa-solid fa-film"></i>
            <p className="libre-baskerville-bold text-lg">Movies</p>
          </button>

          <button className={`flex justify-start gap-8 items-center p-2 rounded hover:bg-gray-300 cursor-pointer ${currPage==='plan' && 'bg-gray-200'}`}
          onClick={()=>{setCurrPage('plan'); setIsOpen(false);}}
          >
            <i class="fa-solid fa-lightbulb"></i>
            <p className="libre-baskerville-bold text-lg">Plans</p>
          </button>

          <button className="flex justify-start gap-8 items-center p-2 rounded hover:bg-gray-200 cursor-pointer"
          onClick={getSignOut}>
            <i class="fa-solid fa-arrow-left" style={{ color: "#dc2626" }}></i>
            <p className="libre-baskerville-bold text-lg text-red-600">Log Out</p>
          </button>
        </div>
      </div>
    </>
  );
}
