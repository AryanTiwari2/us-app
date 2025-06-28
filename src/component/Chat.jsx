import React, { useEffect, useState, useRef } from "react";
import { colorMap,allowedColors } from "../constants";
import ChatArea from "./ChatArea";
import send from '../assets/send.png';
import Picker from '@emoji-mart/react'
import data from '@emoji-mart/data';
import { FireBaseDBinfo } from "../constants";
import { getFirestore, collection, query, where, orderBy, onSnapshot, addDoc, serverTimestamp } from "firebase/firestore";

const Chat = ({userName , roomName, color,setColor}) => {
    const [backgroudColor, setBackgroudColor] = useState('');
    const [bgColor, setBgColor] = useState('');
    const [messageColor , setmessageColor] = useState('');
    const [text, setText] = useState("");
    const [pickerOpen, setPickerOpen] = useState(false);
    const buttonRef = useRef(null);
    const pickerRef = useRef(null);
    const db = getFirestore();
    const [messages, setMessages] = useState([]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                pickerRef.current &&
                !pickerRef.current.contains(event.target) &&
                !buttonRef.current.contains(event.target)
            ) {
                setPickerOpen(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    const onEmojiClick = (emoji) => {
        setText((prev) => prev + emoji.native)
        setPickerOpen(false)
    }

    async function sendMessage() {
        await addDoc(collection(db, FireBaseDBinfo.DB_NAME), {
            text,
            room_name:roomName,
            username:userName,
            createdAt: serverTimestamp()
        });
    }

    function listenToMessages(room_name, callback) {
        const q = query(
            collection(db, FireBaseDBinfo.DB_NAME),
            where("room_name", "==", room_name),
            orderBy("createdAt", "desc")
        );

        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const messages = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            })).reverse();
            callback(messages);
        });

        return unsubscribe;
    }

    useEffect(() => {
        if (!roomName) return;
        const stop = listenToMessages(roomName, (msgs) => {
            setMessages(msgs);
        });

        return () => stop();
    }, [roomName]);


    useEffect(() => {
        setBackgroudColor(colorMap[color].background);
        setBgColor(colorMap[color].bg);
        setmessageColor(colorMap[color].messageColor)
    }, [color]);

    const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleInputClick();
    }
  };


    const changeColor = ()=>{
        const match = text.match(/^color:([a-zA-Z]+)$/);
        if(!match || !allowedColors.includes(match[[1]])){
            return false;
        }
        setColor(match[1]);
        setText('');
        return true;
    }

    const handleInputClick = () =>{
        if(changeColor()) {
            return;
        }
        sendMessage(text,roomName,userName);
        setText('');
    }


    return (
        <div className={`h-full rounded-sm p-0 lg:p-4`} style={{background:`${bgColor}`}}>
            <div className={`shadow-lg rounded-sm h-full`} style={{background:`${backgroudColor}`}}>
                <div className="pt-4 sticky top-0 z-10 bg-inherit">
                    <h3 className="text-lg roboto-regular text-center text-white">{userName}</h3>
                    <h4 className="text-sm kanit-bold text-center text-white">{roomName}</h4>
                </div>

                <div className="flex flex-col pt-4  md:h-[90%] h-[100%] rounded-t-[40px] rounded-b-sm bg-white">
                    <ChatArea messageColor={messageColor} userName={userName} messages={messages}/>
                    <div className={`border-2 rounded-full flex items-center mt-4`} style={{borderColor:`${backgroudColor} `}}>
                        <button className="p-2" onClick={()=>setPickerOpen(open => !open)}>
                            <i className="fa-solid fa-face-smile" style={{ color: `${backgroudColor}` }}></i>
                        </button>
                        <input type="text" className="libre-baskerville-regular border-none flex-1 text-lg focus:outline-none" style={{color:`${messageColor}`}} value={text} onKeyDown={handleKeyDown} onChange={(e)=>setText(e.target.value)}/>
                        <button className={`p-2 rounded-full`} style={{background:`${backgroudColor}`}} onClick={handleInputClick}>
                            <img src={send} alt="send" className="w-6 h-6 lg:w-6 lg:h-6 rounded-full" />
                        </button>
                    </div>
                    {pickerOpen && (
                        <div
                            ref={pickerRef}
                            style={{
                                position: 'absolute',
                                bottom: '50px',
                                left: '0px',
                                zIndex: 9999,
                                boxShadow: '0px 0px 10px rgba(0,0,0,0.1)'
                            }}
                        >
                            <Picker data={data} onEmojiSelect={onEmojiClick} />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
export default Chat;