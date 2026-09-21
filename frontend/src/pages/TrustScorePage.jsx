import React, { useState } from 'react';
import { ShieldCheck, Award, Sparkles } from 'lucide-react';
import TrustBadge from '../components/TrustBadge';
import PageContainer from '../components/PageContainer';

export default function TrustScorePage() {
  const [rating, setRating] = useState(4.8);
  const [reviewReliability, setReviewReliability] = useState(94);
  const [isVerified, setIsVerified] = useState(true);
  const [positiveFeedback, setPositiveFeedback] = useState(90);
  const [networkConnections, setNetworkConnections] = useState(6);
  const [result, setResult] = useState(null);

  const calculateScore = async (e) => {
    if (e) e.preventDefault();
    try {
      const res = await fetch('/api/trust-score', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          rating: Number(rating),
          review_reliability: Number(reviewReliability),
          is_verified: isVerified,
          positive_feedback_pct: Number(positiveFeedback),
          network_connection_count: Number(networkConnections)
        })
      });
      const data = await res.json();
      setResult(data);
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <PageContainer pageKey="trustScore">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
        
        {/* Header */}
        <div className="space-y-2 text-center max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-blue-100/90 backdrop-blur border border-blue-300 text-blue-800 px-4 py-1.5 rounded-full text-xs font-bold shadow-sm">
            <ShieldCheck className="w-4 h-4 text-blue-600" /> Trust Score Algorithm Engine
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900">How Trust Score is Calculated</h1>
          <p className="text-slate-800 text-sm font-semibold">
            A multi-factor 0-100 algorithm evaluating user ratings, review NLP reliability, official verification, feedback ratios, and NetworkX co-occurrences.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
          
          <div className="bg-white/95 backdrop-blur-xl border border-slate-200/90 p-6 rounded-3xl space-y-6 shadow-2xl animated-card">
            <h3 className="font-bold text-slate-900 text-base border-b border-slate-200 pb-3 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-blue-600" /> Adjust Parameters
            </h3>

            <form onSubmit={calculateScore} className="space-y-4 text-xs font-semibold">
              <div>
                <div className="flex justify-between text-slate-800 font-bold mb-1">
                  <span>Average User Rating</span>
                  <span className="text-amber-600">⭐ {rating} / 5.0</span>
                </div>
                <input
                  type="range"
                  min="1.0"
                  max="5.0"
                  step="0.1"
                  value={rating}
                  onChange={(e) => setRating(Number(e.target.value))}
                  className="w-full accent-blue-600 bg-slate-200"
                />
              </div>

              <div>
                <div className="flex justify-between text-slate-800 font-bold mb-1">
                  <span>Review NLP Reliability</span>
                  <span className="text-emerald-700 font-extrabold">{reviewReliability}%</span>
                </div>
                <input
                  type="range"
                  min="40"
                  max="100"
                  step="1"
                  value={reviewReliability}
                  onChange={(e) => setReviewReliability(Number(e.target.value))}
                  className="w-full accent-blue-600 bg-slate-200"
                />
              </div>

              <div>
                <div className="flex justify-between text-slate-800 font-bold mb-1">
                  <span>Positive Feedback Pct</span>
                  <span className="text-purple-700 font-extrabold">{positiveFeedback}%</span>
                </div>
                <input
                  type="range"
                  min="30"
                  max="100"
                  step="1"
                  value={positiveFeedback}
                  onChange={(e) => setPositiveFeedback(Number(e.target.value))}
                  className="w-full accent-blue-600 bg-slate-200"
                />
              </div>

              <div>
                <div className="flex justify-between text-slate-800 font-bold mb-1">
                  <span>Network Connection Chains</span>
                  <span className="text-cyan-700 font-extrabold">{networkConnections} connections</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="12"
                  step="1"
                  value={networkConnections}
                  onChange={(e) => setNetworkConnections(Number(e.target.value))}
                  className="w-full accent-blue-600 bg-slate-200"
                />
              </div>

              <div className="flex items-center gap-3 pt-2">
                <input
                  type="checkbox"
                  id="verif"
                  checked={isVerified}
                  onChange={(e) => setIsVerified(e.target.checked)}
                  className="w-4 h-4 accent-blue-600"
                />
                <label htmlFor="verif" className="text-slate-800 font-bold">Verified Provider Registry (+15 pts)</label>
              </div>

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-extrabold py-3.5 rounded-xl shadow-lg shadow-blue-500/20 text-xs transition-transform hover:scale-[1.02]"
              >
                Calculate Live Trust Score
              </button>
            </form>
          </div>

          <div className="bg-white/95 backdrop-blur-xl border border-slate-200/90 p-6 rounded-3xl space-y-6 shadow-2xl flex flex-col justify-between animated-card">
            <div>
              <h3 className="font-bold text-slate-900 text-base border-b border-slate-200 pb-3 flex items-center gap-2">
                <Award className="w-4 h-4 text-emerald-600" /> Trust Score Breakdown
              </h3>

              {result ? (
                <div className="space-y-6 pt-4">
                  
                  <div className="text-center space-y-2 bg-slate-50 p-6 rounded-2xl border border-slate-200 shadow-sm">
                    <span className="text-5xl font-extrabold text-blue-700">{result.trust_score}</span>
                    <span className="text-slate-600 text-xs block font-bold">out of 100</span>
                    <div className="pt-2">
                      <TrustBadge score={result.trust_score} size="lg" />
                    </div>
                  </div>

                  <div className="space-y-3 text-xs font-semibold">
                    <div className="flex justify-between items-center bg-slate-50 p-3 rounded-xl border border-slate-200">
                      <span className="text-slate-700 font-bold">Rating Contribution (max 35)</span>
                      <span className="font-extrabold text-blue-700">+{result.factors?.rating_contribution} pts</span>
                    </div>
                    <div className="flex justify-between items-center bg-slate-50 p-3 rounded-xl border border-slate-200">
                      <span className="text-slate-700 font-bold">Review Reliability (max 25)</span>
                      <span className="font-extrabold text-emerald-700">+{result.factors?.review_reliability} pts</span>
                    </div>
                    <div className="flex justify-between items-center bg-slate-50 p-3 rounded-xl border border-slate-200">
                      <span className="text-slate-700 font-bold">Verification Status (max 15)</span>
                      <span className="font-extrabold text-cyan-700">+{result.factors?.verification} pts</span>
                    </div>
                    <div className="flex justify-between items-center bg-slate-50 p-3 rounded-xl border border-slate-200">
                      <span className="text-slate-700 font-bold">Feedback Ratio (max 15)</span>
                      <span className="font-extrabold text-purple-700">+{result.factors?.feedback} pts</span>
                    </div>
                    <div className="flex justify-between items-center bg-slate-50 p-3 rounded-xl border border-slate-200">
                      <span className="text-slate-700 font-bold">Network Co-occurrences (max 10)</span>
                      <span className="font-extrabold text-amber-700">+{result.factors?.network} pts</span>
                    </div>
                  </div>

                </div>
              ) : (
                <div className="text-center py-16 text-slate-600 font-semibold text-xs">
                  Click "Calculate Live Trust Score" to test the algorithm.
                </div>
              )}
            </div>

            <p className="text-[11px] text-slate-500 italic text-center font-medium">
              Note: Trust Score is an automated multi-factor intelligence indicator computed from available data.
            </p>
          </div>

        </div>

      </div>
    </PageContainer>
  );
}
