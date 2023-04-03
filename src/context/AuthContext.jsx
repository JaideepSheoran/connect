import { createContext, useContext, useEffect, useState } from 'react';
import React from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { doc, getDoc, updateDoc, setDoc } from 'firebase/firestore';
import { authenticate, db, storage } from '../helper/firebase';
import { doLogin } from '../auth';
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged,
    GoogleAuthProvider,
    updateProfile
} from 'firebase/auth';
import { ref, getDownloadURL, uploadBytesResumable } from 'firebase/storage';
import { v4 as uuid } from 'uuid';


const UserContext = createContext();

export const AuthContextProvider = ({ children }) => {
    const [user, setUser] = useState({});
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const createUser = (email, password, username, picture) => {
        const EMAIL = email.toLowerCase();
        const PASSWORD = password.toLowerCase();
        const STORAGE_REF = ref(storage, `/${uuid()}/${picture.name}`);
        const uploadTask = uploadBytesResumable(STORAGE_REF, picture);

        uploadTask.on('state_changed',
            (snapshot) => {
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                console.log('Upload is ' + progress + '% done');
                switch (snapshot.state) {
                    case 'paused':
                        console.log('Upload is paused');
                        break;
                    case 'running':
                        console.log('Upload is running');
                        break;
                }
            },
            (error) => {
                console.log(error);
            },
            () => {
                getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                    createUserWithEmailAndPassword(authenticate, EMAIL, PASSWORD).then((creds) => {
                        updateProfile(creds.user, {
                            photoURL: downloadURL,
                            displayName: username
                        }).then(() => {
                            setDoc(doc(db, 'users', creds.user.uid), {
                                email: creds.user.email,
                                followers: 0,
                                following: 0,
                                photoUrl: downloadURL,
                                username: username
                            }).then(() => {
                                window.alert('Created');
                            }).catch(err => console.log(err));
                        }).catch((err) => console.log(err));
                    }).catch(err => {
                        window.alert(err);
                    });
                });
            }
        );
    };


    const updateProfilePicture = (picture) => {
        const STORAGE_REF = ref(storage, `/${uuid()}/${picture.name}`);
        const uploadTask = uploadBytesResumable(STORAGE_REF, picture);
        uploadTask.on('state_changed',
            (snapshot) => {
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                console.log('Upload is ' + progress + '% done');
                switch (snapshot.state) {
                    case 'paused':
                        console.log('Upload is paused');
                        break;
                    case 'running':
                        console.log('Upload is running');
                        break;
                }
            },
            (error) => {
                console.log(error);
            },
            () => {
                getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                    updateProfile(authenticate.currentUser, {
                        photoURL: downloadURL
                    }).then(() => {
                        updateDoc(doc(db, 'users', authenticate.currentUser.uid), {
                            photoUrl: downloadURL
                        }).then(() => {
                            window.alert('Created');
                        }).catch(err => console.log(err));
                    }).catch((err) => console.log(err));
                });
            }
        );
    }

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
            value={{
                createUser,
                user,
                logout,
                signIn,
                updateProfilePicture
            }} >
            {children}
        </UserContext.Provider>
    );
};

export const UserAuth = () => {
    return useContext(UserContext);
};