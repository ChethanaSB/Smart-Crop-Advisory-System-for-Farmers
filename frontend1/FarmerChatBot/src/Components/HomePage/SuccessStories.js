import React, { useState } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";

const successStories = [
  "Before using precision farming tools, I struggled with unpredictable yields and high resource costs. Now, with AI-powered analytics and drone monitoring, my farm’s productivity has increased by 40%, and I use 30% less water.",
  "Farmora’s smart irrigation helped me reduce water consumption by half while keeping crop yields stable during drought conditions.",
  "With AI-driven pest detection, I caught crop disease early and saved almost my entire harvest.",
  "Using drone monitoring, I can now cover my entire field in minutes instead of hours, reducing labor costs drastically.",
  "The automation tools helped me double my production efficiency without increasing workforce costs.",
  // 👉 You can add up to 16 or more
];

export default function SuccessStories() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handlePrev = () => {
    setCurrentIndex((prev) =>
      prev === 0 ? successStories.length - 1 : prev - 1
    );
  };

  const handleNext = () => {
    setCurrentIndex((prev) =>
      prev === successStories.length - 1 ? 0 : prev + 1
    );
  };

  return (
    <section className="w-full bg-white py-16 px-6 md:px-12 lg:px-20 text-center">
      {/* Title */}
      <p className="text-sm text-gray-500 mb-4">● Success Stories</p>

      {/* Story */}
      <p className="text-xl md:text-2xl font-medium text-gray-900 leading-relaxed max-w-4xl mx-auto mb-6">
        {successStories[currentIndex]}
      </p>

      {/* Controls */}
      <div className="flex items-center justify-center gap-6 text-gray-600">
        {/* Counter */}
        <span className="text-sm text-gray-500">
          [{currentIndex + 1} / {successStories.length}]
        </span>

        {/* Arrows */}
        <div className="flex gap-4">
          <button
            onClick={handlePrev}
            className="p-2 rounded-full hover:bg-gray-100 transition cursor-pointer"
          >
            <ArrowLeft size={20} />
          </button>
          <button
            onClick={handleNext}
            className="p-2 rounded-full hover:bg-gray-100 transition cursor-pointer"
          >
            <ArrowRight size={20} />
          </button>
        </div>
      </div>
    </section>
  );
}
