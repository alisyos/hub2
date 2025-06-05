export type AgentStatus = '적용완료' | '검토&수정 중' | '검토완료';

export interface OutLink {
  id: string;
  name: string;
  description: string;
  category: string;
  status: AgentStatus;
  userPageUrl: string;
  adminPageUrl?: string;
}

export type OutLinkFormData = Omit<OutLink, 'id'>;

export interface OutLinkContextType {
  outLinks: OutLink[];
  addOutLink: (outLink: OutLinkFormData) => Promise<void>;
  updateOutLink: (id: string, outLink: Partial<OutLink>) => Promise<void>;
  deleteOutLink: (id: string) => Promise<void>;
  loading: boolean;
  refreshData: () => Promise<void>;
  error: string | null;
  saving: boolean;
  clearError: () => void;
} 