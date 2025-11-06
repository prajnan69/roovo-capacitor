"use client";

const checklistItems = [
  { id: 1, text: 'Clean all surfaces and floors', completed: true },
  { id: 2, text: 'Wash all linens and towels', completed: true },
  { id: 3, text: 'Restock essentials (toilet paper, soap, etc.)', completed: false },
  { id: 4, text: 'Check that all appliances are working', completed: false },
  { id: 5, text: 'Set out welcome guide and instructions', completed: false },
];

const PropertyPrep = () => {
  return (
    <div className="min-h-screen bg-black text-white p-4 sm:p-6 md:p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Property Prep</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Left Side: Check-in/Out Guide */}
          <div className="border border-gray-700 bg-gray-900 p-6">
            <h2 className="text-2xl font-bold mb-4">Check-in & Check-out</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-400">Check-in Method</label>
                <select className="w-full bg-black border border-gray-700 p-2 mt-1">
                  <option>Smart Lock</option>
                  <option>Lockbox</option>
                  <option>In-person</option>
                  <option>Other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400">Check-in Instructions</label>
                <textarea rows={4} className="w-full bg-black border border-gray-700 p-2 mt-1" placeholder="e.g., The lockbox code is 1234."></textarea>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400">Check-out Instructions</label>
                <textarea rows={3} className="w-full bg-black border border-gray-700 p-2 mt-1" placeholder="e.g., Please take out the trash and leave the key on the counter."></textarea>
              </div>
              <button className="w-full bg-white text-black font-bold py-2 hover:bg-gray-200">
                Save Instructions
              </button>
            </div>
          </div>

          {/* Right Side: Cleaning Checklist */}
          <div className="border border-gray-700 bg-gray-900 p-6">
            <h2 className="text-2xl font-bold mb-4">Cleaning Checklist</h2>
            <div className="space-y-3">
              {checklistItems.map((item) => (
                <div key={item.id} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={item.completed}
                    readOnly
                    className="w-5 h-5 bg-black border-gray-600 text-blue-500 focus:ring-0"
                  />
                  <label className={`ml-3 ${item.completed ? 'text-gray-500 line-through' : 'text-white'}`}>
                    {item.text}
                  </label>
                </div>
              ))}
            </div>
            <button className="mt-6 w-full bg-white text-black font-bold py-2 hover:bg-gray-200">
              Reset Checklist
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyPrep;
