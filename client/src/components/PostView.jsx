import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { postService } from '../services/api';

const PostView = () => {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [comment, setComment] = useState('');
  const [commentError, setCommentError] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const userStr = localStorage.getItem('user');
  const user = userStr && userStr !== 'undefined' ? JSON.parse(userStr) : null;

  const fetchPost = () => {
    setLoading(true);
    postService.getPost(id)
      .then(setPost)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchPost();
    // eslint-disable-next-line
  }, [id]);

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    setCommentError(null);
    setSubmitting(true);
    if (!comment.trim()) {
      setCommentError('Comment cannot be empty');
      setSubmitting(false);
      return;
    }
    // Optimistic UI: add comment immediately
    const tempComment = {
      user: user,
      content: comment,
      createdAt: new Date().toISOString(),
    };
    const prevComments = post.comments ? [...post.comments] : [];
    setPost({ ...post, comments: [...prevComments, tempComment] });
    setComment('');
    try {
      await postService.addComment(id, { user: user._id, content: tempComment.content });
      fetchPost();
    } catch (err) {
      setCommentError(err.response?.data?.error || err.message);
      setPost({ ...post, comments: prevComments }); // Rollback
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div>Loading post...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!post) return <div>Post not found</div>;

  return (
    <div>
      <h2>{post.title}</h2>
      <p>{post.content}</p>
      <p><strong>Category:</strong> {post.category?.name || post.category}</p>
      <p><strong>Author:</strong> {post.author?.name || post.author}</p>
      <hr />
      <h3>Comments</h3>
      {post.comments && post.comments.length > 0 ? (
        <ul>
          {post.comments.map((c, idx) => (
            <li key={idx} style={{ marginBottom: '0.5rem' }}>
              <strong>{c.user?.name || c.user || 'User'}:</strong> {c.content}
              <span style={{ color: '#888', marginLeft: 8, fontSize: '0.9em' }}>
                {c.createdAt ? new Date(c.createdAt).toLocaleString() : ''}
              </span>
            </li>
          ))}
        </ul>
      ) : (
        <p>No comments yet.</p>
      )}
      {user ? (
        <form onSubmit={handleCommentSubmit} style={{ marginTop: '1rem' }}>
          <textarea
            value={comment}
            onChange={e => setComment(e.target.value)}
            placeholder="Add a comment..."
            rows={3}
            style={{ width: '100%', marginBottom: '0.5rem' }}
          />
          {commentError && <div style={{ color: 'red' }}>{commentError}</div>}
          <button type="submit" disabled={submitting}>
            {submitting ? 'Posting...' : 'Post Comment'}
          </button>
        </form>
      ) : (
        <p><em>Login to add a comment.</em></p>
      )}
    </div>
  );
};

export default PostView; 