import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from "../../components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { Alert, AlertDescription } from "../../components/ui/alert";
import { articlesApi } from '../../services/api';

const ManageArticles = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const navigate = useNavigate();

  useEffect(() => {
    fetchArticles();
  }, [currentPage]);

  const fetchArticles = async () => {
    try {
      setLoading(true);
      const response = await articlesApi.getAll(currentPage);
      setArticles(response.data || []);
      setTotalPages(response.total_pages || 1);
      setLoading(false);
    } catch (error) {
      setError(error.message || 'Failed to fetch articles. Please try again.');
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this article?')) {
      try {
        await articlesApi.delete(id);
        fetchArticles();
      } catch (error) {
        setError(error.message || 'Failed to delete article. Please try again.');
      }
    }
  };

  const filteredArticles = articles.filter(article =>
    article.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <div>Loading...</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">Manage Articles</h2>
        <Button onClick={() => navigate('/admin/articles/create')}>Create New Article</Button>
      </div>
      
      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      <Input
        type="text"
        placeholder="Search articles..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="mb-6"
      />

      {articles.length === 0 ? (
        <p>No articles found.</p>
      ) : (
        <div className="grid gap-6">
          {filteredArticles.map((article) => (
            <Card key={article.id} className="card-glass">
              <CardHeader>
                <CardTitle>{article.title}</CardTitle>
                <p className="text-sm text-gray-500">
                  By {article.profiles?.full_name} | {article.categories?.name} | 
                  Published on {new Date(article.created_at).toLocaleDateString()}
                </p>
              </CardHeader>
              <CardContent>
                <p>{article.content.substring(0, 150)}...</p>
              </CardContent>
              <CardFooter className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => navigate(`/admin/articles/edit/${article.id}`)}>Edit</Button>
                <Button variant="destructive" onClick={() => handleDelete(article.id)}>Delete</Button>
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

export default ManageArticles;