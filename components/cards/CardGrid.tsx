'use client';

import ScheduleCard from './ScheduleCard';
import NewsCard from './NewsCard';
import ActionsCard from './ActionsCard';
import DecisionsCard from './DecisionsCard';
import ApprovalsCard from './ApprovalsCard';

export default function CardGrid() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto px-4">
      <ScheduleCard />
      <NewsCard />
      <ActionsCard />
      <DecisionsCard />
      <ApprovalsCard />
    </div>
  );
}
