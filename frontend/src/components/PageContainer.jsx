import React from 'react';

// Dictionary of stunning high-res tourism background images per page route
const PAGE_BACKGROUNDS = {
  landing: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=2000&q=80', // Tropical Beach
  register: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=2000&q=80', // Goa Palms
  login: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=2000&q=80', // Resort Ocean View
  tourist: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=2000&q=80', // Old Goa Heritage
  discover: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=2000&q=80', // Scuba & Watersports
  service: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=2000&q=80', // Luxury Stay
  planner: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=2000&q=80', // Kerala Houseboat
  trustScore: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=2000&q=80', // Rajasthan Palace
  priceCheck: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&w=2000&q=80', // Express Cab Drive
  reviewIntel: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=2000&q=80', // Coastal Dining
  trustNetwork: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=2000&q=80', // Mysore Palace Night
  heatmap: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=2000&q=80', // Munnar Tea Gardens
  feedback: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=2000&q=80', // Desert Safari
  business: 'https://images.unsplash.com/photo-1561501900-3701fa6a0864?auto=format&fit=crop&w=2000&q=80', // Hyderabad Nizam Palace
  authority: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=2000&q=80'  // Golconda Heritage
};

export default function PageContainer({ pageKey = 'discover', children }) {
  const bgImage = PAGE_BACKGROUNDS[pageKey] || PAGE_BACKGROUNDS.discover;

  return (
    <div
      className="min-h-screen bg-cover bg-center bg-fixed transition-all duration-500 animate-slide-up relative"
      style={{
        backgroundImage: `linear-gradient(rgba(248, 250, 252, 0.62), rgba(241, 245, 249, 0.72)), url('${bgImage}')`
      }}
    >
      <div className="w-full h-full relative z-10">
        {children}
      </div>
    </div>
  );
}
