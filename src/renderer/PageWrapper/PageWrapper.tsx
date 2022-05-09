import React from 'react';

export default function PageWrapper({
  children,
}: {
  children: React.ReactElement;
}) {
  return (
    <div className="pagesMain" style={{ marginLeft: '201px' }}>
      {children}
    </div>
  );
}
