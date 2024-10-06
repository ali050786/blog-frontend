import React, { useState, useEffect } from 'react';
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/table";
import { Alert, AlertDescription } from "../../components/ui/alert";
import { categoriesApi } from '../../services/api';

const CategoryManagement = () => {
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState({ name: '', description: '' });
  const [editingCategory, setEditingCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await categoriesApi.getAll();
      setCategories(response || []);
      setError(null);
    } catch (err) {
      setError(err.message || 'Failed to fetch categories. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCategory = async () => {
    if (!newCategory.name.trim()) {
      setError('Category name cannot be empty');
      return;
    }
    try {
      setLoading(true);
      await categoriesApi.create(newCategory);
      setNewCategory({ name: '', description: '' });
      setSuccess('Category created successfully');
      fetchCategories();
    } catch (err) {
      setError(err.message || 'Failed to create category. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateCategory = async () => {
    if (!editingCategory.name.trim()) {
      setError('Category name cannot be empty');
      return;
    }
    try {
      setLoading(true);
      await categoriesApi.update(editingCategory.id, editingCategory);
      setEditingCategory(null);
      setSuccess('Category updated successfully');
      fetchCategories();
    } catch (err) {
      setError(err.message || 'Failed to update category. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCategory = async (id) => {
    if (window.confirm('Are you sure you want to delete this category? This action cannot be undone.')) {
      try {
        setLoading(true);
        await categoriesApi.delete(id);
        setSuccess('Category deleted successfully');
        fetchCategories();
      } catch (err) {
        setError(err.message || 'Failed to delete category. Please try again.');
      } finally {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => setSuccess(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [success]);

  if (loading && categories.length === 0) return <div>Loading categories...</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-2xl font-semibold mb-6">Manage Categories</h2>
      
      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      {success && (
        <Alert className="mb-4">
          <AlertDescription>{success}</AlertDescription>
        </Alert>
      )}
      
      <div className="mb-6 space-y-2">
        <Input
          placeholder="New category name"
          value={newCategory.name}
          onChange={(e) => setNewCategory({...newCategory, name: e.target.value})}
        />
        <Input
          placeholder="Category description (optional)"
          value={newCategory.description}
          onChange={(e) => setNewCategory({...newCategory, description: e.target.value})}
        />
        <Button onClick={handleCreateCategory} disabled={loading}>Create Category</Button>
      </div>

      {categories.length === 0 ? (
        <p>No categories found.</p>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {categories.map((category) => (
              <TableRow key={category.id}>
                <TableCell>
                  {editingCategory && editingCategory.id === category.id ? (
                    <Input
                      value={editingCategory.name}
                      onChange={(e) => setEditingCategory({...editingCategory, name: e.target.value})}
                    />
                  ) : (
                    category.name
                  )}
                </TableCell>
                <TableCell>
                  {editingCategory && editingCategory.id === category.id ? (
                    <Input
                      value={editingCategory.description}
                      onChange={(e) => setEditingCategory({...editingCategory, description: e.target.value})}
                    />
                  ) : (
                    category.description
                  )}
                </TableCell>
                <TableCell>
                  {editingCategory && editingCategory.id === category.id ? (
                    <Button onClick={handleUpdateCategory} disabled={loading}>Save</Button>
                  ) : (
                    <Button onClick={() => setEditingCategory(category)} disabled={loading}>Edit</Button>
                  )}
                  <Button variant="destructive" onClick={() => handleDeleteCategory(category.id)} disabled={loading}>Delete</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
};

export default CategoryManagement;