import React from 'react';
import { Menu } from 'lucide-react';

const Sidebar: React.FC = () => {
  return (
    <div className="fixed left-0 top-0 h-full w-16 bg-gray-800 text-white flex flex-col items-center py-4">
      <Menu className="w-8 h-8 mb-8" />
      <nav>
        <ul className="space-y-4">
          <li className="w-8 h-8 bg-gray-700 rounded-full"></li>
          <li className="w-8 h-8 bg-gray-700 rounded-full"></li>
          <li className="w-8 h-8 bg-gray-700 rounded-full"></li>
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;