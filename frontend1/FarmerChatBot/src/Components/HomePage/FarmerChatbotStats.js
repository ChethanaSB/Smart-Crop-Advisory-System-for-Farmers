import React from "react";
import { ArrowUpRight } from "lucide-react";

// Import your local images
import chatbotImg from "./Images/stat1.jpg";
import accuracyImg from "./Images/stat2.jpg";
import decisionImg from "./Images/stat3.jpg";

const stats = [
  {
    id: 1,
    image: chatbotImg,
    number: "24/7",
    title: "Farmer Chatbot Support",
    description:
      "Our AI-powered chatbot provides instant support to farmers anytime, anywhere — from crop guidance to weather updates and pest control tips.",
    bg: "bg-white",
  },
  {
    id: 2,
    image: accuracyImg,
    number: "90%",
    title: "Query Resolution Accuracy",
    description:
      "With 90% accuracy in resolving farmer queries, our chatbot ensures reliable answers and faster decision-making for better farming outcomes.",
    bg: "bg-green-100",
  },
  {
    id: 3,
    image: decisionImg,
    number: "3x",
    title: "Faster Farming Decisions",
    description:
      "Farmers make decisions 3x faster with instant insights and personalized recommendations from our chatbot.",
    bg: "bg-white",
  },
];

export default function FarmerChatbotStats() {
  return (
    <section className="w-full py-12 px-6 md:px-12 lg:px-20 bg-white">
      <div className="grid md:grid-cols-3 gap-8">
        {stats.map((stat) => (
          <div
            key={stat.id}
            className={`rounded-2xl overflow-hidden shadow-sm ${stat.bg}`}
          >
            <img
              src={stat.image}
              alt={stat.title}
              className="w-full h-56 object-cover"
            />
            <div className="p-6">
              <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold text-gray-900">
                  {stat.number}
                </h2>
                <span className="w-8 h-8 flex items-center justify-center rounded-full bg-black text-white">
                  <ArrowUpRight size={18} />
                </span>
              </div>
              <h3 className="mt-2 text-lg font-semibold text-gray-800">
                {stat.title}
              </h3>
              <p className="mt-2 text-gray-600 text-sm leading-relaxed">
                {stat.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
