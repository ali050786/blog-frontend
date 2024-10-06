import React from 'react';
import { Badge } from "./ui/badge";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "./ui/command";
import { X } from "lucide-react";

const TagSelector = ({ selectedTags = [], availableTags = [], onTagsChange }) => {
  const handleSelect = (tag) => {
    if (!selectedTags.includes(tag.id)) {
      onTagsChange([...selectedTags, tag.id]);
    }
  };

  const handleRemove = (tagId) => {
    onTagsChange(selectedTags.filter((id) => id !== tagId));
  };

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-2">
        {selectedTags.map((tagId) => {
          const tag = availableTags.find(t => t.id === tagId);
          return tag ? (
            <Badge key={tagId} variant="secondary" className="flex items-center gap-1">
              {tag.name}
              <X 
                className="h-3 w-3 cursor-pointer" 
                onClick={() => handleRemove(tagId)}
              />
            </Badge>
          ) : null;
        })}
      </div>
      <Command className="border rounded-md">
        <CommandInput placeholder="Search tags..." />
        <CommandEmpty>No tags found.</CommandEmpty>
        <CommandGroup>
          {availableTags.map((tag) => (
            <CommandItem 
              key={tag.id} 
              onSelect={() => handleSelect(tag)}
              className="cursor-pointer"
            >
              {tag.name}
            </CommandItem>
          ))}
        </CommandGroup>
      </Command>
    </div>
  );
};

export default TagSelector;