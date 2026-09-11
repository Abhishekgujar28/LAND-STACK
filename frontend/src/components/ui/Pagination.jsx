import React from 'react';

/**
 * UX4G Pagination Wrapper
 */
export const Pagination = ({
  currentPage = 1,
  totalPages = 1,
  onPageChange,
  className = '',
}) => {
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <nav aria-label="Pagination Navigation">
      <ul className={`ux4g-pagination ${className}`.trim()}>
        <li className="ux4g-page-item">
          <button
            type="button"
            className="ux4g-page-btn"
            disabled={currentPage === 1}
            onClick={() => onPageChange(currentPage - 1)}
            aria-label="Previous Page"
          >
            &laquo; Prev
          </button>
        </li>
        {pages.map((page) => (
          <li key={page} className="ux4g-page-item">
            <button
              type="button"
              className={`ux4g-page-btn ${page === currentPage ? 'active' : ''}`}
              onClick={() => onPageChange(page)}
              aria-current={page === currentPage ? 'page' : undefined}
            >
              {page}
            </button>
          </li>
        ))}
        <li className="ux4g-page-item">
          <button
            type="button"
            className="ux4g-page-btn"
            disabled={currentPage === totalPages}
            onClick={() => onPageChange(currentPage + 1)}
            aria-label="Next Page"
          >
            Next &raquo;
          </button>
        </li>
      </ul>
    </nav>
  );
};

export default Pagination;
