import React from "react";
import { ArrowRight } from "lucide-react";
import bgImage from "./Images/Hero.jpg" ; 

function HeroSection() {
  return (
    <section
      className="relative w-full h-screen flex items-center justify-center"
      style={{
        backgroundImage: `url(${bgImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Overlay for better text readability */}
      <div className="absolute inset-0 bg-black/30"></div>

      <div className="relative z-10 container mx-auto px-6 lg:px-12 grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        {/* Left Content */}
        <div className="text-white space-y-6 max-w-xl">
          <span className="inline-block px-4 py-1 text-sm rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-gray-100">
            Sustainable Farming Tech
          </span>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight">
            Bringing Innovation to <br /> Your Farming Journey.
          </h1>

          <p className="text-base md:text-lg text-gray-200 max-w-lg">
            From precision agriculture to sustainable practices, we help you
            grow more efficiently and profitably. Join us in transforming the
            way you farm!
          </p>

          {/* Button */}
          <div>
            <button
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-semibold 
              bg-gradient-to-r from-lime-300 to-green-400 hover:from-lime-400 hover:to-green-500 
              text-gray-900 shadow-lg transition duration-300"
            >
              Get Started
              <ArrowRight size={18} />
            </button>
          </div>
        </div>

        {/* Right Glossy Card */}
        <div className="flex justify-center lg:justify-end">
          <div
            className="bg-white/10 backdrop-blur-md border border-white/20 
            rounded-2xl shadow-lg p-6 max-w-sm text-white"
          >
            <h3 className="text-lg font-semibold flex items-center gap-2 mb-3">
              <span className="text-green-400">●</span> Our Mission
            </h3>
            <p className="text-sm text-gray-200 mb-4">
              To empower farmers with innovative tools and technology that
              enhance productivity, <span className="text-green-300">sustainability</span>, 
              and efficiency, shaping the future of farming.
            </p>
            <button className="inline-flex items-center gap-2 text-sm font-medium text-green-300 hover:text-green-400 transition">
              Learn More <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

export default HeroSection;
