import React from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/api';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';

const RegisterForm = () => {
  const navigate = useNavigate();

  const validationSchema = Yup.object({
    name: Yup.string().min(2, 'Name must be at least 2 characters').required('Name is required'),
    email: Yup.string().email('Invalid email').required('Email is required'),
    password: Yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
  });

  const handleSubmit = async (values, { setSubmitting, setFieldError }) => {
    try {
      await authService.register(values);
      navigate('/login');
    } catch (err) {
      setFieldError('general', err.response?.data?.message || 'Registration failed');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded shadow">
      <h2 className="text-xl font-bold mb-4">Register</h2>
      <Formik
        initialValues={{ name: '', email: '', password: '' }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting, errors }) => (
          <Form className="flex flex-col gap-4">
            {errors.general && <div className="text-red-600 mb-2">{errors.general}</div>}
            <div>
              <label className="block font-medium mb-1">Name:</label>
              <Field name="name" className="border rounded px-3 py-2 w-full" />
              <ErrorMessage name="name" component="div" className="text-red-500 text-sm mt-1" />
            </div>
            <div>
              <label className="block font-medium mb-1">Email:</label>
              <Field name="email" type="email" className="border rounded px-3 py-2 w-full" />
              <ErrorMessage name="email" component="div" className="text-red-500 text-sm mt-1" />
            </div>
            <div>
              <label className="block font-medium mb-1">Password:</label>
              <Field name="password" type="password" className="border rounded px-3 py-2 w-full" />
              <ErrorMessage name="password" component="div" className="text-red-500 text-sm mt-1" />
            </div>
            <button type="submit" disabled={isSubmitting} className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded disabled:opacity-50">Register</button>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default RegisterForm; 