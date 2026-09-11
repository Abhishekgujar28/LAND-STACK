import React from 'react';

/**
 * UX4G Table Wrapper
 * @param {Array<{ key: string, title: string, render?: (val, row) => React.ReactNode }>} columns
 * @param {Array<Object>} data
 */
export const Table = ({
  columns = [],
  data = [],
  emptyMessage = 'No records found',
  className = '',
  keyField = 'id',
}) => {
  return (
    <div className={`ux4g-table-wrapper ${className}`.trim()}>
      <table className="ux4g-table">
        <thead>
          <tr>
            {columns.map((col, idx) => (
              <th key={col.key || idx} style={col.width ? { width: col.width } : undefined}>
                {col.title}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr>
              <td colSpan={columns.length} style={{ textAlign: 'center', padding: '2rem', color: 'var(--ux4g-text-muted)' }}>
                {emptyMessage}
              </td>
            </tr>
          ) : (
            data.map((row, rowIdx) => (
              <tr key={row[keyField] || rowIdx}>
                {columns.map((col, colIdx) => (
                  <td key={col.key || colIdx}>
                    {col.render ? col.render(row[col.key], row) : row[col.key]}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
