"use client";

const cases = [
  {
    id: 'CASE-123',
    listing: 'Modern Downtown Loft',
    issue: 'Incorrect Amenities',
    status: 'Resolved',
  },
  {
    id: 'CASE-456',
    listing: 'Cozy Beachside Cottage',
    issue: 'Cleanliness',
    status: 'Pending Host Response',
  },
];

const ResolutionCenter = () => {
  return (
    <div className="min-h-screen bg-black text-white p-4 sm:p-6 md:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Resolution Center</h1>
          <button className="bg-white text-black font-bold py-2 px-6 hover:bg-gray-200">
            Report an Issue
          </button>
        </div>

        <div className="border border-gray-700 bg-gray-900">
          <div className="grid grid-cols-4 p-4 bg-gray-800 font-bold border-b border-gray-700">
            <div>Case ID</div>
            <div>Listing</div>
            <div>Issue</div>
            <div className="text-center">Status</div>
          </div>
          <div>
            {cases.map((caseItem, index) => (
              <div key={index} className="grid grid-cols-4 items-center p-4 border-b border-gray-800 hover:bg-gray-800">
                <div className="font-bold">{caseItem.id}</div>
                <div>{caseItem.listing}</div>
                <div>{caseItem.issue}</div>
                <div className="text-center">
                  <span className={`px-3 py-1 text-sm font-semibold ${
                    caseItem.status === 'Resolved' ? 'bg-green-800 text-green-200' : 'bg-yellow-800 text-yellow-200'
                  }`}>
                    {caseItem.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResolutionCenter;
