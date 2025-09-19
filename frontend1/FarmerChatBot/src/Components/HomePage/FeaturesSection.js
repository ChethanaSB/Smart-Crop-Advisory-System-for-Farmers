import React from "react";
import { Zap, Database, Cpu, Droplets } from "lucide-react";

const features = [
  {
    id: 1,
    icon: <Zap className="w-6 h-6 text-lime-400" />,
    title: "Precision Farming",
    description:
      "Using satellite imagery and remote sensing, farmers monitor fields in real time, apply fertilizers efficiently, and reduce resource use.",
  },
  {
    id: 2,
    icon: <Droplets className="w-6 h-6 text-lime-400" />,
    title: "Efficient Irrigation Systems",
    description:
      "By integrating soil moisture sensors, weather data, and automated irrigation controls, farmers can ensure crops receive the right amount of water at the right time.",
  },
  {
    id: 3,
    icon: <Database className="w-6 h-6 text-lime-400" />,
    title: "AI & Data Analytics",
    description:
      "AI-driven models analyze historical and real-time data to predict pest infestations, detect crop diseases early, and recommend the best planting schedules.",
  },
  {
    id: 4,
    icon: <Cpu className="w-6 h-6 text-lime-400" />,
    title: "Automated Machinery & Robotics",
    description:
      "From autonomous tractors to drones and robotic harvesters, automation reduces labor while boosting productivity.",
  },
];

export default function FeaturesSection() {
  return (
    <section className="w-full bg-[#111] text-gray-100 py-16 px-6 md:px-12 lg:px-20 rounded-2xl">
      <div className="grid md:grid-cols-2 gap-12">
        {/* Left Label */}
        <div className="flex flex-col space-y-6">
          <span className="text-sm text-lime-400 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-lime-400"></span> Main Feature
          </span>
          <h2 className="text-3xl md:text-4xl font-bold leading-snug">
            Unlock the Future of Farming with Powerful Features Designed for
            Efficiency, Productivity, and Sustainability
          </h2>
        </div>

        {/* Features Grid */}
        <div className="grid sm:grid-cols-2 gap-8">
          {features.map((feature) => (
            <div key={feature.id} className="flex flex-col space-y-3">
              <div className="w-12 h-12 flex items-center justify-center rounded-md bg-lime-950/30">
                {feature.icon}
              </div>
              <h3 className="text-lg font-semibold">{feature.title}</h3>
              <p className="text-sm text-gray-400 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
