'use client';

import { ScheduleCard } from '@/app/components/cards/ScheduleCard';
import { NewsCard } from '@/app/components/cards/NewsCard';
import { ActionsCard } from '@/app/components/cards/ActionsCard';
import { DecisionsCard } from '@/app/components/cards/DecisionsCard';
import { ApprovalsCard } from '@/app/components/cards/ApprovalsCard';

export function Dashboard() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Today's Schedule */}
        <div className="lg:col-span-2">
          <ScheduleCard />
        </div>

        {/* Actions */}
        <div>
          <ActionsCard />
        </div>

        {/* News */}
        <div>
          <NewsCard />
        </div>

        {/* Approvals */}
        <div>
          <ApprovalsCard />
        </div>

        {/* Decisions */}
        <div>
          <DecisionsCard />
        </div>
      </div>
    </div>
  );
}
