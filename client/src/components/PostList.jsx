import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { postService, categoryService } from '../services/api';
import PostForm from './PostForm.jsx';

const PostList = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [categories, setCategories] = useState([]);
  const userStr = localStorage.getItem('user');
  const user = userStr && userStr !== 'undefined' ? JSON.parse(userStr) : null;

  useEffect(() => {
    categoryService.getAllCategories().then(setCategories);
  }, []);

  useEffect(() => {
    setLoading(true);
    postService.getAllPosts(page, 10, category, search)
      .then(data => {
        setPosts(data.posts);
        setTotalPages(data.totalPages);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [page, category, search]);

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    setPage(1);
  };

  const handleCategoryChange = (e) => {
    setCategory(e.target.value);
    setPage(1);
  };

  const handleDelete = async (postId) => {
    const prevPosts = [...posts];
    setPosts(posts.filter(p => p._id !== postId));
    try {
      await postService.deletePost(postId);
    } catch (err) {
      setError('Failed to delete post.');
      setPosts(prevPosts);
    }
  };

  const handlePostCreated = (tempPost) => {
    setPosts([tempPost, ...posts]);
  };

  if (loading) return <div>Loading posts...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">All Posts</h2>
      <PostForm onPostCreated={handlePostCreated} />
      <div className="flex flex-col sm:flex-row gap-2 mb-4 items-center">
        <input
          type="text"
          placeholder="Search posts..."
          value={search}
          onChange={handleSearchChange}
          className="border rounded px-3 py-2 w-full sm:w-auto"
        />
        <select value={category} onChange={handleCategoryChange} className="border rounded px-3 py-2">
          <option value="">All Categories</option>
          {categories.map(cat => (
            <option key={cat._id} value={cat._id}>{cat.name}</option>
          ))}
        </select>
      </div>
      <ul className="divide-y divide-gray-200 bg-white rounded shadow">
        {posts.map(post => (
          <li key={post._id} className="flex items-center justify-between px-4 py-3 hover:bg-gray-50">
            <Link to={`/posts/${post._id}`} className="text-blue-700 font-medium hover:underline">{post.title}</Link>
            {user && (
              <div className="flex gap-2">
                {user._id === (post.author?._id || post.author) && (
                  <Link to={`/edit/${post._id}`} className="text-blue-500 hover:underline">Edit</Link>
                )}
                <button onClick={() => handleDelete(post._id)} className="text-red-500 hover:underline">Delete</button>
              </div>
            )}
          </li>
        ))}
      </ul>
      <div className="flex items-center justify-center gap-4 mt-6">
        <button onClick={() => setPage(page - 1)} disabled={page === 1} className="px-3 py-1 rounded bg-gray-200 disabled:opacity-50">Previous</button>
        <span className="text-gray-700">Page {page} of {totalPages}</span>
        <button onClick={() => setPage(page + 1)} disabled={page === totalPages} className="px-3 py-1 rounded bg-gray-200 disabled:opacity-50">Next</button>
      </div>
    </div>
  );
};

export default PostList; 