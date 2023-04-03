import React, { useRef, useState, useEffect } from 'react';
import './VideoCard.css';
import audioon from '../../assets/audioon.png';
import music from '../../assets/music.png';
import hlike from '../../assets/hlike.png';
import comment from '../../assets/comment.png';
import bookmark from '../../assets/bookmark.png';
import defaultUser from '../../assets/defaultUser.png';
import { collection, query, where, doc, onSnapshot, writeBatch, increment } from "firebase/firestore";
import liked from '../../assets/liked.png';
import { db } from '../../helper/firebase';


const VideoCard = ({ reel }) => {

    const pid = reel.id;
    const [isVideoPlaying, setIsVideoPlaying] = useState(false);
    const [isLiked, setIsLiked] = useState('');
    const [curr, setCurr] = useState(null);
    const videoRef = useRef(null);
    const userID = JSON.parse(window.localStorage.getItem('data')).id_;

    useEffect(() => {
        console.log(pid);
        const unsubscribe = onSnapshot(doc(db, 'posts', pid), (snapshot) => {
            setCurr({ ...snapshot.data(), postID: snapshot.id });
        }, (err) => {
            console.log(err);
        });

        return () => unsubscribe();
    }, []);

    const handlePlay = () => {
        if (isVideoPlaying) {
            videoRef.current.pause();
            setIsVideoPlaying(false);
        } else {
            videoRef.current.play();
            setIsVideoPlaying(true);
        }
    }

    useEffect(() => {
        console.log(pid);
        const q = query(collection(db, "likes"), where('uid', '==', userID), where('pid', '==', pid));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            if (!snapshot.empty) {
                setIsLiked(snapshot.docs[0].id);
            } else {
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
            batch.update(doc(db, 'posts', pid), { likesCnt: increment(-1) });
            batch.delete(doc(db, 'likes', isLiked));
            await batch.commit();
        } else {
            const batch = writeBatch(db);
            batch.update(doc(db, 'posts', pid), { likesCnt: increment(1) });
            batch.set(doc(collection(db, 'likes')), {
                uid: userID,
                pid: pid
            });
            await batch.commit();
        }

    }

    useEffect(() => {
        console.log('Running');
        let options = {
            root: document.getElementById("reels_parent"),
            rootMargin: "0px",
            threshold: [0.25, 0.75]
        };

        let handleAutoPlay = (entries, observer) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    videoRef.current.play();
                    setIsVideoPlaying(true);
                } else {
                    videoRef.current.pause();
                    setIsVideoPlaying(false);
                }
            });
        };

        let observer = new IntersectionObserver(handleAutoPlay, options);

        observer.observe(videoRef.current);

    });

    return (
        <div style={{ backgroundColor: 'white' }} className='videoCard'>
            <div className="reelBox">
                <div className='audioControler'>
                    <img src={audioon} alt="S" />
                </div>
                {
                    <video
                        loop={true}
                        autoPlay={false}
                        ref={videoRef}
                        onClick={handlePlay}
                        src={reel.postUrl}
                        controls={false}
                    ></video>
                }
                <div className='reelFooter'>
                    <div className="reelFooter_">
                        <img src={defaultUser} alt="" /> <span>.</span> <p>naresh_kumar</p> <span>.</span> <p>Follow</p>
                    </div>
                    <p>{reel.caption} - {reel.location}</p>
                    <div className="music_name">
                        <img src={music} alt="" />
                        <span>Sidhu Son - Rehaan Records - {reel.location}</span>
                    </div>
                </div>
            </div>
            <div className="reelStats">
                <div className="reelStat">
                    <button onClick={likePost}>
                        {
                            isLiked
                                ?
                                <img style={{ filter: 'invert(0)' }} src={liked} alt="Like" />
                                :
                                <img src={hlike} alt="Like" />
                        }
                    </button>
                    <span>{curr ? curr.likesCnt : reel.likesCnt}</span>
                </div>
                <div className="reelStat">
                    <img src={comment} alt="" />
                    <span>234</span>
                </div>
                <div className="reelStat">
                    <img src={bookmark} alt="" />
                </div>
            </div>
        </div>
    )
}

export default VideoCard