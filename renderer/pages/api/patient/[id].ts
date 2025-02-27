import type { NextApiRequest, NextApiResponse } from 'next';
import ConnectDB from '@/renderer/src/app';
import { AppDataSource } from '@/renderer/src/config/database.config';
import { Patient } from '@/renderer/src/entities/patient.entity';

type ResponseData = {
  message?: string;
  patient?: Patient;
  error?: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  if (!['GET', 'DELETE', 'PUT'].includes(req.method || '')) {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    await ConnectDB();
    const patientRepository = AppDataSource.getRepository(Patient);
    const { id } = req.query;

    if (req.method === 'DELETE') {
      const result = await patientRepository.delete(id as string);
      
      if (result.affected === 0) {
        return res.status(404).json({ message: 'Patient not found' });
      }

      return res.status(200).json({ message: 'Patient deleted successfully' });
    }

    if (req.method === 'PUT') {
      const {
        scannedDocument,
        ...restPatientData
      } = req.body;

      let scannedDocumentBuffer: Buffer | null = null;
      if (scannedDocument) {
        scannedDocumentBuffer = Buffer.from(scannedDocument, 'base64');
      }

      const updateResult = await patientRepository.update(
        id as string,
        {
          ...restPatientData,
          scannedDocument: scannedDocumentBuffer,
        }
      );

      if (updateResult.affected === 0) {
        return res.status(404).json({ message: 'Patient not found' });
      }

      const updatedPatient = await patientRepository.findOne({ 
        where: { id: id as string } 
      });

      return res.status(200).json({
        message: 'Patient updated successfully',
        patient: updatedPatient
      });
    }

    const patient = await patientRepository.findOne({ where: { id: id as string } });

    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }

    return res.status(200).json({ patient });
  } catch (error) {
    console.error('Error processing patient:', error);
    return res.status(500).json({ 
      message: 'Error processing patient',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
} 