import React, { useState, useContext } from 'react';
import {GoogleAuthProvider, signInWithPopup, createUserWithEmailAndPassword, sendPasswordResetEmail, sendEmailVerification, signInWithEmailAndPassword, signOut} from "firebase/auth";
import './Login.css';
import {authenticate, db} from '../../helper/firebase';
import {Link, useNavigate } from 'react-router-dom';
import userContext from '../../context/userContext';
import { doLogin } from '../../auth';
import './Login.css';
import imgSrc from "../../assets/logo-google.png";
import connect from '../../assets/connect.png'
import { useDispatch } from 'react-redux';
import { doc, getDoc } from 'firebase/firestore';
import { async } from '@firebase/util';

function Login() {
    const {user, setUser} = useContext(userContext);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const handleLogin = (e) => {
        e.preventDefault();
        signInWithPopup(authenticate, new GoogleAuthProvider())
        .then((creds) => {

            const DATA = {
                ...creds.user.providerData[0],
                id_ : creds.user.uid
            }
            doLogin(DATA, () => {
                console.log("login detail is saved to localstorage");

                getDoc(doc(db, 'users', creds.user.uid)).then((rdata) => {
                    dispatch({
                        type : 'SET_USER',
                        payload : {...rdata.data(), id : creds.user.uid}
                    })
                }).catch(err => console.log(err))


                //redirect to user dashboard page
                setUser({
                    ...DATA,
                    login : true
                });
                navigate("/");
              });
        })
        .catch((e) => {
            console.log(e);
        })
    }

    const handleEmailPassLogin = (e) => {
        e.preventDefault();
        createUserWithEmailAndPassword(authenticate, email, password).then((creds) => {
            sendEmailVerification(creds.user).then(() => {
                window.prompt(`Email sent to ${email}.`);
            }).catch(err => console.log(err)); 
        }).catch(err => {
            window.alert(err);
        });
    }

    const handleEmailPassLogins = (e) => {
        e.preventDefault();
        signOut(authenticate).then(() => {
            window.alert(`Out`);
        }).catch(err => console.log(err));
    }

    return (
       <div className="login_page">
            <div className="login_box">
                <div className='login-logo'>
                    <img src={connect} alt="Logo" />
                </div>
                <div className='login-ep'>
                    <form onSubmit={handleEmailPassLogins}>
                        <input 
                            onChange={(e) => {
                                setEmail(e.target.value);
                            }} 
                            className='login-cred' 
                            type="email" 
                            placeholder='Email' />

                        <input 
                            onChange={(e) => {
                                setPassword(e.target.value);
                            }}
                            className='login-cred' 
                            type="password" 
                            placeholder='Password'/>
                        
                        <button 
                            className='login-btn' 
                            type='submit'
                        >Log in</button>
                    </form>
                </div>
                <div className='log-divider'><span>OR</span></div>
                <button onClick={handleLogin}><img src={imgSrc} />Sign in With Google</button>
                <div className='log-divider'><span>OR</span></div>
                <div className='login-reg'>
                    <p>Don't have an account ?</p><Link className='reg-link' to='/register'>Sign up</Link>
                </div>
            </div>
       </div>
    )
}

export default Login