import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Alert, AlertDescription } from "../ui/alert";
import { Badge } from "../ui/badge";
import { articlesApi, categoriesApi, tagsApi } from '../../services/api';
import axios from 'axios';
import RichTextEditor from '../rich-text-editor';

const CreateArticle = () => {
    const navigate = useNavigate();

    const [article, setArticle] = useState({
        title: '',
        content: '',
        meta_description: '',
        category_id: '',
        tag_ids: [],
        author_id: localStorage.getItem('userId'),
        keywords: [],
        image: ''
    });
    const [categories, setCategories] = useState([]);
    const [tags, setTags] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [selectedFile, setSelectedFile] = useState(null);
    const [uploadedImageUrl, setUploadedImageUrl] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [categoriesResponse, tagsResponse] = await Promise.all([
                    categoriesApi.getAll(),
                    tagsApi.getAll()
                ]);
                setCategories(categoriesResponse || []);
                setTags(tagsResponse || []);
            } catch (err) {
                setError('Failed to fetch categories and tags. Please try again.');
            }
        };
        fetchData();
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setArticle({ ...article, [name]: value });
    };

    const handleCategoryChange = (value) => {
        setArticle({ ...article, category_id: value });
    };
    const handleContentChange = (content) => {
        setArticle({ ...article, content });
    };

    const handleTagChange = (tagId) => {
        const updatedTagIds = article.tag_ids.includes(tagId)
            ? article.tag_ids.filter(id => id !== tagId)
            : [...article.tag_ids, tagId];
        setArticle({ ...article, tag_ids: updatedTagIds });
    };

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
            const response = await axios.post('https://minimal-flask-vercel.vercel.app/api/images/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
            });

            setUploadedImageUrl(response.data.url);
            setArticle({ ...article, image: response.data.url });
            setError(null);
        } catch (error) {
            setError('Error uploading the image. Please try again.');
            console.error('Error uploading the image:', error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        try {
            await articlesApi.create(article);
            navigate('/admin/articles');
        } catch (err) {
            setError(err.message || 'Failed to create article. Please try again.');
        } finally {
            setLoading(false);
        }
    };


    return (
        <div className="container mx-auto px-4 py-8">
            <h2 className="text-2xl font-semibold mb-6">Create New Article</h2>
            
            {error && (
                <Alert variant="destructive" className="mb-4">
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
            )}
            
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <Label htmlFor="title">Title</Label>
                    <Input
                        id="title"
                        name="title"
                        value={article.title}
                        onChange={handleInputChange}
                        required
                    />
                </div>
                <div>
                    <Label htmlFor="meta_description">Meta Description</Label>
                    <Input
                        id="meta_description"
                        name="meta_description"
                        value={article.meta_description}
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
                    {uploadedImageUrl && (
                        <img src={uploadedImageUrl} alt="Uploaded" className="mt-2 max-w-xs" />
                    )}
                </div>
                <div>
                    <Label htmlFor="category">Category</Label>
                    <Select onValueChange={handleCategoryChange} value={article.category_id}>
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
                <div className="flex justify-end space-x-2">
                    <Button type="button" variant="outline" onClick={() => navigate('/admin/articles')}>Cancel</Button>
                    <Button type="submit" disabled={loading}>
                        {loading ? 'Creating...' : 'Create Article'}
                    </Button>
                </div>
            </form>
        </div>
    );
};

export default CreateArticle;