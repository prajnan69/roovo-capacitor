"use client";

const helpTopics = [
  { title: 'Getting Started for Guests', description: 'Learn the basics of booking your first stay.' },
  { title: 'Getting Started for Hosts', description: 'How to set up your listing and welcome guests.' },
  { title: 'Your Account', description: 'Manage your profile, notifications, and account settings.' },
  { title: 'Safety & Accessibility', description: 'Our commitment to a safe and inclusive community.' },
  { title: 'Payments & Payouts', description: 'Everything you need to know about transactions.' },
  { title: 'Booking Issues', description: 'Resolving issues with reservations and cancellations.' },
];

const HelpCenter = () => {
  return (
    <div className="min-h-screen bg-black text-white p-4 sm:p-6 md:p-8">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">How can we help?</h1>
          <div className="max-w-2xl mx-auto">
            <input
              type="search"
              placeholder="Search for answers"
              className="w-full bg-gray-900 border border-gray-700 p-4 text-lg"
            />
          </div>
        </div>

        <div className="border border-gray-700 bg-gray-900 p-8">
          <h2 className="text-2xl font-bold mb-6">Browse Help Topics</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {helpTopics.map((topic, index) => (
              <div key={index} className="border border-gray-800 bg-black p-6 hover:bg-gray-800 cursor-pointer">
                <h3 className="font-bold text-xl mb-2">{topic.title}</h3>
                <p className="text-gray-400">{topic.description}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="border border-gray-700 bg-gray-900 p-8">
            <h2 className="text-2xl font-bold mb-4">Community Forum</h2>
            <p className="text-gray-400 mb-4">
              Connect with other hosts and guests, share stories, and get advice from the community.
            </p>
            <button className="w-full bg-white text-black font-bold py-3 hover:bg-gray-200">
              Visit the Forum
            </button>
          </div>
          <div className="border border-gray-700 bg-gray-900 p-8">
            <h2 className="text-2xl font-bold mb-4">Contact Us</h2>
            <p className="text-gray-400 mb-4">
              Can&apos;t find what you&apos;re looking for? Our support team is here to help 24/7.
            </p>
            <button className="w-full bg-white text-black font-bold py-3 hover:bg-gray-200">
              Get Support
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HelpCenter;
