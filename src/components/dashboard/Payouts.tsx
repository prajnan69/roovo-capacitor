"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import supabase, { API_BASE_URL, fetchPayoutsByHostId } from "../../services/api";
import { Spinner } from "../ui/shadcn-io/spinner";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerFooter,
  DrawerClose,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";

const Payouts = () => {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [host, setHost] = useState<any>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [upiId, setUpiId] = useState("");

  useEffect(() => {
    const fetchHostAndPayouts = async () => {
      setLoading(true);
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        const { data: hostData, error } = await supabase
          .from('hosts')
          .select('*')
          .eq('user_id', session.user.id)
          .single();
        if (hostData) {
          setHost(hostData);
          setUpiId(hostData.payout_details);
          const payouts = await fetchPayoutsByHostId(hostData.id);
          setTransactions(payouts);
        }
      }
      setLoading(false);
    };
    fetchHostAndPayouts();
  }, []);

  const handleSave = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (session) {
      const response = await fetch(`${API_BASE_URL}/api/payouts`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: session.user.id,
          payoutMethod: 'UPI',
          payoutDetails: upiId,
        }),
      });
      if (response.ok) {
        const { host } = await response.json();
        setHost(host);
        setIsDrawerOpen(false);
      }
    }
  };

  return (
    <div className="p-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-1">
          <div className="bg-white p-6 rounded-xl shadow-md">
            <h2 className="text-xl font-bold mb-4">Payout Method</h2>
            {host?.payout_method ? (
              <>
                <div className="border border-gray-200 bg-gray-50 p-4 rounded-lg">
                  <p className="font-bold">{host.payout_method}</p>
                  <p className="text-gray-500">{host.payout_details}</p>
                </div>
                <button
                  onClick={() => setIsDrawerOpen(true)}
                  className="mt-4 w-full bg-indigo-500 text-white font-bold py-2 rounded-lg hover:bg-indigo-600"
                >
                  Manage Payout Method
                </button>
              </>
            ) : (
              <>
                <p className="text-gray-500 mb-4">Please add your payout details.</p>
                <button
                  onClick={() => setIsDrawerOpen(true)}
                  className="mt-4 w-full bg-indigo-500 text-white font-bold py-2 rounded-lg hover:bg-indigo-600"
                >
                  Add Payout Method
                </button>
              </>
            )}
          </div>
        </div>
        <div className="md:col-span-2">
          <div className="bg-white rounded-xl shadow-md">
            <div className="p-4 border-b border-gray-200">
              <h2 className="text-xl font-semibold">Transaction History</h2>
            </div>
            {loading ? (
              <div className="flex items-center justify-center h-64">
                <Spinner />
              </div>
            ) : (
              <>
                <div className="grid grid-cols-4 p-4 font-bold text-gray-500 border-b border-gray-200">
                  <div>Date</div>
                  <div>Listing</div>
                  <div className="text-right">Amount</div>
                  <div className="text-center">Status</div>
                </div>
                <div>
                  {transactions.map((tx, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="grid grid-cols-4 items-center p-4 border-b border-gray-200"
                    >
                      <div>{tx.date}</div>
                      <div>{tx.listing}</div>
                      <div className="text-right font-bold">${tx.amount.toFixed(2)}</div>
                      <div className="text-center">
                        <span className={`px-3 py-1 text-sm font-semibold rounded-full ${
                          tx.status === 'Paid' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {tx.status}
                        </span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
      <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>Payout Method</DrawerTitle>
            <DrawerDescription>
              Enter your UPI ID to receive payouts.
            </DrawerDescription>
          </DrawerHeader>
          <div className="p-4">
            <input
              type="text"
              value={upiId}
              onChange={(e) => setUpiId(e.target.value)}
              placeholder="Enter your UPI ID"
              className="w-full p-3 border rounded-lg"
            />
          </div>
          <DrawerFooter>
            <Button onClick={handleSave}>Save</Button>
            <DrawerClose asChild>
              <Button variant="outline">Cancel</Button>
            </DrawerClose>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </div>
  );
};

export default Payouts;
