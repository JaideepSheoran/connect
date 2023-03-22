import React, { useRef, useState, useEffect } from 'react';
import './VideoCard.css';
import audioon from '../../assets/audioon.png';
import music from '../../assets/music.png';
import hlike from '../../assets/hlike.png';
import comment from '../../assets/comment.png';
import bookmark from '../../assets/bookmark.png';
import defaultUser from '../../assets/defaultUser.png';


const VideoCard = ({ reel }) => {

    const [isVideoPlaying, setIsVideoPlaying] = useState(false);
    const videoRef = useRef(null);

    const handlePlay = () => {
        if (isVideoPlaying) {
            videoRef.current.pause();
            setIsVideoPlaying(false);
        } else {
            videoRef.current.play();
            setIsVideoPlaying(true);
        }
    }

    useEffect(() => {
        console.log('Running');
        let options = {
            root : document.getElementById("reels_parent"),
            rootMargin: "0px",
            threshold: [0.25, 0.75]
        };

        let handleAutoPlay = (entries, observer) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    videoRef.current.play();
                    setIsVideoPlaying(true);
                } else {
                    videoRef.current.pause();
                    setIsVideoPlaying(false);
                }
            });
        };

        let observer = new IntersectionObserver(handleAutoPlay, options);

        observer.observe(videoRef.current);

    });

    return (
        <div style={{ backgroundColor: 'white' }} className='videoCard'>
            <div className="reelBox">
                <div className='audioControler'>
                    <img src={audioon} alt="S" />
                </div>
                {
                    <video
                        loop={true}
                        autoPlay={false}
                        ref={videoRef}
                        onClick={handlePlay}
                        src={reel.postUrl}
                        controls={false}
                    ></video>
                }
                <div className='reelFooter'>
                    <div className="reelFooter_">
                        <img src={defaultUser} alt="" /> <span>.</span> <p>naresh_kumar</p> <span>.</span> <p>Follow</p>
                    </div>
                    <p>{reel.caption} Don't be too busy making a living that you forgot making a life.</p>
                    <div className="music_name">
                        <img src={music} alt="" />
                        <span>Sidhu Son - Rehaan Records - {reel.location}</span>
                    </div>
                </div>
            </div>
            <div className="reelStats">
                <div className="reelStat">
                    <img src={hlike} alt="" />
                    <span>{reel.likesCnt}</span>
                </div>
                <div className="reelStat">
                    <img src={comment} alt="" />
                    <span>234</span>
                </div>
                <div className="reelStat">
                    <img src={bookmark} alt="" />
                </div>
            </div>
        </div>
    )
}

export default VideoCard