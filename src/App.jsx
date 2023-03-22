import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './components/Home/Home';
import Login from './components/Login/Login';
import PrivateRoute from './components/PrivateRoute';
import { useEffect, useState } from 'react';
import userContext from './context/AuthContext';
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
import Register from './components/Login/Register';
import VerifyEmail from './components/Login/VerifyEmail';
import Chats from './components/Chats/Chats';
import TestChat from './components/Chats/TestChat';
import Protected from './components/Protected';
import { AuthContextProvider } from './context/AuthContext';
import Explore from './components/Explore/Explore';
import Scroll from './components/Reels/Scroll';


function App() {
	// const [user, setUser] = useState({});
	// const [isSignedIn, setIsSignedIn] = useState(false);

	// useEffect(() => {
	// 	const unsubscribe = onAuthStateChanged(authenticate, (currUser) => {
	// 		if (!currUser) {
	// 			return;
	// 		}

	// 		setUser({
	// 			id: currUser.uid,
	// 			username: currUser.displayName,
	// 			email: currUser.email,
	// 			photoUrl: currUser.photoURL
	// 		});
	// 		setIsSignedIn(true);
	// 		console.log('Run');
	// 	});

	// 	return () => unsubscribe();
	// }, []);


	// const value = { user, setUser };

	return (
		<Router>
			<AuthContextProvider>
				<div className='my-app'>
					<SideBar />
					<div className="content">
						<Routes>
							<Route path="login" element={<Login />} />
							<Route path="register" element={<Register />} />

							{/* <Route path='/' element={<Protected />}>
								<Route path='/' element={<Home />} />
								<Route path='/profile/*' element={<Head />} />
								<Route path='/chats' element={<Chats />} />
								<Route path='/addpost' element={<Create />} />
								<Route path='/explore' element={<Gallary />} />
								<Route path='/saved' element={<Test />} />
								<Route path='/post/:pid' element={<Post />} />
								<Route path='/user/:uid' element={<Profile />} />
							</Route> */}

							<Route exact path='/' element={<Protected><Home/></Protected>}/>
							<Route path='/profile/*' element={<Protected><Head/></Protected>}/>
							<Route exact path='/chats' element={<Protected><Chats/></Protected>}/>
							<Route exact path='/addpost' element={<Protected><Create/></Protected>}/>
							<Route exact path='/explore' element={<Protected><Explore/></Protected>}/>
							<Route exact path='/saved' element={<Protected><Test/></Protected>}/>
							<Route exact path='/reels' element={<Protected><Scroll/></Protected>}/>
							<Route path='/post/:pid' element={<Protected><Post/></Protected>}/>
							<Route path='/user/:uid' element={<Protected><Profile/></Protected>}/>
							
						</Routes>
					</div>
				</div>
			</AuthContextProvider>
		</Router>
	);
}

export default App;

// jaideepsinghsheoran@gmail.com