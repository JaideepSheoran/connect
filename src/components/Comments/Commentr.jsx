import React, { useState, useEffect } from 'react';
import './Commentr.css';
import { db } from '../../helper/firebase';
import { getDoc, doc, onSnapshot, collection, query, setDoc, where } from 'firebase/firestore';
import Picker from '@emoji-mart/react';
import happy from '../../assets/happy.png'


function Commentr({ pid }) {
    const [comments, setComments] = useState([]);
    const [newCommentText, setNewCommentText] = useState('');
    const [parentId, setParentId] = useState(null);
    const [showPicker, setShowPicker] = useState(false);
    const uid = JSON.parse(window.localStorage.getItem('data')).id_;


    useEffect(() => {

        // const unsub = onSnapshot(query(collection(db, "mycomments"), where('pid', '==', pid)), (snapshot) => {
        //     const comments = [];

        //     snapshot.docs.forEach((commentSnap) => {
        //         comments.push({
        //             id: commentSnap.id,
        //             text: commentSnap.data().text,
        //             authorId: commentSnap.data().author_id,
        //             timestamp: commentSnap.data().timestamp,
        //             parentId: commentSnap.data().parent_id
        //         });
        //     });
        //     setComments(comments);
        // });

        const unsubs = onSnapshot(query(collection(db, "mycomments"), where('pid', '==', pid)), (snapshot) => {
            const newComments = [];

            snapshot.docs.forEach((commentSnap) => {
                getDoc(doc(db, 'users', commentSnap.data().author_id))
                    .then((raw) => {
                        console.log(raw.data());
                        newComments.push({
                            id: commentSnap.id,
                            text: commentSnap.data().text,
                            authorId: commentSnap.data().author_id,
                            timestamp: commentSnap.data().timestamp,
                            parentId: commentSnap.data().parent_id,
                            url : raw.data().photoUrl,
                            username : raw.data().username
                        });
                    })
                    .catch(err => console.log(err));
            });
            setComments(newComments);
        });

        // const news = [];

        // comments.forEach( async (comment) => {
        //     getDoc(doc(db, 'users', comment.authorId))
        //         .then((res) => {
        //             const {photoUrl, username} = res.data();
        //             news.push({...comment, url : photoUrl, username : username});
        //         })
        //         .catch((err) => {
        //             console.log(err);
        //         })
        // })

        // console.log(news);
        // setComments(news);

        return () => {
            unsubs();
        };
    }, []);

    const handleCommentSubmit = (event) => {
        event.preventDefault();

        setDoc(doc(collection(db, 'mycomments')), {
            text: newCommentText,
            author_id: uid,
            timestamp: Date.now(),
            parent_id: parentId,
            pid : pid
        })
            .then((res) => {
                setNewCommentText('');
                setParentId(null);
                console.log('ADDED');
            })
            .catch((err) => {
                console.log(err);
            });
    };

    const renderComment = (comment, depth = 0) => {
        return (

            <>
                <li className='comment-item' style={{ marginLeft: `${depth * 10}px` }}>
                    <div className='user-comment'>
                        <div className="dp">
                            <img src={comment.url} alt="DP" />
                        </div>
                        <div className='user-comment-data'>
                            <div className="comment-content">
                                <span>@{comment.username}  <span>{comment.text}</span></span>
                               
                            </div>
                            <div className="comment-time-reply">
                                <span>{new Date(comment.timestamp).toDateString()}</span>
                                <span>
                                    <button 
                                        onClick={() => {
                                            const mentioned = document.getElementById("mention-comment").innerText;
                                            if(mentioned == ''){
                                                document.getElementById("mention-comment").innerText = "@" + comment.username;
                                                setParentId(comment.id);
                                            }else{
                                                document.getElementById("mention-comment").innerText = "";
                                                setParentId(null);
                                            }
                                        }}
                                    >Reply</button>
                                </span>
                            </div>
                        </div>
                    </div>
                    <ul>
                        {
                            comments
                                .filter((childComment) => childComment.parentId == comment.id)
                                .map((childComment) => renderComment(childComment, depth + 1))
                        }
                    </ul>
                </li>
            </>
        );
    };

    const togglePicker = (e) => {
        e.preventDefault();
        setShowPicker(!showPicker);
    }

    return (
        <div className='post-comments'>
            <ul>
                {   comments
                    .filter((comment) => !comment.parentId)
                    .map((comment) => renderComment(comment))
                }
            </ul>

            {
            showPicker && 
                <Picker 
                    navPosition={'none'} 
                    previewPosition={'none'} 
                    searchPosition={'none'}
                    skinTonePosition={'none'}
                    perLine={6}
                    maxFrequentRows={2}
                    onEmojiSelect={(emoji) => {
                        setNewCommentText(newCommentText + emoji.native);
                    }}
                />
            }

            <form onSubmit={handleCommentSubmit}>

                <span id='mention-comment'></span>
                <span style={{cursor : 'pointer'}} onClick={togglePicker}>
                    <img 
                        style={
                            {
                                height : '27px', 
                                filter : 'invert(1)'
                            }
                        } 
                        src={happy} 
                        alt='Smile'
                    />
                </span>
                <input
                    placeholder='Comment...'
                    value={newCommentText}
                    onChange={(event) => setNewCommentText(event.target.value)}
                />
                <button type="submit"> Add </button>
            </form>
        </div>
    );
}

export default Commentr;
