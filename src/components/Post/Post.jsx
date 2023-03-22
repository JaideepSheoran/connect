import React, { useContext, useEffect, useState } from "react";
import './Post.css';
import next from '../../assets/next.png';
import download from '../../assets/download.png';
import menu from '../../assets/menu.svg';
import hlike from '../../assets/hlike.png';
import commentlogo from '../../assets/comment.png';
import close from '../../assets/close.png';
import liked from '../../assets/liked.png';
import bookmark from '../../assets/bookmark.png';
import { strorage, db } from '../../helper/firebase';
import { collection, getDocs, query, where, doc, onSnapshot, getDoc, writeBatch, increment } from "firebase/firestore";
import Comments from "../Comments/Comments";
import Commentr from "../Comments/Commentr";
import { useParams, useNavigate } from "react-router-dom";
import {useSelector, useDispatch} from "react-redux";
import hourglass from '../../assets/hourglass.gif';
import audioon from '../../assets/audioon.png';
import audiooff from '../../assets/audiooff.png';


const Post = () => {

    const { pid } = useParams();
    const [isLiked, setIsLiked] = useState('');
    const myPosts = useSelector((state) => state.loadPosts);
    const dispatch = useDispatch();
    const nav = useNavigate();
    const userID = JSON.parse(window.localStorage.getItem('data')).id_;
    const [curr, setCurr] = useState(null);
    const [volume, setVolume] = useState(true);

    useEffect(() => {
        console.log(pid);
        const unsubscribe = onSnapshot(doc(db, 'posts', pid), (snapshot) => {
            setCurr({ ...snapshot.data(), postID: snapshot.id });
        }, (err) => {
            console.log(err);
        });

        return () => unsubscribe();
    }, []);

    useEffect(() => {
        console.log(pid);
        const q = query(collection(db, "likes"), where('uid', '==', userID), where('pid', '==', pid));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            if(!snapshot.empty){
                setIsLiked(snapshot.docs[0].id);
            }else{
                setIsLiked('');
            }
        }, (err) => {
            console.log(err);
        });

        return () => unsubscribe();
    }, []);

    const likePost = async (e) => {
        e.preventDefault();

        if (isLiked) {
            const batch = writeBatch(db);
            batch.update(doc(db, 'posts', pid), {likesCnt : increment(-1)});
            batch.delete(doc(db, 'likes', isLiked));
            await batch.commit();
        } else {
            const batch = writeBatch(db);
            batch.update(doc(db, 'posts', pid), {likesCnt : increment(1)});
            batch.set(doc(collection(db, 'likes')), {
                uid : userID,
                pid : pid
            });
            await batch.commit();
        }

    }

    const playPause = (e) => {
        e.preventDefault();
        var player = document.getElementById("reelVideo");
        if(player.paused){
            player.play();
        }else{
            player.pause();
        }
    }

    const volumeOnOff = (e) => {
        e.preventDefault();
        var player = document.getElementById("reelVideo");
        if(player.volume == 1){
            player.volume = 0;
        }else{
            player.volume = 1;
        }
        setVolume(!volume);
    }

    const nextPost = (e) => {
        e.preventDefault();

    }

    const prevPost = (e) => {
        e.preventDefault();
    }

    return (
        curr != null
            ?
            <div className="post-main-box">
                <div className="left-post">
                    <button onClick={nextPost}><img src={next} alt="Back Button" /></button>
                </div>
                <div className="post-container">
                    <div className="post">
                        <div className="img-box">
                            <div className="img-box-cont">
                                {
                                    curr.type === 'video'
                                    ?
                                        <>
                                            <video id="reelVideo" onClick={playPause} autoPlay={true} loop={true} src={curr.postUrl} alt="Post" />
                                            <img onClick={volumeOnOff} src={volume ? audioon : audiooff} alt="Audio Button" id="reel-audio-control" />
                                        </>
                                    :
                                        <img src={curr.postUrl} alt="Post" />
                                }
                            </div>
                        </div>
                        <div className="post-info">
                            <div className="top">
                                <div>
                                    <div className="pic"><img src={JSON.parse(window.localStorage.getItem('data')).photoURL} alt="Profile" /></div>
                                    <div className="user-data">
                                        <div className="user">{curr.username}</div>
                                        <div className="location">{new Date(curr.timestamp).toDateString() + " " + curr.location}</div>
                                    </div>
                                </div>
                                <div><button onClick={() => { nav(-1) }}><img src={close} alt="More" /></button></div>
                            </div>
                            <div className="post-details">
                                <div className="pic"><img src={JSON.parse(window.localStorage.getItem('data')).photoURL} alt="Profile" /></div>
                                <div className="user-data">
                                    <div className="user">
                                        {curr.username}
                                        <span>{" " + curr.caption}</span> <br />
                                        {
                                            <div className="post-tags">
                                                {
                                                    curr.tags.map((tag, i) => (
                                                        (<span style={{ color: "#00B7FF" }} key={i}>#{tag}</span>)
                                                    ))
                                                }
                                            </div>
                                        }
                                    </div>
                                    <div className="location">26 June, 2023</div>
                                </div>
                            </div>
                            <div className="comments">
                                {/* <Comments postID={curr.postID} /> */}
                                <Commentr pid={curr.postID} />
                            </div>
                            <div className="stats">
                                <button onClick={likePost}>
                                    {
                                        isLiked
                                        ?
                                        <img style={{filter : 'invert(0)'}} src={liked} alt="Like" />
                                        :
                                        <img src={hlike} alt="Like" />
                                    }
                                </button>
                                <button><img src={commentlogo} alt="Comments" /></button>
                                <button><img src={bookmark} alt="Saved" /></button>
                            </div>
                            <div className="liked-by">
                                <div className="propics">
                                    <div className="a d"><img src={JSON.parse(window.localStorage.getItem('data')).photoURL} alt="A" /></div>
                                    <div className="b d"><img src={JSON.parse(window.localStorage.getItem('data')).photoURL} alt="A" /></div>
                                    <div className="c d"><img src={JSON.parse(window.localStorage.getItem('data')).photoURL} alt="A" /></div>
                                </div>
                                <div className="likecount">
                                    Liked by <span>naresh_kumar and {curr.likesCnt} others</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="right-post">
                    <button onClick={prevPost}><img src={next} alt="Next Button" /></button>
                </div>
            </div>
            :

            <div className='loading'>
                <img src={hourglass} alt="" />
            </div>
    )
}

export default Post;