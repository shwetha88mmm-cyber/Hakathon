import React, { useState } from 'react';
import { Send, Star, ShieldCheck, Sparkles } from 'lucide-react';

export default function TouristFeedbackPage() {
  const [serviceId, setServiceId] = useState(1);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [success, setSuccess] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          service_id: Number(serviceId),
          rating: Number(rating),
          comment
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || 'Feedback failed');
      setSuccess(data.message);
      setComment('');
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="max-w-xl mx-auto py-12 px-4 space-y-6">
      
      <div className="text-center space-y-2">
        <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 text-cyan-400 mx-auto flex items-center justify-center">
          <Sparkles className="w-6 h-6" />
        </div>
        <h1 className="text-2xl font-bold text-white">Tourist Experience Feedback</h1>
        <p className="text-xs text-slate-400">Your verified feedback updates service Trust Scores & co-occurrence weights.</p>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl space-y-4">
        {success && (
          <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 p-3 rounded-xl text-xs font-semibold">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block text-slate-300 font-bold mb-1">Select Service</label>
            <select
              value={serviceId}
              onChange={(e) => setServiceId(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 text-white rounded-xl px-3 py-2.5 focus:outline-none focus:border-cyan-500"
            >
              <option value="1">Baga Bay Heritage Resort (Goa)</option>
              <option value="2">Goa Express Coastal Cabs (Goa)</option>
              <option value="3">Vasco Heritage Guide (Goa)</option>
              <option value="4">Grand Island Scuba Diving (Goa)</option>
              <option value="6">The Pavilion Heritage Hotel (Bengaluru)</option>
              <option value="8">Royal Mysore Palace Grand Hotel (Mysuru)</option>
              <option value="10">Alleppey Emerald Houseboat (Kerala)</option>
              <option value="12">Pink City Palace Haveli (Rajasthan)</option>
            </select>
          </div>

          <div>
            <label className="block text-slate-300 font-bold mb-1">Rating</label>
            <select
              value={rating}
              onChange={(e) => setRating(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 text-white rounded-xl px-3 py-2.5 focus:outline-none focus:border-cyan-500"
            >
              <option value="5">⭐⭐⭐⭐⭐ (5.0 Excellent)</option>
              <option value="4">⭐⭐⭐⭐ (4.0 Good)</option>
              <option value="3">⭐⭐⭐ (3.0 Average)</option>
              <option value="2">⭐⭐ (2.0 Poor)</option>
              <option value="1">⭐ (1.0 Terrible)</option>
            </select>
          </div>

          <div>
            <label className="block text-slate-300 font-bold mb-1">Your Comments</label>
            <textarea
              rows="4"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Describe your journey, driver punctuality, hotel cleanliness, guide honesty..."
              className="w-full bg-slate-950 border border-slate-700 text-white rounded-xl p-3 focus:outline-none focus:border-cyan-500"
            ></textarea>
          </div>

          <button
            type="submit"
            className="w-full bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold py-3 rounded-xl shadow-lg shadow-cyan-500/20 text-xs flex items-center justify-center gap-2"
          >
            <Send className="w-4 h-4" /> Submit Feedback
          </button>
        </form>
      </div>

    </div>
  );
}
