export interface IPatient {
  id: string;
  fullName: string;
  government_ID: string;
  birthday: Date;
  gender: string;
  testDate: Date;
  applicationDate: Date;
  geneAnalysis: string[];
  complaint: boolean;
  treatment: boolean;
  scannedDocument?: Buffer;
  createdAt: Date;
  updatedAt: Date;
} 