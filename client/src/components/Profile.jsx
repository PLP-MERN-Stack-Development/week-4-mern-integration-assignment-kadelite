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
    <div className="max-w-xl mx-auto bg-white p-6 rounded shadow">
      <h2 className="text-2xl font-bold mb-4">Profile</h2>
      <p className="mb-2"><strong>Name:</strong> {user.name}</p>
      <p className="mb-4"><strong>Email:</strong> {user.email}</p>
      <h3 className="text-lg font-semibold mb-2">Your Posts</h3>
      {posts.length === 0 ? (
        <p className="text-gray-500">You have not created any posts yet.</p>
      ) : (
        <ul className="divide-y divide-gray-200 bg-gray-50 rounded">
          {posts.map(post => (
            <li key={post._id} className="px-4 py-2">
              <Link to={`/posts/${post._id}`} className="text-blue-700 hover:underline">{post.title}</Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Profile; 