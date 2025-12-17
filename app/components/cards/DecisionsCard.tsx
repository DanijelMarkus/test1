'use client';

import { useEffect, useState } from 'react';
import { Decision } from '@/lib/types';

export function DecisionsCard() {
  const [decisions, setDecisions] = useState<Decision[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock data
    const mockData: Decision[] = [
      {
        id: '1',
        title: 'Approve new vendor contract',
        description: 'Review and approve the proposed vendor contract',
        options: ['Approve', 'Reject', 'Request Changes'],
        requester: 'John Doe',
        requestedAt: new Date().toISOString(),
        status: 'pending',
      },
    ];

    setTimeout(() => {
      setDecisions(mockData);
      setLoading(false);
    }, 500);
  }, []);

  const formatDate = (isoString: string) => {
    const date = new Date(isoString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold mb-4 text-gray-800">Decisions</h2>
      {loading ? (
        <div className="animate-pulse space-y-4">
          <div className="h-24 bg-gray-200 rounded"></div>
        </div>
      ) : (
        <div className="space-y-4">
          {decisions.length === 0 ? (
            <p className="text-gray-500">No pending decisions</p>
          ) : (
            decisions.map((decision) => (
              <div
                key={decision.id}
                className="border border-gray-200 rounded p-4 hover:shadow-md transition"
              >
                <h3 className="font-medium text-gray-800 mb-2">{decision.title}</h3>
                <p className="text-sm text-gray-600 mb-3">{decision.description}</p>
                <div className="flex flex-wrap gap-2 mb-3">
                  {decision.options.map((option, index) => (
                    <button
                      key={index}
                      className="px-3 py-1 text-sm border border-blue-500 text-blue-500 rounded hover:bg-blue-500 hover:text-white transition"
                    >
                      {option}
                    </button>
                  ))}
                </div>
                <div className="text-xs text-gray-500">
                  <span>Requested by: {decision.requester}</span>
                  <span className="mx-2">•</span>
                  <span>{formatDate(decision.requestedAt)}</span>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
