import React from 'react';

interface FormMessageProps {
  message: string;
  type: 'success' | 'error' | 'info';
}

const FormMessage: React.FC<FormMessageProps> = ({ message, type }) => {
  let textColor = 'text-gray-700';
  if (type === 'success') {
    textColor = 'text-green-500';
  } else if (type === 'error') {
    textColor = 'text-red-500';
  } else if (type === 'info') {
      textColor = 'text-blue-500';
  }

  return (
    <div className={`mb-4 ${textColor}`}>
      {message}
    </div>
  );
};

export default FormMessage;
