import React, { createContext, useContext, useState, ReactNode } from 'react';
import { OutLink, OutLinkFormData, OutLinkContextType } from '../types';

const OutLinkContext = createContext<OutLinkContextType | undefined>(undefined);

// 초기 샘플 데이터
const initialOutLinks: OutLink[] = [
  {
    id: '1',
    name: 'GPT 고객센터',
    description: 'GPT 고객지원 시스템',
    category: '고객센터',
    isApplied: true,
    userPageUrl: 'https://support.gptko.co.kr',
    adminPageUrl: 'https://admin.gptko.co.kr'
  },
  {
    id: '2',
    name: '파트너 포털',
    description: '파트너사 전용 관리 시스템',
    category: '파트너사',
    isApplied: false,
    userPageUrl: 'https://partner.gptko.co.kr',
    adminPageUrl: 'https://partner-admin.gptko.co.kr'
  },
  {
    id: '3',
    name: '내부 시스템',
    description: '직원 전용 내부 관리 도구',
    category: '내부시스템',
    isApplied: true,
    userPageUrl: 'https://internal.gptko.co.kr'
  }
];

export const OutLinkProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [outLinks, setOutLinks] = useState<OutLink[]>(initialOutLinks);

  const addOutLink = (outLinkData: OutLinkFormData) => {
    const newOutLink: OutLink = {
      ...outLinkData,
      id: Date.now().toString()
    };
    setOutLinks(prev => [...prev, newOutLink]);
  };

  const updateOutLink = (id: string, updates: Partial<OutLink>) => {
    setOutLinks(prev => 
      prev.map(link => 
        link.id === id ? { ...link, ...updates } : link
      )
    );
  };

  const deleteOutLink = (id: string) => {
    setOutLinks(prev => prev.filter(link => link.id !== id));
  };

  return (
    <OutLinkContext.Provider value={{
      outLinks,
      addOutLink,
      updateOutLink,
      deleteOutLink
    }}>
      {children}
    </OutLinkContext.Provider>
  );
};

export const useOutLink = () => {
  const context = useContext(OutLinkContext);
  if (context === undefined) {
    throw new Error('useOutLink must be used within an OutLinkProvider');
  }
  return context;
}; 