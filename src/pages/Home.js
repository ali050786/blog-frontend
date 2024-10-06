import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from "framer-motion";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "../components/ui/card";
import { Alert, AlertDescription } from "../components/ui/alert";
import { articlesApi } from '../services/api';
import { formatDate } from '../utils/dateUtils';

const Home = () => {
  const [featuredArticles, setFeaturedArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        setLoading(true);
        const response = await articlesApi.getAll(1, 6);
        setFeaturedArticles(response.data);
        setLoading(false);
      } catch (err) {
        setError(err.message || 'Failed to fetch articles. Please try again later.');
        setLoading(false);
      }
    };

    fetchArticles();
  }, []);

  if (loading) return <div className="flex justify-center items-center h-screen text-white">Loading...</div>;

  return (
    <div className="container mx-auto px-4 py-12 text-white">
      <motion.section 
        className="text-center mb-16"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <h1 className="text-5xl font-bold mb-6 text-purple-300">
          Welcome to UX Design Blog
        </h1>
        <p className="text-xl mb-8 text-gray-300 max-w-2xl mx-auto">
          Discover cutting-edge insights and trends in user experience design. 
          Elevate your skills and stay ahead in the ever-evolving world of UX.
        </p>
        <Button asChild size="lg" className="font-semibold bg-purple-600 hover:bg-purple-700 text-white">
          <Link to="/articles">Explore Articles</Link>
        </Button>
      </motion.section>

      {error && (
        <Alert variant="destructive" className="mb-8 bg-red-900 text-white border-red-700">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <section>
        <h2 className="text-3xl font-semibold mb-8 text-center text-purple-300">
          Featured Articles
        </h2>
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          {featuredArticles.map((article) => (
            <Card key={article.id} className="card-glass flex flex-col h-full">
              <div className="aspect-w-16 aspect-h-9 mb-4">
                <img
                  src={article.image || '/placeholder-image.jpg'}
                  alt={article.title}
                  className="object-cover w-full h-full rounded-t-lg"
                />
              </div>
              <CardHeader>
                <CardTitle className="text-xl line-clamp-2 text-purple-200">{article.title}</CardTitle>
                <p className="text-sm text-purple-300">
                  {article.categories?.name} • {formatDate(article.created_at)}
                </p>
              </CardHeader>
              <CardContent>
                <p className="line-clamp-3 text-gray-300">{article.meta_description}</p>
              </CardContent>
              <CardFooter className="mt-auto pt-4">
                <Button asChild variant="outline" className="w-full border-purple-500 text-purple-300 hover:bg-purple-800">
                  <Link to={`/articles/${article.slug}`}>Read More</Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </motion.div>
      </section>
    </div>
  );
};

export default Home;