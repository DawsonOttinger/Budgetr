import { Link } from "react-router-dom";

function MainPage() {
  return (
    <div className="w-full min-h-screen flex flex-col bg-gradient-to-r from-yellow-200 to-pink-300">
      {/* Navbar */}
      <nav className="w-full flex justify-between items-center px-6 py-4 md:px-10">
        <div className="text-2xl font-bold flex items-center">
          <img src="/logo.png" alt="Budgetr Logo" className="h-10 md:h-12" />
        </div>
        <div className="flex gap-4">
          <Link to="/register" className="px-6 py-2 bg-black text-white rounded-full text-sm md:text-base hover:bg-gray-800 transition">
            Get Started
          </Link>
          <Link to="/login" className="px-6 py-2 bg-white text-black border border-black rounded-full text-sm md:text-base hover:bg-gray-200 transition">
            Login →
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="flex flex-col md:flex-row items-center justify-center w-full h-full min-h-screen px-4">
        {/* White Container for Content */}
        <div className="w-11/12 md:w-9/12 bg-white shadow-lg rounded-2xl p-8 flex flex-col md:flex-row items-center justify-between">
          {/* Left: Image */}
          <div className="w-full md:w-1/2 flex justify-center">
            <img src="/hero-image.jpg" alt="Hero" className="rounded-lg shadow-md w-3/4 md:w-full" />
          </div>

          {/* Right: Content */}
          <div className="w-full md:w-1/2 text-center md:text-left px-4 md:px-8">
            <h1 className="text-4xl md:text-5xl font-semibold leading-tight">
              Controlling your finances made <span className="font-bold text-blue-600">EASY</span>
            </h1>
            <hr className="border-black w-20 my-4 mx-auto md:mx-0" />
            <p className="text-gray-700 text-lg md:text-xl">
              40% of Americans operate with no budget, and 60% are living paycheck to paycheck.
              Take control of your finances and start your journey to financial clarity today!
            </p>
            <div className="mt-6 flex justify-center md:justify-start">
              <Link to="/register" className="px-6 py-3 bg-black text-white rounded-full text-lg hover:bg-gray-800 transition">
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="text-center text-gray-500 text-sm py-4">
        © 2025 | Budgetr | Dawson Ottinger <br />
        All rights reserved
      </footer>
    </div>
  );
}

export default MainPage;


