"use client";

import { useState } from 'react';

const Payments = () => {
  const [selectedMethod, setSelectedMethod] = useState('card');

  return (
    <div className="min-h-screen bg-black text-white p-4 sm:p-6 md:p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Confirm and Pay</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Left Side: Booking Details & Price Summary */}
          <div>
            <div className="border border-gray-700 bg-gray-900 p-6 mb-8">
              <h2 className="text-xl font-bold mb-4">Your Trip</h2>
              <div className="flex justify-between mb-2">
                <span>Dates</span>
                <span>Oct 15-20, 2024</span>
              </div>
              <div className="flex justify-between">
                <span>Guests</span>
                <span>2 guests</span>
              </div>
            </div>

            <div className="border border-gray-700 bg-gray-900 p-6">
              <h2 className="text-xl font-bold mb-4">Price Details</h2>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>$100 x 5 nights</span>
                  <span>$500</span>
                </div>
                <div className="flex justify-between">
                  <span>Cleaning fee</span>
                  <span>$50</span>
                </div>
                <div className="flex justify-between">
                  <span>Service fee</span>
                  <span>$77</span>
                </div>
                <div className="flex justify-between font-bold border-t border-gray-700 pt-2 mt-2">
                  <span>Total (USD)</span>
                  <span>$627</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side: Payment Method */}
          <div>
            <div className="border border-gray-700 bg-gray-900 p-6">
              <h2 className="text-xl font-bold mb-4">Pay with</h2>
              <div className="space-y-4">
                {/* Payment Method Selection */}
                <div className="flex border border-gray-700">
                  <button
                    onClick={() => setSelectedMethod('card')}
                    className={`flex-1 p-4 ${selectedMethod === 'card' ? 'bg-white text-black' : 'bg-black text-white hover:bg-gray-800'}`}
                  >
                    Credit or Debit Card
                  </button>
                  <button
                    onClick={() => setSelectedMethod('paypal')}
                    className={`flex-1 p-4 ${selectedMethod === 'paypal' ? 'bg-white text-black' : 'bg-black text-white hover:bg-gray-800'}`}
                  >
                    PayPal
                  </button>
                </div>

                {/* Card Details Form */}
                {selectedMethod === 'card' && (
                  <div className="space-y-4 pt-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-400">Card Number</label>
                      <input type="text" className="w-full bg-black border border-gray-700 p-2 mt-1" placeholder="•••• •••• •••• ••••" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-400">Expiration</label>
                        <input type="text" className="w-full bg-black border border-gray-700 p-2 mt-1" placeholder="MM / YY" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-400">CVV</label>
                        <input type="text" className="w-full bg-black border border-gray-700 p-2 mt-1" placeholder="•••" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-400">Cardholder Name</label>
                      <input type="text" className="w-full bg-black border border-gray-700 p-2 mt-1" />
                    </div>
                  </div>
                )}

                {/* PayPal Button */}
                {selectedMethod === 'paypal' && (
                  <div className="pt-4">
                    <button className="w-full bg-yellow-500 text-black font-bold py-3">
                      Continue with PayPal
                    </button>
                  </div>
                )}
              </div>

              <button className="mt-8 w-full bg-white text-black font-bold py-3 hover:bg-gray-200">
                Confirm and Pay
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Payments;
