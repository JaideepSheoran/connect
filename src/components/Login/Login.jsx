import React, { useState, useContext } from 'react';
import {GoogleAuthProvider, signInWithPopup, signOut} from "firebase/auth";
import './Login.css';
import {authenticate} from '../../helper/firebase';
import {useNavigate } from 'react-router-dom';
import userContext from '../../context/userContext';
import { doLogin } from '../../auth';
import './Login.css';
import imgSrc from "../../assets/logo-google.png";


function Login() {
    const {user, setUser} = useContext(userContext);
    const navigate = useNavigate();
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

    return (
       <div className="login_page">
            <div className="login_box">
                <button onClick={handleLogin}><img src={imgSrc} />Sign in With Google</button>
            </div>
       </div>
    )
}

export default Login