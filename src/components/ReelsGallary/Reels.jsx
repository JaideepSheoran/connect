import React, {useEffect} from 'react'
import { Link } from 'react-router-dom'
import './Reels.css';
import { collection, doc, getDocs, onSnapshot, query, where } from 'firebase/firestore';
import { db } from '../../helper/firebase';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {setUserPosts} from "../../actions/index"
import hourglass from '../../assets/hourglass.gif';
import ReelItem from './ReelItem';

const Reels = () => {


    const userID = JSON.parse(window.localStorage.getItem('data')).id_;
    const nav = useNavigate();
    const newPosts = useSelector((state) => state.loadPosts);
    const dispatch = useDispatch();

    const getPosts = async () => {
        const q = query(collection(db, 'posts'), where('uid', '==', userID), where('type', '==', 'video'));

        try {
            onSnapshot(q, (res) => {
                var list = [];
                res.docs.forEach((doc) => {
                    list.push({id : doc.id, ...doc.data()});
                });
                dispatch(setUserPosts(list))
                console.log(newPosts);
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
								if(post.type === 'video') {
                                    return <ReelItem key={i} post={post}></ReelItem>
                                }
							})
						}
					</>
					:
					<>
						<div className='loading'>
                            <img src={hourglass} alt="" />
                        </div>
					</>
			}
            </div>
        </div>
    )
}

export default Reels;