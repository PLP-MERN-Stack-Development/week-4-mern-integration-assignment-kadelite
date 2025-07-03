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

  if (loading) return <div className="text-center py-8 text-gray-500">Loading post...</div>;
  if (error) return <div className="text-center py-8 text-red-500">Error: {error}</div>;
  if (!post) return <div className="text-center py-8 text-gray-500">Post not found</div>;

  return (
    <div className="bg-white rounded shadow p-6 max-w-2xl mx-auto">
      <h2 className="text-3xl font-bold mb-2">{post.title}</h2>
      <div className="text-gray-600 mb-2">
        <span className="mr-4"><strong>Category:</strong> {post.category?.name || post.category}</span>
        <span><strong>Author:</strong> {post.author?.name || post.author}</span>
      </div>
      <p className="mb-6 text-gray-800 whitespace-pre-line">{post.content}</p>
      <hr className="my-6" />
      <h3 className="text-xl font-semibold mb-2">Comments</h3>
      {post.comments && post.comments.length > 0 ? (
        <ul className="space-y-3 mb-4">
          {post.comments.map((c, idx) => (
            <li key={idx} className="bg-gray-100 rounded p-3">
              <div className="text-sm text-gray-700 mb-1">
                <strong>{c.user?.name || c.user || 'User'}</strong>
                <span className="ml-2 text-xs text-gray-500">
                  {c.createdAt ? new Date(c.createdAt).toLocaleString() : ''}
                </span>
              </div>
              <div className="text-gray-800">{c.content}</div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-500 mb-4">No comments yet.</p>
      )}
      {user ? (
        <form onSubmit={handleCommentSubmit} className="mt-4">
          <textarea
            value={comment}
            onChange={e => setComment(e.target.value)}
            placeholder="Add a comment..."
            rows={3}
            className="w-full border border-gray-300 rounded px-3 py-2 mb-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          {commentError && <div className="text-red-500 mb-2">{commentError}</div>}
          <button type="submit" disabled={submitting} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded">
            {submitting ? 'Posting...' : 'Post Comment'}
          </button>
        </form>
      ) : (
        <p className="text-gray-500"><em>Login to add a comment.</em></p>
      )}
    </div>
  );
};

export default PostView; 