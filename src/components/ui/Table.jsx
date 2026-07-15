import React from 'react';

const Table = ({ 
  headers = [], 
  children, 
  className = '' 
}) => {
  return (
    <div className={`w-full overflow-x-auto ${className}`}>
      <table className="w-full border-collapse text-left">
        <thead>
          <tr className="border-b border-white/5">
            {headers.map((header, idx) => (
              <th 
                key={idx} 
                className="pb-4 pt-2 px-4 text-xs font-bold uppercase tracking-wider text-brand-textSecondary"
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-white/[0.02]">
          {children}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
