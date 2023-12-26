import React, { useEffect, useState } from 'react';
import {
  getDocs,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  updateDoc,
} from 'firebase/firestore';
import { auth, db } from '../firebase-config';
import { Link, useNavigate } from 'react-router-dom';

function Home({ isAuth }) {
  const [postLists, setPostList] = useState([]);
  const [initialLoad, setInitialLoad] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedPost, setEditedPost] = useState({});

  // New state variables
  const [title, setTitle] = useState('');
  const [jobTitle, setJobTitle] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [jobType, setJobType] = useState('');
  const [skills, setSkills] = useState('');
  const [postDate, setPostDate] = useState('');
  const [location, setLocation] = useState('');
  const [requirements, setRequirements] = useState('');
  const [jobLink, setJobLink] = useState('');

  const postsCollectionRef = collection(db, 'posts');
  const navigate = useNavigate();

  const deletePost = async (id) => {
    const confirmation = window.confirm(
      'Are you sure you want to delete this post?'
    );
    if (confirmation) {
      const postDoc = doc(db, 'posts', id);
      await deleteDoc(postDoc);
    }
  };

  const startEditing = (post) => {
    setIsEditing(true);
    setEditedPost(post);
  };

  const cancelEditing = () => {
    setIsEditing(false);
    setEditedPost({});
  };

  const updatePost = async () => {
    const postDoc = doc(db, 'posts', editedPost.id);
    await updateDoc(postDoc, {
      title: editedPost.title,
      jobTitle: editedPost.jobTitle,
      jobDescription: editedPost.jobDescription,
      companyName: editedPost.companyName,
      jobType: editedPost.jobType,
      skills: editedPost.skills,
      postDate: editedPost.postDate,
      location: editedPost.location,
      requirements: editedPost.requirements,
      jobLink: editedPost.jobLink,
    });
    cancelEditing();
  };

  useEffect(() => {
    const unsubscribe = onSnapshot(postsCollectionRef, (snapshot) => {
      setPostList(snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
      setInitialLoad(true);
    });

    return () => unsubscribe();
  }, []);

  return (
    <div className='homePage'>
      {initialLoad && (
        <div className='postList'>
          {postLists.map((post) => (
            <div className='post' key={post.id}>
              <div className='postHeader'>
                <div className='title'>
                  {isEditing ? (
                    <input
                      type='text'
                      value={editedPost.title}
                      onChange={(e) =>
                        setEditedPost({ ...editedPost, title: e.target.value })
                      }
                    />
                  ) : (
                    <h1
                      className='text-3xl cursor-pointer'
                      onClick={() => navigate(`/posts/${post.id}`)}
                    >
                      {post.title}
                    </h1>
                  )}
                </div>

                <div className='editDeleteButtons'>
                  {isAuth && post.author.id === auth.currentUser.uid && (
                    <>
                      {isEditing ? (
                        <>
                          <button onClick={updatePost}>Save</button>
                          <button onClick={cancelEditing}>Cancel</button>
                        </>
                      ) : (
                        <button onClick={() => startEditing(post)}>Edit</button>
                      )}
                      <button onClick={() => deletePost(post.id)}>🗑️</button>
                    </>
                  )}
                </div>
              </div>

              <div className='postTextContainer'>
                <div>
                  Job Title:{' '}
                  {isEditing ? (
                    <input
                      type='text'
                      value={editedPost.jobTitle}
                      onChange={(e) =>
                        setEditedPost({
                          ...editedPost,
                          jobTitle: e.target.value,
                        })
                      }
                    />
                  ) : (
                    post.jobTitle
                  )}
                </div>
                <div>
                  Job Description:{' '}
                  {isEditing ? (
                    <textarea
                      value={editedPost.jobDescription}
                      onChange={(e) =>
                        setEditedPost({
                          ...editedPost,
                          jobDescription: e.target.value,
                        })
                      }
                    />
                  ) : (
                    post.jobDescription
                  )}
                </div>
                <div>
                  Company Name:{' '}
                  {isEditing ? (
                    <input
                      type='text'
                      value={editedPost.companyName}
                      onChange={(e) =>
                        setEditedPost({
                          ...editedPost,
                          companyName: e.target.value,
                        })
                      }
                    />
                  ) : (
                    post.companyName
                  )}
                </div>
                <div>
                  Job Type:{' '}
                  {isEditing ? (
                    <input
                      type='text'
                      value={editedPost.jobType}
                      onChange={(e) =>
                        setEditedPost({
                          ...editedPost,
                          jobType: e.target.value,
                        })
                      }
                    />
                  ) : (
                    post.jobType
                  )}
                </div>
                <div>
                  Skills:{' '}
                  {isEditing ? (
                    <input
                      type='text'
                      value={editedPost.skills}
                      onChange={(e) =>
                        setEditedPost({ ...editedPost, skills: e.target.value })
                      }
                    />
                  ) : (
                    post.skills
                  )}
                </div>
                <div>
                  Post Date:{' '}
                  {isEditing ? (
                    <input
                      type='date'
                      value={editedPost.postDate}
                      onChange={(e) =>
                        setEditedPost({
                          ...editedPost,
                          postDate: e.target.value,
                        })
                      }
                    />
                  ) : (
                    post.postDate
                  )}
                </div>
                <div>
                  Location:{' '}
                  {isEditing ? (
                    <input
                      type='text'
                      value={editedPost.location}
                      onChange={(e) =>
                        setEditedPost({
                          ...editedPost,
                          location: e.target.value,
                        })
                      }
                    />
                  ) : (
                    post.location
                  )}
                </div>
                <div>
                  Requirements (Degree):{' '}
                  {isEditing ? (
                    <input
                      type='text'
                      value={editedPost.requirements}
                      onChange={(e) =>
                        setEditedPost({
                          ...editedPost,
                          requirements: e.target.value,
                        })
                      }
                    />
                  ) : (
                    post.requirements
                  )}
                </div>

                <div>
                  Job Url Link:
                  {isEditing ? (
                    <input
                      type='text'
                      value={editedPost.jobLink}
                      onChange={(e) =>
                        setJobLink({
                          ...editedPost,
                          jobLink: e.target.value,
                        })
                      }
                    />
                  ) : (
                    <a
                      className='bg-teal-400 rounded-md py-1 px-2'
                      href={post.jobLink}
                    >
                      Apply
                    </a>
                  )}
                </div>
              </div>
              <h3>@{post.author.name}</h3>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Home;
