import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { postService, categoryService } from '../services/api';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';

const PostForm = ({ onPostCreated }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [initialValues, setInitialValues] = useState({
    title: '',
    content: '',
    category: ''
  });
  const [error, setError] = useState(null);
  const [featuredImage, setFeaturedImage] = useState(null);

  // Redirect to login if not authenticated
  useEffect(() => {
    const userStr = localStorage.getItem('user');
    const user = userStr && userStr !== 'undefined' ? JSON.parse(userStr) : null;
    if (!user) {
      navigate('/login');
    }
  }, [navigate]);

  // Validation schema
  const validationSchema = Yup.object({
    title: Yup.string()
      .min(5, 'Title must be at least 5 characters')
      .max(100, 'Title cannot exceed 100 characters')
      .required('Title is required'),
    content: Yup.string()
      .min(10, 'Content must be at least 10 characters')
      .required('Content is required'),
    category: Yup.string().required('Category is required')
  });

  useEffect(() => {
    categoryService.getAllCategories().then(setCategories);
    if (id) {
      postService.getPost(id).then(post => {
        setInitialValues({
          title: post.title,
          content: post.content,
          category: post.category?._id || post.category
        });
      });
    }
  }, [id]);

  const handleSubmit = async (values, { setSubmitting }) => {
    setError(null);
    try {
      const userStr = localStorage.getItem('user');
      const user = userStr && userStr !== 'undefined' ? JSON.parse(userStr) : null;
      const postData = {
        ...values,
        author: user?._id,
      };
      if (featuredImage) {
        postData.featuredImage = featuredImage;
      }
      if (id) {
        await postService.updatePost(id, postData);
        navigate('/');
      } else {
        // Optimistic UI: add post immediately
        const tempPost = {
          ...postData,
          _id: Math.random().toString(36).substr(2, 9),
          title: postData.title,
          content: postData.content,
          category: categories.find(c => c._id === postData.category),
          author: user,
        };
        if (onPostCreated) onPostCreated(tempPost);
        try {
          await postService.createPost(postData);
        } catch (err) {
          setError(err.response?.data?.error || err.message);
        }
        navigate('/');
      }
    } catch (err) {
      setError(err.response?.data?.error || err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded shadow p-6 max-w-xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">{id ? 'Edit Post' : 'Create Post'}</h2>
      {error && <div className="text-red-500 mb-4">{error}</div>}
      <Formik
        enableReinitialize
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting }) => (
          <Form className="space-y-4">
            <div>
              <label className="block mb-1 font-medium">Title:</label>
              <Field name="title" className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400" />
              <ErrorMessage name="title" component="div" className="text-red-500 text-sm mt-1" />
            </div>
            <div>
              <label className="block mb-1 font-medium">Content:</label>
              <Field as="textarea" name="content" className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400" />
              <ErrorMessage name="content" component="div" className="text-red-500 text-sm mt-1" />
            </div>
            <div>
              <label className="block mb-1 font-medium">Category:</label>
              <Field as="select" name="category" className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400">
                <option value="">Select category</option>
                {categories.map(cat => (
                  <option key={cat._id} value={cat._id}>{cat.name}</option>
                ))}
              </Field>
              <ErrorMessage name="category" component="div" className="text-red-500 text-sm mt-1" />
            </div>
            <div>
              <label className="block mb-1 font-medium">Featured Image:</label>
              <input type="file" accept="image/*" onChange={e => setFeaturedImage(e.target.files[0])} className="block w-full text-sm text-gray-700" />
            </div>
            <button type="submit" disabled={isSubmitting} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded">
              {isSubmitting ? 'Saving...' : (id ? 'Update' : 'Create')}
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default PostForm; 