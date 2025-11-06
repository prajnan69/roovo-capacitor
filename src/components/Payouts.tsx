"use client";

const transactions = [
  {
    date: 'Oct 21, 2024',
    listing: 'Modern Downtown Loft',
    amount: 450.00,
    status: 'Paid',
  },
  {
    date: 'Nov 11, 2024',
    listing: 'Cozy Beachside Cottage',
    amount: 620.00,
    status: 'Pending',
  },
  {
    date: 'Sep 15, 2024',
    listing: 'Rustic Mountain Cabin',
    amount: 880.00,
    status: 'Paid',
  },
];

const Payouts = () => {
  return (
    <div className="min-h-screen bg-black text-white p-4 sm:p-6 md:p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Payouts</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Left Side: Payout Method */}
          <div className="md:col-span-1">
            <div className="border border-gray-700 bg-gray-900 p-6">
              <h2 className="text-xl font-bold mb-4">Payout Method</h2>
              <p className="text-gray-400 mb-4">
                Your payouts are sent via Direct Deposit to your linked bank account.
              </p>
              <div className="border border-gray-800 bg-black p-4">
                <p className="font-bold">Bank of Example</p>
                <p className="text-gray-400">Account ending in ••••1234</p>
              </div>
              <button className="mt-4 w-full bg-white text-black font-bold py-2 hover:bg-gray-200">
                Manage Payout Method
              </button>
            </div>
          </div>

          {/* Right Side: Transaction History */}
          <div className="md:col-span-2">
            <div className="border border-gray-700">
              <div className="p-4 bg-gray-800 font-bold border-b border-gray-700">
                <h2 className="text-xl">Transaction History</h2>
              </div>
              <div className="grid grid-cols-4 p-4 bg-gray-800 font-bold border-b border-gray-700">
                <div>Date</div>
                <div>Listing</div>
                <div className="text-right">Amount</div>
                <div className="text-center">Status</div>
              </div>
              <div>
                {transactions.map((tx, index) => (
                  <div key={index} className="grid grid-cols-4 items-center p-4 border-b border-gray-800 bg-gray-900">
                    <div>{tx.date}</div>
                    <div>{tx.listing}</div>
                    <div className="text-right font-bold">${tx.amount.toFixed(2)}</div>
                    <div className="text-center">
                      <span className={`px-3 py-1 text-sm font-semibold ${
                        tx.status === 'Paid' ? 'bg-green-800 text-green-200' : 'bg-yellow-800 text-yellow-200'
                      }`}>
                        {tx.status}
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

export default Payouts;
