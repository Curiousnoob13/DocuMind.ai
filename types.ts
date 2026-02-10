
export interface Message {
  role: 'user' | 'model';
  text: string;
  timestamp: number;
}

export interface PdfData {
  name: string;
  text: string;
  pageCount: number;
  size: number;
}

export enum AppStatus {
  IDLE = 'IDLE',
  PROCESSING = 'PROCESSING',
  READY = 'READY',
  ERROR = 'ERROR'
}

export interface UserStats {
  uploadCount: number;
}
