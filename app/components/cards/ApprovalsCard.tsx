'use client';

import { useEffect, useState } from 'react';
import { Approval } from '@/lib/types';

export function ApprovalsCard() {
  const [approvals, setApprovals] = useState<Approval[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock data
    const mockData: Approval[] = [
      {
        id: '1',
        title: 'Expense Report - Travel',
        description: 'Approve travel expenses for conference',
        type: 'expense',
        requester: 'Jane Smith',
        requestedAt: new Date().toISOString(),
        status: 'pending',
        amount: 1250.0,
      },
      {
        id: '2',
        title: 'Time Off Request',
        description: 'Vacation request for next month',
        type: 'time_off',
        requester: 'Bob Johnson',
        requestedAt: new Date(Date.now() - 24 * 60 * 60000).toISOString(),
        status: 'pending',
      },
    ];

    setTimeout(() => {
      setApprovals(mockData);
      setLoading(false);
    }, 500);
  }, []);

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'expense':
        return '💰';
      case 'time_off':
        return '🏖️';
      case 'document':
        return '📄';
      default:
        return '📋';
    }
  };

  const formatDate = (isoString: string) => {
    const date = new Date(isoString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold mb-4 text-gray-800">Approvals</h2>
      {loading ? (
        <div className="animate-pulse space-y-4">
          <div className="h-20 bg-gray-200 rounded"></div>
          <div className="h-20 bg-gray-200 rounded"></div>
        </div>
      ) : (
        <div className="space-y-4">
          {approvals.length === 0 ? (
            <p className="text-gray-500">No pending approvals</p>
          ) : (
            approvals.map((approval) => (
              <div
                key={approval.id}
                className="border border-gray-200 rounded p-4 hover:shadow-md transition"
              >
                <div className="flex items-start mb-2">
                  <span className="text-2xl mr-3">{getTypeIcon(approval.type)}</span>
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-800">{approval.title}</h3>
                    <p className="text-sm text-gray-600 mb-2">{approval.description}</p>
                    {approval.amount && (
                      <p className="text-lg font-semibold text-green-600">
                        ${approval.amount.toFixed(2)}
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex justify-between items-center mt-3">
                  <div className="text-xs text-gray-500">
                    <span>From: {approval.requester}</span>
                    <span className="mx-2">•</span>
                    <span>{formatDate(approval.requestedAt)}</span>
                  </div>
                  <div className="flex gap-2">
                    <button className="px-3 py-1 text-sm bg-green-500 text-white rounded hover:bg-green-600 transition">
                      Approve
                    </button>
                    <button className="px-3 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600 transition">
                      Reject
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
