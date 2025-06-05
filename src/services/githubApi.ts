import { OutLink } from '../types';

const GITHUB_API_BASE = 'https://api.github.com';
const REPO_OWNER = 'alisyos';
const REPO_NAME = 'hub2';
const FILE_PATH = 'public/data/agents.json';

// GitHub Personal Access Token이 필요합니다 (환경변수로 설정)
// 현재는 읽기 전용으로 구현 (공개 저장소이므로 토큰 없이도 읽기 가능)
const GITHUB_TOKEN = import.meta.env.VITE_GITHUB_TOKEN || '';

interface GitHubFileResponse {
  content: string;
  sha: string;
  encoding: string;
}

export class GitHubDataService {
  private static instance: GitHubDataService;
  private cachedData: OutLink[] | null = null;
  private lastFetch: number = 0;
  private readonly CACHE_DURATION = 5 * 60 * 1000; // 5분 캐시

  static getInstance(): GitHubDataService {
    if (!GitHubDataService.instance) {
      GitHubDataService.instance = new GitHubDataService();
    }
    return GitHubDataService.instance;
  }

  private async fetchFromGitHub(): Promise<OutLink[]> {
    try {
      const response = await fetch(
        `${GITHUB_API_BASE}/repos/${REPO_OWNER}/${REPO_NAME}/contents/${FILE_PATH}`,
        {
          headers: GITHUB_TOKEN ? {
            'Authorization': `token ${GITHUB_TOKEN}`,
            'Accept': 'application/vnd.github.v3+json'
          } : {
            'Accept': 'application/vnd.github.v3+json'
          }
        }
      );

      if (!response.ok) {
        throw new Error(`GitHub API error: ${response.status}`);
      }

      const data: GitHubFileResponse = await response.json();
      
      // Base64 디코딩을 UTF-8로 올바르게 처리
      const base64Content = data.content.replace(/\n/g, '');
      const binaryString = atob(base64Content);
      
      // UTF-8 디코딩
      const bytes = new Uint8Array(binaryString.length);
      for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }
      const content = new TextDecoder('utf-8').decode(bytes);
      
      const parsedData = JSON.parse(content);
      
      // 데이터 마이그레이션: isApplied를 status로 변환
      return this.migrateData(parsedData);
    } catch (error) {
      console.error('Failed to fetch from GitHub:', error);
      // 폴백: 로컬 초기 데이터 사용
      return this.getFallbackData();
    }
  }

  private migrateData(data: any[]): OutLink[] {
    return data.map(item => {
      // 기존 isApplied 필드가 있으면 status로 변환
      if (item.hasOwnProperty('isApplied') && !item.hasOwnProperty('status')) {
        const status = item.isApplied ? '적용완료' : '검토&수정 중';
        const { isApplied, ...rest } = item;
        return { ...rest, status };
      }
      
      // status 필드가 없으면 기본값 설정
      if (!item.hasOwnProperty('status')) {
        return { ...item, status: '검토&수정 중' };
      }
      
      return item;
    });
  }

  private getFallbackData(): OutLink[] {
    return [
      {
        id: '1',
        name: 'GPT 고객센터',
        description: 'GPT 고객지원 시스템',
        category: '고객센터',
        status: '적용완료',
        userPageUrl: 'https://support.gptko.co.kr',
        adminPageUrl: 'https://admin.gptko.co.kr'
      },
      {
        id: '2',
        name: '파트너 포털',
        description: '파트너사 전용 관리 시스템',
        category: '파트너사',
        status: '검토&수정 중',
        userPageUrl: 'https://partner.gptko.co.kr',
        adminPageUrl: 'https://partner-admin.gptko.co.kr'
      },
      {
        id: '3',
        name: '내부 시스템',
        description: '직원 전용 내부 관리 도구',
        category: '내부시스템',
        status: '적용완료',
        userPageUrl: 'https://internal.gptko.co.kr'
      }
    ];
  }

  async getAgents(): Promise<OutLink[]> {
    const now = Date.now();
    
    // 캐시된 데이터가 있고 아직 유효하면 캐시 반환
    if (this.cachedData && (now - this.lastFetch) < this.CACHE_DURATION) {
      return this.cachedData;
    }

    // GitHub에서 최신 데이터 가져오기
    this.cachedData = await this.fetchFromGitHub();
    this.lastFetch = now;
    
    return this.cachedData;
  }

  async updateAgents(agents: OutLink[]): Promise<boolean> {
    if (!GITHUB_TOKEN) {
      console.warn('GitHub token not provided. Changes will be stored locally only.');
      this.cachedData = agents;
      return false;
    }

    try {
      // 현재 파일의 SHA 가져오기
      const fileResponse = await fetch(
        `${GITHUB_API_BASE}/repos/${REPO_OWNER}/${REPO_NAME}/contents/${FILE_PATH}`,
        {
          headers: {
            'Authorization': `token ${GITHUB_TOKEN}`,
            'Accept': 'application/vnd.github.v3+json'
          }
        }
      );

      if (!fileResponse.ok) {
        throw new Error(`Failed to get file SHA: ${fileResponse.status}`);
      }

      const fileData: GitHubFileResponse = await fileResponse.json();
      
      // 파일 업데이트 - UTF-8 인코딩 후 Base64 변환
      const jsonString = JSON.stringify(agents, null, 2);
      const encoder = new TextEncoder();
      const utf8Bytes = encoder.encode(jsonString);
      
      // Uint8Array를 binary string으로 변환
      let binaryString = '';
      for (let i = 0; i < utf8Bytes.length; i++) {
        binaryString += String.fromCharCode(utf8Bytes[i]);
      }
      const content = btoa(binaryString);
      
      const updateResponse = await fetch(
        `${GITHUB_API_BASE}/repos/${REPO_OWNER}/${REPO_NAME}/contents/${FILE_PATH}`,
        {
          method: 'PUT',
          headers: {
            'Authorization': `token ${GITHUB_TOKEN}`,
            'Accept': 'application/vnd.github.v3+json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            message: 'Update agents data',
            content: content,
            sha: fileData.sha
          })
        }
      );

      if (updateResponse.ok) {
        this.cachedData = agents;
        this.lastFetch = Date.now();
        return true;
      } else {
        throw new Error(`Failed to update file: ${updateResponse.status}`);
      }
    } catch (error) {
      console.error('Failed to update GitHub file:', error);
      // 로컬 캐시에는 저장
      this.cachedData = agents;
      return false;
    }
  }

  // 캐시 무효화
  invalidateCache(): void {
    this.cachedData = null;
    this.lastFetch = 0;
  }
} 