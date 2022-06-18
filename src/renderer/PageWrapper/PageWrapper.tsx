import React from 'react';
import { useLocation } from 'react-router-dom';
import { CollapsedSidebarRoutes } from '../routePaths';

const leftMargins = {
  default: 201,
  min: 10,
};

export default function PageWrapper({
  children,
}: {
  children: React.ReactElement;
}) {
  const { pathname } = useLocation();

  const left = CollapsedSidebarRoutes.includes(pathname)
    ? leftMargins.min
    : leftMargins.default;

  return (
    <div className="pagesMain" style={{ marginLeft: `${left}px` }}>
      {children}
    </div>
  );
}
