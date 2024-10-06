// src/components/ui/card.jsx
import React from 'react';

const Card = ({ className, ...props }) => (
  <div className={`bg-white rounded-lg shadow card-glass ${className}`} {...props} />
);

const CardHeader = ({ className, ...props }) => (
  <div className={`p-6 ${className}`} {...props} />
);

const CardTitle = ({ className, ...props }) => (
  <h3 className={`text-2xl font-bold ${className}`} {...props} />
);

const CardContent = ({ className, ...props }) => (
  <div className={`p-6 pt-0 ${className}`} {...props} />
);

const CardFooter = ({ className, ...props }) => (
  <div className={`p-6 pt-0 ${className}`} {...props} />
);

export { Card, CardHeader, CardTitle, CardContent, CardFooter };