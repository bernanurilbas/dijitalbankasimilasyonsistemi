import React from 'react';

const Unauthorized = () => {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="glass-panel p-8 rounded-lg max-w-sm w-full text-center">
        <h1 className="text-2xl font-bold mb-4 text-brand-danger">Erişim Engellendi</h1>
        <p className="text-brand-textSecondary mb-4">Bu sayfa için yetkiniz bulunmamaktadır.</p>
      </div>
    </div>
  );
};

export default Unauthorized;
