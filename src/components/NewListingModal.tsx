"use client";

import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Spinner } from './ui/shadcn-io/spinner';

interface NewListingModalProps {
  isOpen: boolean;
  onClose: () => void;
  loading: boolean;
}

const NewListingModal = ({ isOpen, onClose, loading }: NewListingModalProps) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0.9 }}
            className="bg-gray-900 rounded-2xl p-8 w-full max-w-md"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-2xl font-bold mb-6 text-center text-white flex items-center justify-center">
              Create a new listing {loading && <Spinner className="ml-2" />}
            </h2>
            <div className="grid grid-cols-1 gap-6">
              <Link to="/import-listing">
                <div className="flex flex-col items-center justify-center p-6 border-2 border-gray-700 rounded-2xl transition-all duration-200 cursor-pointer hover:border-indigo-500 hover:bg-gray-800">
                  <img src="/icons/rehost.png" alt="Already hosted" width={80} height={80} className="mb-4" />
                  <span className="text-lg font-semibold text-white">Import your listing</span>
                  <p className="text-gray-400 mt-2 text-center">Import your existing listing from another site.</p>
                </div>
              </Link>
              <Link to="/become-a-host">
                <div className="flex flex-col items-center justify-center p-6 border-2 border-gray-700 rounded-2xl transition-all duration-200 cursor-pointer hover:border-indigo-500 hover:bg-gray-800">
                  <img src="/icons/newhost.png" alt="New to hosting" width={80} height={80} className="mb-4" />
                  <span className="text-lg font-semibold text-white">Create a new listing</span>
                  <p className="text-gray-400 mt-2 text-center">Create a new listing from scratch.</p>
                </div>
              </Link>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default NewListingModal;
