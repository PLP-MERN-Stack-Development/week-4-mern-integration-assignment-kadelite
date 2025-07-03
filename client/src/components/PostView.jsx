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
    <div className="max-w-2xl mx-auto bg-white p-6 rounded shadow">
      <h2 className="text-2xl font-bold mb-2">{post.title}</h2>
      <p className="mb-2 text-gray-700">{post.content}</p>
      <p className="text-sm text-gray-500 mb-1"><strong>Category:</strong> {post.category?.name || post.category}</p>
      <p className="text-sm text-gray-500 mb-4"><strong>Author:</strong> {post.author?.name || post.author}</p>
      <hr className="my-4" />
      <h3 className="text-lg font-semibold mb-2">Comments</h3>
      {post.comments && post.comments.length > 0 ? (
        <ul className="space-y-2 mb-4">
          {post.comments.map((c, idx) => (
            <li key={idx} className="bg-gray-100 rounded px-3 py-2">
              <strong className="text-blue-700">{c.user?.name || c.user || 'User'}:</strong> {c.content}
              <span className="text-xs text-gray-500 ml-2">
                {c.createdAt ? new Date(c.createdAt).toLocaleString() : ''}
              </span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-500 mb-4">No comments yet.</p>
      )}
      {user ? (
        <form onSubmit={handleCommentSubmit} className="flex flex-col gap-2 mt-2">
          <textarea
            value={comment}
            onChange={e => setComment(e.target.value)}
            placeholder="Add a comment..."
            rows={3}
            className="border rounded px-3 py-2 w-full"
          />
          {commentError && <div className="text-red-500 text-sm">{commentError}</div>}
          <button type="submit" disabled={submitting} className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded disabled:opacity-50">
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