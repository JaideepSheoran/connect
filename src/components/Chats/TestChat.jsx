import React, { useEffect, useRef, useState } from 'react';
import { db } from '../../helper/firebase';
import { collection, onSnapshot, query, where } from 'firebase/firestore';
import './Chats.css';
import messanger from '../../assets/messanger.png';

const TestChat = ({chatID, msgs, setMsgs}) => {
    const uid = JSON.parse(window.localStorage.getItem('data')).id_;
    const ref = useRef();
    const cid = chatID;
    useEffect(() => {
        // if(!chatID){
        //     return;
        // }
        const unsub = onSnapshot(query(collection(db, 'messages'), where('conversation_id', '==', cid)), (snapshot) => {
            const chats = [];
            snapshot.docs.forEach((shot) => {
                chats.push(shot.data());
            });
            chats.sort((a, b) => {
                if(a.timestamp > b.timestamp){
                    return 1;
                }
                return -1;
            })
            setMsgs(chats);
        })

        return () => {
            unsub();
        }
    }, [chatID]);


    useEffect(() => {
        ref.current?.scrollIntoView();
    }, [msgs])


    return (
        <>
        {
            msgs.length !== 0
            ?
            <div className="message-container">
                {
                    msgs.map((msg, i) => {
                        return (
                            <div
                                key={i}
                                ref={ref}
                                className="message-holder"
                                style={msg.by === uid ? { justifyContent: 'end' } : { justifyContent: 'start' }}
                            >
                                <div
                                    className={(msg.by === uid) ? "message-box message-right" : "message-box message-left"}
                                >
                                    <p>{msg.msg}</p>
                                </div>
                            </div>
                        )
                    })
                }
            </div>
            :
            <div style={{
                display : 'flex',
                justifyContent : 'center',
                flexDirection : 'column',
                alignItems : 'center',
                marginTop : '50px'
            }}>
                <img 
                    style={{
                        filter : 'invert(1)',
                        height : '150px'
                    }} 
                    src={messanger} 
                    alt="" 
                />
                <h2>Start Conversation</h2>
            </div>
        }
        </>
    )
}

export default TestChat