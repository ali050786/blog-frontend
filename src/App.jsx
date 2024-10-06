import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/layout/layout';

// Placeholder components for our routes
const Home = () => <div className="prose dark:prose-invert"><h1>Welcome to UX Design Blog</h1></div>;
const ArticlesList = () => <div className="prose dark:prose-invert"><h1>Articles</h1></div>;
const ArticleView = () => <div className="prose dark:prose-invert"><h1>Article View</h1></div>;
const About = () => <div className="prose dark:prose-invert"><h1>About Us</h1></div>;

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/articles" element={<ArticlesList />} />
          <Route path="/articles/:id" element={<ArticleView />} />
          <Route path="/about" element={<About />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;