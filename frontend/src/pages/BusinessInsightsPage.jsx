import React, { useState, useEffect } from 'react';
import { Sparkles, TrendingUp, BarChart2 } from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid, BarChart, Bar, Legend } from 'recharts';
import { fetchDemandTrends } from '../services/api';

export const BusinessInsightsPage = () => {
  const [data, setData] = useState(null);
  const [destination, setDestination] = useState('Goa');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const res = await fetchDemandTrends(destination);
        setData(res);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [destination]);

  return (
    <div className="container" style={{ padding: '2.5rem 0', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#6366f1', fontWeight: 800, fontSize: '0.9rem' }}>
            <TrendingUp size={18} /> Predictive Demand & Regional Trend Telemetry
          </div>
          <h1 style={{ fontSize: '2.2rem', fontWeight: 800, color: '#0f172a', marginTop: '0.25rem' }}>
            Tourism Business Demand Insights
          </h1>
        </div>

        <select className="form-select" value={destination} onChange={(e) => setDestination(e.target.value)} style={{ width: '180px' }}>
          <option value="Goa">Goa</option>
          <option value="Jaipur">Jaipur</option>
          <option value="Kerala">Kerala</option>
          <option value="Bengaluru">Bengaluru</option>
        </select>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '4rem 0' }}>Loading Recharts Telemetry...</div>
      ) : data ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Summary Banner */}
          <div className="grid-3">
            <div className="card">
              <span style={{ fontSize: '0.8rem', color: '#64748b' }}>Forecasted Demand Trend</span>
              <h2 style={{ fontSize: '1.8rem', color: '#10b981' }}>{data.demand_trend} (+{data.growth_rate_pct}%)</h2>
            </div>
            <div className="card">
              <span style={{ fontSize: '0.8rem', color: '#64748b' }}>Top Demanded Category</span>
              <h2 style={{ fontSize: '1.4rem', color: '#0ea5e9' }}>{data.popular_category}</h2>
            </div>
            <div className="card">
              <span style={{ fontSize: '0.8rem', color: '#64748b' }}>High Activity Corridor</span>
              <h2 style={{ fontSize: '1.2rem', color: '#6366f1' }}>{data.high_activity_area}</h2>
            </div>
          </div>

          {/* Recharts Area Chart - Monthly Searches vs Bookings */}
          <div className="card">
            <h3 style={{ fontSize: '1.15rem', color: '#0f172a', marginBottom: '1.25rem' }}>
              Monthly Search vs Booking Volume Forecast ({destination})
            </h3>
            <div style={{ width: '100%', height: '320px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data.monthly_trends}>
                  <defs>
                    <linearGradient id="colorSearch" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorBooking" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="month" stroke="#64748b" />
                  <YAxis stroke="#64748b" />
                  <Tooltip />
                  <Legend />
                  <Area type="monotone" dataKey="search_volume" name="Tourist Search Volume" stroke="#0ea5e9" fillOpacity={1} fill="url(#colorSearch)" />
                  <Area type="monotone" dataKey="booking_volume" name="Confirmed Bookings" stroke="#10b981" fillOpacity={1} fill="url(#colorBooking)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
};
