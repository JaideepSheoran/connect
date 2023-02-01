import './Comments.css';
import React, { useState, useEffect } from 'react';
import Comment from './Comment';
import { storage, db } from '../../helper/firebase';
import { doc, collection, updateDoc, arrayUnion, query, where, getDocs, getDoc, setDoc } from 'firebase/firestore';
import { async } from '@firebase/util';

function Comments({ postID }) {

    const [newComment, setNewComment] = useState({
        parentID: '',
        by: '',
        content: ''
    });

    const [postCommentsList, setpostCommentsList] = useState([]);

    const setChange = (e) => {
        const value = e.target.value;
        const USER = JSON.parse(window.localStorage.getItem('data')).id_;
        setNewComment({ ...newComment, ['content']: value, ['parentID']: '', ['by']: USER });
    }

    useEffect(() => {
        loadComments();
    }, []);


    const loadComments = async () => {
        console.log(postID);
        const docRef = doc(db, "posts", postID);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            const postCommentsID = docSnap.data().comments;
            if (!postCommentsID) {
                alert('No Comments...');
                return;
            }
            const getAllCommentsQuery = query(collection(db, `comments/${postCommentsID}/comment`));
            getDocs(getAllCommentsQuery).then((commentsDocs) => {
                var list = [];
                commentsDocs.forEach((commentDoc) => {
                    var commentData = commentDoc.data();
                    commentData['selfID'] = commentDoc.id;
                    getDoc(doc(db, 'users', commentData.by)).then((userMetaData) => {
                        var userData = userMetaData.data();
                        commentData['url'] = userData.photoUrl;
                        commentData['username'] = userData.username;
                        list.push(commentData);
                    });
                });
                setpostCommentsList(list);
                console.log(postCommentsList);
            });
        } else {
            console.log("No such document!");
        }
    }

    const addComment = (e) => {
        e.preventDefault();
        console.log(newComment);
        const postRef = doc(db, "posts", postID);
        getDoc(postRef).then((snap) => {
            const DATA = snap.data();
            if (DATA.comments === '') {
                const newCommetsSection = doc(collection(db, 'comments'));
                console.log("NEW->", newCommetsSection);
                const newCommentRef = doc(collection(db, `${newCommetsSection.path}/comment`));
                setDoc(newCommentRef, newComment).then((res) => {
                    console.log(res);
                }).catch(err => {
                    console.log(err);
                });
                updateDoc(postRef, {
                    comments: newCommetsSection.id
                }).then((res) => {
                    alert('First Comment Added Sucessfully.');
                }).catch(err => { alert(err) });
            }
            else {
                const newCommentRef = doc(collection(db, `comments/${DATA.comments}/comment`));
                setDoc(newCommentRef, newComment).then((res) => {
                    alert('Comment Added Sucessfully.');
                }).catch(err => {
                    console.log(err);
                });
            }
        })
    }

    return (
        <div className="comments-section">
            <button onClick={(e) => {
                e.preventDefault();
                loadComments();
            }}>Load Comments</button>
            <div className="comment-form">
                <input onChange={setChange} value={newComment.content} placeholder='Comment...' type='text' />
                <button onClick={addComment}>Add</button>
            </div>
            <div className="comments-all">
                {

                    postCommentsList.length != 0 
                    ?  
                    
                    postCommentsList.map((comment, i) => {
                        return (
                            comment.parentID === ''
                                ?
                                <Comment key={i} postID={postID} comment={comment} commentList={postCommentsList} setpostCommentsList={setpostCommentsList} />
                                :
                                <> </>
                        )
                    })

                    :
                    <>
                        Loading ...
                    </>
                }
            </div>

        </div>
    );
}

export default Comments;