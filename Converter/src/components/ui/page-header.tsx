"use client";
import React from "react";

interface PageHeaderProps {
  title: string;
  description?: string;
  className?: string;
}

export default function PageHeader({ title, description, className }: PageHeaderProps) {
  const base = "relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8";
  const containerClass = className ? `${base} ${className}` : base;

  return (
    <div className={containerClass}>
      <div aria-hidden="true" className="h-1 w-full rounded-full bg-gradient-to-r from-blue-600 to-blue-700 dark:from-blue-400 dark:to-blue-500 mb-4" />
      <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-900 dark:text-white">{title}</h1>
      {description ? (
        <p className="mt-2 text-sm sm:text-base text-gray-600 dark:text-gray-300 max-w-3xl">{description}</p>
      ) : null}
    </div>
  );
}