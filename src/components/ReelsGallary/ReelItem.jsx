import React from 'react';
import './ReelItem.css';
import { useNavigate } from 'react-router-dom';

const ReelItem = ({ post }) => {
    const nav = useNavigate();

    const movetopost = (e) => {
        e.preventDefault();
        nav(`/post/${post.id}`)
    }

    return (
        <div onClick={movetopost} className='reels-item'>
            {
                post.type === 'video'
                ?  <img src={post.thumbnail}/>
                : <img src={post.postUrl} />
            }
        </div>
    )
}

export default ReelItem;