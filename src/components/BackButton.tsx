"use client";

import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { Spinner } from './ui/shadcn-io/spinner';
import { ChevronLeft } from 'lucide-react';

const BackButton = ({ label, variant = 'default' }: { label?: string, variant?: 'default' | 'dark' }) => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleClick = () => {
    setLoading(true);
    navigate('/hosting');
  };

  const baseClasses = "text-white font-bold transition-colors flex items-center justify-center";
  const variantClasses = {
    default: "bg-gray-700 hover:bg-gray-600 rounded-lg py-2 px-4",
    dark: "bg-black hover:bg-gray-800 rounded-lg hover:rounded-full w-10 h-10",
  };

  const displayContent = () => {
    if (loading) {
      return <Spinner />;
    }
    if (variant === 'dark') {
      return <ChevronLeft className="h-6 w-6" />;
    }
    return label ?? 'Done';
  };

  return (
    <button
      className={`${baseClasses} ${variantClasses[variant]}`}
      onClick={handleClick}
    >
      {displayContent()}
    </button>
  );
};

export default BackButton;
