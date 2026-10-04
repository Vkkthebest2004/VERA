'use client';

import React from 'react';
import { CompanyData } from '@/data/mockCompanies';
import { VeraAssistantDrawer } from '@/components/VeraAssistantDrawer';

interface VeraEvidenceSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  selectedCompany: CompanyData;
  initialClaim?: string;
  defaultMode?: 'chat' | 'evidence';
}

export const VeraEvidenceSidebar: React.FC<VeraEvidenceSidebarProps> = ({
  isOpen,
  onClose,
  selectedCompany,
  initialClaim = '',
  defaultMode = 'evidence',
}) => {
  const [activeMode, setActiveMode] = React.useState<'chat' | 'evidence'>(defaultMode);

  React.useEffect(() => {
    if (defaultMode) {
      setActiveMode(defaultMode);
    }
  }, [defaultMode, isOpen]);

  return (
    <VeraAssistantDrawer
      isOpen={isOpen}
      onClose={onClose}
      selectedCompany={selectedCompany}
      activeMode={activeMode}
      onModeChange={setActiveMode}
      initialClaim={initialClaim}
    />
  );
};
