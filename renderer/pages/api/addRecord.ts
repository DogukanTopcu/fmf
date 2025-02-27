import ConnectDB from '@/renderer/src/app';
import { AppDataSource } from '@/renderer/src/config/database.config';
import { Patient } from '@/renderer/src/entities/patient.entity';
import type { NextApiRequest, NextApiResponse } from 'next';
import { Buffer } from 'buffer';

type ResponseData = {
  message: string;
  patient?: Patient;
  error?: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    await ConnectDB();
    const patientRepository = AppDataSource.getRepository(Patient);
    
    const {
      scannedDocument,
      ...patientData
    } = req.body;

    // scannedDocument base64 formatındaysa Buffer'a dönüştür
    let scannedDocumentBuffer: Buffer | null = null;
    if (scannedDocument) {
      scannedDocumentBuffer = Buffer.from(scannedDocument, 'base64');
    }

    // Tarihleri Date objelerine dönüştür
    const newPatient = patientRepository.create({
      ...patientData,
      birthday: new Date(patientData.birthday),
      testDate: new Date(patientData.testDate),
      applicationDate: new Date(patientData.applicationDate),
      scannedDocument: scannedDocumentBuffer,
      createdAt: new Date(),
      updatedAt: new Date()
    });

    // Veriyi kaydet
    const savedPatient = await patientRepository.save(newPatient);

    return res.status(201).json({ 
      message: 'Patient record created successfully',
      patient: savedPatient[0]
    });

  } catch (error) {
    console.error('Error creating patient record:', error);
    return res.status(500).json({ 
      message: 'Error creating patient record',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}