import React, { useState, useEffect } from 'react';
import './HomePost.css';
import hlike from '../../assets/hlike.png';
import commentlogo from '../../assets/comment.png';
import closeicon from '../../assets/closeicon.png';
import bookmark from '../../assets/bookmark.png';
import Commentr from '../Comments/Commentr';
import { setDoc, getDoc, collection, where, query, doc, getDocs, serverTimestamp, orderBy } from 'firebase/firestore';
import { db } from '../../helper/firebase';
import { Link, useNavigate } from 'react-router-dom';

const HomePost = ({ photoURL, post }) => {

    const nav = useNavigate();
    const [comments, setComments] = useState([]);
    const [parentId, setParentId] = useState(null);
    const [replyerId, setReplyerId] = useState(null);
    const [replyTo, setReplyTo] = useState(null);
    const [newCommentText, setNewCommentText] = useState('');
    const uid = JSON.parse(window.localStorage.getItem('data')).id_;
    const [videoShow, setVideoShow] = useState(false);


    const refreshComments = async () => {
        const commentsQuery = query(collection(db, "mycomments"), where('pid', '==', post.id), orderBy('timestamp', 'desc'));
        getDocs(commentsQuery).then(async (snapshot) => {
            const res = await Promise.all(snapshot.docs.map(async (commentSnap) => {
                const data = commentSnap.data();
                const r = await getDoc(doc(db, 'users', data.author_id));
                return {
                    id: commentSnap.id,
                    text: data.text,
                    authorId: data.author_id,
                    timestamp: data.timestamp,
                    parentId: data.parent_id,
                    url: r.data().photoUrl,
                    username: r.data().username
                };
            }));
            setComments(res);
        }).catch((err) => {
            console.log(err);
        })
    }

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
                                            setReplyerId(comment.id);
                                            setReplyTo(comment.username);
                                        }}
                                    >Reply</button>
                                </span>
                            </div>
                        </div>
                    </div>
                    <ul>
                        {
                            comments
                                .filter((childComment) => childComment.parentId === comment.id)
                                .map((childComment) => renderComment(childComment, depth + 1))
                        }
                    </ul>
                </li>
            </>
        );
    };

    const moveToDirectChat = (msger) => {
        nav(`/directmsg/${msger}`);
    }

    const handleCommentSubmit = (event) => {
        event.preventDefault();

        setDoc(doc(collection(db, 'mycomments')), {
            text: newCommentText,
            author_id: uid,
            timestamp: Date.now(),
            parent_id: replyerId,
            pid: post.id
        })
            .then((res) => {
                setNewCommentText('');
                setReplyTo(null);
                setReplyerId(null);
                refreshComments();
                console.log('ADDED');
            })
            .catch((err) => {
                console.log(err);
            });
    };

    const handleReelPlay = (e) => {
        e.preventDefault();
        setVideoShow(!videoShow);
    }


    return (
        <div className='home-post'>
            <div className="top">
                <div>
                    <div className="pic"><img src={post.photoUrl} alt="Profile" /></div>
                    <div className="user-data">
                        <div className="user"><Link className='user-link' to={`/user/${post.uid}`}>{post.username}</Link></div>
                        <div className="location">{new Date(3246345658763).toDateString() + " Dubai, UAE"}</div>
                    </div>
                </div>
            </div>
            <div onClick={handleReelPlay} className="home-post-container">
                {
                    post.type !== 'video'
                        ?
                        <img src={photoURL} alt="" />
                        :
                        <>
                            {
                                videoShow
                                    ?
                                    <video autoPlay={true} src={post.postUrl}></video>
                                    :
                                    <img src={photoURL} alt="" />
                            }
                        </>
                }
            </div>
            <div className="stats">
                <button><img src={hlike} alt="Comments" /></button>
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
                    Liked by <span>naresh_kumar and 53453 others</span>
                </div>
            </div>
            <div className='stats'>
                <button className='home-post-comment-btn' onClick={refreshComments}>View all comments</button>
                <button className='dm-btn' onClick={(e) => {e.preventDefault(); moveToDirectChat(post.uid)}}>Direct Message</button>
            </div>
            <div className='home-post-comments post-comments'>
                <ul>
                    {
                        comments
                            .filter((comment) => !comment.parentId)
                            .map((comment) => renderComment(comment))
                    }
                </ul>
            </div>
            <div className="user">
                {post.uid}
                <span>{" " + post.caption}</span> <br />
                {
                    <div className="post-tags">
                        {
                            post.tags.map((tag, i) => (
                                (<span style={{ color: "#00B7FF" }} key={i}>#{tag}</span>)
                            ))
                        }
                    </div>
                }
            </div>
            <div className="add-your-comment">
                <form onSubmit={handleCommentSubmit}>
                    <input
                        type="text"
                        name="usercomment"
                        placeholder={replyTo ? `Reply to @${replyTo}` : 'Add Comment...'}
                        value={newCommentText}
                        onChange={(e) => {
                            setNewCommentText(e.target.value);
                        }}
                    />
                    {
                        replyTo
                        && <img
                            src={closeicon}
                            alt="Cross"
                            onClick={(e) => {
                                e.preventDefault();
                                setReplyTo(null);
                                setReplyerId(null);
                            }}
                        />
                    }
                    <button>Add</button>
                </form>
            </div>
        </div>
    )
}

export default HomePost;