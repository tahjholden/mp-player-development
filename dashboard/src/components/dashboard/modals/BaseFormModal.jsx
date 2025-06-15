import React from 'react';
import { FaTimes } from 'react-icons/fa';

/**
 * BaseFormModal - A reusable modal component for consistent form styling
 * 
 * @param {Object} props
 * @param {string} props.title - The title/header for the modal
 * @param {function} props.onClose - Function to call when closing the modal
 * @param {function} props.onSubmit - Function to call when submitting the form
 * @param {string} props.submitButtonText - Text for the submit button
 * @param {React.ReactNode} props.children - Form content to render inside the modal
 */
const BaseFormModal = ({ title, onClose, onSubmit, submitButtonText = 'Submit', children }) => {
  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 text-white rounded-lg shadow-xl w-full max-w-md flex flex-col">
        <div className="sticky top-0 p-5 border-b border-gray-700 flex justify-between items-center bg-gray-900 rounded-t-lg">
          <h2 className="text-xl font-bold text-oldgold">{title}</h2>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-white p-1"
            aria-label="Close"
          >
            <FaTimes />
          </button>
        </div>
        
        <div className="p-5">
          <form onSubmit={handleSubmit}>
            {children}
          </form>
        </div>
        
        <div className="sticky bottom-0 p-5 border-t border-gray-700 bg-gray-900 rounded-b-lg">
          <button 
            onClick={handleSubmit}
            className="w-full py-3 bg-oldgold hover:bg-yellow-600 text-black rounded-lg font-medium text-lg transition duration-200"
          >
            {submitButtonText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default BaseFormModal;