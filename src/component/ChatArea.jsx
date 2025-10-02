import React, { useRef, useEffect, useState } from "react";
import TextBox from "./TextBox";

function ChatArea({ messages, messageColor, userName, fetchMoreMessages }) {
    const scrollRef = useRef();
    const endRef = useRef(null);

    useEffect(() => {
        endRef.current?.scrollIntoView();
    }, [messages]);

    const getMessageDate = (msg) => {
        if (msg.createdAt?.seconds) {
            return new Date(msg.createdAt.seconds * 1000 + (msg.createdAt.nanoseconds || 0) / 1e6);
        } else if (msg.clientCreatedAt) {
            return new Date(msg.clientCreatedAt);
        } else {
            return new Date(); // fallback to now
        }
    };

    return (
        <div
            ref={scrollRef}
            className="flex-1 overflow-y-auto p-4 space-y-2"
            onScroll={() => {
                if (scrollRef.current.scrollTop === 0) {
                    fetchMoreMessages();
                }
            }}
        >
            {messages.map((data, index) => {
                const prevData = messages[index - 1];
                const currentDate = getMessageDate(data);
                const prevDate = prevData ? getMessageDate(prevData) : null;

                const showDateSeparator =
                    !prevData || currentDate.toDateString() !== prevDate.toDateString();
                const formattedDate = currentDate.toLocaleDateString([], {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric'
                });

                return (
                    <React.Fragment key={index}>
                        {showDateSeparator && (
                            <div className="flex justify-center my-2">
                                <p className="text-xs text-gray-500 bg-gray-200 px-3 py-1 rounded-full mb-3">
                                    {formattedDate}
                                </p>
                            </div>
                        )}
                        <TextBox
                            message={data.text}
                            userName={data.username}
                            currUserName={userName}
                            createdAt={data.createdAt}
                            clientCreatedAt={data.clientCreatedAt}
                            messageColor={messageColor}
                        />
                    </React.Fragment>
                );
            })}
            <div ref={endRef} />
        </div>

    );
}

export default ChatArea;
