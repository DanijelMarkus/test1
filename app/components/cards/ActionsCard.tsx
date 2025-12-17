'use client';

import { useEffect, useState } from 'react';
import { ActionItem } from '@/lib/types';

export function ActionsCard() {
  const [actionItems, setActionItems] = useState<ActionItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock data
    const mockData: ActionItem[] = [
      {
        id: '1',
        title: 'Complete quarterly review',
        description: 'Submit quarterly performance review',
        priority: 'high',
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60000).toISOString(),
        status: 'pending',
      },
      {
        id: '2',
        title: 'Update project documentation',
        description: 'Update technical documentation for project',
        priority: 'medium',
        dueDate: new Date(Date.now() + 14 * 24 * 60 * 60000).toISOString(),
        status: 'in_progress',
      },
    ];

    setTimeout(() => {
      setActionItems(mockData);
      setLoading(false);
    }, 500);
  }, []);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'text-red-600 bg-red-100';
      case 'medium':
        return 'text-yellow-600 bg-yellow-100';
      case 'low':
        return 'text-green-600 bg-green-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const formatDueDate = (isoString: string) => {
    const date = new Date(isoString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold mb-4 text-gray-800">Actions</h2>
      {loading ? (
        <div className="animate-pulse space-y-4">
          <div className="h-16 bg-gray-200 rounded"></div>
          <div className="h-16 bg-gray-200 rounded"></div>
        </div>
      ) : (
        <div className="space-y-4">
          {actionItems.length === 0 ? (
            <p className="text-gray-500">No pending actions</p>
          ) : (
            actionItems.map((item) => (
              <div
                key={item.id}
                className="border border-gray-200 rounded p-4 hover:shadow-md transition"
              >
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-medium text-gray-800">{item.title}</h3>
                  <span
                    className={`text-xs px-2 py-1 rounded ${getPriorityColor(
                      item.priority
                    )}`}
                  >
                    {item.priority}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mb-2">{item.description}</p>
                <div className="flex justify-between items-center text-xs text-gray-500">
                  <span className="capitalize">{item.status.replace('_', ' ')}</span>
                  {item.dueDate && <span>Due: {formatDueDate(item.dueDate)}</span>}
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
