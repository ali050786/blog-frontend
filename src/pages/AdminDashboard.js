import React from 'react';
import { Routes, Route } from 'react-router-dom';
import ManageArticles from '../components/admin/manage-articles';
import ManageTags from '../components/admin/manage-tags';
import ManageCategories from '../components/admin/manage-categories';
import ManageUsers from '../components/admin/manage-users';
import EditArticle from '../components/admin/edit-article';
import CreateArticle from '../components/admin/create-article';

const AdminDashboard = () => {
  const userRole = localStorage.getItem('userRole') || 'reader';

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>
      <Routes>
        <Route path="articles" element={<ManageArticles />} />
        {userRole === 'admin' && (
          <>
            <Route path="tags" element={<ManageTags />} />
            <Route path="categories" element={<ManageCategories />} />
            <Route path="users" element={<ManageUsers />} />
            <Route path="articles" element={<ManageArticles />} />
            <Route path="articles/create" element={<CreateArticle />} />
            <Route path="articles/edit/:id" element={<EditArticle />} />
            
          </>
        )}
      </Routes>
    </div>
  );
};

export default AdminDashboard;