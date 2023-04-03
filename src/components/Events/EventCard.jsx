import React, { useState} from 'react';
import './EventCard.css';
import { useNavigate } from 'react-router-dom';

const EventCard = ({ event }) => {
    const nav = useNavigate();
    return (
        <div className='event-card' onClick={
            (e) => {
                e.preventDefault();
                console.log('CLICKED');
                nav(`/event/${event.id}`)
            }
        }>
            <div className="event-poster">
                <img src={event.poster} alt="Poster" />
            </div>
            <div className="event-disc">
                <p className='event-title'>{event.title}</p>
                <p className='event-creator'><span>Oraganised By : </span> {event.college}</p>
                <span>Start Date : {new Date(event.startDate).toDateString()}</span><br/>
                <span>End Date : {new Date(event.endDate).toDateString()}</span>
            </div>
            <div className="expire-time">
                <p>End Date : <span>{new Date(event.endDate).toDateString()}</span></p>
            </div>
        </div>
    )
}

export default EventCard