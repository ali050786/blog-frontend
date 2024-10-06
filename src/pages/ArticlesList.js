import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from "../components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Alert, AlertDescription } from "../components/ui/alert";
import { articlesApi } from '../services/api';
import { formatDate } from '../utils/dateUtils'; // Assume we have a utility function for date formatting

const ArticlesList = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        setLoading(true);
        const response = await articlesApi.getAll(currentPage);
        setArticles(response.data || []);
        setTotalPages(response.total_pages || 1);
        setLoading(false);
      } catch (err) {
        setError(err.message || 'Failed to fetch articles. Please try again later.');
        setArticles([]);
        setLoading(false);
      }
    };

    fetchArticles();
  }, [currentPage]);

  const filteredArticles = articles.filter(article =>
    article.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <div>Loading...</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Articles</h1>
      
      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      <div className="mb-8">
        <Input
          type="text"
          placeholder="Search articles..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full max-w-sm"
        />
      </div>

      {articles.length === 0 ? (
        <p>No articles found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredArticles.map(article => (
            <Card key={article.id} className="flex flex-col">
              <div className="aspect-w-16 aspect-h-9">
                <img
                  src={article.image || '/placeholder-image.jpg'}
                  alt={article.title}
                  className="object-cover w-full h-full rounded-t-lg"
                />
              </div>
              <CardHeader>
                <CardTitle className="text-xl">{article.title}</CardTitle>
                <p className="text-sm text-muted-foreground">
                  {article.categories?.name} | {formatDate(article.created_at)}
                </p>
              </CardHeader>
              <CardContent>
                <p className="line-clamp-3">{article.meta_description}</p>
              </CardContent>
              <CardFooter className="mt-auto">
                <Button asChild variant="outline" className="w-full">
                  <Link to={`/articles/${article.slug}`}>Read More</Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      <div className="mt-8 flex justify-center space-x-2">
        <Button 
          onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
        >
          Previous
        </Button>
        <span className="py-2">Page {currentPage} of {totalPages}</span>
        <Button 
          onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages}
        >
          Next
        </Button>
      </div>
    </div>
  );
};

export default ArticlesList;