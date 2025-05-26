import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { OutLink, OutLinkFormData, OutLinkContextType } from '../types';
import { GitHubDataService } from '../services/githubApi';

const OutLinkContext = createContext<OutLinkContextType | undefined>(undefined);

export const OutLinkProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [outLinks, setOutLinks] = useState<OutLink[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const githubService = GitHubDataService.getInstance();

  // 초기 데이터 로드
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await githubService.getAgents();
        setOutLinks(data);
      } catch (error) {
        console.error('Failed to load agents:', error);
        setError('데이터를 불러오는데 실패했습니다.');
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
      setSaving(true);
      setError(null);
      const success = await githubService.updateAgents(updatedLinks);
      if (!success) {
        setError('GitHub 토큰이 설정되지 않아 로컬에만 저장되었습니다.');
      }
    } catch (error) {
      console.error('Failed to save to GitHub:', error);
      setError('저장 중 오류가 발생했습니다.');
    } finally {
      setSaving(false);
    }
  };

  const updateOutLink = async (id: string, updates: Partial<OutLink>) => {
    const updatedLinks = outLinks.map(link => 
      link.id === id ? { ...link, ...updates } : link
    );
    
    setOutLinks(updatedLinks);
    
    // GitHub에 저장 시도
    try {
      setSaving(true);
      setError(null);
      const success = await githubService.updateAgents(updatedLinks);
      if (!success) {
        setError('GitHub 토큰이 설정되지 않아 로컬에만 저장되었습니다.');
      }
    } catch (error) {
      console.error('Failed to save to GitHub:', error);
      setError('저장 중 오류가 발생했습니다.');
    } finally {
      setSaving(false);
    }
  };

  const deleteOutLink = async (id: string) => {
    const updatedLinks = outLinks.filter(link => link.id !== id);
    setOutLinks(updatedLinks);
    
    // GitHub에 저장 시도
    try {
      setSaving(true);
      setError(null);
      const success = await githubService.updateAgents(updatedLinks);
      if (!success) {
        setError('GitHub 토큰이 설정되지 않아 로컬에만 저장되었습니다.');
      }
    } catch (error) {
      console.error('Failed to save to GitHub:', error);
      setError('저장 중 오류가 발생했습니다.');
    } finally {
      setSaving(false);
    }
  };

  const refreshData = async () => {
    try {
      setLoading(true);
      setError(null);
      githubService.invalidateCache();
      const data = await githubService.getAgents();
      setOutLinks(data);
    } catch (error) {
      console.error('Failed to refresh data:', error);
      setError('데이터 새로고침에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const clearError = () => {
    setError(null);
  };

  return (
    <OutLinkContext.Provider value={{
      outLinks,
      addOutLink,
      updateOutLink,
      deleteOutLink,
      loading,
      refreshData,
      error,
      saving,
      clearError
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