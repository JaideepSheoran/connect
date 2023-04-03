import React, { useRef, useEffect } from "react";

const Message = ({ msg, user1 }) => {
    const scrollRef = useRef();

    useEffect(() => {
        scrollRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [msg]);
    return (
        <div
            ref={scrollRef}
            className="message-holder"
            style={msg.from === user1 ? { justifyContent: 'end' } : { justifyContent: 'start' }}
        >
            <div className={(msg.from === user1) ? "message-box message-right" : "message-box message-left"}>
                <p>
                    {msg.media ? <img src={msg.media} alt={msg.text} /> : null}
                    {msg.text}
                </p>
            </div>
        </div>
    );
};

export default Message;
