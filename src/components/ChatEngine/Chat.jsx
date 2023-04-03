import React, { useState } from 'react';
import { ChatEngine, getOrCreateChat } from 'react-chat-engine';

const Chat = () => {

    const [username, setUsername] = useState('')

	function createDirectChat(creds) {
		getOrCreateChat(
			creds,
			{ is_direct_chat: true, usernames: [username] },
			() => setUsername('')
		)
	}

	function renderChatForm(creds) {
		return (
			<div>
				<input 
					placeholder='Username' 
					value={username} 
					onChange={(e) => setUsername(e.target.value)} 
				/>
				<button onClick={() => createDirectChat(creds)}>
					Create
				</button>
			</div>
		)
	}



    return (
        <div>
            <ChatEngine
                projectID='b3432642-c228-4c5e-adea-715e8b0dc5a0'
                userName='Jaideep'
                userSecret='asdf-asdf'
                renderNewChatForm={(creds) => renderChatForm(creds)}
            />
        </div>
    )
}

export default Chat;