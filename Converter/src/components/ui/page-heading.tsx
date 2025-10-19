"use client";
import React from 'react';

export default function PageHeading({ title }: { title: string }) {
  return (
    <div className="max-w-4xl mx-auto px-4 pt-6">
      <div className="h-1.5 w-24 rounded-full bg-brand.indigo/80 mb-3" />
      <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
        {title}
      </h1>
    </div>
  );
}