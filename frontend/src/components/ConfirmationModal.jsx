// frontend/src/components/ConfirmationModal.jsx
import React from 'react';

// Props:
// isOpen: boolean - Controls whether the modal is visible
// onClose: function - Called when the modal should be closed (e.g., clicking Cancel or overlay)
// onConfirm: function - Called when the Confirm button is clicked
// title: string - The title text for the modal
// message: string - The confirmation message body

const ConfirmationModal = ({ isOpen, onClose, onConfirm, title, message }) => {
  // If the modal is not open, render nothing
  if (!isOpen) return null;

  // Prevent closing when clicking inside the modal content
  const handleModalContentClick = (e) => {
    e.stopPropagation();
  };

  return (
    // Full screen overlay
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm p-4"
      onClick={onClose} // Close modal if overlay is clicked
    >
      {/* Modal Content Box */}
      <div
        className="bg-white rounded-lg shadow-xl w-full max-w-md overflow-hidden"
        onClick={handleModalContentClick} // Stop propagation here
      >
        {/* Modal Header */}
        <div className="p-5 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800">{title || 'Confirm Action'}</h3>
        </div>

        {/* Modal Body */}
        <div className="p-5">
          <p className="text-sm text-gray-600">{message || 'Are you sure you want to proceed?'}</p>
        </div>

        {/* Modal Footer (Action Buttons) */}
        <div className="px-5 py-4 bg-gray-50 border-t border-gray-200 flex justify-end space-x-3">
          {/* Cancel Button */}
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors text-sm font-medium focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-1"
          >
            Cancel
          </button>

          {/* Confirm Button (Example uses red for destructive action) */}
          <button
            type="button"
            onClick={onConfirm}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors text-sm font-medium focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-1"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;