import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { articlesApi } from '../services/api';
import DOMPurify from 'dompurify';

const ArticleView = () => {
  const { slug } = useParams();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        setLoading(true);
        const response = await articlesApi.getBySlug(slug);
        setArticle(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch article. Please try again later.');
        setLoading(false);
      }
    };

    fetchArticle();
  }, [slug]);

  if (loading) return <div className="text-center py-8">Loading...</div>;
  if (error) return <div className="text-center py-8 text-red-500">{error}</div>;
  if (!article) return <div className="text-center py-8">Article not found</div>;

  const sanitizeHTML = (html) => {
    return {
      __html: DOMPurify.sanitize(html)
    };
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="mb-8">
        <CardHeader>
        {article.image && (
            <img 
              src={article.image} 
              alt={article.title} 
              className="w-full h-auto object-cover rounded-lg my-4"
            />
          )}
          <CardTitle className="text-3xl mb-2">{article.title}</CardTitle>
          <div className="text-sm text-gray-500 flex flex-wrap gap-2">
            <span>By {article.profiles?.full_name}</span>
            <span>•</span>
            <span>{article.categories?.name}</span>
            <span>•</span>
            <span>Published on {new Date(article.created_at).toLocaleDateString()}</span>
          </div>
        </CardHeader>
        <CardContent>

          <div 
            className="prose dark:prose-invert max-w-none"
            dangerouslySetInnerHTML={sanitizeHTML(article.content)}
          />
          
          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-2">Tags:</h3>
            <div className="flex flex-wrap gap-2">
              {article.tags && article.tags.map(tag => (
                <span key={tag.id} className="bg-gray-200 dark:bg-gray-700 px-3 py-1 rounded-full text-sm">
                  {tag.name}
                </span>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
      
      <div className="flex justify-between items-center">
        <Button asChild variant="outline">
          <Link to="/articles">← Back to Articles</Link>
        </Button>
      </div>
    </div>
  );
};

export default ArticleView;