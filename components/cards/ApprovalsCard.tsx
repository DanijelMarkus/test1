'use client';

import { useEffect, useState } from 'react';

interface Approval {
  id: string;
  title: string;
  type: string;
  status: string;
  requestDate: string;
}

export default function ApprovalsCard() {
  const [approvals, setApprovals] = useState<Approval[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchApprovals();
  }, []);

  const fetchApprovals = async () => {
    try {
      const response = await fetch('/api/connectors', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          connector: 'custom',
          action: 'fetch_approvals',
          params: {},
        }),
      });
      const data = await response.json();
      if (data.success) {
        setApprovals(data.data.approvals || []);
      }
    } catch (error) {
      console.error('Failed to fetch approvals:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
      <h2 className="text-xl font-bold mb-4 text-gray-800 flex items-center">
        <span className="text-2xl mr-2">✓</span>
        Approvals
      </h2>
      {loading ? (
        <p className="text-gray-500">Loading...</p>
      ) : (
        <div className="space-y-3">
          {approvals.map((approval) => (
            <div key={approval.id} className="border-l-4 border-blue-500 pl-3">
              <p className="font-semibold text-gray-800">{approval.title}</p>
              <p className="text-sm text-gray-600">{approval.type}</p>
              <span className="text-xs text-gray-500">{approval.status}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
