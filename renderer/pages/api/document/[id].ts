import type { NextApiRequest, NextApiResponse } from 'next';
import ConnectDB from '@/renderer/src/app';
import { AppDataSource } from '@/renderer/src/config/database.config';
import { Patient } from '@/renderer/src/entities/patient.entity';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    await ConnectDB();
    const patientRepository = AppDataSource.getRepository(Patient);
    
    const { id } = req.query;
    const patient = await patientRepository.findOne({ where: { id: id as string } });

    if (!patient || !patient.scannedDocument) {
      return res.status(404).json({ message: 'Document not found' });
    }

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `inline; filename="patient-${id}.pdf"`);
    
    return res.send(patient.scannedDocument);
  } catch (error) {
    console.error('Error fetching document:', error);
    return res.status(500).json({ 
      message: 'Error fetching document',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
} 