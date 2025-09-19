import React from "react";
import { ArrowRight } from "lucide-react";

export default function Footer() {
  // Array of social media links for easier management
  const socialLinks = [
    {
      name: "Twitter",
      href: "https://x.com/agrosage_?s=21",
    },
    {
      name: "Facebook",
      href: "#", // Placeholder, add your Facebook link here
    },
    {
      name: "Instagram",
      href: "https://www.instagram.com/agrosage_/",
    },
    {
      name: "Youtube",
      href: "#", // Placeholder, add your YouTube link here
    },
  ];

  return (
    <footer className="w-full bg-[#111] text-gray-300 rounded-t-2xl">
      {/* Top Section */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20 py-12 grid md:grid-cols-2 gap-8 items-center border-b border-gray-800">
        {/* Left Text + Button */}
        <div>
          <p className="text-sm md:text-2xl font-normal leading-relaxed mb-6 -ml-4">
            Growing the Future of Farming with Innovation, Sustainability, and
            Smart Technology – Connecting Farmers to a Smarter Tomorrow.
          </p>
          <button className="flex items-center gap-2 bg-lime-400 text-black px-6 py-3 rounded-full font-medium hover:bg-lime-500 transition cursor-pointer">
            Contact Us <ArrowRight size={18} />
          </button>
        </div>

        {/* Right Social Media */}
        <div className="flex flex-col md:items-end gap-4">
          <p className="text-sm">Our Social Media</p>
          <div className="flex flex-wrap gap-3">
            {socialLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 rounded-full border border-gray-600 text-gray-200 text-sm hover:bg-gray-800 transition cursor-pointer"
              >
                {link.name}
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Middle Section */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20 py-12 grid md:grid-cols-4 gap-10 border-b border-gray-800">
        {/* Newsletter */}
        <div>
          <h4 className="text-white font-semibold mb-4">Newsletter</h4>
          <div className="flex items-center bg-transparent border border-gray-600 rounded-full overflow-hidden max-w-xs focus-within:ring-2 focus-within:ring-lime-400 transition">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-2 bg-transparent text-sm text-gray-200 focus:outline-none"
            />
            <button className="bg-white text-black px-5 py-2 text-sm font-medium hover:bg-gray-200 transition cursor-pointer">
              Join
            </button>
          </div>
        </div>

        {/* Company */}
        <div>
          <h4 className="text-white font-semibold mb-4">Company</h4>
          <ul className="space-y-2 text-sm">
            <li className="cursor-pointer hover:text-white">About Us</li>
            <li className="cursor-pointer hover:text-white">Our Mission</li>
            <li className="cursor-pointer hover:text-white">Success Stories</li>
            <li className="cursor-pointer hover:text-white">Careers</li>
          </ul>
        </div>

        {/* Solutions */}
        <div>
          <h4 className="text-white font-semibold mb-4">Solutions</h4>
          <ul className="space-y-2 text-sm">
            <li className="cursor-pointer hover:text-white">Our Technologies</li>
            <li className="cursor-pointer hover:text-white">Precision Farming</li>
            <li className="cursor-pointer hover:text-white">Smart Irrigation</li>
            <li className="cursor-pointer hover:text-white">Automation & AI</li>
          </ul>
        </div>

        {/* Resources */}
        <div>
          <h4 className="text-white font-semibold mb-4">Resources</h4>
          <ul className="space-y-2 text-sm">
            <li className="cursor-pointer hover:text-white">Blog & News</li>
            <li className="cursor-pointer hover:text-white">Case Studies</li>
            <li className="cursor-pointer hover:text-white">
              Sustainability Reports
            </li>
            <li className="cursor-pointer hover:text-white">FAQs</li>
          </ul>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20 py-6 flex flex-col md:flex-row justify-between items-center text-xs text-gray-500">
        <p>Farmora © 2024. All rights reserved.</p>
        <div className="flex gap-6 mt-3 md:mt-0">
          <a href="#" className="hover:text-white cursor-pointer">
            Privacy & Policy
          </a>
          <a href="#" className="hover:text-white cursor-pointer">
            Terms & Conditions
          </a>
        </div>
      </div>
    </footer>
  );
}