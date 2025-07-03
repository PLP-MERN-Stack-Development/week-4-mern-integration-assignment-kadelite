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
    <div>
      <h2>All Posts</h2>
      <PostForm onPostCreated={handlePostCreated} />
      <div style={{ marginBottom: '1rem' }}>
        <input
          type="text"
          placeholder="Search posts..."
          value={search}
          onChange={handleSearchChange}
          style={{ marginRight: '1rem' }}
        />
        <select value={category} onChange={handleCategoryChange}>
          <option value="">All Categories</option>
          {categories.map(cat => (
            <option key={cat._id} value={cat._id}>{cat.name}</option>
          ))}
        </select>
      </div>
      <ul>
        {posts.map(post => (
          <li key={post._id}>
            <Link to={`/posts/${post._id}`}>{post.title}</Link>
            {user && (
              <>
                {user._id === (post.author?._id || post.author) && (
                  <Link to={`/edit/${post._id}`} style={{ marginLeft: 8, color: 'blue' }}>
                    Edit
                  </Link>
                )}
                <button onClick={() => handleDelete(post._id)} style={{ marginLeft: 8, color: 'red' }}>
                  Delete
                </button>
              </>
            )}
          </li>
        ))}
      </ul>
      <div style={{ marginTop: '1rem' }}>
        <button onClick={() => setPage(page - 1)} disabled={page === 1}>
          Previous
        </button>
        <span style={{ margin: '0 1rem' }}>Page {page} of {totalPages}</span>
        <button onClick={() => setPage(page + 1)} disabled={page === totalPages}>
          Next
        </button>
      </div>
    </div>
  );
};

export default PostList; 