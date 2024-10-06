import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Badge } from "../ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Alert, AlertDescription } from "../ui/alert";
import { articlesApi, categoriesApi, tagsApi } from '../../services/api';
import axios from 'axios';
import RichTextEditor from '../rich-text-editor';

const EditArticle = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [selectedFile, setSelectedFile] = useState(null);
    const [uploadedImageUrl, setUploadedImageUrl] = useState('');
    const [article, setArticle] = useState({
        title: '',
        content: '',
        meta_description: '',
        category_id: '',
        tag_ids: [],
        author_id: localStorage.getItem('userId'),
        image: '',
        keywords: []
    });
    const [categories, setCategories] = useState([]);
    const [tags, setTags] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            setError(null);
            try {
                // Fetch article data
                const articleResponse = await articlesApi.getById(id);
                setArticle(prevArticle => ({
                    ...prevArticle,
                    ...articleResponse.data,
                    tag_ids: Array.isArray(articleResponse.data.tags)
                        ? articleResponse.data.tags.map(tag => tag.id)
                        : []
                }));

                // Fetch categories
                const categoriesResponse = await categoriesApi.getAll();
                setCategories(categoriesResponse || []);

                // Fetch tags
                const tagsResponse = await tagsApi.getAll();
                setTags(tagsResponse || []);

            } catch (error) {
                setError(error.message || 'An error occurred while fetching data');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [id]);

    const handleContentChange = useCallback((content) => {
        setArticle(prev => ({ ...prev, content }));
    }, []);

    const handleFileChange = (event) => {
        setSelectedFile(event.target.files[0]);
    };

    const handleImageUpload = async () => {
        if (!selectedFile) {
            setError('Please select an image to upload.');
            return;
        }

        const formData = new FormData();
        formData.append('file', selectedFile);

        try {
            const response = await axios.post('http://localhost:5000/api/images/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
            });

            setUploadedImageUrl(response.data.url);
            setArticle({ ...article, image: response.data.url });
            setError(null);
            setSuccess('Image uploaded successfully');
        } catch (error) {
            setError('Error uploading the image. Please try again.');
            console.error('Error uploading the image:', error);
        }
    };

    const handleInputChange = useCallback((e) => {
        const { name, value } = e.target;
        setArticle(prev => ({ ...prev, [name]: value }));
    }, []);

    const handleCategoryChange = useCallback((value) => {
        setArticle(prev => ({ ...prev, category_id: value }));
    }, []);

    const handleTagChange = useCallback((value) => {
        setArticle(prev => {
            const updatedTagIds = prev.tag_ids.includes(value)
                ? prev.tag_ids.filter(id => id !== value)
                : [...prev.tag_ids, value];
            return { ...prev, tag_ids: updatedTagIds };
        });
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        setError(null);
        setSuccess(null);

        try {
            await articlesApi.update(id, article);
            setSuccess('Article updated successfully');
            setTimeout(() => navigate('/admin/articles'), 2000);
        } catch (err) {
            setError(err.message || 'Failed to update article. Please try again.');
        } finally {
            setSaving(false);
        }
    };


    if (loading) return <div>Loading article...</div>;

    return (
        <div className="container mx-auto px-4 py-8">
            <h2 className="text-2xl font-semibold mb-6">Edit Article</h2>

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

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <Label htmlFor="title">Title</Label>
                    <Input
                        id="title"
                        name="title"
                        value={article.title || ''}
                        onChange={handleInputChange}
                        required
                    />
                </div>

                <div>
                    <Label htmlFor="content">Content</Label>
                    <RichTextEditor
                        value={article.content}
                        onChange={handleContentChange}
                        placeholder="Write your article content here..."
                    />
                </div>

                <div>
                    <Label htmlFor="meta_description">Meta Description</Label>
                    <Input
                        id="meta_description"
                        name="meta_description"
                        value={article.meta_description || ''}
                        onChange={handleInputChange}
                    />
                </div>

                <div>
                    <Label htmlFor="category">Category</Label>
                    <Select onValueChange={handleCategoryChange} value={article.category_id || ''}>
                        <SelectTrigger>
                            <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                        <SelectContent>
                            {categories.map((category) => (
                                <SelectItem key={category.id} value={category.id}>{category.name}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                <div>
                    <Label htmlFor="tags">Tags</Label>
                    <div className="flex flex-wrap gap-2 mt-2">
                        {tags.map((tag) => (
                            <Badge
                                key={tag.id}
                                variant={article.tag_ids.includes(tag.id) ? "default" : "outline"}
                                className="cursor-pointer"
                                onClick={() => handleTagChange(tag.id)}
                            >
                                {tag.name}
                            </Badge>
                        ))}
                    </div>
                </div>


                <div>
                    <Label htmlFor="image">Image</Label>
                    <Input
                        type="file"
                        id="image"
                        onChange={handleFileChange}
                        accept="image/*"
                    />
                    <Button type="button" onClick={handleImageUpload} className="mt-2">
                        Upload Image
                    </Button>
                    {(uploadedImageUrl || article.image) && (
                        <img src={uploadedImageUrl || article.image} alt="Article" className="mt-2 max-w-xs" />
                    )}
                </div>

                <div>
                    <Label htmlFor="keywords">Keywords (comma-separated)</Label>
                    <Input
                        id="keywords"
                        name="keywords"
                        value={(article.keywords || []).join(', ')}
                        onChange={(e) => setArticle(prev => ({ ...prev, keywords: e.target.value.split(',').map(k => k.trim()) }))}
                    />
                </div>

                <div className="flex justify-end space-x-2">
                    <Button type="button" variant="outline" onClick={() => navigate('/admin/articles')}>Cancel</Button>
                    <Button type="submit" disabled={saving || loading}>
                        {saving ? 'Saving...' : 'Update Article'}
                    </Button>
                </div>
            </form>
        </div>
    );
};

export default EditArticle;