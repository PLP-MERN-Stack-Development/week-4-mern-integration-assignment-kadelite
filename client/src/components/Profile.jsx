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

  if (!user) return <div className="text-center py-8 text-gray-500">Please log in to view your profile.</div>;
  if (loading) return <div className="text-center py-8 text-gray-500">Loading profile...</div>;

  return (
    <div className="bg-white rounded shadow p-6 max-w-xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Profile</h2>
      <div className="mb-4">
        <p><span className="font-semibold">Name:</span> {user.name}</p>
        <p><span className="font-semibold">Email:</span> {user.email}</p>
      </div>
      <h3 className="text-xl font-semibold mb-2">Your Posts</h3>
      {posts.length === 0 ? (
        <p className="text-gray-500">You have not created any posts yet.</p>
      ) : (
        <ul className="divide-y divide-gray-200">
          {posts.map(post => (
            <li key={post._id} className="py-2">
              <Link to={`/posts/${post._id}`} className="text-blue-700 hover:underline font-medium">{post.title}</Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Profile; 