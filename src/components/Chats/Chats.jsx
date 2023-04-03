import React, { useEffect, useState } from 'react';
import './Chats.css';
import { addDoc, collection, doc, getDocs, onSnapshot, orderBy, query, where, serverTimestamp as firestoreTimeStamp } from 'firebase/firestore';
import { db } from '../../helper/firebase';
import happy from '../../assets/happy.png';
import filepicker from '../../assets/filepicker.png';
import TestChat from './TestChat';
import { rtdb } from '../../helper/firebase';
import { ref, onValue, serverTimestamp, onDisconnect, set, get } from 'firebase/database';

const Chats = () => {

    const uid = JSON.parse(window.localStorage.getItem('data')).id_;
    const [friends, setFriends] = useState([]);
    const [message, setMessage] = useState(null);
    const [unread, setUnreads] = useState(new Map());
    const [conversationIds, setconversationIds] = useState([]);
    const [currFriend, setCurrFriend] = useState(null);
    const [chatID, setChatID] = useState(null);
    const [msgs, setMsgs] = useState([]);
    const [search, setSearch] = useState('');
    const [list, setList] = useState([]);

    // useEffect(() => {
    //     var userStatusDatabaseRef = ref(rtdb, '/status/' + uid);

    //     var isOfflineForFirestore = {
    //         state: 'offline',
    //         last_changed: serverTimestamp()
    //     };
        
    //     var isOnlineForFirestore = {
    //         state: 'online',
    //         last_changed: serverTimestamp(),
    //     };  


    //     const unsub = onValue(ref(rtdb, '.info/connected'), (snapshot) => {
    //         if(snapshot.val() == false){
    //             console.log('NOT CONNECTED');
    //             return;
    //         }

    //         onDisconnect(userStatusDatabaseRef).set(isOfflineForFirestore).then(() => {
    //             set(userStatusDatabaseRef, isOnlineForFirestore);
    //         })

    //     })
    //     return () => {
    //         unsub();
    //     }
    // });

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

    useEffect(() => {
        if(chatID === null){
            return;
        }
        // const q = query(collection(db, 'messages'), where('conversation_id', '!=', chatID));
        // const hashMap = new Map(unread);
        // const unsub = onSnapshot(q, (snapshot) => {
        //     snapshot.docChanges().forEach((change) => {
        //         if (change.type === "added") {
        //             const newMsg = change.doc.data();
        //             if(hashMap.has(newMsg.by)){
        //                 let val = hashMap.get(newMsg.by);
        //                 val.push(newMsg);
        //                 hashMap.set(newMsg.by, val);
        //             }else{
        //                 hashMap.set(newMsg.by, [newMsg]);
        //             }
        //         }
        //     });
        //     console.log(hashMap);
        //     setUnreads(hashMap);
        // }, (err) => {console.log(err);})

        // return () => {
        //     unsub()
        // }
        // getDocs(q).then((snapshot) => {
        //     const conversation_ids = [];
        //     const unreads = [];
        //     snapshot.docs.forEach((document) => {
        //         conversation_ids.push(document.id);
        //         get(ref(rtdb, '/chatstatus/' + document.id + '/user/' + uid)).then((lastSeen) => {
        //             const last_seen = lastSeen.val().last_seen;
        //             getDocs(query(collection(db, 'messages'), where('timestamp' , '>=', last_seen), where('conversation_id', '==', document.id))).then((unseens) => {
        //                 unreads.push(unseens.size);
        //                 console.log(unseens.size);
        //             })
        //         })
        //     })
        //     setUnreads(unreads);
        //     setconversationIds(conversation_ids);
        // }).catch(err => console.log(err));
    }, []);



    const loadChat = async (frnd) => {
        if(currFriend && frnd.id_ === currFriend.id_) {
            return;
        }
        setMsgs([]);
        setCurrFriend(frnd);
        const friendId = frnd.id_;
        const prevChatID = chatID;
        console.log('FRND', friendId);
        const quers = query(collection(db, 'coversation'), where('group_name', 'in', [`${uid}-${friendId}`, `${friendId}-${uid}`]));
        getDocs(quers).then((snap) => {
            if(snap.docs.length !== 0){
                console.log('AM BACK', snap.docs[0].id);
                setChatID(snap.docs[0].id);
            }else{
                console.log("NOT FOUND");
                addDoc(collection(db, 'coversation'), {
                    "group_name" : `${uid}-${friendId}`,
                    "timestamp" : firestoreTimeStamp(),
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
            timestamp : firestoreTimeStamp(),
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
                            friends.length !== 0 &&
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