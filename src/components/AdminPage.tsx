import React, { useState } from 'react';
import { Plus, Edit2, Trash2, CheckCircle, XCircle, Save, X, ChevronDown } from 'lucide-react';
import { useOutLink } from '../context/OutLinkContext';
import { OutLink, OutLinkFormData, AgentStatus } from '../types';

const AdminPage: React.FC = () => {
  const { outLinks, addOutLink, updateOutLink, deleteOutLink, loading, error, saving, clearError } = useOutLink();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<OutLinkFormData>({
    name: '',
    description: '',
    category: '',
    status: '검토&수정 중',
    userPageUrl: '',
    adminPageUrl: ''
  });

  const statusOptions: AgentStatus[] = ['적용완료', '검토&수정 중', '검토완료'];

  const getStatusColor = (status: AgentStatus) => {
    switch (status) {
      case '적용완료':
        return 'bg-green-100 text-green-800';
      case '검토완료':
        return 'bg-blue-100 text-blue-800';
      case '검토&수정 중':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: AgentStatus) => {
    switch (status) {
      case '적용완료':
        return <CheckCircle className="h-4 w-4 mr-1" />;
      case '검토완료':
        return <CheckCircle className="h-4 w-4 mr-1" />;
      case '검토&수정 중':
        return <XCircle className="h-4 w-4 mr-1" />;
      default:
        return <XCircle className="h-4 w-4 mr-1" />;
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      category: '',
      status: '검토&수정 중',
      userPageUrl: '',
      adminPageUrl: ''
    });
    setEditingId(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (editingId) {
        await updateOutLink(editingId, formData);
      } else {
        await addOutLink(formData);
      }
      
      setIsModalOpen(false);
      resetForm();
    } catch (error) {
      console.error('Failed to save:', error);
    }
  };

  const handleEdit = (link: OutLink) => {
    setFormData({
      name: link.name,
      description: link.description,
      category: link.category,
      status: link.status,
      userPageUrl: link.userPageUrl,
      adminPageUrl: link.adminPageUrl || ''
    });
    setEditingId(link.id);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('정말로 이 아웃링크를 삭제하시겠습니까?')) {
      try {
        await deleteOutLink(id);
      } catch (error) {
        console.error('Failed to delete:', error);
      }
    }
  };

  const handleStatusChange = async (id: string, newStatus: AgentStatus) => {
    try {
      await updateOutLink(id, { status: newStatus });
    } catch (error) {
      console.error('Failed to update status:', error);
    }
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
            <h1 className="text-3xl font-bold text-gray-900 mb-2">AI Agent Hub 관리</h1>
            <p className="text-gray-600">AI 에이전트 서비스 링크를 등록하고 관리하세요</p>
          </div>
          <button
            onClick={() => {
              resetForm();
              setIsModalOpen(true);
            }}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <Plus className="h-4 w-4 mr-2" />
            새 Agent 추가
          </button>
        </div>

        {/* 오류 및 상태 표시 */}
        {error && (
          <div className="mb-4 bg-red-50 border border-red-200 rounded-md p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <XCircle className="h-5 w-5 text-red-400" />
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-800">{error}</p>
              </div>
              <div className="ml-auto pl-3">
                <div className="-mx-1.5 -my-1.5">
                  <button
                    onClick={clearError}
                    className="inline-flex bg-red-50 rounded-md p-1.5 text-red-500 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-red-50 focus:ring-red-600"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {saving && (
          <div className="mb-4 bg-blue-50 border border-blue-200 rounded-md p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
              </div>
              <div className="ml-3">
                <p className="text-sm text-blue-800">저장 중...</p>
              </div>
            </div>
          </div>
        )}

        {/* 아웃링크 목록 */}
        <div className="bg-white shadow-sm rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/3">
                    서비스 정보
                  </th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/6">
                    카테고리
                  </th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/4">
                    URL
                  </th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/6">
                    상태
                  </th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/12">
                    액션
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {outLinks.map((link: OutLink) => (
                  <tr key={link.id} className="hover:bg-gray-50">
                    <td className="px-3 py-4">
                      <div>
                        <div className="text-sm font-medium text-gray-900 truncate max-w-xs">{link.name}</div>
                        <div className="text-xs text-gray-500 truncate max-w-xs">{link.description}</div>
                      </div>
                    </td>
                    <td className="px-3 py-4">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 truncate max-w-full">
                        {link.category}
                      </span>
                    </td>
                    <td className="px-3 py-4 text-xs text-gray-500">
                      <div className="space-y-1">
                        <div className="flex items-center">
                          <span className="text-gray-400 mr-1">U:</span>
                          <a href={link.userPageUrl} target="_blank" rel="noopener noreferrer" 
                             className="text-blue-600 hover:text-blue-800 truncate max-w-44" 
                             title={link.userPageUrl}>
                            {link.userPageUrl.replace(/^https?:\/\//, '').split('/')[0]}
                          </a>
                        </div>
                        {link.adminPageUrl && (
                          <div className="flex items-center">
                            <span className="text-gray-400 mr-1">A:</span>
                            <a href={link.adminPageUrl} target="_blank" rel="noopener noreferrer" 
                               className="text-purple-600 hover:text-purple-800 truncate max-w-44" 
                               title={link.adminPageUrl}>
                              {link.adminPageUrl.replace(/^https?:\/\//, '').split('/')[0]}
                            </a>
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-3 py-4">
                      <div className="relative inline-block w-full">
                        <select
                          value={link.status}
                          onChange={(e) => handleStatusChange(link.id, e.target.value as AgentStatus)}
                          className={`w-full px-2 py-1 rounded text-xs font-medium border cursor-pointer focus:outline-none focus:ring-1 focus:ring-blue-500 ${getStatusColor(link.status)}`}
                        >
                          {statusOptions.map((status) => (
                            <option key={status} value={status}>
                              {status}
                            </option>
                          ))}
                        </select>
                      </div>
                    </td>
                    <td className="px-3 py-4 text-sm font-medium">
                      <div className="flex space-x-1">
                        <button
                          onClick={() => handleEdit(link)}
                          className="inline-flex items-center p-1.5 border border-transparent rounded text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-1 focus:ring-blue-500"
                          title="수정"
                        >
                          <Edit2 className="h-3 w-3" />
                        </button>
                        
                        <button
                          onClick={() => handleDelete(link.id)}
                          className="inline-flex items-center p-1.5 border border-transparent rounded text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-1 focus:ring-red-500"
                          title="삭제"
                        >
                          <Trash2 className="h-3 w-3" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {outLinks.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">등록된 아웃링크가 없습니다. 새로운 아웃링크를 추가해보세요.</p>
          </div>
        )}
      </div>

      {/* 모달 */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-900">
                  {editingId ? 'Agent 수정' : '새 Agent 추가'}
                </h3>
                <button
                  onClick={() => {
                    setIsModalOpen(false);
                    resetForm();
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    서비스 명칭 *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="예: GPT 고객센터"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    설명 *
                  </label>
                  <textarea
                    required
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="서비스에 대한 간단한 설명"
                    rows={3}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    카테고리 *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="예: 고객센터, 파트너사, 내부시스템 등"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    사용자 페이지 URL *
                  </label>
                  <input
                    type="url"
                    required
                    value={formData.userPageUrl}
                    onChange={(e) => setFormData({ ...formData, userPageUrl: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="https://example.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    관리자 페이지 URL (선택)
                  </label>
                  <input
                    type="url"
                    value={formData.adminPageUrl}
                    onChange={(e) => setFormData({ ...formData, adminPageUrl: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="https://admin.example.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    적용 상태 *
                  </label>
                  <select
                    required
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as AgentStatus })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {statusOptions.map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setIsModalOpen(false);
                      resetForm();
                    }}
                    className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    취소
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                  >
                    <Save className="h-4 w-4 mr-2" />
                    {saving ? '저장 중...' : (editingId ? '수정' : '추가')}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPage; 