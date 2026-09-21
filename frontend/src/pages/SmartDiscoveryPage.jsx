import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Compass, Search, MapPin, Star, CheckCircle, RotateCcw } from 'lucide-react';
import TrustBadge from '../components/TrustBadge';
import PageContainer from '../components/PageContainer';

export default function SmartDiscoveryPage() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState('All');
  const [location, setLocation] = useState('All');
  const [maxPrice, setMaxPrice] = useState(10000);
  const [minTrustScore, setMinTrustScore] = useState(0);

  const fetchServices = () => {
    setLoading(true);
    let url = `/api/services?`;
    if (searchTerm) url += `search=${encodeURIComponent(searchTerm)}&`;
    if (category !== 'All') url += `category=${encodeURIComponent(category)}&`;
    if (location !== 'All') url += `location=${encodeURIComponent(location)}&`;
    if (maxPrice < 10000) url += `max_price=${maxPrice}&`;
    if (minTrustScore > 0) url += `min_trust_score=${minTrustScore}&`;

    fetch(url)
      .then(res => res.json())
      .then(data => {
        setServices(data.services || []);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchServices();
  }, [category, location, maxPrice, minTrustScore]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchServices();
  };

  const resetFilters = () => {
    setSearchTerm('');
    setCategory('All');
    setLocation('All');
    setMaxPrice(10000);
    setMinTrustScore(0);
  };

  return (
    <PageContainer pageKey="discover">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        
        {/* Header */}
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 bg-blue-100/90 backdrop-blur border border-blue-300 text-blue-800 px-3 py-1 rounded-full text-xs font-bold shadow-sm">
            <Compass className="w-3.5 h-3.5 text-blue-600" /> Smart Tourism Discovery
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900">Find Verified Tourism Services</h1>
          <p className="text-slate-800 text-sm font-semibold">
            Discover hotels, taxis, guides, activities, and local dining across India with verified AI Trust Scores.
          </p>
        </div>

        {/* SEARCH AND FILTERS BAR */}
        <div className="bg-white/95 backdrop-blur-xl border border-slate-200/90 p-6 rounded-3xl space-y-6 shadow-xl animated-card">
          
          {/* Search Bar */}
          <form onSubmit={handleSearchSubmit} className="relative">
            <Search className="w-5 h-5 text-slate-400 absolute left-4 top-3.5" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search hotels, taxis, scuba diving, guides, spice tours..."
              className="w-full bg-slate-50 border border-slate-300 text-slate-900 text-sm font-semibold rounded-2xl pl-12 pr-28 py-3 focus:outline-none focus:border-blue-500 shadow-inner"
            />
            <button
              type="submit"
              className="absolute right-2 top-2 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-extrabold px-5 py-1.5 rounded-xl text-xs transition-all shadow-md"
            >
              Search
            </button>
          </form>

          {/* Filter Controls Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
            
            <div>
              <label className="block text-slate-700 font-bold uppercase tracking-wider mb-1.5">Service Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 text-slate-800 font-semibold rounded-xl px-3 py-2 focus:outline-none focus:border-blue-500"
              >
                <option value="All">All Categories</option>
                <option value="Hotel">Hotels & Resorts</option>
                <option value="Taxi">Taxis & Transport</option>
                <option value="Guide">Tour Guides</option>
                <option value="Activity">Activities & Adventure</option>
                <option value="Restaurant">Local Dining & Shacks</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-700 font-bold uppercase tracking-wider mb-1.5">Destination</label>
              <select
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 text-slate-800 font-semibold rounded-xl px-3 py-2 focus:outline-none focus:border-blue-500"
              >
                <option value="All">All Destinations</option>
                <option value="Goa">Goa</option>
                <option value="Bengaluru">Bengaluru</option>
                <option value="Mysuru">Mysuru</option>
                <option value="Kerala">Kerala</option>
                <option value="Hyderabad">Hyderabad</option>
                <option value="Rajasthan">Rajasthan</option>
              </select>
            </div>

            <div>
              <div className="flex justify-between text-slate-700 font-bold uppercase tracking-wider mb-1.5">
                <span>Max Price</span>
                <span className="text-blue-700 font-extrabold">₹{maxPrice.toLocaleString('en-IN')}</span>
              </div>
              <input
                type="range"
                min="500"
                max="10000"
                step="500"
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="w-full accent-blue-600 bg-slate-200"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-bold uppercase tracking-wider mb-1.5">Min Trust Score</label>
              <select
                value={minTrustScore}
                onChange={(e) => setMinTrustScore(Number(e.target.value))}
                className="w-full bg-slate-50 border border-slate-300 text-slate-800 font-semibold rounded-xl px-3 py-2 focus:outline-none focus:border-blue-500"
              >
                <option value="0">Any Trust Score</option>
                <option value="90">90+ Platinum Verified</option>
                <option value="80">80+ High Trust</option>
                <option value="70">70+ Moderate Trust</option>
              </select>
            </div>

          </div>

          <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-200">
            <span className="text-slate-700 font-bold">Found <strong className="text-slate-900">{services.length}</strong> matching services</span>
            <button
              onClick={resetFilters}
              className="text-slate-600 hover:text-rose-600 flex items-center gap-1 font-bold"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Reset Filters
            </button>
          </div>

        </div>

        {/* SERVICES GRID RESULT */}
        {loading ? (
          <div className="text-center py-20 text-slate-700 text-sm font-bold">Searching verified tourism database...</div>
        ) : services.length === 0 ? (
          <div className="bg-white/95 backdrop-blur border border-slate-200 p-12 text-center rounded-3xl space-y-3 shadow-lg">
            <p className="text-slate-800 font-bold text-base">No tourism services matched your filter criteria.</p>
            <p className="text-slate-600 text-xs font-semibold">Try adjusting your price range or selecting "All Destinations".</p>
            <button onClick={resetFilters} className="bg-blue-50 text-blue-700 text-xs font-bold px-4 py-2 rounded-xl">Reset Search</button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((s) => (
              <div key={s.id} className="bg-white/95 backdrop-blur-xl border border-slate-200/90 rounded-3xl overflow-hidden hover:border-blue-300 transition-all shadow-xl flex flex-col justify-between animated-card">
                <div>
                  <div className="h-48 bg-slate-100 relative overflow-hidden">
                    <img src={s.image_url} alt={s.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                    <div className="absolute top-3 left-3">
                      <TrustBadge score={s.trust_score} size="sm" />
                    </div>
                    <div className="absolute top-3 right-3 bg-white/90 backdrop-blur text-slate-900 text-xs font-extrabold px-3 py-1 rounded-full border border-slate-200 shadow-sm">
                      ₹{s.price_inr?.toLocaleString('en-IN')}
                    </div>
                  </div>

                  <div className="p-6 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold text-blue-700 uppercase tracking-wider">{s.category}</span>
                      <span className="text-xs font-bold text-slate-700 flex items-center gap-1">
                        <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" /> {s.rating}
                      </span>
                    </div>

                    <h3 className="font-extrabold text-slate-900 text-lg leading-tight group-hover:text-blue-700 transition-colors">{s.name}</h3>

                    <div className="flex items-center gap-1 text-xs text-slate-700 font-semibold">
                      <MapPin className="w-3.5 h-3.5 text-amber-600" />
                      <span>{s.location}</span>
                    </div>

                    <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed font-semibold">{s.description}</p>
                  </div>
                </div>

                <div className="px-6 pb-6 pt-3 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[11px] text-emerald-700 font-bold flex items-center gap-1">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-600" /> Verified Listing
                  </span>
                  <Link
                    to={`/service/${s.id}`}
                    className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-extrabold px-4 py-2 rounded-xl transition-colors shadow-md shadow-blue-500/10"
                  >
                    View Details
                  </Link>
                </div>

              </div>
            ))}
          </div>
        )}

      </div>
    </PageContainer>
  );
}
