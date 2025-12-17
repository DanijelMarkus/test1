'use client';

import { useEffect, useState } from 'react';

interface Task {
  id: string;
  title: string;
  status: string;
  priority: string;
  dueDate: string;
}

export default function ActionsCard() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchActions();
  }, []);

  const fetchActions = async () => {
    try {
      const response = await fetch('/api/connectors', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          connector: 'custom',
          action: 'fetch_tasks',
          params: {},
        }),
      });
      const data = await response.json();
      if (data.success) {
        setTasks(data.data.tasks || []);
      }
    } catch (error) {
      console.error('Failed to fetch actions:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
      <h2 className="text-xl font-bold mb-4 text-gray-800 flex items-center">
        <span className="text-2xl mr-2">✓</span>
        Actions
      </h2>
      {loading ? (
        <p className="text-gray-500">Loading...</p>
      ) : (
        <div className="space-y-3">
          {tasks.map((task) => (
            <div key={task.id} className="border-l-4 border-green-500 pl-3">
              <p className="font-semibold text-gray-800">{task.title}</p>
              <div className="flex justify-between text-sm">
                <span className={task.priority === 'High' ? 'text-red-600' : 'text-gray-600'}>
                  {task.priority}
                </span>
                <span className="text-gray-600">{task.status}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
