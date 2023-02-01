import React from 'react'
import { useEffect } from 'react'
import { useState } from 'react'
import { getCurrentUserDetail, isLoggedIn } from '../auth'
import userContext from './userContext'

function UserProvider({ children }) {

    const [user, setUser] = useState({
        data: {},
        login: false
    });
    const value = { user, setUser };

    useEffect(() => {
        setUser({
            data: getCurrentUserDetail(),
            login: isLoggedIn()
        })
    }, [])



    return (

        <
        userContext.Provider value = { value } > { children } <
        /userContext.Provider>

    )
}

export default UserProvider