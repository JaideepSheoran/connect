import React, { useState } from 'react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import { storage, db } from '../../helper/firebase';
import { uploadBytes, getDownloadURL, ref } from 'firebase/storage';
import { uuidv4 as uuid } from '@firebase/util';
import './CreateEvent.css';
import { addDoc, collection } from 'firebase/firestore';

const CreateEvent = () => {

    const usermail = JSON.parse(window.localStorage.getItem('data')).email;

    const [newEvent, setNewEvent] = useState({
        title: '',
        college: 'NIT, Delhi',
        by: usermail,
        content: '',
        poster: '',
        startDate: '',
        endDate: '',
        type: 'Sports'
    });
    const [text, setText] = useState('');
    const [image, setImage] = useState('');

    const handleInputChange = (e) => {
        const { name, value } = e.target;

        setNewEvent({
            ...newEvent,
            [name]: value,
        });
    };

    const addEventToDatabase = (e) => {
        e.preventDefault();
        const UUID = uuid();
        console.log(newEvent);
        uploadBytes(ref(storage, `events/${UUID}`), image).then(() => {
            getDownloadURL(ref(storage, `events/${UUID}`)).then((url) => {
                const eventObj = newEvent;
                eventObj['poster'] = url;
                addDoc(collection(db, 'events'), eventObj).then((document) => {
                    setNewEvent({
                        title: '',
                        college: 'NIT, Delhi',
                        by: usermail,
                        content: '',
                        poster: '',
                        startDate: '',
                        endDate: '',
                        type: 'Sports'
                    });
                }).catch(err => console.log(err));
            }).catch((err) => {console.log(err)});
        }).catch((err) => {console.log(err)});
    }

    return (
        <div className='editor'>
            <div className="event-form">
                <div className="event-input">
                    <label>Add Title</label>
                    <input 
                        value={newEvent.title}
                        type="text" 
                        name='title'
                        placeholder=' Title...'
                        onChange={handleInputChange}
                    />
                </div>
                <div className="event-input">
                    <label>Start Date</label>
                    <input 
                        value={newEvent.startDate}
                        type="date" 
                        name='startDate'
                        onChange={handleInputChange}
                    />
                </div>
                <div className="event-input">
                    <label>End Date</label>
                    <input 
                        value={newEvent.endDate}
                        type="date" 
                        name='endDate'
                        onChange={handleInputChange}
                    />
                </div>
                <div className="event-editor">
                    <label>Event Details</label>
                    <CKEditor
                        editor={ClassicEditor}
                        data={text}
                        onChange={(event, editor) => {
                            const data = editor.getData();
                            setNewEvent({
                                ...newEvent,
                                ['content']: data
                            });
                        }}
                    />
                </div>
                <div className="event-input">
                    <label>Add Poster</label>
                    <input onChange={(e) => {setImage(e.target.files[0])}} type="file" />
                </div>
                <button onClick={addEventToDatabase}>Add Event</button>
            </div>
        </div>
    )
}

export default CreateEvent