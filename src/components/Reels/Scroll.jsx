import React, { useEffect, useState } from 'react';
import './Scroll.css';
import VideoCard from './VideoCard';
import { db } from '../../helper/firebase';
import { collection, getDocs, query, where } from 'firebase/firestore';

const Scroll = () => {

    const [reels, setReels] = useState([]);
    const [isLiked, setIsLiked] = useState('');

    useEffect(() => {
        const q = query(collection(db, 'posts'), where('type', '==', 'video'));
        getDocs(q).then((snap) => {
            const reel = [];
            snap.docs.forEach((doc) => {
                reel.push({...doc.data(), id : doc.id});
            })
            console.log(reel);
            setReels(reel);
        }).catch((err) => {
            console.log(err);
        })
    }, []);



    return (
        reels.length !== 0
        ?
        <div className='scrollReels'>
            <div id='reels_parent' className="reelSection">
                {
                    reels.map((reel, i) => {
                        return <VideoCard key={i} reel={reel}/>
                    })
                }
            </div>
        </div>
        :
        <>Loading...</>
    )
}

export default Scroll