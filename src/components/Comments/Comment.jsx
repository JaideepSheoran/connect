import React, { useState } from 'react';
import './Comment.css';
import { db } from '../../helper/firebase';
import { getDoc, doc, getDocs, query, collection, where, setDoc, updateDoc } from 'firebase/firestore';

function Comment({ comment, commentList, postID , setpostCommentsList}) {

    const [commentForm, setcommentForm] = useState(false);
    const [newComment, setNewComment] = useState({
        parentID: '',
        by: '',
        content: ''
    });

    const setChange = (e) => {
        const value = e.target.value;
        const ID = comment.selfID;
        const USER = JSON.parse(window.localStorage.getItem('data')).id_;
        setNewComment({ ...newComment, ['content']: value, ['parentID']: ID, ['by']: USER });
    }


    const loadComments = async () => {
        console.log(postID);
        const docRef = doc(db, "posts", postID);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            const postCommentsID =  docSnap.data().comments;
            if(!postCommentsID) {
                alert('No Comments...');
                return;
            }
            const getAllCommentsQuery = query(collection(db, `comments/${postCommentsID}/comment`));
            getDocs(getAllCommentsQuery).then((commentsDocs) => {
                var list = [];

                const response = Promise.all(
                    commentsDocs.docs.forEach(async (document) => {
                        const docData = document.data();
                        const userData = await getDoc(doc(db, 'users', docData.by));
                        const CommenT = {
                            ...docData,
                            url : userData.photoUrl,
                            username : userData.username
                        };
                        list.push(CommenT);
                    })
                );
                console.log(response);
                setpostCommentsList(list);

                // commentsDocs.forEach((commentDoc) => {
                //     var commentData = commentDoc.data();
                //     commentData['selfID'] = commentDoc.id;
                //     getDoc(doc(db, 'users', commentData.by)).then((userMetaData) => {
                //         var userData = userMetaData.data();
                //         commentData['url'] = userData.photoUrl;
                //         commentData['username'] = userData.username;
                //         list.push(commentData);
                //     });
                // });
                // setpostCommentsList(list);
            });
        } else {
            console.log("No such document!");
        }
    }

    return (
        <div className='comment-container'>
            <p>
               <span> <img style={{height : '25px', borderRadius : '50%'}} src={comment.url} alt="ID_PIC" /> @{comment.username} </span>
                {comment.content}
                <button onClick={(e) => {
                   e.preventDefault();
                   setcommentForm(true);
                }}>Reply</button>
            </p>
            <div className='comment-box'>
                {
                    commentForm &&
                    <div className="comment-form">
                        <input onChange={setChange} value={newComment.content} placeholder='Comment...' type='text' />
                        <div className="comment-btns">
                            <button onClick={(e) => {
                                e.preventDefault();
                                setcommentForm(false);
                            }}>Cancel</button>
                            <button onClick={(e) => {
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
                                            setcommentForm(false);
                                            loadComments();
                                        }).catch(err => { alert(err) });
                                    }
                                    else {
                                        const newCommentRef = doc(collection(db, `comments/${DATA.comments}/comment`));
                                        setDoc(newCommentRef, newComment).then((res) => {
                                            setcommentForm(false);
                                            loadComments();
                                        }).catch(err => {
                                            console.log(err);
                                        });
                                    }
                                })
                            }}>Add</button>
                        </div>
                    </div>
                }
                <div className="comment-replies">
                    {
                        commentList.map((cmnt, i) => {
                            return (
                                comment.selfID === cmnt.parentID
                                    ?
                                    <Comment postID={postID} key={i} comment={cmnt} commentList={commentList} setpostCommentsList = {setpostCommentsList} />
                                    :
                                    <></>
                            )
                        })
                    }
                </div>
            </div>
        </div>
    )
}

export default Comment;