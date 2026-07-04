export type ReelTemplate = 'khatereh' | 'daftarcheh' | 'ghamgin' | 'masire-tanhaei' | 'neon-ember' | 'neon-rain' | 'neon-drift';

export type VideoAsset = {
  id: string;
  title: string;
  description?: string;
  fileName: string;
  createdAt: string;
  updatedAt: string;
  duration: number;
  thumbnailUri?: string;
  contentBase64?: string;
  htmlContent?: string; // Reel HTML template
  templateId: ReelTemplate;
  photoUris?: string[];
  exportedAt?: string;
  shareUrl?: string;
};
