"use client";

const languages = [
  { code: 'en', name: 'English' },
  { code: 'es', name: 'Español' },
  { code: 'fr', name: 'Français' },
  { code: 'de', name: 'Deutsch' },
  { code: 'ja', name: '日本語' },
  { code: 'zh', name: '中文' },
];

const currencies = [
  { code: 'USD', name: 'United States Dollar' },
  { code: 'EUR', name: 'Euro' },
  { code: 'JPY', name: 'Japanese Yen' },
  { code: 'GBP', name: 'British Pound' },
  { code: 'CAD', name: 'Canadian Dollar' },
  { code: 'AUD', name: 'Australian Dollar' },
];

const Accessibility = () => {
  return (
    <div className="min-h-screen bg-black text-white p-4 sm:p-6 md:p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-center">Global Accessibility</h1>
        <p className="text-center text-gray-400 mb-12">
          We are committed to making our platform accessible to everyone, everywhere.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Language Selection */}
          <div className="border border-gray-700 bg-gray-900 p-6">
            <h2 className="text-2xl font-bold mb-4">Language</h2>
            <p className="text-gray-400 mb-4">Choose your preferred language.</p>
            <select className="w-full bg-black border border-gray-700 p-3">
              {languages.map((lang) => (
                <option key={lang.code} value={lang.code}>
                  {lang.name}
                </option>
              ))}
            </select>
          </div>

          {/* Currency Selection */}
          <div className="border border-gray-700 bg-gray-900 p-6">
            <h2 className="text-2xl font-bold mb-4">Currency</h2>
            <p className="text-gray-400 mb-4">Choose your preferred currency.</p>
            <select className="w-full bg-black border border-gray-700 p-3">
              {currencies.map((currency) => (
                <option key={currency.code} value={currency.code}>
                  {currency.name} ({currency.code})
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="mt-12 text-center">
          <button className="bg-white text-black font-bold py-3 px-8 hover:bg-gray-200">
            Save Preferences
          </button>
        </div>
      </div>
    </div>
  );
};

export default Accessibility;
