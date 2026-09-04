import React from 'react';

/**
 * Accessible SkipToContent component
 */
export const SkipToContent = ({ contentId = 'main-content' }) => {
  return (
    <a href={`#${contentId}`} className="ux4g-skip-link">
      Skip to main content
    </a>
  );
};

export default SkipToContent;
