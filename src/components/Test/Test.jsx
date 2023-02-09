import React, { useState, useEffect } from "react";
import firebase from "firebase/app";
import { db } from '../../helper/firebase';
import "firebase/firestore";
import { collection, getDocs, limit, orderBy, startAfter, query } from "firebase/firestore";

const Test = () => {
    const [reels, setReels] = useState([]);
    const [lastVisible, setLastVisible] = useState(null);
    const [lastVisible_2, setLastVisible_2] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setLoading(true);
        let q;
        if (lastVisible) {
            q = query(collection(db, 'posts'), orderBy("timestamp", "desc"), limit(6), startAfter(lastVisible));
        } else {
            q = query(collection(db, 'posts'), orderBy("timestamp", "desc"), limit(6));
        }

        getDocs(q).then(snap => {
            setLoading(false);
            const newReels = [];
            snap.forEach(reel => {
                newReels.push({ id: reel.id, ...reel.data() });
            });
            setReels(prevReels => [...prevReels, ...newReels]);
            setLastVisible(snap.docs[snap.docs.length - 1]);
        });
        console.log('RUN');

    }, [lastVisible_2]);

    useEffect(() => {
        setLoading(true);
        let q;
        if (lastVisible) {
            q = query(collection(db, 'posts'), orderBy("timestamp", "desc"), limit(6), startAfter(lastVisible));
        } else {
            q = query(collection(db, 'posts'), orderBy("timestamp", "desc"), limit(6));
        }

        getDocs(q).then(snap => {
            setLoading(false);
            const newReels = [];
            snap.forEach(reel => {
                newReels.push({ id: reel.id, ...reel.data() });
            });
            setReels(prevReels => [...newReels]);
            setLastVisible(snap.docs[snap.docs.length - 1]);
        });
        console.log('RUN');

    }, []);

    return (
        <div>
            {
                reels.map((reel, i) => {
                    return <>
                        <p key={i}>{JSON.stringify(reel.id)}</p>
                    </>
                })
            }
            {loading && <div>Loading...</div>}
            <button onClick={() => setLastVisible_2(null)}>Reset</button>
            <button onClick={() => setLastVisible_2(lastVisible)}>Load More</button>
        </div>
    );
};

export default Test;
