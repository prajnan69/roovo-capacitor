"use client";

import { motion } from "framer-motion";
import HostHeader from "./HostHeader";
import ActionCard from "./ActionCard";
import Reservations from "./Reservations";

const HostDashboard = () => {
  return (
    <div className="min-h-screen bg-white">
      <HostHeader />
      <main className="p-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8"
        >
          <ActionCard
            title="Add a payout method"
            description="Required to get paid"
            icon="/icons/payout.png"
          />
          <ActionCard
            title="Add your account information"
            description="Required to get paid"
            icon="/icons/account.png"
          />
        </motion.div>
        <Reservations />
      </main>
    </div>
  );
};

export default HostDashboard;
