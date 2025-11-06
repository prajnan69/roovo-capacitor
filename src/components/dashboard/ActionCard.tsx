"use client";

import { motion } from "framer-motion";

interface ActionCardProps {
  title: string;
  description: string;
  icon: string;
}

const ActionCard = ({ title, description, icon }: ActionCardProps) => {
  return (
    <motion.div
      className="flex items-center p-4 border rounded-lg shadow-sm cursor-pointer hover:shadow-md transition-shadow"
      whileHover={{ scale: 1.02 }}
    >
      <img src={icon} alt={title} width={48} height={48} />
      <div className="ml-4">
        <h3 className="font-semibold">{title}</h3>
        <p className="text-sm text-gray-500">{description}</p>
      </div>
    </motion.div>
  );
};

export default ActionCard;
