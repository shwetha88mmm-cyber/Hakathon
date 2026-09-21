import React from 'react';
import { ShieldCheck, CheckCircle2 } from 'lucide-react';

export const TrustBadge = ({ score, verified = true, showText = true }) => {
  let badgeColor = '#10b981';
  let badgeBg = '#d1fae5';

  if (score < 75) {
    badgeColor = '#ef4444';
    badgeBg = '#fee2e2';
  } else if (score < 88) {
    badgeColor = '#f59e0b';
    badgeBg = '#fef3c7';
  }

  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', backgroundColor: badgeBg, color: badgeColor, padding: '0.25rem 0.6rem', borderRadius: '20px', fontSize: '0.82rem', fontWeight: 700 }}>
      <ShieldCheck size={16} />
      <span>Trust Score: {score}/100</span>
      {verified && <CheckCircle2 size={14} color="#0ea5e9" title="Government / Business Verified" />}
    </div>
  );
};
