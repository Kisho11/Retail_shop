import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const industries = [
  'Tech shops', 'DIY', 'Greengrocer', 'Pound shop', 'Pet shop', 'Vape shop',
  'Grocery store', 'Butcher', 'Organic shops', 'Pharmacy store', 'Restaurants', 'Bakery'
];

function Navbar() {
  const [isIndustryOpen, setIsIndustryOpen] = useState(false);

  return (
    <nav className="bg-primary text-white p-4 shadow-lg">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold text-accent">Elamshelf</Link>
        <ul className="flex space-x-6">
          <li>
            <Link to="/" className="hover:text-accent">Shop Shelving & Professional Retail Display Solutions</Link>
          </li>
          <li className="relative">
            <button
              onClick={() => setIsIndustryOpen(!isIndustryOpen)}
              className="hover:text-accent focus:outline-none"
            >
              Products by Industry
            </button>
            {isIndustryOpen && (
              <ul className="absolute top-full left-0 bg-primary shadow-md mt-2 p-2 rounded">
                {industries.map((industry, index) => (
                  <li key={index}>
                    <Link
                      to={`/products-by-industry/${industry.toLowerCase().replace(/\s+/g, '-')}`}
                      className="block px-4 py-2 hover:bg-accent hover:text-primary"
                      onClick={() => setIsIndustryOpen(false)}
                    >
                      {industry}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </li>
          <li><Link to="/showroom" className="hover:text-accent">Our Extensive Showroom</Link></li>
          <li><Link to="/clients" className="hover:text-accent">Our Clients</Link></li>
          <li><Link to="/reviews" className="hover:text-accent">Our Reviews</Link></li>
          <li><Link to="/catalogue" className="hover:text-accent">Our Catalogue</Link></li>
          <li><Link to="/sponsor" className="hover:text-accent">We Proudly Sponsor</Link></li>
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;