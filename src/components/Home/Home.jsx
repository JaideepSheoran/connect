import React, { useEffect, useState, useMemo } from 'react';
import './Home.css';
import SideBar from '../Sidebar/SideBar';
import Post from '../Post/Post';
import AddPost from '../Post/AddPost';
import userContext from '../../context/userContext';
import { collection, doc, getDocs, onSnapshot, query, where } from 'firebase/firestore';
import { db } from '../../helper/firebase';
import { Navigate, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {setUserPosts} from "../../actions/index"


function Home() {
	const userID = JSON.parse(window.localStorage.getItem('data')).id_;
	const nav = useNavigate();
	const newPosts = useSelector((state) => state.loadPosts);
	const dispatch = useDispatch();

	const getPosts = async () => {
		const q = query(collection(db, 'posts'), where('uid', '==', userID));

		try {
			const res = await getDocs(q);
			var list = [];
			res.docs.forEach((doc) => {
				list.push(doc.id);
			});
			dispatch(setUserPosts(list))
			console.log(newPosts);
		} catch (error) {
			console.log(error);
		}
	}

	useEffect(() => {
		if(newPosts.length != 0) return;
		getPosts();
		console.log('RUN');
	}, []);



	return (
		<div>
			
			{
				newPosts.length > 0 ?
					<>
						{
							newPosts.map((post, i) => {
								return <button key={i} onClick={(e) => {
									e.preventDefault();
									nav(`/post/${post}`)
								}}>{post}</button>
							})
						}
					</>
					:
					<>
						Loading...
					</>
			}
		</div>
	)
}

export default Home;