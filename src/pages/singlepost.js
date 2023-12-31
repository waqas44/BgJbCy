import React, { useEffect, useState } from 'react';
import ReactQuill from 'react-quill'; // Import the Quill editor
import 'react-quill/dist/quill.snow.css'; // Import Quill's styles
import { getDoc, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { auth, db } from '../firebase-config';
import { useParams, useNavigate, Link } from 'react-router-dom'; // Import useNavigate
import '../single.css';
import Banner from '../components/Banner';
import Footer from '../components/Footer';
import { MultiSelect } from 'react-multi-select-component'; // Import the multi-select component
import { skills } from './CreatePost';
import DOMPurify from 'dompurify'; // Import DOMPurify to sanitize HTML content

function SinglePost({ isAuth }) {
  const [post, setPost] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});
  // const postUrl = `${window.location.origin}/posts/${postId}`;

  const postId = useParams().id;
  const navigate = useNavigate(); // Initialize useNavigate

  useEffect(() => {
    const fetchPost = async () => {
      const postDoc = doc(db, 'posts', postId);
      const docSnap = await getDoc(postDoc);
      const postData = {
        jobTitle: docSnap.data().jobTitle,
        jobLink: docSnap.data().jobLink,
        jobDescription: docSnap.data().jobDescription,
        companyName: docSnap.data().companyName,
        jobType: docSnap.data().jobType,
        workHours: docSnap.data().workHours,
        postDate: docSnap.data().postDate,
        postLastDate: docSnap.data().postLastDate,
        location: docSnap.data().location,
        requirements: docSnap.data().requirements,
        selectedSkills: docSnap.data().skillReq || [], // Fetch the selectedSkills from Firestore

        author: docSnap.data().author.name,

        postUrl: `${window.location.origin}/posts/${postId}`,
      };
      console.log(docSnap.data());
      setPost({ ...postData }); // Add the dynamic postUrl to the postData
      setFormData(postData); // Set initial form data
    };

    fetchPost();
  }, [postId]);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const postDocRef = doc(db, 'posts', postId);
    await updateDoc(postDocRef, {
      jobTitle: formData.jobTitle,
      jobLink: formData.jobLink,
      jobDescription: formData.jobDescription,
      companyName: formData.companyName,
      jobType: formData.jobType,
      workHours: formData.workHours,
      postDate: formData.postDate,
      postLastDate: formData.postLastDate,
      location: formData.location,
      requirements: formData.requirements,
      // skillReq: formData.selectedSkills.map((skill) => skill.value),
      selectedSkills: formData.selectedSkills,

      // Update other fields as needed
    });

    // Fetch the updated data from Firebase
    const updatedDocSnap = await getDoc(postDocRef);
    const updatedPostData = {
      jobTitle: updatedDocSnap.data().jobTitle,
      jobLink: updatedDocSnap.data().jobLink,
      jobDescription: updatedDocSnap.data().jobDescription,
      companyName: updatedDocSnap.data().companyName,
      jobType: updatedDocSnap.data().jobType,
      workHours: updatedDocSnap.data().workHours,
      postDate: updatedDocSnap.data().postDate,
      postLastDate: updatedDocSnap.data().postLastDate,
      location: updatedDocSnap.data().location,
      requirements: updatedDocSnap.data().requirements,
      selectedSkills: updatedDocSnap.data().selectedSkills || [], // Fetch the selectedSkills from Firestore
    };

    // Update the local state with the fetched data
    setPost(updatedPostData);
    setFormData(updatedPostData);

    setIsEditing(false);
  };

  const handleDelete = async () => {
    const shouldDelete = window.confirm(
      'Are you sure you want to delete this post?'
    );

    if (shouldDelete) {
      const postDocRef = doc(db, 'posts', postId);
      await deleteDoc(postDocRef);
      navigate('/'); // Redirect to the home page after deletion using useNavigate
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Handle multi-select
    if (e.target.multiple) {
      const selectedOptions = Array.from(
        e.target.selectedOptions,
        (option) => option.value
      );
      setFormData((prevData) => ({
        ...prevData,
        [name]: selectedOptions,
      }));
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

  const handleChange2 = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const cancelHandle = () => {
    setIsEditing(false);
  };

  return (
    <>
      <div className='createPostPage1 h-auto m-0 mr-auto ml-auto grid items-center place-items-center'>
        <div className='singlePost cpContainer  p-10 py-5 '>
          {isAuth && ( // Check if user is authenticated
            <>
              {isEditing ? (
                <form onSubmit={handleSubmit}>
                  <div className='inputGp'>
                    <label> Job Title:</label>
                    <input
                      type='text'
                      name='jobTitle'
                      value={formData.jobTitle}
                      onChange={handleChange}
                      placeholder='Job title'
                    />
                  </div>

                  <div className='inputGp'>
                    <label> Job Link:</label>
                    <input
                      type='url'
                      name='jobLink'
                      value={formData.jobLink}
                      onChange={handleChange}
                      placeholder='job link'
                    />
                  </div>

                  {/* <div className='inputGp'>
                        <label> Job Description:</label>
                        <input
                          type='text'
                          name='jobDescription'
                          value={formData.jobDescription}
                          onChange={handleChange}
                          placeholder='Job Description'
                        />
                      </div> */}

                  <div className='inputGp'>
                    <label> Job Description:</label>
                    <textarea
                      style={{ display: 'none' }}
                      name='jobDescription'
                      placeholder='Description...'
                      onChange={handleChange}
                      value={formData.jobDescription}
                    />
                  </div>
                  <ReactQuill
                    value={formData.jobDescription}
                    onChange={(value) =>
                      setFormData({ ...formData, jobDescription: value })
                    }
                    placeholder='Write your job description...'
                  />

                  <div className='inputGp'>
                    <label> Company Name :</label>
                    <input
                      type='text'
                      name='companyName'
                      value={formData.companyName}
                      onChange={handleChange}
                      placeholder='Company Name'
                    />
                  </div>
                  {/* <select defaultValue={formData.jobType} onChange={handleChange}>
                  <option value='remote'>Remote</option>
                  <option value='inoffice'>In Office</option>
                </select> */}
                  <div className='inputGp'>
                    <label> Job Type :</label>
                    <select
                      onChange={handleChange2}
                      name='jobType'
                      value={formData.jobType}
                      className='w-64 py-3 pl-4 bg-zinc-200 font-semibold rounded-md'
                    >
                      <option value='' disabled hidden>
                        Job Role
                      </option>
                      <option value='Remote'>Remote</option>
                      <option value='In Office'>In Office</option>
                      <option value='Part Time'>Part Time</option>
                      <option value='Full Time'>Full-Time</option>
                    </select>
                  </div>

                  <div className='inputGp'>
                    <label> workHours:</label>
                    <input
                      type='text'
                      name='workHours'
                      value={formData.workHours}
                      onChange={handleChange}
                      placeholder='40h / week ...'
                    />
                  </div>
                  <div className='inputGp'>
                    <label>Post Date :</label>
                    <input
                      type='date'
                      name='postDate'
                      value={formData.postDate}
                      onChange={handleChange}
                    />
                  </div>

                  <div className='inputGp'>
                    <label>Post LastDate :</label>
                    <input
                      type='date'
                      name='postLastDate'
                      value={formData.postLastDate}
                      onChange={handleChange}
                    />
                  </div>
                  <div className='inputGp'>
                    <label> Location :</label>
                    <input
                      type='text'
                      name='location'
                      value={formData.location}
                      onChange={handleChange}
                      placeholder='e.g. Lahore, Pak'
                    />
                  </div>
                  <div className='inputGp'>
                    <label> Requirements :</label>
                    <input
                      type='text'
                      name='requirements'
                      value={formData.requirements}
                      onChange={handleChange}
                      placeholder='Master bachlor ...'
                    />
                  </div>
                  <div className='inputGp'>
                    <label> Skills:</label>
                    <select
                      multiple
                      name='selectedSkills'
                      value={formData.selectedSkills}
                      onChange={handleChange}
                      className='w-64 py-3 pl-4 bg-zinc-200 font-semibold rounded-md min-h-20'
                    >
                      {/* List of skills */}
                      <option value='react'>React</option>
                      <option value='nodejs'>Nodejs</option>
                      <option value='javascript'>JavaScript</option>
                      {/* Add more skills as needed */}
                    </select>
                  </div>
                  {/* Add other fields as needed */}
                  <button
                    className='text-blue-500 text-sm border border-blue-500 bg-blue-100 px-5 py-1 rounded-md hover:bg-blue-500 hover:text-white mr-3'
                    type='submit'
                  >
                    Update
                  </button>
                  <button
                    className='text-blue-500 text-sm border border-blue-500 bg-blue-100 px-5 py-1 rounded-md hover:bg-blue-500 hover:text-white mr-3'
                    type='button'
                    onClick={cancelHandle}
                  >
                    Cancel
                  </button>
                  {/* Add delete button */}
                </form>
              ) : (
                <>
                  <h1 className='text-3xl'>{post.title}</h1>
                  <div className='postTextContainer'>
                    <div className='post-content'>
                      Job Title : {post.jobTitle}
                    </div>
                    <div className='post-content'>
                      Job Link : {post.jobLink}
                    </div>
                    <div className='post-content'>
                      {/* Job Description : {post.jobDescription} */}
                      <div
                        dangerouslySetInnerHTML={{
                          __html: DOMPurify.sanitize(post.jobDescription),
                        }}
                      />
                    </div>

                    <div className='post-content'>
                      Company Name : {post.companyName}
                    </div>
                    <div className='post-content'>
                      Job Type : {post.jobType}
                    </div>
                    <div className='post-content'>
                      Working Hours : {post.workHours}
                    </div>
                    <div className='post-content'>
                      Post Date : {post.postDate}
                    </div>

                    <div className='post-content'>
                      Post Last Date : {post.postLastDate}
                    </div>
                    <div className='post-content'>
                      Location : {post.location}
                    </div>
                    <div className='post-content'>
                      Requirements :{post.requirements}
                    </div>
                    <div className='post-content'>
                      Selected Skills:{' '}
                      {post.selectedSkills && post.selectedSkills.join(', ')}
                    </div>
                  </div>
                  <h3>@{post.author}</h3>
                  <button onClick={handleEdit}>Edit</button>
                  <button onClick={handleDelete}>Delete</button>
                  {/* Add delete button */}
                </>
              )}
            </>
          )}
          {!isAuth && (
            // You can also add a message or redirect user to login
            <p>Please login to edit this post.</p>
          )}
        </div>
      </div>
      <Banner postInfo={post} />
      <div className='section'>
        <div className='w-container'>
          <div className='align-center'>
            <h2 className='logo-title'>{post.jobTitle}</h2>
            <div className='small space'></div>
            <div>
              <div className='meta-tag no-float'>
                <div> {post.companyName}</div>
              </div>
              <div className='marker meta-tag no-float'>
                <div>{post.location}</div>
              </div>
              {/* <div className='meta-tag money no-float'>
                    <div>$40,000 - $200,000 / year</div>
                  </div> */}
              <div className='certificate meta-tag no-float'>
                <div>{post.requirements}</div>
              </div>
              <div className='clock meta-tag no-float'>
                <div>{post.workHours}</div>
              </div>
            </div>
            <div className='big space super-big'></div>
          </div>
          <div>
            <div className='w-row'>
              <div className='w-col w-col-8'>
                <div>
                  <h2 className='smaller-font'>Job Details</h2>
                  <div className='small space'></div>
                  <div className='w-richtext'>
                    <div className='trix-content'>
                      {/* <div>{post.jobDescription}</div> */}
                      <div
                        dangerouslySetInnerHTML={{
                          __html: DOMPurify.sanitize(post.jobDescription),
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className='column-space w-col w-col-4'>
                <div>
                  <a
                    className='button full w-button'
                    data-ix='show-popup-on-click'
                    href={post.jobLink}
                    style={{ transition: 'all 0.4s ease 0s' }}
                  >
                    Apply For Job
                  </a>
                </div>
                <div className='big space'></div>
                <div>
                  <h2 className='smaller-font'>Share This Job</h2>
                  <div className='small space'></div>
                  <div className='text-center-1'>
                    <div>
                      <a
                        className='icons-so w-inline-block'
                        href={`https://www.facebook.com/sharer.php?u=${post.postUrl}`}
                      ></a>
                      <a
                        className='twitter icons-so w-inline-block'
                        href={`https://twitter.com/intent/tweet?url=${post.postUrl}`}
                      ></a>
                      <a
                        className='linkin icons-so w-inline-block'
                        // href='https://www.linkedin.com/shareArticle?mini=true&amp;url=https://careers.brainxtech.com/jobs/shopify-developer-2023-12-08'

                        href={`https://www.linkedin.com/shareArticle?mini=true&amp;url=${post.postUrl}`}
                      ></a>
                    </div>
                  </div>
                </div>
                <div className='big space'></div>
                <div>
                  <h2 className='smaller-font'>Job Type</h2>
                  <div className='small space'></div>
                  <div className='text-center-1'>
                    <div
                      className='different in-pages job-time'
                      style={{ backgroundColor: '#5cb85c' }}
                    >
                      {post.jobType}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className='space'></div>
          <div className='align-center'>
            <a
              className='button full w-button'
              data-ix='show-popup-on-click'
              href={post.jobLink}
              style={{ transition: 'all 0.4s ease 0s', width: 300 }}
            >
              Apply For Job
            </a>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default SinglePost;
