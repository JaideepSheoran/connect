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
									<Route path='/' element={<Commentr />} />
									<Route path='/profile' element={<Home />} />
									<Route path='/chats' element={<Home />} />
									<Route path='/addpost' element={<AddPost />} />
									<Route path='/explore' element={<Home />} />
									<Route path='/saved' element={<Home />} />
									<Route path='/post/:pid' element={<Post />} />
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