import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { DollarSign, TrendingUp, Sparkles } from 'lucide-react';
import PageContainer from '../components/PageContainer';

export default function FairPriceCheckPage() {
  const [searchParams] = useSearchParams();

  const [serviceCategory, setServiceCategory] = useState(searchParams.get('category') || 'Hotel');
  const [location, setLocation] = useState(searchParams.get('location') || 'Goa');
  const [enteredPrice, setEnteredPrice] = useState(searchParams.get('price') || 3500);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handlePriceCheck = async (e) => {
    if (e) e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/price-check', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          service_category: serviceCategory,
          location: location,
          entered_price: Number(enteredPrice)
        })
      });
      const data = await res.json();
      setResult(data);
      setLoading(false);
    } catch (err) {
      alert(err.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    handlePriceCheck();
  }, []);

  return (
    <PageContainer pageKey="priceCheck">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
        
        {/* Header */}
        <div className="space-y-2 text-center max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-emerald-100/90 backdrop-blur border border-emerald-300 text-emerald-800 px-4 py-1.5 rounded-full text-xs font-bold shadow-sm">
            <DollarSign className="w-4 h-4 text-emerald-600" /> AI Fair-Price Check Engine
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900">Compare Prices Against Market Medians</h1>
          <p className="text-slate-800 text-sm font-semibold">
            Avoid overpricing and unfair surge pricing. Our statistical engine compares quoted fares against regional benchmarks.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
          
          <div className="bg-white/95 backdrop-blur-xl border border-slate-200/90 p-6 rounded-3xl space-y-6 shadow-2xl animated-card">
            <h3 className="font-bold text-slate-900 text-base border-b border-slate-200 pb-3 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-600" /> Enter Quoted Price
            </h3>

            <form onSubmit={handlePriceCheck} className="space-y-4 text-xs font-semibold">
              <div>
                <label className="block text-slate-700 font-bold mb-1">Service Category</label>
                <select
                  value={serviceCategory}
                  onChange={(e) => setServiceCategory(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 text-slate-900 font-bold rounded-xl px-3 py-2.5 focus:outline-none focus:border-blue-500"
                >
                  <option value="Hotel">Hotel / Resort</option>
                  <option value="Taxi">Taxi / Cab Fare</option>
                  <option value="Guide">Tour Guide</option>
                  <option value="Activity">Activity / Watersports</option>
                  <option value="Restaurant">Restaurant / Local Shack</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Destination / Region</label>
                <select
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 text-slate-900 font-bold rounded-xl px-3 py-2.5 focus:outline-none focus:border-blue-500"
                >
                  <option value="Goa">Goa</option>
                  <option value="Bengaluru">Bengaluru</option>
                  <option value="Mysuru">Mysuru</option>
                  <option value="Kerala">Kerala</option>
                  <option value="Hyderabad">Hyderabad</option>
                  <option value="Rajasthan">Rajasthan</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Quoted Price (₹ INR)</label>
                <input
                  type="number"
                  min="100"
                  step="50"
                  value={enteredPrice}
                  onChange={(e) => setEnteredPrice(e.target.value)}
                  placeholder="3500"
                  className="w-full bg-slate-50 border border-slate-300 text-slate-900 text-sm rounded-xl px-4 py-2.5 focus:outline-none focus:border-blue-500 font-extrabold"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold py-3.5 rounded-xl shadow-lg shadow-emerald-500/20 text-xs transition-transform hover:scale-[1.02]"
              >
                {loading ? 'Analyzing Price...' : '🔍 Check Price Fairness'}
              </button>
            </form>
          </div>

          <div className="bg-white/95 backdrop-blur-xl border border-slate-200/90 p-6 rounded-3xl space-y-6 shadow-2xl flex flex-col justify-between animated-card">
            <div>
              <h3 className="font-bold text-slate-900 text-base border-b border-slate-200 pb-3 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-blue-600" /> Price Intelligence Report
              </h3>

              {result ? (
                <div className="space-y-6 pt-4">
                  
                  <div className="flex items-center justify-between bg-slate-50 p-4 rounded-2xl border border-slate-200 shadow-sm">
                    <div>
                      <span className="text-slate-500 text-[10px] uppercase font-bold block">Evaluation Result</span>
                      <span className={`text-lg font-extrabold ${
                        result.status === 'NORMAL' ? 'text-emerald-700' :
                        result.status === 'SLIGHTLY HIGH' ? 'text-amber-700' :
                        result.status === 'HIGH' ? 'text-orange-700' : 'text-rose-700'
                      }`}>
                        {result.status}
                      </span>
                    </div>

                    <div className="text-right">
                      <span className="text-slate-500 text-[10px] uppercase font-bold block">Quoted Price</span>
                      <span className="text-xl font-extrabold text-slate-900">₹{result.entered_price?.toLocaleString('en-IN')}</span>
                    </div>
                  </div>

                  <div className="space-y-3 text-xs font-semibold">
                    <div className="flex justify-between items-center bg-slate-50 p-3 rounded-xl border border-slate-200">
                      <span className="text-slate-700 font-bold">Typical Market Range for {result.location}</span>
                      <span className="font-extrabold text-blue-700">₹{result.normal_range?.min?.toLocaleString('en-IN')} - ₹{result.normal_range?.max?.toLocaleString('en-IN')}</span>
                    </div>

                    <div className="flex justify-between items-center bg-slate-50 p-3 rounded-xl border border-slate-200">
                      <span className="text-slate-700 font-bold">Local Median Benchmark</span>
                      <span className="font-extrabold text-slate-900">₹{result.median_price?.toLocaleString('en-IN')}</span>
                    </div>

                    <div className="flex justify-between items-center bg-slate-50 p-3 rounded-xl border border-slate-200">
                      <span className="text-slate-700 font-bold">Price Variance Delta</span>
                      <span className={`font-extrabold ${result.price_difference > 0 ? 'text-amber-700' : 'text-emerald-700'}`}>
                        {result.price_difference > 0 ? `+₹${result.price_difference?.toLocaleString('en-IN')} (${result.percentage_difference}%)` : `₹${result.price_difference?.toLocaleString('en-IN')} (Discount)`}
                      </span>
                    </div>
                  </div>

                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-xs space-y-1 shadow-sm">
                    <span className="text-slate-500 font-bold block text-[10px] uppercase">AI Explanation:</span>
                    <p className="text-slate-800 leading-relaxed font-semibold">{result.explanation}</p>
                  </div>

                </div>
              ) : (
                <div className="text-center py-16 text-slate-600 font-semibold text-xs">
                  Enter price details and click "Check Price Fairness" to generate report.
                </div>
              )}
            </div>

            <p className="text-[11px] text-slate-500 italic text-center font-medium">
              Statistical comparisons generated from verified historical market distributions across Indian regional hubs.
            </p>
          </div>

        </div>

      </div>
    </PageContainer>
  );
}
