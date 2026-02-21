import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import ProductsByIndustry from './pages/ProductsByIndustry';
import Showroom from './pages/Showroom';
import Clients from './pages/Clients';
import Reviews from './pages/Reviews';
import Catalogue from './pages/Catalogue';
import Sponsor from './pages/Sponsor';
import Categories from './components/Categories';  // We'll embed this in Home or a dedicated page

function App() {
  return (
    <Router>
      <div className="min-h-screen">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/products-by-industry" element={<ProductsByIndustry />} />
          <Route path="/showroom" element={<Showroom />} />
          <Route path="/clients" element={<Clients />} />
          <Route path="/reviews" element={<Reviews />} />
          <Route path="/catalogue" element={<Catalogue />} />
          <Route path="/sponsor" element={<Sponsor />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;