import React, { useState } from 'react';
import { ExternalLink, Settings, CheckCircle, XCircle, RefreshCw, Clock } from 'lucide-react';
import { useOutLink } from '../context/OutLinkContext';
import { OutLink, AgentStatus } from '../types';

const UserPage: React.FC = () => {
  const { outLinks, loading, refreshData } = useOutLink();
  const [selectedCategory, setSelectedCategory] = useState<string>('전체');
  const [selectedStatus, setSelectedStatus] = useState<string>('전체');
  const [refreshing, setRefreshing] = useState(false);

  const categories = ['전체', ...Array.from(new Set(outLinks.map(link => link.category)))];
  const statusOptions = ['전체', '적용완료', '검토완료', '검토&수정 중'];
  
  const filteredLinks = outLinks.filter(link => {
    const categoryMatch = selectedCategory === '전체' || link.category === selectedCategory;
    const statusMatch = selectedStatus === '전체' || link.status === selectedStatus;
    return categoryMatch && statusMatch;
  });

  const getStatusDisplay = (status: AgentStatus) => {
    switch (status) {
      case '적용완료':
        return {
          icon: <CheckCircle className="h-4 w-4 text-green-500 mr-1" />,
          text: '적용완료',
          textColor: 'text-green-700'
        };
      case '검토완료':
        return {
          icon: <CheckCircle className="h-4 w-4 text-blue-500 mr-1" />,
          text: '검토완료',
          textColor: 'text-blue-700'
        };
      case '검토&수정 중':
        return {
          icon: <Clock className="h-4 w-4 text-yellow-500 mr-1" />,
          text: '검토&수정 중',
          textColor: 'text-yellow-700'
        };
      default:
        return {
          icon: <XCircle className="h-4 w-4 text-red-500 mr-1" />,
          text: '미적용',
          textColor: 'text-red-700'
        };
    }
  };

  const getCardBackgroundColor = (status: AgentStatus) => {
    switch (status) {
      case '적용완료':
        return 'bg-gray-100';
      case '검토완료':
        return 'bg-green-100';
      case '검토&수정 중':
        return 'bg-red-100';
      default:
        return 'bg-white';
    }
  };

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
        {/* 필터 및 새로고침 영역 */}
        <div className="mb-6">
          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-end lg:justify-between">
            {/* 필터 영역 */}
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-end">
              {/* 카테고리 필터 */}
              <div className="w-full sm:w-auto">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  카테고리
                </label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full sm:w-48 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                >
                  {categories.map(category => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>

              {/* 상태 필터 */}
              <div className="w-full sm:w-auto">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  적용 상태
                </label>
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="w-full sm:w-48 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                >
                  {statusOptions.map(status => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
              </div>

              {/* 필터 초기화 버튼 */}
              {(selectedCategory !== '전체' || selectedStatus !== '전체') && (
                <button
                  onClick={() => {
                    setSelectedCategory('전체');
                    setSelectedStatus('전체');
                  }}
                  className="w-full sm:w-auto px-4 py-2 text-sm font-medium text-gray-600 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-colors"
                >
                  필터 초기화
                </button>
              )}
            </div>

            {/* 새로고침 버튼 */}
            <div className="w-full lg:w-auto">
              <button
                onClick={handleRefresh}
                disabled={refreshing}
                className="w-full lg:w-auto inline-flex items-center justify-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
                새로고침
              </button>
            </div>
          </div>
        </div>

        {/* 검색 결과 정보 */}
        {(selectedCategory !== '전체' || selectedStatus !== '전체') && (
          <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-800">
              <span className="font-medium">필터 적용됨:</span>
              {selectedCategory !== '전체' && ` 카테고리 "${selectedCategory}"`}
              {selectedCategory !== '전체' && selectedStatus !== '전체' && ','}
              {selectedStatus !== '전체' && ` 상태 "${selectedStatus}"`}
              {` • 총 ${filteredLinks.length}개 결과`}
            </p>
          </div>
        )}

        {/* Agent 카드 목록 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredLinks.map((link: OutLink) => (
            <div key={link.id} className={`${getCardBackgroundColor(link.status)} rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200`}>
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
                    {getStatusDisplay(link.status).icon}
                    <span className={`text-xs font-medium ${getStatusDisplay(link.status).textColor}`}>
                      {getStatusDisplay(link.status).text}
                    </span>
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

                    {link.status === '적용완료' && (
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