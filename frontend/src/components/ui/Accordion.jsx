import React, { useState } from 'react';

/**
 * UX4G Accordion Wrapper
 * @param {Array<{ id: string, title: string, content: React.ReactNode }>} items
 */
export const Accordion = ({ items = [], allowMultiple = false, className = '' }) => {
  const [openIds, setOpenIds] = useState([]);

  const toggle = (id) => {
    if (allowMultiple) {
      setOpenIds((prev) =>
        prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
      );
    } else {
      setOpenIds((prev) => (prev.includes(id) ? [] : [id]));
    }
  };

  return (
    <div className={`ux4g-accordion ${className}`.trim()}>
      {items.map((item) => {
        const isOpen = openIds.includes(item.id);
        return (
          <div key={item.id} className="ux4g-accordion-item">
            <button
              type="button"
              className="ux4g-accordion-header"
              onClick={() => toggle(item.id)}
              aria-expanded={isOpen}
            >
              <span>{item.title}</span>
              <span>{isOpen ? '−' : '+'}</span>
            </button>
            {isOpen && <div className="ux4g-accordion-content">{item.content}</div>}
          </div>
        );
      })}
    </div>
  );
};

export default Accordion;
