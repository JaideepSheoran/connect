import React from "react";
import filepicker from '../../assets/filepicker.png';
import happy from '../../assets/happy.png';


const MessageForm = ({ handleSubmit, text, setText, setImg }) => {
	return (
		<div className="message-sender-form">
			<form className="chat-form" onSubmit={handleSubmit}>
				<img
					style={
						{
							height: '25px',
							filter: 'invert(1)'
						}
					}
					src={happy} alt="Emoji"
				/>
				<input
					type="text"
					placeholder="Enter message"
					value={text}
					onChange={(e) => setText(e.target.value)}
				/>
				<input
					onChange={(e) => setImg(e.target.files[0])}
					type="file"
					id="img"
					accept="image/*"
					style={{ display: "none" }}
				/>
				<div className="chat-img-send">
					<label htmlFor="img">
						<img style={{ height: '25px', filter: 'invert(1)' }} src={filepicker} />
					</label>
				</div>
				<button>Send</button>
			</form>
		</div>
	);
};

export default MessageForm;
