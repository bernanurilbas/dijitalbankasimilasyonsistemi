import React from 'react';

const Tabs = ({ 
  items = [], 
  activeTabId, 
  onTabChange 
}) => {
  return (
    <div className="w-full">
      {/* Tabs Headers */}
      <div className="flex border-b border-white/5 gap-1 mb-6 overflow-x-auto">
        {items.map((tab) => {
          const isActive = tab.id === activeTabId;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`px-4 py-3 text-sm font-semibold border-b-2 transition-all whitespace-nowrap focus:outline-none ${isActive ? 'border-brand-primary text-brand-primary' : 'border-transparent text-brand-textSecondary hover:text-brand-textPrimary'}`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Tabs Active Content */}
      <div className="w-full">
        {items.find(t => t.id === activeTabId)?.content}
      </div>
    </div>
  );
};

export default Tabs;
