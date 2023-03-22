import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import './Profile.css';
import { db } from '../../helper/firebase';
import { collection, doc, getDoc, onSnapshot, query, where , writeBatch, increment} from 'firebase/firestore';
import GallaryItem from '../Gallary/GallaryItem';
import hourglass from '../../assets/hourglass.gif';
import { Link, Route, Routes, useNavigate } from 'react-router-dom';
import defaultUser from '../../assets/defaultUser.png';
import tagged from '../../assets/hash.svg';
import postsicon from '../../assets/posts.png';
import reels from '../../assets/reels.png';
import { UserAuth } from '../../context/AuthContext';

const Profile = () => {
    const user = JSON.parse(window.localStorage.getItem('data'));
    const { uid } = useParams();
    const [profileData, setProfileData] = useState(null);
    const [posts, setPosts] = useState([]);
    const [isFollowing, setFollowing] = useState('');

    const getProfileData = async () => {
        try {
            const profileRawData = await getDoc(doc(db, 'users', uid));
            setProfileData({ ...profileRawData.data(), id: profileRawData.id });
        } catch (error) {
            console.log(error);
        }
    }

    const getUserPosts = async () => {
        const q = query(collection(db, 'posts'), where('uid', '==', uid));

        try {
            onSnapshot(q, (res) => {
                var list = [];
                res.docs.forEach((doc) => {
                    list.push({ id: doc.id, ...doc.data() });
                });
                setPosts(list);
            }, (err) => {
                window.alert(err);
            });

        } catch (error) {
            console.log(error);
        }
    }


    useEffect(() => {
        
        if(!uid || !user) {
            return;
        }
        const q = query(collection(db, "followers"), where('uid', '==', user.id_), where('fid', '==', uid));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            if(!snapshot.empty){
                setFollowing(snapshot.docs[0].id);
            }else{
                setFollowing('');
            }
        }, (err) => {
            console.log(err);
        });

        return () => unsubscribe();
    }, []);

    useEffect(() => {
        getProfileData();
        getUserPosts();
    }, []);


    const followUnfollow = async (e) => {
        e.preventDefault();

        if (isFollowing) {
            const batch = writeBatch(db);
            const userRef = doc(db, 'users', uid); // influencer
            const followRef = doc(db, 'followers', isFollowing);
            batch.update(userRef, {followers : increment(-1)});
            batch.update(doc(db, 'users', user.id_), {following : increment(-1)});
            batch.delete(followRef);
            await batch.commit();
        } else {
            const batch = writeBatch(db);
            const userRef = doc(db, 'users', uid);
            const followRef = doc(collection(db, 'followers')); // influencer
            batch.update(userRef, {followers : increment(1)});
            batch.update(doc(db, 'users', user.id_), {following : increment(1)});
            batch.set(followRef, {
                uid : user.id_,
                fid : uid
            });
            await batch.commit();
        }

    }


    return (
        <div className='userProfile'>
            <div className='full-pro'>
                <div className='pro-head'>
                    <div className="pro-details">
                        {
                            profileData &&
                            <>
                                <div className="pro-pic">
                                {
                                    Object.keys(profileData).length > 1 ?
                                        <img src={profileData.photoUrl} alt="" />
                                        :
                                        <img src={defaultUser} alt="" />
                                }
                                </div>
                                <div className='pro-data'>
                                    <div className="pro-name">
                                        <span>{profileData.username}</span>
                                        <button style={isFollowing === '' ? {
                                            cursor : 'pointer'
                                        } : {
                                            cursor : 'pointer',
                                            backgroundColor : 'black',
                                            border : '1px solid white'
                                        }} onClick={followUnfollow}>
                                        {
                                            isFollowing === '' ? <>Follow</> : <>Following</>
                                        }
                                        </button>
                                    </div>
                                    <div className="pro-numdata">
                                        <span className='pro-postcnt'>{posts.length}<span>Posts</span></span>
                                        <span className='pro-follower'>{profileData.followers}<span>Followers</span></span>
                                        <span className='pro-following'>{profileData.following}<span>Following</span></span>
                                    </div>
                                    <div className="pro-about">{profileData.email} <br /> HR86 - Hisar - Haryana</div>
                                </div>
                            </>
                        }
                    </div>
                    {/* <div className="pro-navbar">
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
                    </div> */}
                </div>
                {/* <div className='pro-posts'>
                    <Routes>
                        <Route path={`profile`} element={<Gallary />} />
                        <Route path={`profile/reels`} element={<Reels />} />
                    </Routes>
                </div> */}
            </div>
            <div className='profile-gallary'>
                <div className='gallary'>
                    {
                        posts.length > 0 ?
                            <>
                                {
                                    posts.map((post, i) => {
                                        return <GallaryItem key={i} post={post}></GallaryItem>
                                    })
                                }
                            </>
                            :
                            <>
                                <div className='loading'>
                                    <img src={hourglass} alt="" />
                                </div>
                            </>
                    }
                </div>
            </div>
        </div>
    )
}

export default Profile