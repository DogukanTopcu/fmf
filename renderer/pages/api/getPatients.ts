import type { NextApiRequest, NextApiResponse } from 'next';
import ConnectDB from '@/renderer/src/app';
import { AppDataSource } from '@/renderer/src/config/database.config';
import { Patient } from '@/renderer/src/entities/patient.entity';
import { ILike } from 'typeorm';

type ResponseData = {
  message?: string;
  patients?: Patient[];
  error?: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  try {
    await ConnectDB();
    const patientRepository = AppDataSource.getRepository(Patient);
    
    const searchTerm = req.query.search as string;
    
    const patients = await patientRepository.find({
      where: searchTerm ? {
        fullName: ILike(`%${searchTerm}%`)
      } : {},
      order: {
        createdAt: 'DESC'
      }
    });

    return res.status(200).json({ patients });
  } catch (error) {
    console.error('Error fetching patients:', error);
    return res.status(500).json({ 
      message: 'Error fetching patients',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}