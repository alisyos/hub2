import React, { useState } from 'react';
import { ExternalLink, Settings, CheckCircle, XCircle, RefreshCw } from 'lucide-react';
import { useOutLink } from '../context/OutLinkContext';
import { OutLink } from '../types';

const UserPage: React.FC = () => {
  const { outLinks, loading, refreshData } = useOutLink();
  const [selectedCategory, setSelectedCategory] = useState<string>('전체');
  const [refreshing, setRefreshing] = useState(false);

  const categories = ['전체', ...Array.from(new Set(outLinks.map(link => link.category)))];
  
  const filteredLinks = selectedCategory === '전체' 
    ? outLinks 
    : outLinks.filter(link => link.category === selectedCategory);

  const handleUserPageClick = (url: string) => {
    window.open(url, '_blank');
  };

  const handleAdminPageClick = (url?: string) => {
    if (url) {
      window.open(url, '_blank');
    }
  };

  const handleAppliedClick = () => {
    window.open('https://agent.gptko.co.kr/agent', '_blank');
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await refreshData();
    setRefreshing(false);
  };

  if (loading) {
    return (
      <div className="bg-gray-50 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <span className="ml-3 text-gray-600">데이터를 불러오는 중...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">AI Agent Hub PoC</h1>
            <p className="text-gray-600">다양한 AI 에이전트 서비스에 쉽게 접근하세요</p>
          </div>
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
            새로고침
          </button>
        </div>

        {/* 카테고리 필터 */}
        <div className="mb-6">
          <div className="flex flex-wrap gap-2">
            {categories.map(category => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  selectedCategory === category
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Agent 카드 목록 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredLinks.map((link: OutLink) => (
            <div key={link.id} className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200">
              <div className="p-6">
                {/* 헤더 영역 */}
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{link.name}</h3>
                    <p className="text-sm text-gray-600 mb-3">{link.description}</p>
                  </div>
                </div>

                {/* 카테고리 및 상태 */}
                <div className="flex justify-between items-center mb-4">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {link.category}
                  </span>
                  <div className="flex items-center">
                    {link.isApplied ? (
                      <>
                        <CheckCircle className="h-4 w-4 text-green-500 mr-1" />
                        <span className="text-xs text-green-700 font-medium">적용완료</span>
                      </>
                    ) : (
                      <>
                        <XCircle className="h-4 w-4 text-red-500 mr-1" />
                        <span className="text-xs text-red-700 font-medium">미적용</span>
                      </>
                    )}
                  </div>
                </div>

                {/* 액션 버튼들 */}
                <div className="space-y-2">
                  <button
                    onClick={() => handleUserPageClick(link.userPageUrl)}
                    className="w-full inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                  >
                    <ExternalLink className="h-4 w-4 mr-2" />
                    사용자 페이지
                  </button>
                  
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleAdminPageClick(link.adminPageUrl)}
                      disabled={!link.adminPageUrl}
                      className={`flex-1 inline-flex items-center justify-center px-3 py-2 border border-transparent text-sm font-medium rounded-md transition-colors ${
                        link.adminPageUrl
                          ? 'text-white bg-gray-600 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500'
                          : 'text-gray-400 bg-gray-200 cursor-not-allowed'
                      }`}
                    >
                      <Settings className="h-4 w-4 mr-1" />
                      관리자
                    </button>

                    {link.isApplied && (
                      <button
                        onClick={handleAppliedClick}
                        className="flex-1 inline-flex items-center justify-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors"
                      >
                        <CheckCircle className="h-4 w-4 mr-1" />
                        적용완료
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredLinks.length === 0 && (
          <div className="text-center py-12">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
              <p className="text-gray-500 text-lg">해당 카테고리에 등록된 서비스가 없습니다.</p>
              <p className="text-gray-400 text-sm mt-2">다른 카테고리를 선택해보세요.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserPage; 