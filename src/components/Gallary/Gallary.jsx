import React, {useEffect, useState} from 'react'
import { Link } from 'react-router-dom'
import './Gallary.css';
import { collection, doc, getDocs, onSnapshot, query, where } from 'firebase/firestore';
import { db } from '../../helper/firebase';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {setUserPosts} from "../../actions/index"
import GallaryItem from './GallaryItem';
import hourglass from '../../assets/hourglass.gif';

const Gallary = () => {


    const userID = JSON.parse(window.localStorage.getItem('data')).id_;
    const nav = useNavigate();
    const newPosts = useSelector((state) => state.loadPosts);
    const [isLoaded, setLoaded] = useState(false);
    const dispatch = useDispatch();

    const getPosts = async () => {
        const q = query(collection(db, 'posts'), where('uid', '==', userID));

        try {
            onSnapshot(q, (res) => {
                var list = [];
                res.docs.forEach((doc) => {
                    list.push({id : doc.id, ...doc.data()});
                });
                dispatch(setUserPosts(list));
                setLoaded(true);
            }, (err) => {
                window.alert(err);
            });
            
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        if (newPosts.length != 0) return;
        getPosts();
        console.log('RUN');
    }, []);


    return (
        <div className='profile-gallary'>
            <div className='gallary'>
            {
				newPosts.length > 0 ?
					<>
						{
							newPosts.map((post, i) => {
								return <GallaryItem key={i} post={post}></GallaryItem>
							})
						}
					</>
					:
					<>
						{
                            isLoaded && newPosts.length == 0 
                            ?
                            <>
                                <h1 style={{color : 'white', width : '100%'}}>NO POSTS</h1>
                                <h1 style={{color : 'white', width : '100%'}}>NO POSTS</h1>
                                <h1 style={{color : 'white', width : '100%'}}>NO POSTS</h1>
                            </>
                            :
                                <div className='loading'>
                                    <img src={hourglass} alt="" />
                                </div>
                        }
					</>
			}
            </div>
        </div>
    )
}

export default Gallary