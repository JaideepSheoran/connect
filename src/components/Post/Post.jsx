import React, { useContext, useEffect, useState } from "react";
import './Post.css';
import next from '../../assets/next.png';
import download from '../../assets/download.png';
import menu from '../../assets/menu.svg';
import hlike from '../../assets/hlike.png';
import commentlogo from '../../assets/comment.png';
import bookmark from '../../assets/bookmark.svg';
import { strorage, db } from '../../helper/firebase';
import { collection, getDocs, query, where, doc, runTransaction, onSnapshot, getDoc, FieldValue, increment } from "firebase/firestore";
import Comments from "../Comments/Comments";
import Commentr from "../Comments/Commentr";
import { useParams, useNavigate } from "react-router-dom";

/*

POST {
    docid,
    user : userID,
    url : 'URL',
    type : 'img, video',
    thumbnail : null,
    caption : 'Just do it',
    tags : [],
    commnets : docID,
    likesCnt : 0,
    likedby : 'docid'
}

*/

const Post = ({ cnt, index, setIndex}) => {

    const {pid}= useParams();
    const nav = useNavigate();
    const userID = JSON.parse(window.localStorage.getItem('data')).id_;
    const [curr, setCurr] = useState(null);

    useEffect(() => {
        console.log(pid);
        const unsubscribe = onSnapshot(doc(db, 'posts', pid), (snapshot) => {
            setCurr({...snapshot.data(), postID : snapshot.id});
            console.log("Updated");
        }, (err) => {
            console.log("HERE",err);
        });

    
        return () => unsubscribe();
    }, []);
    
    const likePost = async (e) => {
        e.preventDefault();
        const q = query(collection(db, "likes"), where('uid' , '==', userID), where('pid' , '==', curr.postID));
        try {
            const likerDoc = await getDocs(q);
            if(likerDoc.docs.length != 0){
                try {
                    const docID = likerDoc.docs[0].id;
                    console.log("DOC :", docID);
                    const sfDocRef = doc(db, "posts", curr.postID);
                    const likeRef = doc(db, "likes", docID);
                    const newLikes = await runTransaction(db, async (transaction) => {
                        const sfDoc = await transaction.get(sfDocRef);
                        if (!sfDoc.exists()) {
                            throw "Document does not exist!";
                        }
                        // const newLikes = sfDoc.data().likesCnt - 1;
                        transaction.update(sfDocRef, { likesCnt: increment(-1) });
                        transaction.delete(likeRef);
                    });
                } catch (e) {
                    console.error(e);
                }
            }else{
                try {
                    const sfDocRef = doc(db, "posts", curr.postID);
                    const newLike = doc(collection(db, "likes"));
                    const newLikes = await runTransaction(db, async (transaction) => {
                        const sfDoc = await transaction.get(sfDocRef);
                        if (!sfDoc.exists()) {
                            throw "Document does not exist!";
                        }        
                        const newLikes = sfDoc.data().likesCnt + 1;
                        transaction.update(sfDocRef, { likesCnt: newLikes });
                        transaction.set(newLike, {
                            pid : curr.postID,
                            uid : userID
                        });
                    });
                } catch (e) {
                    // This will be a "population is too big" error.
                    console.error(e);
                }
            }
        } catch (error) {
            console.log(error);   
        }
       
    }
    

    const getPosts = async (e) => {
        e.preventDefault();

        try {
            const res = await getDoc(doc(db, 'posts', pid));
            setCurr({...res.data(), postID : res.id});
        } catch (error) {
            console.log(error);
        }
    }


    return (
        curr != null
            ?
            <div className="post-main-box">
                <div className="left-post">
                    <button onClick={(e) => { e.preventDefault(); setIndex((index + 1) % cnt); }}><img src={next} alt="Back Button" /></button>
                </div>
                <div className="post-container">
                    <div className="post">
                        <div className="img-box">
                            <img src={curr.postUrl} alt="Post" />
                        </div>
                        <div className="post-info">
                            <div className="top">
                                <div>
                                    <div className="pic"><img src={JSON.parse(window.localStorage.getItem('data')).photoURL} alt="Profile" /></div>
                                    <div className="user-data">
                                        <div className="user">{curr.username}</div>
                                        <div className="location">NIT KKR</div>
                                    </div>
                                </div>
                                <div><button onClick={() => {nav(-1)}}><img src={menu} alt="More" /></button></div>
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
                                {/* <Commentr /> */}
                            </div>
                            <div className="stats">
                                <button onClick={likePost}><img src={hlike} alt="Like" /></button>
                                <button><img src={commentlogo} alt="Comments" /></button>
                                <button><img src={menu} alt="Saved" /></button>
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
                    <button onClick={(e) => { e.preventDefault(); setIndex((index - 1 + cnt) % cnt); }}><img src={next} alt="Next Button" /></button>
                </div>
            </div>

            :

            <> Loading ....</>
    )
}

export default Post;