import React, { useEffect, useState } from 'react';
import { postService } from '../services/api';
import { Link } from 'react-router-dom';

const Profile = () => {
  const userStr = localStorage.getItem('user');
  const user = userStr && userStr !== 'undefined' ? JSON.parse(userStr) : null;
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      postService.getAllPosts(1, 100)
        .then(data => {
          setPosts(data.posts.filter(post => (post.author?._id || post.author) === user._id));
        })
        .finally(() => setLoading(false));
    }
  }, [user]);

  if (!user) return <div>Please log in to view your profile.</div>;
  if (loading) return <div>Loading profile...</div>;

  return (
    <div>
      <h2>Profile</h2>
      <p><strong>Name:</strong> {user.name}</p>
      <p><strong>Email:</strong> {user.email}</p>
      <h3>Your Posts</h3>
      {posts.length === 0 ? (
        <p>You have not created any posts yet.</p>
      ) : (
        <ul>
          {posts.map(post => (
            <li key={post._id}>
              <Link to={`/posts/${post._id}`}>{post.title}</Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Profile; 