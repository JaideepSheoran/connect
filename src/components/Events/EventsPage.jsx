import React, { useState, useEffect } from 'react'
import './EventsPage.css';
import {collection, onSnapshot, query} from 'firebase/firestore';
import { db } from '../../helper/firebase';
import EventCard from './EventCard';
import funnel from '../../assets/funnel.gif';
import { useNavigate } from 'react-router-dom';


const EventsPage = () => {

    const [events, setEvents] = useState([]);
    const nav = useNavigate();

    useEffect(() => {
        const q = query(collection(db, 'events'));
        const unsub = onSnapshot(q, (snapshot) => {
            const allEvents = [];
            snapshot.docs.forEach((doc) => {
                allEvents.push({id : doc.id, ...doc.data()});
            })
            setEvents(allEvents);
        }, (err) => {console.log(err);})
        return () => {
            unsub();
        }
    }, []);
    

    return (
        <div className='event-page'>
            <div className="event-header">
                <div className='event-side'><p>Filter By</p> <img src={funnel} style={{filter : 'invert(1)', height : '25px'}} alt="" /> </div>
                <div className="event-filter">
                        <div className="data-filter">
                            <p>End Date</p>
                            <input type="date" name="expire"/>
                        </div>
                        <div className="data-filter">
                            <p>Event Type</p>
                            <select name="eventtype">
                                <option value="coding">Coding</option>
                                <option value="sports">Sports</option>
                                <option value="dance">Dance</option>
                                <option value="tech_fest">Technical Fest</option>
                                <option value="athletics">Athletics</option>
                            </select>
                        </div>
                        <div className="data-filter">
                            <p>College</p>
                            <select name="college">
                                <option value="nit_kkr">NIT, KKR</option>
                                <option value="nit_delhi">NIT, Delhi</option>
                                <option value="nit_surat">NIT, Surat</option>
                                <option value="nit_jalan">NIT, Jalandhar</option>
                                <option value="nit_hamir">NIT, Hamirpur</option>
                            </select>
                        </div>
                </div>
                <div className="event-creator">
                    <button className='event-creator-btn' onClick={(e) => {
                        e.preventDefault();
                        nav('/eventcreate');
                    }}>New Event</button>
                </div>
            </div>
            <div className="all-events">
                {
                    events && events.length > 0 && events.map((curr, i) => {
                        return (
                            <EventCard event={curr} key={curr.id} />
                        )
                    })
                }
            </div>
        </div>
    )
}

export default EventsPage;