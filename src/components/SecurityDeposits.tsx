"use client";

const claims = [
  {
    guest: 'John Doe',
    listing: 'Modern Downtown Loft',
    amount: 250.00,
    status: 'Resolved',
  },
  {
    guest: 'Jane Smith',
    listing: 'Cozy Beachside Cottage',
    amount: 150.00,
    status: 'Pending',
  },
];

const SecurityDeposits = () => {
  return (
    <div className="min-h-screen bg-black text-white p-4 sm:p-6 md:p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Security Deposits</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Left Side: Deposit Settings */}
          <div className="md:col-span-1">
            <div className="border border-gray-700 bg-gray-900 p-6">
              <h2 className="text-xl font-bold mb-4">Deposit Settings</h2>
              <p className="text-gray-400 mb-4">
                Require a security deposit to cover damages. This is a hold on the guest&apos;s payment method.
              </p>
              <div>
                <label className="block text-sm font-medium text-gray-400">Default Deposit Amount</label>
                <input type="number" defaultValue="500" className="w-full bg-black border border-gray-700 p-2 mt-1" />
              </div>
              <button className="mt-4 w-full bg-white text-black font-bold py-2 hover:bg-gray-200">
                Save Settings
              </button>
            </div>
          </div>

          {/* Right Side: Claims History */}
          <div className="md:col-span-2">
            <div className="border border-gray-700">
              <div className="p-4 bg-gray-800 font-bold border-b border-gray-700 flex justify-between items-center">
                <h2 className="text-xl">Claims History</h2>
                <button className="bg-blue-600 text-white font-bold py-2 px-4 hover:bg-blue-500">
                  File a Claim
                </button>
              </div>
              <div className="grid grid-cols-4 p-4 bg-gray-800 font-bold border-b border-gray-700">
                <div>Guest</div>
                <div>Listing</div>
                <div className="text-right">Amount</div>
                <div className="text-center">Status</div>
              </div>
              <div>
                {claims.map((claim, index) => (
                  <div key={index} className="grid grid-cols-4 items-center p-4 border-b border-gray-800 bg-gray-900">
                    <div>{claim.guest}</div>
                    <div>{claim.listing}</div>
                    <div className="text-right font-bold">${claim.amount.toFixed(2)}</div>
                    <div className="text-center">
                      <span className={`px-3 py-1 text-sm font-semibold ${
                        claim.status === 'Resolved' ? 'bg-green-800 text-green-200' : 'bg-yellow-800 text-yellow-200'
                      }`}>
                        {claim.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SecurityDeposits;
