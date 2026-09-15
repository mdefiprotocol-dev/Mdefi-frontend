import React from 'react';
import { HubModule } from '../../data/hubModulesData';
import { HubModuleCard } from './HubModuleCard';

interface HubModuleGridProps {
  modules: HubModule[];
  onSelectModule: (module: HubModule) => void;
}

export const HubModuleGrid: React.FC<HubModuleGridProps> = ({ modules, onSelectModule }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 w-full max-w-7xl mx-auto">
      {modules.map((module) => (
        <HubModuleCard
          key={module.id}
          module={module}
          onClick={onSelectModule}
        />
      ))}
    </div>
  );
};
