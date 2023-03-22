import { createContext, useContext, useEffect, useState } from 'react';
import React from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { authenticate, db } from '../helper/firebase';
import {doLogin} from '../auth';
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged,
    GoogleAuthProvider,
    updateProfile
} from 'firebase/auth';


const UserContext = createContext();

export const AuthContextProvider = ({ children }) => {
    const [user, setUser] = useState({});
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const createUser = (email, password, username) => {
        const EMAIL = email.toLowerCase();
        const PASSWORD = password.toLowerCase();
        createUserWithEmailAndPassword(authenticate, EMAIL, PASSWORD).then((creds) => {
            updateProfile(creds.user, {
                photoURL : 'https://cdn-icons-png.flaticon.com/512/149/149071.png',
                displayName : username
            }).then(() => {
                setDoc(doc(db, 'users', creds.user.uid), {
                    email : creds.user.email,
                    followers : 0,
                    following : 0,
                    photoUrl : 'https://cdn-icons-png.flaticon.com/512/149/149071.png',
                    username : username
                }).then(() => {
                    window.alert('Created');
                }).catch(err => console.log(err));
            }).catch((err) => console.log(err));
        }).catch(err => {
            window.alert(err);
        });
    };

    const signIn = (email, password) => {
        signInWithEmailAndPassword(authenticate, email, password).then((creds) => {
            const DATA = {
                ...creds.user.providerData[0],
                id_: creds.user.uid
            }
            doLogin(DATA, () => {
                console.log("login detail is saved to localstorage");

                getDoc(doc(db, 'users', creds.user.uid)).then((rdata) => {
                    dispatch({
                        type: 'SET_USER',
                        payload: { ...rdata.data(), id: creds.user.uid }
                    })
                }).catch(err => console.log(err));
                navigate("/chats");
            });
        }).catch(err => {
            window.alert(err);
        });
    }

    const logout = () => {
        return signOut(authenticate)
    }

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(authenticate, (currentUser) => {
            console.log(currentUser);
            setUser(currentUser);
        });
        return () => {
            unsubscribe();
        };
    }, []);

    return ( 
        <UserContext.Provider 
            value = {{ 
                        createUser, 
                        user, 
                        logout, 
                        signIn     
                    }} > 
            { children } 
        </UserContext.Provider>
    );
};

export const UserAuth = () => {
    return useContext(UserContext);
};