import React, { useEffect, useState, useMemo } from 'react';
import './Home.css';
import SideBar from '../Sidebar/SideBar';
import Post from '../Post/Post';
import AddPost from '../Post/AddPost';
import userContext from '../../context/userContext';
import { collection, doc, getDocs, onSnapshot, query, where } from 'firebase/firestore';
import { db } from '../../helper/firebase';
import { Navigate, useNavigate } from 'react-router-dom';



function Home() {
	const userID = JSON.parse(window.localStorage.getItem('data')).id_;
	const nav = useNavigate();
	const [posts, setPosts] = useState([]);
	const [index, setIndex] = useState(0);

	const getPosts = async () => {
		const q = query(collection(db, 'posts'), where('uid', '==', userID));

		try {
			const res = await getDocs(q);
			var list = [];
			res.docs.forEach((doc) => {
				list.push(doc.id);
			});
			setPosts([...list]);
			console.log(posts);
		} catch (error) {
			console.log(error);
		}
	}

	useEffect(() => {
		getPosts();
		console.log('RUN');
	}, []);

	const processedPosts = useMemo(() => {
		return posts;
	}, [posts]);


	return (
		<div>
			{
				posts.length > 0 ?
					<>
						{
							processedPosts.map((post, i) => {
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