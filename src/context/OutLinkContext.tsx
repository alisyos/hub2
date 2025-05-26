import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { OutLink, OutLinkFormData, OutLinkContextType } from '../types';
import { GitHubDataService } from '../services/githubApi';

const OutLinkContext = createContext<OutLinkContextType | undefined>(undefined);

export const OutLinkProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [outLinks, setOutLinks] = useState<OutLink[]>([]);
  const [loading, setLoading] = useState(true);
  const githubService = GitHubDataService.getInstance();

  // 초기 데이터 로드
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const data = await githubService.getAgents();
        setOutLinks(data);
      } catch (error) {
        console.error('Failed to load agents:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [githubService]);

  const addOutLink = async (outLinkData: OutLinkFormData) => {
    const newOutLink: OutLink = {
      ...outLinkData,
      id: Date.now().toString()
    };
    
    const updatedLinks = [...outLinks, newOutLink];
    setOutLinks(updatedLinks);
    
    // GitHub에 저장 시도
    try {
      await githubService.updateAgents(updatedLinks);
    } catch (error) {
      console.error('Failed to save to GitHub:', error);
    }
  };

  const updateOutLink = async (id: string, updates: Partial<OutLink>) => {
    const updatedLinks = outLinks.map(link => 
      link.id === id ? { ...link, ...updates } : link
    );
    
    setOutLinks(updatedLinks);
    
    // GitHub에 저장 시도
    try {
      await githubService.updateAgents(updatedLinks);
    } catch (error) {
      console.error('Failed to save to GitHub:', error);
    }
  };

  const deleteOutLink = async (id: string) => {
    const updatedLinks = outLinks.filter(link => link.id !== id);
    setOutLinks(updatedLinks);
    
    // GitHub에 저장 시도
    try {
      await githubService.updateAgents(updatedLinks);
    } catch (error) {
      console.error('Failed to save to GitHub:', error);
    }
  };

  const refreshData = async () => {
    try {
      setLoading(true);
      githubService.invalidateCache();
      const data = await githubService.getAgents();
      setOutLinks(data);
    } catch (error) {
      console.error('Failed to refresh data:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <OutLinkContext.Provider value={{
      outLinks,
      addOutLink,
      updateOutLink,
      deleteOutLink,
      loading,
      refreshData
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