'use client';

import { useEffect, useState } from 'react';

interface Article {
  id: string;
  title: string;
  summary: string;
  date: string;
  category: string;
}

export default function NewsCard() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNews();
  }, []);

  const fetchNews = async () => {
    try {
      const response = await fetch('/api/connectors', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          connector: 'custom',
          action: 'fetch_news',
          params: {},
        }),
      });
      const data = await response.json();
      if (data.success) {
        setArticles(data.data.articles || []);
      }
    } catch (error) {
      console.error('Failed to fetch news:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
      <h2 className="text-xl font-bold mb-4 text-gray-800 flex items-center">
        <span className="text-2xl mr-2">📰</span>
        News
      </h2>
      {loading ? (
        <p className="text-gray-500">Loading...</p>
      ) : (
        <div className="space-y-3">
          {articles.map((article) => (
            <div key={article.id} className="border-b pb-2 last:border-0">
              <p className="font-semibold text-gray-800">{article.title}</p>
              <p className="text-sm text-gray-600">{article.summary}</p>
              <span className="text-xs text-gray-500">{article.category}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
