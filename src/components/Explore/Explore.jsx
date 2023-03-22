import React, { useState, useEffect } from 'react';
import './Explore.css';
import { collection, getDocs, limit, query, startAfter, where } from 'firebase/firestore';
import { db } from '../../helper/firebase';


const Explore = () => {

    const [reels, setReels] = useState([]);
    const [posts, setPosts] = useState([]);
    const [lastReel, setLastReel] = useState(null);
    const [lastPost, setLastPost] = useState(null);
    const [visible, setVisible] = useState([null, null]);
    const [k, setK] = useState([]);


    const setReelsState = async () => {
        let reelQuery;
        if (lastReel) {
            reelQuery = query(collection(db, 'posts'), where('type', '==', 'video'), limit(2), startAfter(lastReel));
        } else {
            reelQuery = query(collection(db, 'posts'), where('type', '==', 'video'), limit(2));
        }

        getDocs(reelQuery).then((snap) => {
            if (snap.size != 0) {
                const rawReels = [];
                snap.docs.forEach((reel) => {
                    rawReels.push({ id: reel.id, ...reel.data() });
                })
                console.log(rawReels);
                setReels(prevReels => [...prevReels, ...rawReels]);
                setLastReel(snap.docs[snap.docs.length - 1]);
            }
        });
    }

    const setPostsState = async () => {
        let postQuery;
        if (lastPost) {
            postQuery = query(collection(db, 'posts'), where('type', '==', ''), limit(8), startAfter(lastPost));
        } else {
            postQuery = query(collection(db, 'posts'), where('type', '==', ''), limit(8));
        }

        getDocs(postQuery).then((snap) => {
            if (snap.size != 0) {
                const rawPosts = [];
                snap.docs.forEach((post) => {
                    rawPosts.push({ id: post.id, ...post.data() });
                })
                setPosts(prevPosts => [...prevPosts, ...rawPosts]);
                setLastPost(snap.docs[snap.docs.length - 1]);
            }
        });
    }

    // useEffect(() => {
    //     setPostsState();
    //     setReelsState();
    //     setK([...k, 'Jaideep']);
    //     console.log(lastPost, lastReel);
    // }, []);

    useEffect(() => {
        // if(!visible[0] && !visible[1]) {
        //     return;
        // }
        setPostsState();
        setReelsState();
        setK([...k, 'Jaideep']);
        console.log(reels);
    }, [visible]);



    return (
        <div className='explore'>
            {
                posts.length !== 0 && reels.length !== 0 && k.map((val, i) => {
                    return (
                        <>
                            <div className="explore-type-one">
                                <div className="post-box">
                                    <img src={posts.at(0 + i * 8).postUrl} alt="" />
                                </div>
                                <div className="post-box">
                                    <img src={posts.at(1 + i * 8).postUrl} alt="" />
                                </div>
                                <div className="post-box">
                                    <img src={posts.at(2 + i * 8).postUrl} alt="" />
                                </div>
                                <div className="post-box">
                                    <img src={posts.at(3 + i * 8).postUrl} alt="" />
                                </div>
                                <div className="post-box reel-left">
                                    <img src={reels.at(0 + i * 2).thumbnail} alt="" />
                                </div>
                            </div>
                            <div className="explore-type-one">
                                <div className="post-box">
                                    <img src={posts.at(4 + i * 8).postUrl} alt="" />
                                </div>
                                <div className="post-box">
                                    <img src={posts.at(5 + i * 8).postUrl} alt="" />
                                </div>
                                <div className="post-box">
                                    <img src={posts.at(6 + i * 8).postUrl} alt="" />
                                </div>
                                <div className="post-box">
                                    <img src={posts.at(7 + i * 8).postUrl} alt="" />
                                </div>
                                <div className="post-box reel-right">
                                    <img src={reels.at(1 + i * 2).thumbnail} alt="" />
                                </div>
                            </div>
                        </>
                    )
                })
            }

            <button onClick={() => {
                setVisible([lastPost, lastReel]);
            }}>Load More</button>
        </div>
    )
}

export default Explore;