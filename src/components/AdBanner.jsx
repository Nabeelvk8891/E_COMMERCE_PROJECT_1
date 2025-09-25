import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getAds } from "../api/adsApi";  // 👈 import from API file

const AdBanner = () => {
  const [ads, setAds] = useState([]);
  const [current, setCurrent] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    getAds()
      .then((res) => setAds(res.data))  // 👈 res.data because axios
      .catch((err) => console.error("Error fetching ads:", err));
  }, []);

  useEffect(() => {
    if (!ads.length) return;
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % ads.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [ads]);

  if (!ads.length) return null;

  return (
    <div className="relative w-full max-w-screen-xl mx-auto overflow-hidden py-4">
      <div className="relative h-[220px] sm:h-64 md:h-80 lg:h-96 flex justify-center items-center">
        {ads.map((ad, i) => {
          let offset = i - current;
          if (offset < -Math.floor(ads.length / 2)) offset += ads.length;
          if (offset > Math.floor(ads.length / 2)) offset -= ads.length;

          const scale = offset === 0 ? 1 : 0.8;
          const opacity = offset === 0 ? 1 : 0.5;
          const zIndex = offset === 0 ? 20 : 10;
          const xOffset = offset * 40;

          return (
            <div
              key={i}
              className="absolute top-0 left-1/2 transform -translate-x-1/2 transition-all duration-700 cursor-pointer"
              style={{
                transform: `translateX(${xOffset}%) scale(${scale})`,
                zIndex,
                opacity,
              }}
            >
              <div
                className="rounded-2xl overflow-hidden shadow-lg
                  w-[80vw] sm:w-72 md:w-80 lg:w-[45rem]
                  h-[180px] sm:h-64 md:h-80 lg:h-96"
              >
                <img
                  src={ad.img}
                  alt={`Ad ${ad.id}`}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Dots navigation */}
      <div className="flex justify-center mt-4 space-x-2">
        {ads.map((_, i) => (
          <button
            key={i}
            className={`w-3 h-3 rounded-full ${
              i === current ? "bg-yellow-500" : "bg-gray-300"
            }`}
            onClick={() => setCurrent(i)}
          />
        ))}
      </div>
    </div>
  );
};

export default AdBanner;
