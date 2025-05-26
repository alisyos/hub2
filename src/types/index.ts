export interface OutLink {
  id: string;
  name: string;
  description: string;
  category: string;
  isApplied: boolean;
  userPageUrl: string;
  adminPageUrl?: string;
}

export type OutLinkFormData = Omit<OutLink, 'id'>;

export interface OutLinkContextType {
  outLinks: OutLink[];
  addOutLink: (outLink: OutLinkFormData) => void;
  updateOutLink: (id: string, outLink: Partial<OutLink>) => void;
  deleteOutLink: (id: string) => void;
} 