import React from 'react';
import { useForm } from 'react-hook-form';
import { X, Save } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
}

const Modal: React.FC<Props> = ({ isOpen, onClose, onSubmit }) => {
  const { register, handleSubmit, formState: { errors } } = useForm();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl p-8 transform transition-all duration-300 ease-in-out">
        <button 
          onClick={onClose} 
          className="absolute top-4 right-4 text-gray-500 hover:text-red-500 transition-colors"
        >
          <X className="w-6 h-6" />
        </button>
        
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Add New User</h2>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
            <input 
              {...register('name', { 
                required: 'Name is required',
                minLength: { value: 2, message: 'Name must be at least 2 characters' }
              })} 
              className={`
                w-full px-4 py-2 border rounded-lg 
                focus:outline-none focus:ring-2 
                text-black
                ${errors.name ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'}
              `}
              placeholder="Enter full name"
            />
            {errors.name && (
              <p className="text-red-500 text-xs mt-1">{errors.name.message as string}</p>
            )}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
            <input 
              {...register('email', { 
                required: 'Email is required',
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: 'Invalid email address'
                }
              })} 
              type="email" 
              className={`
                w-full px-4 py-2 border rounded-lg 
                focus:outline-none focus:ring-2 text-black 
                ${errors.email ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'}
              `}
              placeholder="Enter email address"
            />
            {errors.email && (
              <p className="text-red-500 text-xs mt-1">{errors.email.message as string}</p>
            )}
          </div>
          
          <div className="flex space-x-4 pt-2">
            <button 
              type="submit" 
              className="
                flex-1 flex items-center justify-center 
                bg-gradient-to-r from-blue-500 to-purple-600 
                text-white py-2 rounded-lg 
                hover:from-blue-600 hover:to-purple-700 
                transition-all duration-300
              "
            >
              <Save className="w-5 h-5 mr-2" />
              Save User
            </button>
            <button 
              type="button" 
              onClick={onClose} 
              className="
                flex-1 
                bg-gray-100 text-gray-700 
                py-2 rounded-lg 
                hover:bg-gray-200 
                transition-colors
              "
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Modal;