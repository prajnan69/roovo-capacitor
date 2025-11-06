"use client";

const TrustAndSafety = () => {
  return (
    <div className="min-h-screen bg-black text-white p-4 sm:p-6 md:p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-center">Trust & Safety</h1>
        <p className="text-center text-gray-400 mb-12">
          Your security is our priority. We&apos;ve built a foundation of trust with tools and support to help you feel confident and safe.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Left Side: Key Features */}
          <div className="space-y-8">
            <div className="border border-gray-700 bg-gray-900 p-6">
              <h2 className="text-2xl font-bold mb-3">Reservation Screening</h2>
              <p className="text-gray-400">
                We use a robust screening process to help prevent fraudulent bookings and build a trusted community for both guests and hosts.
              </p>
            </div>
            <div className="border border-gray-700 bg-gray-900 p-6">
              <h2 className="text-2xl font-bold mb-3">Data Protection</h2>
              <p className="text-gray-400">
                Your personal information is encrypted and protected. We are committed to safeguarding your data and privacy.
              </p>
            </div>
            <div className="border border-gray-700 bg-gray-900 p-6">
              <h2 className="text-2xl font-bold mb-3">24/7 Support</h2>
              <p className="text-gray-400">
                Our global support team is available 24/7 in multiple languages to assist with rebooking, refunds, and any other issues that may arise.
              </p>
              <button className="mt-4 w-full bg-white text-black font-bold py-2 hover:bg-gray-200">
                Contact Support
              </button>
            </div>
          </div>

          {/* Right Side: AirCover-inspired Protection */}
          <div className="border border-gray-700 bg-gray-900 p-8 flex flex-col justify-between">
            <div>
              <h2 className="text-3xl font-bold mb-4">RoovoCover</h2>
              <p className="text-gray-300 mb-6">
                Comprehensive protection for every booking. RoovoCover includes damage coverage, liability insurance, and booking protection to ensure peace of mind.
              </p>
              <ul className="space-y-4">
                <li className="flex items-center">
                  <svg className="w-6 h-6 mr-3 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                  <span>Up to $3M in damage protection</span>
                </li>
                <li className="flex items-center">
                  <svg className="w-6 h-6 mr-3 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                  <span>Up to $1M in liability insurance</span>
                </li>
                <li className="flex items-center">
                  <svg className="w-6 h-6 mr-3 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                  <span>Booking guarantee and rebooking assistance</span>
                </li>
              </ul>
            </div>
            <button className="mt-8 w-full bg-blue-600 text-white font-bold py-3 hover:bg-blue-500">
              Learn More
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrustAndSafety;
