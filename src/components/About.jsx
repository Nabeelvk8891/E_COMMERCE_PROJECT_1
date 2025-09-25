import React, { useState } from "react";
import { Link } from "react-router-dom";
import logo from "../assets/images/zeyoraLogo.png";
import pic from "../assets/images/1.jpg";
import { HiOutlineMenu, HiOutlineX } from "react-icons/hi";

const About = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <>
      <header className="bg-white shadow-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-8 py-8 flex items-center justify-between relative">
          <div className="flex items-center">
            <Link to="/">
              <img
                src={logo}
                alt="Zeyora Logo"
                className="w-32 sm:w-40 md:w-64 lg:w-40 h-auto object-contain"
              />
            </Link>
          </div>

          <nav className="hidden md:flex absolute left-1/2 transform -translate-x-1/2 gap-6 text-gray-700 font-normal">
            <Link to="/" className=" hover:text-blue-600">
              Home
            </Link>
            <Link to="/shop" className="hover:text-blue-600">
              Shop
            </Link>
            <Link to="/about" className=" text-blue-400 hover:text-blue-600">
              About Us
            </Link>
            <Link to="/contact" className="hover:text-blue-600">
              Help/Support
            </Link>
          </nav>

          <button
            className="md:hidden text-gray-700 p-2 rounded hover:bg-gray-100 transition"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? (
              <HiOutlineX className="w-6 h-6" />
            ) : (
              <HiOutlineMenu className="w-6 h-6" />
            )}
          </button>
        </div>

        <div
          className={`md:hidden px-6 pb-4 space-y-2 bg-white border-t border-gray-200 transition-all duration-300 ${
            isMenuOpen
              ? "max-h-96 opacity-100"
              : "max-h-0 opacity-0 overflow-hidden"
          }`}
        >
          <Link to="/" className="block text-blue-400 hover:text-blue-600 py-2">
            Home
          </Link>
          <Link
            to="/shop"
            className="block text-gray-700 hover:text-blue-600 py-2"
          >
            Shop
          </Link>
          <Link
            to="/about"
            className="block text-gray-700 hover:text-blue-600 py-2"
          >
            About Us
          </Link>
          <Link
            to="/contact"
            className="block text-gray-700 hover:text-blue-600 py-2"
          >
            Help/Support
          </Link>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-12 space-y-12 text-gray-800">
        <div className="text-center space-y-3">
          <div className="flex justify-center">
            <img
              src={pic}
              alt="Perfume Bottles"
              className="rounded-lg shadow-md w-150  object-cover"
            />
          </div>

          <p className="text-sm sm:text-base max-w-2xl mx-auto text-gray-600">
            Zeyora is your trusted fragrance destination — where luxury meets
            affordability. We deliver genuine branded perfumes, thanks to our
            direct tie-ups with original manufacturers.
          </p>
        </div>

        <div className=" flex align-center justify center">
          <div className="space-y-4">
            <h2 className="text-xl sm:text-2xl font-semibold">Our Story</h2>
            <p className="text-gray-600 text-sm sm:text-base">
              Founded with a love for premium fragrances, Zeyora was born to
              make high-end scents accessible to everyone. We bring you perfumes
              that suit your mood, personality, and lifestyle — without the
              premium markup.
            </p>
            <p className="text-gray-600 text-sm sm:text-base">
              We proudly partner directly with original brands, ensuring 100%
              authenticity and unbeatable prices. No middlemen, no knock-offs —
              just real scents from real names.
            </p>
          </div>
        </div>

        <section className="bg-gray-100 rounded-xl p-6 md:p-10">
          <h2 className="text-xl sm:text-2xl font-semibold text-center mb-6">
            Why Trust Zeyora?
          </h2>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm sm:text-base">
            <li>✅ 100% Genuine Fragrance Products</li>
            <li>✅ Official Brand Partnerships</li>
            <li>✅ Secure Payment Gateway</li>
            <li>✅ Fast & Safe Delivery</li>
            <li>✅ Affordable Pricing without Compromise</li>
            <li>✅ Transparent Return Policies</li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl sm:text-2xl font-semibold">Privacy Policy</h2>
          <p className="text-gray-600 text-sm sm:text-base">
            At Zeyora, your privacy matters. We collect only essential
            information such as your name, address, and contact details — just
            enough to process your order and provide great service.
          </p>
          <p className="text-gray-600 text-sm sm:text-base">
            We never sell or share your personal data with third parties. All
            payments and personal details are handled securely using
            industry-standard encryption protocols.
          </p>
          <p className="text-gray-600 text-sm sm:text-base">
            When you shop with us, you're not just buying a product — you're
            trusting us with your time, your money, and your expectations. We
            take that trust seriously.
          </p>
        </section>
      </main>

      <footer className="bg-gray-900 text-white py-6 mt-12">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row justify-between text-sm sm:text-base">
          <p>&copy; {new Date().getFullYear()} Zeyora. All rights reserved.</p>
          <div className="space-x-4 mt-2 sm:mt-0">
            <Link to="/" className="hover:underline">
              Home
            </Link>
            <Link to="/shop" className="hover:underline">
              Shop
            </Link>
            <Link to="/about" className="hover:underline">
              About
            </Link>
            <Link to="/contact" className="hover:underline">
              Help/Support
            </Link>
          </div>
        </div>
      </footer>
    </>
  );
};

export default About;
