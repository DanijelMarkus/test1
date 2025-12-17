'use client';

import { useEffect, useState } from 'react';
import { ScheduleItem } from '@/lib/types';

export function ScheduleCard() {
  const [scheduleItems, setScheduleItems] = useState<ScheduleItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock data - in production, would fetch from API
    const mockData: ScheduleItem[] = [
      {
        id: '1',
        title: 'Team Standup',
        startTime: new Date().toISOString(),
        endTime: new Date(Date.now() + 30 * 60000).toISOString(),
        location: 'Teams Meeting',
      },
      {
        id: '2',
        title: 'Project Review',
        startTime: new Date(Date.now() + 2 * 60 * 60000).toISOString(),
        endTime: new Date(Date.now() + 3 * 60 * 60000).toISOString(),
        location: 'Conference Room A',
      },
    ];
    
    setTimeout(() => {
      setScheduleItems(mockData);
      setLoading(false);
    }, 500);
  }, []);

  const formatTime = (isoString: string) => {
    return new Date(isoString).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold mb-4 text-gray-800">Today&apos;s Schedule</h2>
      {loading ? (
        <div className="animate-pulse space-y-4">
          <div className="h-16 bg-gray-200 rounded"></div>
          <div className="h-16 bg-gray-200 rounded"></div>
        </div>
      ) : (
        <div className="space-y-4">
          {scheduleItems.length === 0 ? (
            <p className="text-gray-500">No meetings scheduled for today</p>
          ) : (
            scheduleItems.map((item) => (
              <div
                key={item.id}
                className="border-l-4 border-blue-500 pl-4 py-2 hover:bg-gray-50 transition"
              >
                <h3 className="font-medium text-gray-800">{item.title}</h3>
                <p className="text-sm text-gray-600">
                  {formatTime(item.startTime)} - {formatTime(item.endTime)}
                </p>
                {item.location && (
                  <p className="text-sm text-gray-500">{item.location}</p>
                )}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
