'use client';

import { useEffect, useState } from 'react';
import { NewsItem } from '@/lib/types';

export function NewsCard() {
  const [newsItems, setNewsItems] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock data
    const mockData: NewsItem[] = [
      {
        id: '1',
        title: 'Q4 Company Results Announced',
        summary: 'Company exceeds expectations with strong Q4 performance...',
        publishedAt: new Date().toISOString(),
        source: 'Corporate News',
      },
      {
        id: '2',
        title: 'New Product Launch Next Month',
        summary: 'Exciting new product features coming in the next release...',
        publishedAt: new Date(Date.now() - 24 * 60 * 60000).toISOString(),
        source: 'Product Team',
      },
    ];

    setTimeout(() => {
      setNewsItems(mockData);
      setLoading(false);
    }, 500);
  }, []);

  const formatDate = (isoString: string) => {
    const date = new Date(isoString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));

    if (hours < 1) return 'Just now';
    if (hours < 24) return `${hours}h ago`;
    return `${Math.floor(hours / 24)}d ago`;
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold mb-4 text-gray-800">News</h2>
      {loading ? (
        <div className="animate-pulse space-y-4">
          <div className="h-20 bg-gray-200 rounded"></div>
          <div className="h-20 bg-gray-200 rounded"></div>
        </div>
      ) : (
        <div className="space-y-4">
          {newsItems.map((item) => (
            <div
              key={item.id}
              className="border-b border-gray-200 pb-4 last:border-b-0 hover:bg-gray-50 transition p-2 rounded"
            >
              <h3 className="font-medium text-gray-800 mb-1">{item.title}</h3>
              <p className="text-sm text-gray-600 mb-2">{item.summary}</p>
              <div className="flex justify-between items-center text-xs text-gray-500">
                <span>{item.source}</span>
                <span>{formatDate(item.publishedAt)}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
