import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { useEffect } from 'react';
import { db } from '../../helper/firebase';
import './Event.css';
import hourglass from '../../assets/hourglass.gif';
import { useNavigate } from 'react-router-dom';
import Commentr from '../Comments/Commentr';
import next from '../../assets/next.png';

const Event = () => {
    const { eid } = useParams();
    const [event, setEvent] = useState(null);
    const nav = useNavigate();

    useEffect(() => {
        getDoc(doc(db, 'events', eid)).then((document) => {
            setEvent({ id: document.id, ...document.data() });
        }).catch((err) => { console.log(err); });
    }, []);


    return (
        event != null
            ?
            <div className="event-main-box">
                <div className="event-container">
                    <div className="event-align">
                        <div className="post-info">
                            <div className="top">
                                <div>
                                    <div className="pic"><img src={JSON.parse(window.localStorage.getItem('data')).photoURL} alt="Profile" /></div>
                                    <div className="user-data">
                                        <div className="user">{event.by}</div>
                                        <div className="location">{new Date(event.startDate).toDateString() + " " + event.college}</div>
                                    </div>
                                </div>
                                <div><button onClick={() => { nav(-1) }}><img style={{ filter: 'invert(1)', rotate: '180deg' }} src={next} /></button></div>
                            </div>
                            <div className="post-details">
                                <div className="pic"><img src={JSON.parse(window.localStorage.getItem('data')).photoURL} alt="Profile" /></div>
                                <div className="user-data">
                                    <div className="user">
                                        {event.by}
                                        <span>{" " + event.title}</span> <br />
                                    </div>
                                    <div className="location">{event.endDate}</div>
                                </div>
                            </div>
                        </div>
                        <div className="img-box">
                            <div className="poster-box-cont">
                                {
                                    <img src={event.poster} alt="Post" />
                                }
                            </div>
                        </div>
                        <div className="post-info">
                            <div dangerouslySetInnerHTML={{ __html: event.content }} className="event-data"></div>
                            <p className='p-head'>Ask Doubt via Comments</p>
                            <div className="comments">
                                <Commentr pid={event.id} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            :

            <div className='loading'>
                <img src={hourglass} alt="" />
            </div>
    )
}

export default Event