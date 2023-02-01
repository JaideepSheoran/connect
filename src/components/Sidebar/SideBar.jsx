import React, { useState , useEffect} from 'react';
import './SideBar.css';
import home from '../../assets/home.svg';
import hash from '../../assets/hash.svg';
import plus from '../../assets/plus.png';
import notification from '../../assets/notifications.svg';
import bookmark from '../../assets/bookmark.svg';
import message from '../../assets/message.svg';
import profile from '../../assets/profile.svg';
import connect from '../../assets/connect.png';
import SideBarItem from './SideBarItem';
import { Link } from 'react-router-dom';
import logout from '../../assets/logout.png';
import { signOut, onAuthStateChanged } from 'firebase/auth';
import { authenticate } from '../../helper/firebase';
import { useNavigate } from 'react-router-dom';

function SideBar() {
    const [userData, setUserData] = useState(JSON.parse(window.localStorage.getItem('data')));
    const navigate = useNavigate();

	useEffect(() => {
	  const removeListner = onAuthStateChanged(authenticate, (user) => {
			if(!user) navigate('/login');
			else {
				setUserData(user);
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
        }).catch((err) => {
            console.log(err);
        });
    }

	return (
		<div className="sidebar-container">
			<div className='sidebar-box'>
				<SideBarItem logoSrc={connect} logoType="" />
				<Link style={{textDecoration : 'none', color : 'white'}} to="/"><SideBarItem logoSrc={home} logoType="Home" /></Link>
				<Link style={{textDecoration : 'none', color : 'white'}} to="/explore"><SideBarItem logoSrc={hash} logoType="Explore" /></Link>
				<Link style={{textDecoration : 'none', color : 'white'}} to="/notification"><SideBarItem logoSrc={notification} logoType="Notifications" /></Link>
				<Link style={{textDecoration : 'none', color : 'white'}} to="/chats"><SideBarItem logoSrc={message} logoType="Messages" /></Link>
				<Link style={{textDecoration : 'none', color : 'white'}} to="/saved"><SideBarItem logoSrc={bookmark} logoType="Saved" /></Link>
				<Link style={{textDecoration : 'none', color : 'white'}} to="/addpost"><SideBarItem logoSrc={plus} logoType="Create" /></Link>
				<Link style={{textDecoration : 'none', color : 'white'}} to="/profile"><SideBarItem logoSrc={profile} logoType="Profile" /></Link>
				{/* <Link style={{textDecoration : 'none', color : 'white'}} to="/"><SideBarItem logoSrc={menu} logoType="More" /></Link> */}
			</div>
			<div className="add-or-logout">
				{
					userData &&
					<>
						<div className="profile-pic">
							<img src={userData.photoURL} alt="" />
						</div>
						<div className="profile-info">
							<div className="account-details">
								<div className='disp-name'>{userData.displayName}</div>
								<div className='user-name'>@Jaideep_shrn19</div>
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