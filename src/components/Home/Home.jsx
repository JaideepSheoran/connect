import React, { useEffect, useState } from 'react';
import './Home.css';
import { collection, doc, getDocs, getDoc, query, where } from 'firebase/firestore';
import { db } from '../../helper/firebase';
import HomePost from './HomePost';
import hourglass from '../../assets/hourglass.gif';


function Home() {
	const [feed, setFeed] = useState([]);

	const getPosts = async () => {
		const q = query(collection(db, 'posts'));
        getDocs(q).then(async (snapshot) => {
            const res = await Promise.all(snapshot.docs.map(async (postSnap) => {
                const data = postSnap.data();
                const r = await getDoc(doc(db, 'users', data.uid));
	            return {
                    id: postSnap.id,
					...r.data(),
                   	...data
                };
            }));
            setFeed(res);
        }).catch((err) => {
            console.log(err);
        })
    }


	useEffect(() => {
		if(feed.length != 0) return;
		getPosts();
	}, []);



	return (
		<div>
			
			{
				feed.length > 0 ?
					<>
						{
							feed.map((post, i) => {
								return <HomePost key={i} photoURL={post.type === 'video' ? post.thumbnail : post.postUrl} post={post} />
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
	)
}

export default Home;