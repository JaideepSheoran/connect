import React, { useEffect, useState } from "react";
import Img from '../../assets/defaultUser.png';

import { onSnapshot, doc } from "firebase/firestore";
import { db } from "../../helper/firebase";

const User = ({ user1, user, selectUser, chat }) => {
    const user2 = user?.uid;
    const [data, setData] = useState("");

    useEffect(() => {
        const id = user1 > user2 ? `${user1 + user2}` : `${user2 + user1}`;
        let unsub = onSnapshot(doc(db, "lastMsg", id), (doc) => {
            setData(doc.data());
        });
        return () => unsub();
    }, []);

    return (
        <>
            <div className='friend' onClick={() => selectUser(user)} >
                <div className="friend-img">
                    <img src={user.photoUrl} alt="" />
                </div>
                <div className='friend-info'>
                    <div className="friend-user">{user.username}</div>
                    <div className="friend-last-msg">
                        {data && 
                            <>
                                <strong>{data.from === user1 ? "Me:" : null}</strong>
                                {data.text}
                            </>
                        }
                    </div>
                </div>
            </div>
        </>
    );
};

export default User;
