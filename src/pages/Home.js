import React, { useEffect, useState } from 'react';
import { getDocs, collection, deleteDoc, doc } from 'firebase/firestore';
import { auth, db } from '../firebase-config';
import { useNavigate } from 'react-router-dom';

function Home({ isAuth }) {
  const [postLists, setPostList] = useState([]);
  const postsCollectionRef = collection(db, 'posts');
  const navigate = useNavigate();

  const deletePost = async (id) => {
    const postDoc = doc(db, 'posts', id);
    await deleteDoc(postDoc);
  };
  useEffect(() => {
    const getPosts = async () => {
      const data = await getDocs(postsCollectionRef);
      setPostList(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    };

    getPosts();
  }, [deletePost]);

  return (
    <div className='homePage'>
      {postLists.map((post) => {
        return (
          <div
            className='post'
            key={post.id}
            onClick={() => navigate(`/posts/${post.id}`)}
          >
            <div className='postHeader'>
              <div className='title'>
                <h1 className='text-3xl'> {post.title}</h1>
              </div>
              <div className='deletePost'>
                {isAuth && post.author.id === auth.currentUser.uid && (
                  <button
                    onClick={() => {
                      deletePost(post.id);
                    }}
                  >
                    &#128465;
                  </button>
                )}
              </div>
            </div>
            <div className='postTextContainer'>
              <div> Gender: {post.gender} </div>
              <div> Age : {post.age} </div>
              <div> {post.postText} </div>
            </div>
            <h3>@{post.author.name}</h3>
          </div>
        );
      })}
    </div>
  );
}

export default Home;
