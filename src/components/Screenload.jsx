import React from "react";

const LoadingScreen = () => {
  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-white z-50">
      {/* Rotating rings */}
      <div className="relative w-20 h-20 sm:w-24 sm:h-24">
        <div className="absolute inset-0 border-4 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
        <div className="absolute inset-2 border-4 border-gray-200 border-t-purple-500 rounded-full animate-spin-slow"></div>
      </div>

      {/* Text */}
      <h1 className="mt-6 text-gray-700 text-lg sm:text-2xl font-semibold tracking-widest animate-pulse">
        Loading...
      </h1>

      {/* Animated dots */}
      <div className="flex mt-3 space-x-2">
        <span className="w-2 h-2 bg-blue-500 rounded-full animate-bounce delay-100"></span>
        <span className="w-2 h-2 bg-purple-500 rounded-full animate-bounce delay-200"></span>
        <span className="w-2 h-2 bg-pink-500 rounded-full animate-bounce delay-300"></span>
      </div>
    </div>
  );
};

export default LoadingScreen;
