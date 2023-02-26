import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './components/Home/Home';
import Login from './components/Login/Login';
import PrivateRoute from './components/PrivateRoute';
import { useEffect, useState } from 'react';
import userContext from './context/userContext';
import { onAuthStateChanged } from 'firebase/auth';
import { authenticate } from './helper/firebase';
import SideBar from './components/Sidebar/SideBar';
import AddPost from './components/Post/AddPost';
import Post from './components/Post/Post';
import Commentr from './components/Comments/Commentr';
import Gallary from './components/Gallary/Gallary';
import Head from './components/Head/Head';
import Profile from './components/Profile/Profile';
import Test from './components/Test/Test';
import ThumbNail from './components/Test/ThumbNail';
import Create from './components/Create/Create';


function App() {
	const [user, setUser] = useState({});

	useEffect(() => {
		const unsubscribe = onAuthStateChanged(authenticate, (currUser) => {
			if (!currUser) return;

			setUser({
				id: currUser.uid,
				username: currUser.displayName,
				email: currUser.email,
				photoUrl: currUser.photoURL
			});
			console.log('Run');
		});

		return () => unsubscribe();
	}, []);


	const value = { user, setUser };

	return (
			<userContext.Provider value={value}>
				<Router>
					<div className='my-app'>
						<SideBar />
						<div className="content">
							<Routes>
								<Route path="login" element={<Login />} />
								<Route path="register" element={<Login />} />

								<Route path='/' element={<PrivateRoute />}>
									<Route path='/' element={<Gallary />} />
									<Route path='/profile/*' element={<Head />} />
									<Route path='/chats' element={<ThumbNail />} />
									<Route path='/addpost' element={<Create />} />
									<Route path='/explore' element={<Gallary />} />
									<Route path='/saved' element={<Test />} />
									<Route path='/post/:pid' element={<Post />} />
									<Route path='/user/:uid' element={<Profile />} />
								</Route>
							</Routes>
						</div>
					</div>
				</Router>
			</userContext.Provider>
	);
}

export default App;

// jaideepsinghsheoran@gmail.com