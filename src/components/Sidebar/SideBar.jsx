import React, { useState, useEffect } from 'react';
import './SideBar.css';
import home from '../../assets/home.svg';
import hash from '../../assets/hash.svg';
import plus from '../../assets/plus.png';
import notification from '../../assets/notifications.svg';
import bookmark from '../../assets/bookmark.svg';
import message from '../../assets/message.svg';
import profile from '../../assets/profile.svg';
import reels from '../../assets/reels.png';
import connect from '../../assets/connect-logo.png';
import SideBarItem from './SideBarItem';
import defaultUser from '../../assets/defaultUser.png';
import { Link } from 'react-router-dom';
import logout from '../../assets/logout.png';
import { signOut, onAuthStateChanged } from 'firebase/auth';
import { authenticate } from '../../helper/firebase';
import { useNavigate } from 'react-router-dom';
import { UserAuth } from '../../context/AuthContext';


function SideBar() {
	const [userData, setUserData] = useState(null);
	const navigate = useNavigate();
	const [picture, setPicture] = useState(null);
	const {updateProfilePicture} = UserAuth();


	useEffect(() => {
		const removeListner = onAuthStateChanged(authenticate, (user) => {
			if (!user) navigate('/login');
			else {
				console.log(user);
				setUserData({ ...user });
			}
		});

		return () => {
			removeListner();
		}
	}, []);



	const SignOut = (e) => {
		e.preventDefault();
		signOut(authenticate).then(() => {
			window.localStorage.removeItem('data');
			setUserData(null);
			navigate('/login');
			window.location.reload();
		}).catch((err) => {
			console.log(err);
		});
	}

	return (
		<div className="sidebar-container">
			<div className='sidebar-box'>
				<div className='company'>
					<img src={connect} alt="" srcset="" />
				</div>
				<Link style={{ textDecoration: 'none', color: 'white' }} to="/"><SideBarItem logoSrc={home} logoType="Home" /></Link>
				<Link style={{ textDecoration: 'none', color: 'white' }} to="/explore"><SideBarItem logoSrc={hash} logoType="Explore" /></Link>
				{/* <Link style={{ textDecoration: 'none', color: 'white' }} to="/notification"><SideBarItem logoSrc={notification} logoType="Notifications" /></Link> */}
				<Link style={{ textDecoration: 'none', color: 'white' }} to="/chats"><SideBarItem logoSrc={message} logoType="Messages" /></Link>
				<Link style={{ textDecoration: 'none', color: 'white' }} to="/saved"><SideBarItem logoSrc={bookmark} logoType="Saved" /></Link>
				<Link style={{ textDecoration: 'none', color: 'white' }} to="/reels"><SideBarItem logoSrc={reels} logoType="Scrolls" /></Link>
				<Link style={{ textDecoration: 'none', color: 'white' }} to="/addpost"><SideBarItem logoSrc={plus} logoType="Create" /></Link>
				<Link style={{ textDecoration: 'none', color: 'white' }} to="/profile"><SideBarItem logoSrc={profile} logoType="Profile" /></Link>
			</div>
			<div className="add-or-logout">
				{
					userData &&
					<>
						<img className='ppic' src={userData.photoURL ? userData.photoURL : defaultUser } alt="" />
						<input

							onChange={(e) => {
								setPicture(e.target.files[0]);
							}}

						
							style={{
								position : 'relative',
								top : '-50px',
								cursor : 'pointer',
								left : '50px'
							}} type="file" />
						<button onClick={(e) => {
							e.preventDefault();
							if(!picture) {
								return;
							}
							updateProfilePicture(picture);
						}}>Update</button>
						<div className="profile-info">
							<div className="account-details">
								<div className='disp-name'>{userData.displayName}</div>
								<div className='user-name'>{userData.email}</div>
							</div>
							<div className="threedots">
								<button onClick={SignOut}><img src={logout} alt="" /></button>
							</div>
						</div>
					</>
				}
			</div>
		</div>
	)
}

export default SideBar