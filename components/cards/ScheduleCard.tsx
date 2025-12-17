'use client';

import { useEffect, useState } from 'react';

interface Event {
  id: string;
  title: string;
  time: string;
  date: string;
  type: string;
}

export default function ScheduleCard() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSchedule();
  }, []);

  const fetchSchedule = async () => {
    try {
      const response = await fetch('/api/connectors', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          connector: 'custom',
          action: 'fetch_calendar',
          params: {},
        }),
      });
      const data = await response.json();
      if (data.success) {
        setEvents(data.data.events || []);
      }
    } catch (error) {
      console.error('Failed to fetch schedule:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
      <h2 className="text-xl font-bold mb-4 text-gray-800 flex items-center">
        <span className="text-2xl mr-2">📅</span>
        Schedule
      </h2>
      {loading ? (
        <p className="text-gray-500">Loading...</p>
      ) : (
        <div className="space-y-3">
          {events.map((event) => (
            <div key={event.id} className="border-l-4 border-primary pl-3">
              <p className="font-semibold text-gray-800">{event.title}</p>
              <p className="text-sm text-gray-600">{event.time}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
