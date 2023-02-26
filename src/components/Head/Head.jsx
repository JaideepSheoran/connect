import React from 'react';
import './Head.css';
import Gallary from '../Gallary/Gallary';
import Reels from '../ReelsGallary/Reels'
import connect from '../../assets/connect-logo.png';
import tagged from '../../assets/hash.svg';
import postsicon from '../../assets/posts.png';
import reels from '../../assets/reels.png';
import defaultUser from '../../assets/defaultUser.png';
import { useSelector, useDispatch } from 'react-redux'
import { useEffect } from 'react';
import { onSnapshot, doc, query, collection, where  } from 'firebase/firestore';
import { db } from '../../helper/firebase';
import { useState } from 'react';
import { Link, Route, Routes, useNavigate } from 'react-router-dom';

const Head = ({match}) => {

    const userData = JSON.parse(window.localStorage.getItem('data'));
    const user = useSelector((state) => state.getUser);
    const [isFollowing, setFollowing] = useState(false);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    useEffect(() => {
       const unsub = onSnapshot(doc(db, 'users', userData.id_), (snap) => {
            dispatch({
                type : 'SET_USER',
                payload : {...snap.data(), id : snap.id}
            })
       }, (err) => {
            console.log(err);
       });
       return () => unsub();
    }, []);
    

    return (
        <div className='full-pro'>
            <div className='pro-head'>
                <div className="pro-details">
                    <div className="pro-pic">
                        {
                            Object.keys(user).length > 1 ? 
                            <img src={user.photoUrl} alt="" />
                            :
                            <img src={defaultUser} alt=""/>
                        }
                    </div>
                    <div className='pro-data'>
                        <div className="pro-name">
                            <span>jaideepsinghsheoran</span>
                            <button>Follow</button>
                        </div>
                        <div className="pro-numdata">
                            <span className='pro-postcnt'>10<span>Posts</span></span>
                            <span className='pro-follower'>{user.followers}<span>Followers</span></span>
                            <span className='pro-following'>7<span>Following</span></span>
                        </div>
                        <div className="pro-about">Jaideep Singh Sheoran <br /> HR86 - Hisar - Haryana</div>
                    </div>
                </div>
                <div className="pro-navbar">
                        <Link className='linkin' to={`profile`}>
                            <img src={postsicon} alt="" srcset="" />
                            <div>POSTS</div>
                        </Link>
                        <Link className='linkin' to={`profile/reels`}>
                            <img src={reels} alt="" srcset="" />
                            <div>REELS</div>
                        </Link>
                        <Link className='linkin' to={`profile`}>
                            <img src={tagged} alt="" srcset="" />
                            <div>TAGGED</div>
                        </Link>
                </div>
            </div>
            <div className='pro-posts'>
                <Routes>
                    <Route path={`profile`} element={<Gallary />}/>
                    <Route path={`profile/reels`} element={<Reels />}/>
                </Routes>
            </div>
        </div>
    )
}

export default Head