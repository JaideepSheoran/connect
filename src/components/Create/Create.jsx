import React from 'react';
import { useState } from 'react';
import AddPost from '../Post/AddPost';
import ThumbNail from '../Test/ThumbNail';
import './Create.css';

const Create = () => {

    const [switchType, setSwitch] = useState(true);

    const toggleContent = (e) => {
        e.preventDefault();
        setSwitch(!switchType);
    }

    return (
        <div className='create-content'>
            <button onClick={toggleContent}>Switch Content</button>
            <div className='content-container'>
                {
                    switchType
                    ?
                        <AddPost />
                    :
                        <ThumbNail />
                }
            </div>
        </div>

    )
}

export default Create