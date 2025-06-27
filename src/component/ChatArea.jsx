import React, { useRef, useEffect, useState } from "react";
import TextBox from "./TextBox";

function ChatArea({ messages, messageColor,userName }) {
    const endRef = useRef(null);
    useEffect(() => {
        endRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    return (
        <div className="flex flex-col flex-1 overflow-hidden">
            <div className="flex-1 overflow-y-auto p-4 space-y-2">
                {messages.map((data, index) => (
                    <div key={index}>
                        <TextBox message={data.text} userName={data.username} currUserName={userName} messageColor={messageColor}></TextBox>
                    </div>
                ))}
                <div ref={endRef} />
            </div>
        </div>
    );
}

export default ChatArea;
