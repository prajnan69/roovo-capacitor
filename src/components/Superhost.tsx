"use client";

const Superhost = () => {
  return (
    <div className="min-h-screen bg-black text-white p-4 sm:p-6 md:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Superhost Status</h1>
          <p className="text-gray-400 max-w-2xl mx-auto">
            You&apos;re on your way to becoming a Superhost! Here&apos;s a summary of your performance over the past year.
          </p>
        </div>

        <div className="border border-gray-700 bg-gray-900 p-8">
          <h2 className="text-2xl font-bold mb-6">Your Progress</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Stat Card */}
            <div className="border border-gray-800 bg-black p-6 text-center">
              <p className="text-4xl font-bold">4.9</p>
              <p className="text-gray-400 mt-2">Overall Rating</p>
              <p className="text-sm text-green-400 mt-1">Goal: 4.8+</p>
            </div>
            {/* Stat Card */}
            <div className="border border-gray-800 bg-black p-6 text-center">
              <p className="text-4xl font-bold">98%</p>
              <p className="text-gray-400 mt-2">Response Rate</p>
              <p className="text-sm text-green-400 mt-1">Goal: 90%+</p>
            </div>
            {/* Stat Card */}
            <div className="border border-gray-800 bg-black p-6 text-center">
              <p className="text-4xl font-bold">25</p>
              <p className="text-gray-400 mt-2">Stays</p>
              <p className="text-sm text-green-400 mt-1">Goal: 10+</p>
            </div>
            {/* Stat Card */}
            <div className="border border-gray-800 bg-black p-6 text-center">
              <p className="text-4xl font-bold">0%</p>
              <p className="text-gray-400 mt-2">Cancellation Rate</p>
              <p className="text-sm text-green-400 mt-1">{'Goal: <1%'}</p>
            </div>
          </div>
          <div className="mt-8 text-center">
            <p className="text-lg text-green-400 font-bold">Congratulations! You&apos;ve met all the requirements.</p>
            <p className="text-gray-400">Next assessment is on Jan 1, 2025.</p>
          </div>
        </div>

        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-4 text-center">Superhost Benefits</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="border border-gray-700 bg-gray-900 p-6">
              <h3 className="text-xl font-bold mb-2">Increased Visibility</h3>
              <p className="text-gray-400">Get a special badge and stand out in search results.</p>
            </div>
            <div className="border border-gray-700 bg-gray-900 p-6">
              <h3 className="text-xl font-bold mb-2">Exclusive Rewards</h3>
              <p className="text-gray-400">Enjoy travel coupons and other exclusive perks.</p>
            </div>
            <div className="border border-gray-700 bg-gray-900 p-6">
              <h3 className="text-xl font-bold mb-2">Priority Support</h3>
              <p className="text-gray-400">Get access to a dedicated support team.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Superhost;
