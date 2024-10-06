import React, { useState, useEffect } from 'react';
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/table";
import { Alert, AlertDescription } from "../../components/ui/alert";
import { tagsApi } from '../../services/api';

const TagManagement = () => {
  const [tags, setTags] = useState([]);
  const [newTagName, setNewTagName] = useState('');
  const [editingTag, setEditingTag] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    fetchTags();
  }, []);

  const fetchTags = async () => {
    try {
      setLoading(true);
      const response = await tagsApi.getAll();
      setTags(response || []);
      setError(null);
    } catch (err) {
      setError(err.message || 'Failed to fetch tags. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTag = async () => {
    if (!newTagName.trim()) {
      setError('Tag name cannot be empty');
      return;
    }
    try {
      setLoading(true);
      await tagsApi.create({ name: newTagName.trim() });
      setNewTagName('');
      setSuccess('Tag created successfully');
      fetchTags();
    } catch (err) {
      setError(err.message || 'Failed to create tag. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateTag = async () => {
    if (!editingTag.name.trim()) {
      setError('Tag name cannot be empty');
      return;
    }
    try {
      setLoading(true);
      await tagsApi.update(editingTag.id, { name: editingTag.name.trim() });
      setEditingTag(null);
      setSuccess('Tag updated successfully');
      fetchTags();
    } catch (err) {
      setError(err.message || 'Failed to update tag. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteTag = async (id) => {
    if (window.confirm('Are you sure you want to delete this tag? This action cannot be undone.')) {
      try {
        setLoading(true);
        await tagsApi.delete(id);
        setSuccess('Tag deleted successfully');
        fetchTags();
      } catch (err) {
        setError(err.message || 'Failed to delete tag. Please try again.');
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

  if (loading && tags.length === 0) return <div>Loading tags...</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-2xl font-semibold mb-6">Manage Tags</h2>
      
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
      
      <div className="mb-6 flex space-x-2">
        <Input
          placeholder="New tag name"
          value={newTagName}
          onChange={(e) => setNewTagName(e.target.value)}
        />
        <Button onClick={handleCreateTag} disabled={loading}>Create Tag</Button>
      </div>

      {tags.length === 0 ? (
        <p>No tags found.</p>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tags.map((tag) => (
              <TableRow key={tag.id}>
                <TableCell>
                  {editingTag && editingTag.id === tag.id ? (
                    <Input
                      value={editingTag.name}
                      onChange={(e) => setEditingTag({...editingTag, name: e.target.value})}
                    />
                  ) : (
                    tag.name
                  )}
                </TableCell>
                <TableCell>
                  {editingTag && editingTag.id === tag.id ? (
                    <Button onClick={handleUpdateTag} disabled={loading}>Save</Button>
                  ) : (
                    <Button onClick={() => setEditingTag(tag)} disabled={loading}>Edit</Button>
                  )}
                  <Button variant="destructive" onClick={() => handleDeleteTag(tag.id)} disabled={loading}>Delete</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
};

export default TagManagement;