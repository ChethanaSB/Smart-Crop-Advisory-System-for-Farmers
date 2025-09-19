import React, { useState } from "react";

const AboutSection = () => {
  const [activeTab, setActiveTab] = useState("about");

  const tabs = [
    { id: "about", label: "About Us", content: "Who We Are at Farmora" },
    { id: "journey", label: "Journey", content: "Our journey started with a vision to connect farming and technology." },
    { id: "vision", label: "Vision", content: "We envision a future where farming is smarter, sustainable, and profitable." },
    { id: "mission", label: "Mission", content: "Our mission is to empower farmers through innovation and sustainability." },
  ];

  return (
    <section className="w-full px-6 md:px-16 py-12">
      <div className="grid md:grid-cols-2 gap-10 items-start">
        {/* Left Side Tabs */}
        <div className="flex flex-col gap-4">
          <div className="flex flex-wrap gap-4">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-6 py-2 rounded-full border transition-all duration-300 
                  ${
                    activeTab === tab.id
                      ? "bg-lime-300 text-black font-semibold shadow-md"
                      : "bg-white border-gray-300 text-gray-700 hover:bg-gray-100"
                  }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <ul className="mt-6 list-disc list-inside text-gray-700">
            <li>{tabs.find((tab) => tab.id === activeTab)?.content}</li>
          </ul>
        </div>

        {/* Right Side Content */}
        <div className="text-gray-800">
          <h2 className="text-3xl md:text-4xl font-bold leading-snug mb-6">
            With years of expertise in both farming and tech, we’re committed to helping farmers grow smarter and achieve better yields. 
            Together, we’re shaping the future of farming for a more sustainable world.
          </h2>
          <p className="text-gray-600 mb-6">
            By combining innovation with sustainability, we empower farmers to increase productivity, reduce waste, and contribute to a healthier planet. 
            Together, we are shaping the future of farming, ensuring it thrives for generations to come.
          </p>
          <button className="px-6 py-2 rounded-full border border-gray-300 bg-white hover:bg-gray-100 transition">
            Learn More
          </button>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
