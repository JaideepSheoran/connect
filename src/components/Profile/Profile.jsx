import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import './Profile.css';
import { db } from '../../helper/firebase';
import { collection, doc, getDoc, getDocs, query, where } from 'firebase/firestore';


const Profile = () => {
    const {uid} = useParams();
    const [profileData, setProfileData] = useState(null);
    const [posts, setPosts] = useState([]);

    const getProfileData = async () => {
        try {
            const profileRawData = await getDoc(doc(db, 'users', uid));
            setProfileData({...profileRawData.data(), id : profileRawData.id});
        } catch (error) {
            console.log(error);
        }
    }

    const getUserPosts = async () => {
        try {
            const postsRawData = await getDocs(query(collection(db, 'posts'), where('uid', "==", uid)));
            const list = [];
            postsRawData.docs.forEach((snapshot) => {
                list.push({...snapshot.data(), id : snapshot.id});
            })
            setPosts([...list]);
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        getProfileData();
        getUserPosts();
    }, []);
    
    
    return (
        <div>
            <h1>PROFILE</h1>
            {profileData && <p>Profile of User {uid} & {JSON.stringify(profileData)}</p>}
            <ul>
                {
                    posts && posts.map((post, i) => {
                        return <li key={i}>{JSON.stringify(post)}</li>
                    })
                }
            </ul>
        </div>
    )
}

export default Profile