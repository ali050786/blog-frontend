import React, { useState, useEffect } from 'react';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "../../components/ui/command";
import { Badge } from "../../components/ui/badge";
import { X } from "lucide-react";
import { articlesApi } from '../../services/api';

const AutocompleteTag = ({ selectedTags = [], onTagsChange }) => {
  console.log("AutocompleteTag rendered with selectedTags:", selectedTags);
  const [inputValue, setInputValue] = useState('');
  const [availableTags, setAvailableTags] = useState([]);

  useEffect(() => {
    const fetchTags = async () => {
      try {
        const response = await articlesApi.getTags();
        setAvailableTags(response.data);
      } catch (error) {
        console.error('Failed to fetch tags:', error);
      }
    };
    fetchTags();
  }, []);

  const handleSelect = (tag) => {
    if (!selectedTags.includes(tag)) {
      onTagsChange([...selectedTags, tag]);
    }
    setInputValue('');
  };

  const handleRemove = (tag) => {
    onTagsChange(selectedTags.filter((t) => t !== tag));
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && inputValue && !availableTags.some(tag => tag.name.toLowerCase() === inputValue.toLowerCase())) {
      handleSelect(inputValue);
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-2">
        {selectedTags.map((tag) => (
          <Badge key={tag} variant="secondary" className="flex items-center gap-1">
            {tag}
            <X className="h-3 w-3 cursor-pointer" onClick={() => handleRemove(tag)} />
          </Badge>
        ))}
      </div>
      <Command className="border rounded-md">
        <CommandInput
          placeholder="Search or add tags..."
          value={inputValue}
          onValueChange={setInputValue}
          onKeyDown={handleKeyDown}
        />
        <CommandEmpty>No tags found. Press enter to add '{inputValue}'</CommandEmpty>
        <CommandGroup>
          {availableTags
            .filter((tag) => tag.name.toLowerCase().includes(inputValue.toLowerCase()))
            .map((tag) => (
              <CommandItem key={tag.id} onSelect={() => handleSelect(tag.name)}>
                {tag.name}
              </CommandItem>
            ))}
        </CommandGroup>
      </Command>
    </div>
  );
};

export default AutocompleteTag;