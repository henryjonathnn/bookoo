import React from 'react';

const BADGE_COLORS = {
  USER: 'bg-blue-500/10 text-blue-400',
  STAFF: 'bg-green-500/10 text-green-400',
  ADMIN: 'bg-red-500/10 text-red-400'
};

const RoleBadge = ({ role }) => {
  const badgeColor = BADGE_COLORS[role] || 'bg-gray-500/10 text-gray-400';
  const badgeText = role;

  return (
    <span className={`px-3 py-1 rounded-md text-sm ${badgeColor}`}>
      {badgeText}
    </span>
  );
};

export default RoleBadge;