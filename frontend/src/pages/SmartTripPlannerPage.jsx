import React, { useState } from 'react';
import { Sparkles, Clock } from 'lucide-react';
import TrustBadge from '../components/TrustBadge';
import PageContainer from '../components/PageContainer';

export default function SmartTripPlannerPage() {
  const [destination, setDestination] = useState('Goa');
  const [days, setDays] = useState(3);
  const [budget, setBudget] = useState(10000);
  const [selectedInterests, setSelectedInterests] = useState(['Beaches', 'Food', 'Sightseeing']);
  const [itinerary, setItinerary] = useState(null);
  const [loading, setLoading] = useState(false);

  const availableInterests = ['Beaches', 'Food', 'Sightseeing', 'Heritage', 'Adventure', 'Cultural'];

  const toggleInterest = (interest) => {
    if (selectedInterests.includes(interest)) {
      setSelectedInterests(selectedInterests.filter(i => i !== interest));
    } else {
      setSelectedInterests([...selectedInterests, interest]);
    }
  };

  const handleGeneratePlan = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/trip-recommendation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          destination,
          days: Number(days),
          budget: Number(budget),
          interests: selectedInterests
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || 'Trip recommendation failed');
      setItinerary(data);
      setLoading(false);
    } catch (err) {
      alert(err.message);
      setLoading(false);
    }
  };

  return (
    <PageContainer pageKey="planner">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
        
        {/* Header */}
        <div className="space-y-2 text-center max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-cyan-100/90 backdrop-blur border border-cyan-300 text-cyan-800 px-4 py-1.5 rounded-full text-xs font-bold shadow-sm">
            <Sparkles className="w-4 h-4 text-cyan-600" /> AI Smart Trip Recommendation Engine
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900">Plan Your Trusted Itinerary</h1>
          <p className="text-slate-800 text-sm font-semibold">
            Enter destination, budget, days and interests. AI will optimize high-trust hotels, transport, guides and activities.
          </p>
        </div>

        {/* PLANNER INPUT FORM */}
        <div className="bg-white/95 backdrop-blur-xl border border-slate-200/90 p-8 rounded-3xl shadow-2xl max-w-4xl mx-auto space-y-6 animated-card">
          <form onSubmit={handleGeneratePlan} className="space-y-6">
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Destination</label>
                <select
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 text-slate-900 font-semibold text-sm rounded-xl px-4 py-3 focus:outline-none focus:border-cyan-500"
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
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Duration (Days)</label>
                <input
                  type="number"
                  min="1"
                  max="7"
                  value={days}
                  onChange={(e) => setDays(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 text-slate-900 font-bold text-sm rounded-xl px-4 py-3 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Total Budget (₹ INR)</label>
                <input
                  type="number"
                  min="2000"
                  step="1000"
                  value={budget}
                  onChange={(e) => setBudget(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 text-slate-900 font-bold text-sm rounded-xl px-4 py-3 focus:outline-none focus:border-cyan-500"
                />
              </div>

            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Your Travel Interests</label>
              <div className="flex flex-wrap gap-2">
                {availableInterests.map((interest) => {
                  const isSelected = selectedInterests.includes(interest);
                  return (
                    <button
                      key={interest}
                      type="button"
                      onClick={() => toggleInterest(interest)}
                      className={`px-4 py-2 rounded-xl text-xs font-extrabold border transition-all ${
                        isSelected
                          ? 'bg-cyan-100 text-cyan-800 border-cyan-400 shadow-sm'
                          : 'bg-slate-50 text-slate-600 border-slate-200 hover:text-slate-900'
                      }`}
                    >
                      {interest} {isSelected && '✓'}
                    </button>
                  );
                })}
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-extrabold py-4 rounded-xl shadow-lg shadow-cyan-500/20 flex items-center justify-center gap-2 text-sm"
            >
              {loading ? 'Generating AI Itinerary...' : '✨ Generate Smart Trip Plan'}
            </button>
          </form>
        </div>

        {/* GENERATED ITINERARY DISPLAY */}
        {itinerary && (
          <div className="space-y-8 animate-fadeIn max-w-5xl mx-auto">
            <div className="bg-white/95 backdrop-blur-xl border border-cyan-300 p-8 rounded-3xl shadow-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6 animated-card">
              <div className="space-y-2">
                <span className="text-xs font-extrabold text-cyan-700 uppercase tracking-widest">Optimized Itinerary</span>
                <h2 className="text-2xl font-extrabold text-slate-900">{itinerary.destination} — {itinerary.days} Days Trip</h2>
                <div className="flex flex-wrap items-center gap-4 text-xs text-slate-700 font-semibold pt-1">
                  <span>Budget: <strong>₹{itinerary.user_budget?.toLocaleString('en-IN')}</strong></span>
                  <span>Estimated Cost: <strong className="text-emerald-700 font-extrabold">₹{itinerary.total_estimated_cost?.toLocaleString('en-IN')}</strong></span>
                  <span className="bg-emerald-100 text-emerald-800 border border-emerald-300 px-2.5 py-0.5 rounded-full font-bold">
                    Headroom: ₹{itinerary.budget_headroom?.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              <div className="bg-slate-50 border border-slate-200 p-4 rounded-2xl text-xs space-y-1 shrink-0 shadow-sm">
                <span className="text-slate-500 font-bold block text-[10px] uppercase">Recommended Stay</span>
                <h4 className="font-extrabold text-slate-900 text-sm">{itinerary.selected_accommodation?.name}</h4>
                <span className="text-emerald-700 font-bold block">₹{itinerary.selected_accommodation?.cost_per_night}/night</span>
              </div>
            </div>

            <div className="space-y-6">
              {itinerary.daily_itinerary?.map((dayPlan) => (
                <div key={dayPlan.day} className="bg-white/95 backdrop-blur-xl border border-slate-200 rounded-3xl p-6 shadow-xl space-y-4 animated-card">
                  <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                    <div className="flex items-center gap-3">
                      <span className="w-8 h-8 rounded-xl bg-cyan-100 text-cyan-800 font-extrabold flex items-center justify-center text-sm shadow-sm">
                        D{dayPlan.day}
                      </span>
                      <h3 className="font-extrabold text-slate-900 text-base">{dayPlan.title}</h3>
                    </div>
                    <span className="text-xs font-bold text-slate-600">Est. Day Cost: ₹{dayPlan.estimated_day_expense?.toLocaleString('en-IN')}</span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-semibold">
                    <div className="bg-slate-50 border border-slate-200 p-4 rounded-2xl space-y-2 shadow-sm">
                      <span className="text-amber-700 font-extrabold text-[10px] uppercase tracking-wider block flex items-center gap-1">
                        <Clock className="w-3 h-3" /> Morning ({dayPlan.schedule?.morning?.time})
                      </span>
                      <h4 className="font-extrabold text-slate-900 text-sm">{dayPlan.schedule?.morning?.activity}</h4>
                      <div className="flex items-center justify-between pt-1">
                        <TrustBadge score={dayPlan.schedule?.morning?.trust_score} size="sm" />
                        <span className="text-slate-700 font-bold">₹{dayPlan.schedule?.morning?.cost_inr}</span>
                      </div>
                    </div>

                    <div className="bg-slate-50 border border-slate-200 p-4 rounded-2xl space-y-2 shadow-sm">
                      <span className="text-cyan-700 font-extrabold text-[10px] uppercase tracking-wider block flex items-center gap-1">
                        <Clock className="w-3 h-3" /> Afternoon ({dayPlan.schedule?.afternoon?.time})
                      </span>
                      <h4 className="font-extrabold text-slate-900 text-sm">{dayPlan.schedule?.afternoon?.activity}</h4>
                      <div className="flex items-center justify-between pt-1">
                        <TrustBadge score={dayPlan.schedule?.afternoon?.trust_score} size="sm" />
                        <span className="text-slate-700 font-bold">₹{dayPlan.schedule?.afternoon?.cost_inr}</span>
                      </div>
                    </div>

                    <div className="bg-slate-50 border border-slate-200 p-4 rounded-2xl space-y-2 shadow-sm">
                      <span className="text-purple-700 font-extrabold text-[10px] uppercase tracking-wider block flex items-center gap-1">
                        <Clock className="w-3 h-3" /> Evening ({dayPlan.schedule?.evening?.time})
                      </span>
                      <h4 className="font-extrabold text-slate-900 text-sm">{dayPlan.schedule?.evening?.activity}</h4>
                      <div className="flex items-center justify-between pt-1">
                        <TrustBadge score={dayPlan.schedule?.evening?.trust_score} size="sm" />
                        <span className="text-slate-700 font-bold">₹{dayPlan.schedule?.evening?.cost_inr}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </PageContainer>
  );
}
