import React from 'react';
import './GallaryItem.css';
import { useNavigate } from 'react-router-dom';

const GallaryItem = ({ post }) => {
    const nav = useNavigate();

    const movetopost = (e) => {
        e.preventDefault();
        nav(`/post/${post.id}`)
    }

    return (
        <div onClick={movetopost} className='gallary-item'>
            {
                post.type === 'video'
                ?  <img src={post.thumbnail}/>
                : <img src={post.postUrl} />
            }
        </div>
    )
}

export default GallaryItem