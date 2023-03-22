import React, { useEffect, useState } from 'react';
import './Chats.css';
import { addDoc, collection, doc, getDocs, onSnapshot, orderBy, query, where } from 'firebase/firestore';
import { db } from '../../helper/firebase';
import happy from '../../assets/happy.png';
import filepicker from '../../assets/filepicker.png';
import TestChat from './TestChat';

const Chats = () => {

    const uid = JSON.parse(window.localStorage.getItem('data')).id_;
    const [friends, setFriends] = useState([]);
    const [message, setMessage] = useState(null);
    const [currFriend, setCurrFriend] = useState(null);
    const [chatID, setChatID] = useState(null);
    const [msgs, setMsgs] = useState([]);

    useEffect(() => {
        const q = query(collection(db, 'users'));
        getDocs(q).then((snap) => {
            const fList = [];
            console.log(snap.docs);
            snap.docs.forEach((frnd) => {
                fList.push({id_ : frnd.id , ...frnd.data()});
            })
            setFriends(fList);
        })
    }, []);

    const loadChat = async (frnd) => {
        if(currFriend && frnd.id_ === currFriend.id_) {
            return;
        }
        setMsgs([]);
        setCurrFriend(frnd);
        const friendId = frnd.id_;
        console.log('FRND', friendId);
        const quers = query(collection(db, 'coversation'), where('group_name', 'in', [`${uid}-${friendId}`, `${friendId}-${uid}`]));
        getDocs(quers).then((snap) => {
            if(snap.docs.length !== 0){
                console.log('AM BACK', snap.docs[0].id);
                setChatID(snap.docs[0].id);
                // const chatMessages = [];
                // const chat_query = query(collection(db, 'messages'), where('conversation_id' , '==' , snap.docs[0].id));
                // getDocs(chat_query).then((msgs) => {
                //     if(msgs.size !== 0){
                //         msgs.docs.forEach((msg) => {
                //             chatMessages.push(msg.data());
                //         })
                //         chatMessages.sort((a, b) => {
                //             if (a.timestamp > b.timestamp) {
                //                 return 1;
                //             }
                //             return -1;
                //         })
                //         setChat(chatMessages);
                //     }
                //     setLoading(false);
                // }).catch(err => {setLoading(false); window.alert(err)});
            }else{
                console.log("NOT FOUND");
                const TIMESTAMP = Date.now();
                addDoc(collection(db, 'coversation'), {
                    "group_name" : `${uid}-${friendId}`,
                    "timestamp" : TIMESTAMP,
                    "participants" : [uid, friendId]
                }).then((docRef) => {
                    console.log("NEW CONV : ", docRef.id);
                }).catch(err => console.log(err));
            }
        }).catch(err => console.log(err));
    }

    const sendMessage = async (e) => {
        e.preventDefault();
        if(!message || message.length == 0){
            return;
        }
        const myMsg = message;
        setMessage('');
        addDoc(collection(db,'messages'), {
            by : uid,
            timestamp : Date.now(),
            msg : myMsg,
            conversation_id : chatID
        }).then((docRef) => {
            console.log(docRef.id);
        }).catch(err => console.log(err));
    }


    return (
        <div className='chat-section'>
            <div className="chat-container">
                <div className='chat-sidebar'>
                    <div className="chat-user"><span>jaideepsinghsheoran</span></div>
                    <div className='chat-heading'><span>Chats</span></div>
                    <div className='chat-list'>
                        {
                            friends.length != 0 &&
                            friends.map((friend, i) => {
                                return (
                                    <div onClick={async (e) => {
                                        e.preventDefault();
                                        loadChat(friend);
                                    }} key={i} className='friend'>
                                        <div className="friend-img">
                                            <img src={friend.photoUrl} alt="" />
                                        </div>
                                        <div className='friend-info'>
                                            <div className="friend-user">{friend.username}</div>
                                            <div className="friend-last-msg">What is time ?</div>
                                        </div>
                                    </div>
                                );
                            })
                        }
                    </div>
                </div>
                <div className="selected-user-chat">
                    <div className="selected-user-info"><span>{currFriend ? currFriend.username : 'NK'}</span></div>
                    <div className="selected-messages">
                        {
                                // <>
                                //     {
                                //         currChat.length !== 0
                                //         ?
                                //             <div className="message-container">
                                //                 {
                                //                     currChat.map((msg, i) => {
                                //                         return (
                                //                             <div 
                                //                                 key={i} 
                                //                                 className="message-holder"
                                //                                 style={msg.by === uid ? {justifyContent : 'end'} : {justifyContent : 'start'}}
                                //                             >
                                //                                 <div 
                                //                                     className={(msg.by === uid) ? "message-box message-right" : "message-box message-left"}
                                //                                 >
                                //                                 <p>{msg.msg}</p>
                                //                                 </div>
                                //                             </div>
                                //                         )
                                //                     })
                                //                 }
                                //             </div>
                                //         :
                                //             <h1>NO CHAT</h1>
                                //     }
                                // </>
                                chatID && <TestChat chatID={chatID} msgs={msgs} setMsgs={setMsgs}/>
                        }
                    </div>
                    <div className="message-sender-form">
                        <form onSubmit={sendMessage} className='chat-form'>
                            <img 
                                    style={
                                        {
                                            height : '25px',
                                            filter : 'invert(1)'
                                        }
                                    } 
                                    src={happy} alt="Emoji" 
                            />
                            <input
                                value={message}
                                onChange={(e) => {setMessage(e.target.value)}}
                                placeholder='Type Message...' 
                                type="text" 
                            />
                            <div className="chat-img-send">
                                <img 
                                        style={
                                            {
                                                height : '25px',
                                                filter : 'invert(1)'
                                            }
                                        } 
                                        src={filepicker} alt="Emoji" 
                                />
                            </div>
                            <button>Send</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Chats;