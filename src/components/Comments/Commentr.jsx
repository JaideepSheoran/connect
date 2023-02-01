import React, { useState, useEffect } from 'react';
import './Commentr.css';
import { db } from '../../helper/firebase';
import { addDoc, doc, onSnapshot, collection, query, setDoc } from 'firebase/firestore';

function Commentr() {
  const [comments, setComments] = useState([]);
  const [newCommentText, setNewCommentText] = useState('');
  const [parentId, setParentId] = useState(null);

  useEffect(() => {

    const unsub = onSnapshot(query(collection(db, "mycomments")) , (snapshot) => {
        const comments = [];
        snapshot.docs.forEach((commentSnap) => {
            comments.push({
                id : commentSnap.id,
                text : commentSnap.data().text,
                authorId : commentSnap.data().author_id,
                timestamp : commentSnap.data().timestamp,
                parentId : commentSnap.data().parent_id,
            });
        });
        setComments(comments);
    });

   
    return () => {
      unsub();
    };
  }, []);

  const handleCommentSubmit = (event) => {
    event.preventDefault();

    setDoc(doc(collection(db, 'mycomments')), {
        text: newCommentText,
        author_id: '@naresh',
        timestamp: Date.now(),
        parent_id: parentId,
    })
    .then((res) => {
        setNewCommentText('');
        setParentId(null);
        console.log('ADDED');
    })
    .catch((err) => {
        console.log(err);
    });
  };

  const renderComment = (comment, depth = 0) => {
    return (
      <li style={{ marginLeft: `${depth * 10}px` }}>
        <p>{comment.authorId + " "}{" " + comment.text}</p>
        <ul>
            {
                comments
                .filter((childComment) => childComment.parentId == comment.id)
                .map((childComment) => renderComment(childComment, depth + 1))
            }
        </ul>
        <button onClick={() => setParentId(comment.id)}>
          Reply to this comment
        </button>
      </li>
    );
  };

  return (
    <div className='post-comments'>
      <h2>Comments</h2>
      <ul>
        {comments
          .filter((comment) => !comment.parentId)
          .map((comment) => renderComment(comment))}
      </ul>
      <form onSubmit={handleCommentSubmit}>
        <textarea
          value={newCommentText}
          onChange={(event) => setNewCommentText(event.target.value)}
        />
        <button type="submit">Submit Comment</button>
      </form>
    </div>
  );
}

export default Commentr;
