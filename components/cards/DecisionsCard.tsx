'use client';

import { useEffect, useState } from 'react';

interface Decision {
  id: string;
  title: string;
  status: string;
  requester: string;
  dueDate: string;
}

export default function DecisionsCard() {
  const [decisions, setDecisions] = useState<Decision[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDecisions();
  }, []);

  const fetchDecisions = async () => {
    try {
      const response = await fetch('/api/connectors', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          connector: 'custom',
          action: 'fetch_decisions',
          params: {},
        }),
      });
      const data = await response.json();
      if (data.success) {
        setDecisions(data.data.decisions || []);
      }
    } catch (error) {
      console.error('Failed to fetch decisions:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
      <h2 className="text-xl font-bold mb-4 text-gray-800 flex items-center">
        <span className="text-2xl mr-2">⚖️</span>
        Decisions
      </h2>
      {loading ? (
        <p className="text-gray-500">Loading...</p>
      ) : (
        <div className="space-y-3">
          {decisions.map((decision) => (
            <div key={decision.id} className="border-l-4 border-yellow-500 pl-3">
              <p className="font-semibold text-gray-800">{decision.title}</p>
              <p className="text-sm text-gray-600">By: {decision.requester}</p>
              <span className="text-xs text-gray-500">{decision.status}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
