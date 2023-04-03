import React, { useEffect, useState } from "react";
import { db, storage } from "../../helper/firebase";
import {
	collection,
	query,
	where,
	onSnapshot,
	addDoc,
	Timestamp,
	orderBy,
	setDoc,
	doc,
	getDoc,
	updateDoc,
} from "firebase/firestore";
import { ref, getDownloadURL, uploadBytes } from "firebase/storage";
import User from "./User";
import MessageForm from "./MessageForm";
import Message from "./Message";
import './Take.css';

const Take = () => {
	const [users, setUsers] = useState([]);
	const [chat, setChat] = useState("");
	const [text, setText] = useState("");
	const [img, setImg] = useState("");
	const [msgs, setMsgs] = useState([]);

	const user1 = JSON.parse(window.localStorage.getItem('data')).id_;

	useEffect(() => {
		const usersRef = collection(db, "users");
		// create query object
		const q = query(usersRef);
		// execute query
		const unsub = onSnapshot(q, (querySnapshot) => {
			let users = [];
			querySnapshot.forEach((doc) => {
				if (doc.id !== user1) {
					users.push({ uid: doc.id, ...doc.data() });
				}
			});
			setUsers(users);
		});
		return () => unsub();
	}, []);

	const selectUser = async (user) => {
		setChat(user);

		const user2 = user.uid;
		const id = user1 > user2 ? `${user1 + user2}` : `${user2 + user1}`;

		console.log(id);

		const msgsRef = collection(db, "messages_", id, "chat");
		const q = query(msgsRef, orderBy("createdAt", "asc"));

		onSnapshot(q, (querySnapshot) => {
			let msgs = [];
			querySnapshot.forEach((doc) => {
				const tempId = doc.ref.path.slice(10, -26);
				console.log(tempId, id);
				if(tempId !== id){
					console.log('NOT SAME');
					return;
				}
				msgs.push(doc.data());
			});
			setMsgs(msgs);
		});

		// get last message b/w logged in user and selected user
		const docSnap = await getDoc(doc(db, "lastMsg", id));
		// if last message exists and message is from selected user
		if (docSnap.data() && docSnap.data().from !== user1) {
			// update last message doc, set unread to false
			await updateDoc(doc(db, "lastMsg", id), { unread: false });
		}
	};

	const handleSubmit = async (e) => {
		e.preventDefault();

		const user2 = chat.uid;

		const id = user1 > user2 ? `${user1 + user2}` : `${user2 + user1}`;

		let url;
		if (img) {
			const imgRef = ref(
				storage,
				`images/${new Date().getTime()} - ${img.name}`
			);
			const snap = await uploadBytes(imgRef, img);
			const dlUrl = await getDownloadURL(ref(storage, snap.ref.fullPath));
			url = dlUrl;
		}

		await addDoc(collection(db, "messages_", id, "chat"), {
			text,
			from: user1,
			to: user2,
			createdAt: Timestamp.fromDate(new Date()),
			media: url || "",
		});

		await setDoc(doc(db, "lastMsg", id), {
			text,
			from: user1,
			to: user2,
			createdAt: Timestamp.fromDate(new Date()),
			media: url || "",
			unread: true,
		});

		setText("");
		setImg("");
	};
	return (
		<div className="chat-section">
			<div className="chat-container">
				<div className="chat-sidebar">
					<div className="cbx">
						<div className="chat-user"><span>{JSON.parse(window.localStorage.getItem('data')).email}</span></div>
						<div className='chat-heading'><span>Chats</span></div>
					</div>
					<div className="chat-list">
						{users.map((user) => (
							<User
								key={user.uid}
								user={user}
								selectUser={selectUser}
								user1={user1}
								chat={chat}
							/>
						))}
					</div>
				</div>
				<div className="selected-user-chat">
					<div className="selected-user-info"><span>{chat ? chat.username : ''}</span></div>
					<div className="selected-messages">
						{chat ? (
							<>
								<div className="message-container">
									{msgs.length
										? msgs.map((msg, i) => (
											<Message key={i} msg={msg} user1={user1} />
										))
										: null}
								</div>
							</>
						) : (
							<h3 className="no_conv">Select a user to start conversation</h3>
						)}
					</div>
					<div className="message-sender-form">
						<MessageForm
							handleSubmit={handleSubmit}
							text={text}
							setText={setText}
							setImg={setImg}
						/>
					</div>

				</div>
			</div>
		</div>
	);
};

export default Take;
