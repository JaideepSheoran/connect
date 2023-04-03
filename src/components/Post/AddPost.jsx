import './AddPost.css';
import React, { useState, useEffect } from 'react';
import { storage, db } from '../../helper/firebase';
import { useNavigate } from 'react-router-dom';
import { doc, collection, updateDoc, arrayUnion, query, where, getDocs, addDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { onAuthStateChanged } from 'firebase/auth';
import { authenticate } from '../../helper/firebase';
import ThumbNail from '../Test/ThumbNail';
import { UserAuth } from '../../context/AuthContext';

function AddPost() {

    const navigate = useNavigate();
    const { user } = UserAuth();
    const [postImg, setPostImg] = useState(null);
    const [tags, setTags] = useState('');
    const [addPostText, setaddPostText] = useState('Add Post');
    const [post, setPost] = useState({
            uid: "",
            caption: "",
            postUrl: "",
            location: "",
            timestamp: "",
            comments: "",
            tags: [],
            type: "",
            thumbnail: "",
            likesCnt: 0
        }
    );

    useEffect(() => {
        
        const unsubscribe = onAuthStateChanged(authenticate, (currentUser) => {
            if(!currentUser) 
                navigate("/");
            else {
                setPost({
                    ...post,
                    ['uid'] : currentUser.uid
                });
                console.log(post);
            }
        })
    
    
      return () => unsubscribe();
    }, []);
    

    const handleChange = (e) => {
        const { name, value } = e.target;
        setPost(prev => ({
            ...prev,
            [name]: value
        }));
    }

    const handleClick = (e) => {
        e.preventDefault();
        try {
            if (!post.caption || !post.location || !tags) {
                alert('Empty Fields ~~~');
                return;
            }
            if (!postImg) {
                alert('Choose Post ~~~');
                return;
            } else {
                setaddPostText('Uploading...');
                var tagsTemp = tags;
                tagsTemp = tagsTemp.replaceAll(' ', '');
                var tagsArray = tagsTemp.split(',');
                tagsArray = tagsArray.filter((tag) => { return tag.length !== 0 });
                var tempPost = post;
                tempPost.tags = tagsArray;
                setPost(tempPost);
                console.log(post);
                const Time = Date.now();
                uploadBytes(ref(storage, `${post.uid}/${post.uid}-${Time}`), postImg).then(() => {
                    getDownloadURL(ref(storage, `${post.uid}/${post.uid}-${Time}`)).then((url) => {
                        post.postUrl = url;
                        post.timestamp = Date.now();
                        
                        console.log('THIS IS RUNNING....');
                        addDoc(collection(db, 'posts'), post).then((docRef) => {
                            console.log(docRef);
                            setaddPostText('Add Post');
                        });
                    }).catch((error) => {
                        console.log(error);
                    });
                });
            }
        } catch (e) {
            console.error("Error adding document: ", e);
        }
    }


    const setImagePreview = (file) => {
        document.getElementById('preview').src = URL.createObjectURL(file);
        console.log('DONE');
    }

    return (
        <div className='addpost-body'>
            <div className="addpost-container">
                <div className="addpost-title">
                    <p>Create New Post</p>
                    <button onClick={handleClick} >{addPostText}</button>
                </div>
                <div className="addpost-post-container">
                    <div className="post-selector">
                        <input 
                            type={"file"} 
                            accept="image/*" 
                            onChange={(e) => { 
                                setPostImg(e.target.files[0]);
                                setImagePreview(e.target.files[0]);
                            }} 
                        />
                        <div className="imagediv">
                            <img alt='User' id='preview' width="100%" />
                        </div>
                    </div>
                    <div className="post-details">
                        <div className="userinfo-box">
                            <div className="user-img">
                                <img src={user.photoURL} alt='Nothing' className='user-img-img' />
                            </div>
                            <div className="username">
                                {user.email}
                            </div>
                        </div>
                        <div className="post-caption">
                            <p>Caption</p>
                            <textarea placeholder='Add caption ...' onChange={handleChange} value={post.caption} name="caption" id="" cols="33" rows="6"></textarea>
                        </div>
                        <div className="posttags">
                            <p>Add Tags</p>
                            <textarea placeholder='Add Tags ...' onChange={(e) => { setTags(e.target.value) }} value={tags} name="tags" id="" cols="33" rows="6"></textarea>
                        </div>
                        <div className="post-location">
                            <p>Add Location</p>
                            <input placeholder='Add Location ...' onChange={handleChange} name='location' value={post.location} type="text" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AddPost