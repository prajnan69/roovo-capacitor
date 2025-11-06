"use client";

import { motion } from "framer-motion";

interface Step1IntroProps {
  onNext: () => void;
}

const Step1_Intro = ({ onNext }: Step1IntroProps) => {
  const benefits = [
    {
      title: "Save More, Earn More",
      description: "Competitors can take up to 30% of your earnings. At Roovo, our industry-low fees mean you keep up to 70% more of what you earn.",
      icon: "/icons/host_benefit_1.png",
    },
    {
      title: "A Win-Win for Everyone",
      description: "Lower fees for you mean more competitive pricing for guests. This attracts more bookings and creates a thriving marketplace for everyone.",
      icon: "/icons/host_benefit_2.png",
    },
  ];

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-slate-900 mb-4">Hosting on Roovo is a Smart Choice</h1>
        <p className="text-lg text-slate-600">Join a community that values fairness and transparency.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-start">
        {benefits.map((benefit, index) => (
          <motion.div
            key={index}
            className="bg-white p-8 rounded-2xl shadow-lg border border-slate-100 flex flex-col items-center text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.2 }}
          >
            <img src={benefit.icon} alt={benefit.title} width={128} height={128} className="mb-6" />
            <h3 className="text-2xl font-semibold text-slate-800 mb-3">{benefit.title}</h3>
            <p className="text-slate-600 leading-relaxed">{benefit.description}</p>
          </motion.div>
        ))}
      </div>

      <div className="mt-12 text-center">
        <motion.button
          onClick={onNext}
          className="bg-indigo-600 text-white font-bold py-4 px-10 rounded-full hover:bg-indigo-700 transition-all duration-300 text-xl cursor-pointer shadow-lg hover:shadow-xl transform hover:scale-105"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.98 }}
        >
          Get Started
        </motion.button>
      </div>
    </div>
  );
};

export default Step1_Intro;
