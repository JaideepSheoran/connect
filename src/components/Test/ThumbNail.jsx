import { generateVideoThumbnails, importFileandPreview } from '@rajesh896/video-thumbnails-generator';
import React, { useEffect, useState } from 'react';
import loadingSVG from '../../assets/hourglass.gif';
import { storage } from '../../helper/firebase';
import { uploadBytes, getDownloadURL, ref, uploadString, getMetadata, getBlob } from 'firebase/storage';
import { Buffer } from 'buffer';
import './ThumbNail.css';
import { authenticate } from '../../helper/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { addDoc, collection } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { db } from '../../helper/firebase';

const ThumbNail = () => {
	const navigate = useNavigate();
	const [selectedFile, setSelectedFile] = useState(null);
	const [addPostText, setaddPostText] = useState('Add Reel');
	const [numberOfThumbnails, setNumberOfThumbnails] = useState(0);
	const [isLoading, setIsLoading] = useState(false);
	const [thumbnails, setThumbnails] = useState([]);
	const [selectedThumbnail, setselectedThumbnail] = useState('');
	const [videoPreview, setVideoPreview] = useState("");
	const [tags, setTags] = useState('');
	const [reel, setReel] = useState({
		uid: "",
		userUrl: "",
		username: "",
		caption: "",
		postUrl: "",
		location: "",
		timestamp: "",
		comments: "",
		tags: [],
		type: "video",
		thumbnail: "",
		likesCnt: 0
	}
	);


	const handleChange = (e) => {
        const { name, value } = e.target;
        setReel(prev => ({
            ...prev,
            [name]: value
        }));
    }

	useEffect(() => {
		if (selectedFile) {
			setselectedThumbnail("")
			setNumberOfThumbnails(0)
			setThumbnails([])
			importFileandPreview(selectedFile).then((url) => {
				setVideoPreview(url)
			})
		}
		return () => {
			window.URL.revokeObjectURL(videoPreview)
		}
	}, [selectedFile]);


	useEffect(() => {
        
        const unsubscribe = onAuthStateChanged(authenticate, (currentUser) => {
            if(!currentUser) 
                navigate("/");
            else {
                setReel({
                    ...reel,
                    ['uid'] : currentUser.uid,
                    ['username'] : currentUser.displayName,
                    ['userUrl'] : currentUser.photoURL
                });
                console.log(reel);
            }
        })
    
    
      return () => unsubscribe();
    }, []);
    

	// TESTING
	const [mu, setMy] = useState(null);
	const uploadtoStore = (e) => {
		e.preventDefault();
		const imageData = selectedThumbnail.split(',')[1];
		const file = new Blob([Buffer.from(imageData, 'base64')], { type: 'image/jpeg' });
		console.log(file);
		uploadBytes(ref(storage, `tests/random4.jpeg`), file).then((res) => {
			getDownloadURL(ref(storage, `tests/random4.jpeg`)).then((url) => {
				console.log(url);
				setMy(url);
			})
		}).catch(err => console.log(err));
	}

	const uploadReel = (e) => {
        e.preventDefault();
        try {
            if (!reel.caption || !reel.location || !tags) {
                alert('Empty Fields ~~~');
                return;
            }
            if (!selectedFile) {
                alert('Choose Post ~~~');
                return;
            } else {
                setaddPostText('Uploading...');

				// Set Tags Array
                var tagsTemp = tags;
                tagsTemp = tagsTemp.replaceAll(' ', '');
                var tagsArray = tagsTemp.split(',');
                tagsArray = tagsArray.filter((tag) => { return tag.length !== 0 });
                var tempPost = reel;
                tempPost.tags = tagsArray;
                setReel(tempPost);
                console.log(reel);
                const Time = Date.now();

				// data URI to image Data

				const imageData = selectedThumbnail.split(',')[1];
				const file = new Blob([Buffer.from(imageData, 'base64')], { type: 'image/jpeg' });

                uploadBytes(ref(storage, `${reel.uid}/${reel.uid}-${Time}`), selectedFile)
				.then((snap) => {
                    getDownloadURL(ref(storage, `${reel.uid}/${reel.uid}-${Time}`))
					.then((url) => {

                        reel.postUrl = url;

						uploadBytes(ref(storage, `${reel.uid}/${reel.uid}--${Time}`), file)
						.then((thumb) => {

							getDownloadURL(ref(storage, `${reel.uid}/${reel.uid}--${Time}`))
							.then((thumbUrl) => {
								reel.thumbnail = thumbUrl;
								reel.timestamp = Date.now();
								addDoc(collection(db, 'posts'), reel).then((docRef) => {
									console.log(docRef);
									setaddPostText('Add Reel');
								});
							}).catch(err => console.log(err));

						}).catch(err => console.log(err));

                    }).catch((err) => console.log(err));
                });
            }
        } catch (e) {
            console.error("Error adding document: ", e);
        }
    }

	return (
		<div className='fromfile'>
			{
				videoPreview &&
				<div className="preview-video">
					<video src={videoPreview} poster={selectedThumbnail || ""} ></video>
				</div>
			}
			<div className="formgroup">
				<input
					type={"file"}
					onChange={(e) => {
						if (e.target.files && e.target.files.length > 0 && e.target.files[0].type.includes("video")) {
							setSelectedFile(e.target.files[0])
						}
					}}
					accept="video/*"
				/>

				<input
					type={"number"}
					placeholder="Amount of thumbnails"
					onChange={(e) => {
						if (parseInt(e.target.value) > 20) return
						setNumberOfThumbnails(parseInt(e.target.value))
					}}
					max={"20"}
					value={numberOfThumbnails}
				/>

				<button
					onClick={() => {
						if (selectedFile) {
							setIsLoading(true);
							generateVideoThumbnails(selectedFile, numberOfThumbnails, "file").then((res) => {
								setIsLoading(false);
								setThumbnails(res);
								console.log(res);
							}).catch((Err) => {
								console.log('Err', Err)
								setIsLoading(false);
							})
						}
					}}
					disabled={selectedFile ? false : true}
				>Generate Thumbnails</button>
			</div>
			<div className="thumbnails-container">
				{!isLoading
					?
					thumbnails.map((image, index) => {
						return <img src={image} alt="thumbnails" className={`width-100 ${image === selectedThumbnail ? "active" : ""}`} style={{ maxWidth: 200 }} key={index} onClick={() => setselectedThumbnail(image)} />
					})
					:
					<img src={loadingSVG} alt="" className='no-border' />
				}
			</div>
			<div className='reel-data'>
				<div className="reel-caption">
					<p>Caption</p>
					<textarea placeholder='Add caption ...' onChange={handleChange} value={reel.caption}  name="caption" id="" cols="50" rows="5"></textarea>
				</div>
				<div className="reel-tags">
					<p>Add Tags</p>
					<textarea placeholder='Add Tags Comma Seperator ...' onChange={(e) => { setTags(e.target.value) }} value={tags} name="tags" id="" cols="50" rows="5"></textarea>
				</div>
				<div className="reel-location">
					<p>Add Location</p>
					<input placeholder='Add Location ...' onChange={handleChange} value={reel.location}  name='location'  type="text" />
				</div>
				<button onClick={uploadReel}>{addPostText}</button>
			</div>
		</div>
	)
}

export default ThumbNail;