import React, { useState, useEffect } from 'react';
import { MessageSquare, AlertCircle, CheckCircle, ShieldCheck, Sparkles } from 'lucide-react';

export default function ReviewIntelPage() {
  const [reviewsInput, setReviewsInput] = useState([
    { rating: 5, text: "Exceptional beach resort! Super clean rooms, polite staff, and beautiful sunset view." },
    { rating: 5, text: "Wonderful stay for family trip. Highly recommended for eco-friendly hospitality." },
    { rating: 5, text: "Super clean rooms, polite staff, and beautiful sunset view." }, // Duplicate wording test
    { rating: 4, text: "Good location near Baga beach. Breakfast options were decent." }
  ]);
  const [analysis, setAnalysis] = useState(null);

  const runAnalysis = async () => {
    try {
      const res = await fetch('/api/review-analysis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reviews: reviewsInput })
      });
      const data = await res.json();
      setAnalysis(data);
    } catch (err) {
      alert(err.message);
    }
  };

  useEffect(() => {
    runAnalysis();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      
      {/* Header */}
      <div className="space-y-2 text-center max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-2 bg-purple-500/10 border border-purple-500/20 text-purple-400 px-4 py-1.5 rounded-full text-xs font-semibold">
          <MessageSquare className="w-4 h-4 text-purple-400" /> AI Review Intelligence Engine
        </div>
        <h1 className="text-3xl font-extrabold text-white">Review Pattern & Reliability Analysis</h1>
        <p className="text-slate-400 text-sm">
          Detect copy-pasted review phrasing, sentiment distribution, and review reliability scores before making your decision.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
        
        {/* REVIEWS INPUT DISPLAY */}
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl space-y-4 shadow-2xl">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="font-bold text-white text-base flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-purple-400" /> Analyzed Sample Reviews
            </h3>
            <span className="text-xs text-slate-400">{reviewsInput.length} Entries</span>
          </div>

          <div className="space-y-3 max-h-[360px] overflow-y-auto pr-1 text-xs">
            {reviewsInput.map((r, i) => (
              <div key={i} className="bg-slate-950 p-3 rounded-2xl border border-slate-800 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-amber-400 font-bold">⭐ {r.rating}.0</span>
                  <span className="text-[10px] text-slate-500 font-mono">Sample #{i + 1}</span>
                </div>
                <p className="text-slate-300 italic">"{r.text}"</p>
              </div>
            ))}
          </div>

          <button
            onClick={runAnalysis}
            className="w-full bg-purple-600 hover:bg-purple-500 text-white font-bold py-3 rounded-xl shadow-lg shadow-purple-500/20 text-xs transition-colors"
          >
            Re-Run Review Intelligence AI
          </button>
        </div>


        {/* ANALYSIS REPORT CARD */}
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl space-y-6 shadow-2xl flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-white text-base border-b border-slate-800 pb-3 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" /> NLP Reliability Report
            </h3>

            {analysis ? (
              <div className="space-y-6 pt-4">
                
                <div className="text-center space-y-2 bg-slate-950 p-6 rounded-2xl border border-slate-800">
                  <span className="text-5xl font-extrabold text-purple-400">{analysis.reliability_score}%</span>
                  <span className="text-slate-400 text-xs block font-bold uppercase tracking-wider">Review Reliability Index</span>
                  <span className="inline-block bg-purple-500/10 text-purple-400 border border-purple-500/20 text-[11px] font-bold px-3 py-0.5 rounded-full mt-1">
                    {analysis.is_reliable ? 'Verified Authentic Pattern' : 'Flagged Repetition'}
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2 text-center text-xs">
                  <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                    <span className="text-emerald-400 font-extrabold text-base block">{analysis.sentiment_breakdown?.POSITIVE || 0}</span>
                    <span className="text-slate-400 text-[10px]">Positive</span>
                  </div>
                  <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                    <span className="text-amber-400 font-extrabold text-base block">{analysis.sentiment_breakdown?.NEUTRAL || 0}</span>
                    <span className="text-slate-400 text-[10px]">Neutral</span>
                  </div>
                  <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                    <span className="text-rose-400 font-extrabold text-base block">{analysis.sentiment_breakdown?.NEGATIVE || 0}</span>
                    <span className="text-slate-400 text-[10px]">Negative</span>
                  </div>
                </div>

                <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2 text-xs">
                  <span className="text-slate-400 font-bold block text-[10px] uppercase">Detected Patterns & Flags:</span>
                  {analysis.suspicious_flags?.map((flag, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-slate-300 leading-snug">
                      <AlertCircle className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                      <span>{flag}</span>
                    </div>
                  ))}
                </div>

              </div>
            ) : (
              <div className="text-center py-16 text-slate-500 text-xs">Analyzing review patterns...</div>
            )}
          </div>

          <p className="text-[11px] text-slate-500 italic text-center">
            Review Intelligence is an automated pattern analysis tool designed to detect duplicate phrasing.
          </p>
        </div>

      </div>

    </div>
  );
}
