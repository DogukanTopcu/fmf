import ConnectDB from '@/renderer/src/app';
import { AppDataSource } from '@/renderer/src/config/database.config';
import { Patient } from '@/renderer/src/entities/patient.entity';
import type { NextApiRequest, NextApiResponse } from 'next';

type ResponseData = {
  message: string;
  error?: string;
}

type mockData = {
    name: string;   
    birthday: string;
    testDay: string;
    gender: string;
    gene: string;
}

const data: mockData[] = [
  {"name": "Ismail Hakkı BULUT", "birthday": "2010-04-12", "testDay": "2024-11-25", "gender": "ERKEK", "gene": "M694V HOMOZIGOT"},
  {"name": "Metin DÜDÜK", "birthday": "2012-04-09", "testDay": "2024-11-26", "gender": "ERKEK", "gene": "V726A HETEROZIGOT"},
  {"name": "Asmin TANGOBAY", "birthday": "2013-12-11", "testDay": "2024-11-27", "gender": "KADIN", "gene": "M694V/E148Q/R202Q BIRLEŞIK HETEROZIGOT"},
  {"name": "Ali Cihan TALABOĞA", "birthday": "2007-04-09", "testDay": "2024-11-27", "gender": "ERKEK", "gene": "M694V/R202Q BIRLEŞIK HOMOZIGOT"},
  {"name": "Yaren MEYDAN", "birthday": "2012-06-02", "testDay": "2024-12-02", "gender": "KADIN", "gene": "M694V HETEROZIGOT"},
  {"name": "Ege ERTEM", "birthday": "2012-10-26", "testDay": "2024-12-09", "gender": "ERKEK", "gene": "M694V/V726A BIRLEŞIK HETEROZIGOT"},
  {"name": "Muhammed Aras KAYCI", "birthday": "2015-03-04", "testDay": "2024-12-11", "gender": "ERKEK", "gene": "M694V/R761H BIRLEŞIK HETEROZIGOT"},
  {"name": "Ahmet ÇALIŞKAN", "birthday": "2012-09-12", "testDay": "2024-12-18", "gender": "ERKEK", "gene": "M694V HOMOZIGOT"},
  {"name": "Beyazıt SAĞDIÇ", "birthday": "2012-04-11", "testDay": "2024-12-18", "gender": "ERKEK", "gene": "M694V/R202Q BIRLEŞIK HOMOZIGOT"},
  {"name": "Civan ÖZTÜRK", "birthday": "2020-04-14", "testDay": "2024-12-18", "gender": "ERKEK", "gene": "M694V HETEROZIGOT"},
  {"name": "Selim TURIDI", "birthday": "2021-07-17", "testDay": "2024-12-25", "gender": "ERKEK", "gene": "M694V HOMOZIGOT"},
  {"name": "Güneş TURIDI", "birthday": "2017-07-27", "testDay": "2024-12-25", "gender": "KADIN", "gene": "M694V HOMOZIGOT"},
  {"name": "Merve ERTURAN", "birthday": "2009-03-17", "testDay": "2024-12-25", "gender": "KADIN", "gene": "M694V/R202Q BIRLEŞIK HOMOZIGOT"},
  {"name": "Gökçe Nisa ÖNCÜL", "birthday": "2013-04-17", "testDay": "2024-12-26", "gender": "KADIN", "gene": "M694V/R202Q BIRLEŞİK HOMOZIGOT"},
  {"name": "Musa Mert BULUT", "birthday": "2018-12-12", "testDay": "2024-12-26", "gender": "ERKEK", "gene": "M694V HOMOZIGOT"},
  {"name": "Cemre ERGIN", "birthday": "2017-08-16", "testDay": "2024-12-30", "gender": "KADIN", "gene": "M694V HETEROZIGOT"},
  {"name": "Yunus Emre DIKICI", "birthday": "2019-09-22", "testDay": "2025-01-02", "gender": "ERKEK", "gene": "M680I HETEROZIGOT"},
  {"name": "Yusuf Zahid DIKICI", "birthday": "2016-12-25", "testDay": "2025-01-02", "gender": "ERKEK", "gene": "V726A HETEROZIGOT"},
  {"name": "Mehmet Tuğra ÇETE", "birthday": "2014-10-22", "testDay": "2025-01-06", "gender": "ERKEK", "gene": "M680I/E148Q BIRLEŞIK HETEROZIGOT"},
  {"name": "Enes Arın TAMTÜRK", "birthday": "2017-11-21", "testDay": "2025-01-07", "gender": "ERKEK", "gene": "M680I HETEROZIGOT"},
  {"name": "Zehra Nida KANLI", "birthday": "2018-03-27", "testDay": "2025-01-14", "gender": "KADIN", "gene": "M694V HOMOZIGOT"},
  {"name": "Safiye Sultan KOCAAĞA", "birthday": "2013-02-05", "testDay": "2025-01-16", "gender": "KADIN", "gene": "M694V/V726A BIRLEŞIK HETEROZIGOT"},
  {"name": "Ebrar KOCAAĞA", "birthday": "2017-04-20", "testDay": "2025-01-16", "gender": "KADIN", "gene": "M694V/V726A/R202Q BIRLEŞIK HETEROZIGOT"},
  {"name": "Kadir ILHAN", "birthday": "2017-05-25", "testDay": "2025-01-17", "gender": "ERKEK", "gene": "M680I HETEROZIGOT"},
  {"name": "Yusuf Osman ERYILMAZ", "birthday": "2007-04-03", "testDay": "2025-01-22", "gender": "ERKEK", "gene": "M694V/R761H BIRLEŞIK HETEROZIGOT"},
  {"name": "Muharrem Emir KAPLAN", "birthday": "2016-04-08", "testDay": "2025-01-22", "gender": "ERKEK", "gene": "M680I HETEROZIGOT"},
  {"name": "Havvanur TAŞKIRAN", "birthday": "2009-05-19", "testDay": "2025-01-22", "gender": "KADIN", "gene": "M694V HOMOZIGOT"},
  {"name": "Irem KAPLAN", "birthday": "2007-03-27", "testDay": "2025-01-22", "gender": "KADIN", "gene": "M680I HETEROZIGOT"},
  {"name": "Yaren BULUT", "birthday": "2011-09-28", "testDay": "2025-01-22", "gender": "KADIN", "gene": "M694V/V726A BIRLEŞIK HETEROZIGOT"},
  {"name": "Öykü ALTAY", "birthday": "2020-08-18", "testDay": "2025-01-22", "gender": "KADIN", "gene": "M680I HETEROZIGOT"},
  {"name": "Zeynep EZEL", "birthday": "2009-11-11", "testDay": "2025-01-22", "gender": "KADIN", "gene": "V726A HETEROZIGOT"},
  {"name": "Zafer EZEL", "birthday": "2012-03-19", "testDay": "2025-01-22", "gender": "ERKEK", "gene": "V726A/E148Q HETEROZIGOT"},
  {"name": "Buğlem TÜRKMEN", "birthday": "2016-04-18", "testDay": "2025-01-24", "gender": "KADIN", "gene": "M694V/R202Q BIRLEŞIK HOMOZIGOT"},
  {"name": "Recep ATABEY", "birthday": "2017-09-09", "testDay": "2025-01-24", "gender": "ERKEK", "gene": "V726A HETEROZIGOT"},
  {"name": "Atlas AFACAN", "birthday": "2023-05-15", "testDay": "2025-01-27", "gender": "ERKEK", "gene": "V726A/E148Q HETEROZIGOT"},
  {"name": "Eren ŞANLIDERE", "birthday": "2010-02-05", "testDay": "2025-01-27", "gender": "ERKEK", "gene": "M694V/M680I BIRLEŞIK HETEROZIGOT"},
  {"name": "Irem AYTAÇ", "birthday": "2012-07-06", "testDay": "2025-01-28", "gender": "KADIN", "gene": "M694V/R202Q BIRLEŞIK HOMOZIGOT"},
  {"name": "Işıl KURBAN", "birthday": "2008-04-18", "testDay": "2025-01-29", "gender": "KADIN", "gene": "M694V HOMOZIGOT"},
  {"name": "Ibrahim Berk IŞÇI", "birthday": "2009-11-18", "testDay": "2025-01-29", "gender": "ERKEK", "gene": "M694V HETEROZIGOT"},
  {"name": "Poyraz ÖZYAŞAR", "birthday": "2018-01-27", "testDay": "2025-01-29", "gender": "ERKEK", "gene": "F479L/E167D BIRLEŞIK HETEROZIGOT"},
  {"name": "Eslem Cennet YARIM", "birthday": "2014-09-17", "testDay": "2025-01-30", "gender": "KADIN", "gene": "M694V HOMOZIGOT"},
  {"name": "Beren YALÇIN", "birthday": "2011-03-03", "testDay": "2025-01-30", "gender": "KADIN", "gene": "M694V HOMOZIGOT"},
  {"name": "Beste YALÇIN", "birthday": "2011-03-03", "testDay": "2025-01-30", "gender": "KADIN", "gene": "M694V HOMOZIGOT"},
  {"name": "Derin DEMİR", "birthday": "2013-11-20", "testDay": "2025-01-31", "gender": "KADIN", "gene": "M694V/M680I BIRLEŞIK HETEROZIGOT"},
  {"name": "Mehmet Dağhan DURMUŞOĞLU", "birthday": "2012-05-23", "testDay": "2025-01-31", "gender": "ERKEK", "gene": "M694V/R761H BIRLEŞIK HETEROZIGOT"},
  {"name": "Tuğsem Mavi ER", "birthday": "2016-02-14", "testDay": "2025-01-31", "gender": "KADIN", "gene": "V726A HETEROZIGOT"},
  {"name": "Yusuf Ali ÇAKIR", "birthday": "2010-09-23", "testDay": "2025-02-03", "gender": "ERKEK", "gene": "R761H HETEROZIGOT"},
  {"name": "Sude KALE", "birthday": "2009-05-10", "testDay": "2025-02-03", "gender": "KADIN", "gene": "A744S HETEROZIGOT"},
  {"name": "Zeynep Duru TINGAZ", "birthday": "2007-02-16", "testDay": "2025-02-04", "gender": "KADIN", "gene": "M694V HOMOZIGOT"},
  {"name": "Elif Sude DÖNMEZ", "birthday": "2011-10-11", "testDay": "2025-02-06", "gender": "KADIN", "gene": "M694V HETEROZIGOT"},
  {"name": "Abdullah GÜMÜŞTAŞ", "birthday": "2008-05-05", "testDay": "2025-02-17", "gender": "ERKEK", "gene": "M694V/R202Q BIRLEŞIK HETEROZIGOT"},
  {"name": "Velat KAPLAN", "birthday": "2014-01-26", "testDay": "2025-02-17", "gender": "ERKEK", "gene": "M694V/R761H/E148Q BIRLEŞIK HETEROZIGOT"},
  {"name": "Enes Yiğit DOĞAN", "birthday": "2009-03-14", "testDay": "2025-02-25", "gender": "ERKEK", "gene": "M694V/M680I/R202Q BIRLEŞIK HETEROZIGOT"},
  {"name": "Eylül SAĞLAM", "birthday": "0001-01-01", "testDay": "2025-02-26", "gender": "KADIN", "gene": "M694V/M680 BIRLEŞIK HETEROZIGOT"},
  {"name": "Defne KOÇOĞLU", "birthday": "0001-01-01", "testDay": "2025-02-26", "gender": "KADIN", "gene": "A289V/R202Q BIRLEŞIK HETEROZIGOT"},
  {"name": "Halil Efe KOÇOĞLU", "birthday": "0001-01-01", "testDay": "2025-02-26", "gender": "ERKEK", "gene": "K695R/A289V/R202Q BIRLEŞIK HETEROZIGOT"},
  {"name": "Elif Duru KOÇOĞLU", "birthday": "0001-01-01", "testDay": "2025-02-26", "gender": "KADIN", "gene": "P369S/E148Q BIRLEŞIK HETEROZIGOT"},
  {"name": "Elifnaz ÖZKAYA", "birthday": "2006-07-28", "testDay": "0001-01-01", "gender": "KADIN", "gene": "Control"},
  {"name": "Artun İŞGÜDER", "birthday": "2011-06-06", "testDay": "0001-01-01", "gender": "ERKEK", "gene": "Control"},
  {"name": "Azra İpek ANKARA", "birthday": "2005-11-18", "testDay": "0001-01-01", "gender": "KADIN", "gene": "Control"},
  {"name": "Kemal Utku AYAZ", "birthday": "2008-10-02", "testDay": "0001-01-01", "gender": "ERKEK", "gene": "Control"},
  {"name": "Bala Berke MAKAY", "birthday": "2004-01-31", "testDay": "0001-01-01", "gender": "ERKEK", "gene": "Control"},
  {"name": "Elif Tuğba TANIŞIR", "birthday": "2008-02-18", "testDay": "0001-01-01", "gender": "KADIN", "gene": "Control"},
  {"name": "Süleyman TOPKAYA", "birthday": "2003-11-18", "testDay": "0001-01-01", "gender": "ERKEK", "gene": "Control"},
  {"name": "Defne Zeynep KIZIL", "birthday": "2008-12-07", "testDay": "0001-01-01", "gender": "KADIN", "gene": "Control"},
  {"name": "Kezban Eylül ORUÇ", "birthday": "2013-05-10", "testDay": "0001-01-01", "gender": "KADIN", "gene": "Control"},
  {"name": "Toprak MAKAY", "birthday": "2010-12-08", "testDay": "0001-01-01", "gender": "ERKEK", "gene": "Control"},
  {"name": "Muhammet Emre SALDANLI", "birthday": "2006-07-15", "testDay": "0001-01-01", "gender": "ERKEK", "gene": "M694V/V726A Birleşik Heterozigot/R202Q"},
  {"name": "Eymen Adar BALLIKAYA", "birthday": "2017-06-05", "testDay": "0001-01-01", "gender": "ERKEK", "gene": "M694V/R202Q Birleşik Homozigot"},
  {"name": "Gökçe Nisa ÖNCÜL", "birthday": "2013-04-17", "testDay": "0001-01-01", "gender": "KADIN", "gene": "M694V/R202Q Birleşik Homozigot"},
  {"name": "Zeynep BAŞ", "birthday": "2006-11-09", "testDay": "0001-01-01", "gender": "KADIN", "gene": "M694V/R202Q Birleşik Homozigot"},
  {"name": "Bahri YILMAZ", "birthday": "2007-12-05", "testDay": "0001-01-01", "gender": "ERKEK", "gene": "M694V Homozigot/A744S Heterozigot/R202Q"},
  {"name": "Arda DOĞAN", "birthday": "2007-10-09", "testDay": "0001-01-01", "gender": "ERKEK", "gene": "M694V Homozigot"},
  {"name": "Hüseyin DOĞAN", "birthday": "2011-07-20", "testDay": "0001-01-01", "gender": "ERKEK", "gene": "M694V Homozigot"},
  {"name": "Gülhan ÖZCANOĞLU", "birthday": "2004-08-15", "testDay": "0001-01-01", "gender": "KADIN", "gene": "M694V Homozigot"},
  {"name": "Ahmet DURSUN", "birthday": "2005-11-23", "testDay": "0001-01-01", "gender": "ERKEK", "gene": "M694V/R202Q Birleşik Homozigot"},
  {"name": "Maya Nur SOĞANCI", "birthday": "2013-06-26", "testDay": "0001-01-01", "gender": "KADIN", "gene": "M694V/R202Q Birleşik Homozigot"},
  {"name": "Ali MUTLU", "birthday": "2012-03-20", "testDay": "0001-01-01", "gender": "ERKEK", "gene": "M694V/V726A Birleşik Heterozigot"},
  {"name": "Yusuf PALABIYIK", "birthday": "2008-02-18", "testDay": "0001-01-01", "gender": "ERKEK", "gene": "M694V/V726A Birleşik Heterozigot"},
  {"name": "Toprak ERDEM", "birthday": "2014-02-09", "testDay": "0001-01-01", "gender": "ERKEK", "gene": "M694V/M680I Birleşik Heterozigot"},
  {"name": "Şule SAYLIK", "birthday": "2005-08-22", "testDay": "0001-01-01", "gender": "KADIN", "gene": "M694V Homozigot"},
  {"name": "Arda SOYLU", "birthday": "2007-02-17", "testDay": "0001-01-01", "gender": "ERKEK", "gene": "M694V Homozigot"},
  {"name": "Esila ÜRELLİ", "birthday": "2010-08-09", "testDay": "0001-01-01", "gender": "KADIN", "gene": "M694V/R202Q Birleşik Homozigot"},
  {"name": "Görkem SAVRAN", "birthday": "2010-09-29", "testDay": "0001-01-01", "gender": "ERKEK", "gene": "M694V/M680I Birleşik Heterozigot"},
  {"name": "Tunahan ÖZGÜLER", "birthday": "2007-01-15", "testDay": "0001-01-01", "gender": "ERKEK", "gene": "M694V Homozigot/R202Q Heterozigot"},
  {"name": "Emirhan ÇETİNKAYA", "birthday": "2004-05-28", "testDay": "0001-01-01", "gender": "ERKEK", "gene": "M694V/V726A Birleşik Heterozigot"},
  {"name": "Duru Nehir UĞUR", "birthday": "2007-02-24", "testDay": "0001-01-01", "gender": "KADIN", "gene": "M694V Homozigot"},
  {"name": "Doğan Efe YAŞAR", "birthday": "2012-09-21", "testDay": "2024-11-12", "gender": "ERKEK", "gene": "M694V Homozigot"},
  {"name": "Beyza ALTAŞ", "birthday": "2007-10-26", "testDay": "2024-11-14", "gender": "KADIN", "gene": "M694V Heterozigot"},
  {"name": "Nursema AYVALI", "birthday": "2007-02-05", "testDay": "2024-11-14", "gender": "KADIN", "gene": "M694V Heterozigot"},
  {"name": "Ahmet KAYNAK", "birthday": "2016-06-27", "testDay": "2024-11-14", "gender": "ERKEK", "gene": "Pnömani/Plevral Efüzyon"},
  {"name": "Hatice Ceren BUDAK", "birthday": "2015-10-15", "testDay": "2024-11-18", "gender": "KADIN", "gene": "M694V Homozigot"},
  {"name": "Neslihan AYVALI", "birthday": "2010-11-12", "testDay": "2024-11-21", "gender": "KADIN", "gene": "M694V Heterozigot"}
]

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

    data.map(async (patient) => {
      // Tarihleri Date objelerine dönüştür
      const newPatient = patientRepository.create({
        fullName: patient.name,
        gender: patient.gender,
        geneAnalysis: [patient.gene],
        government_ID: "",
        treatment: false,
        complaint: false,
        birthday: new Date(patient.birthday),
        testDate: new Date(patient.testDay),
        applicationDate: new Date("0001-01-01"),
        scannedDocument: null,
        createdAt: new Date(),
        updatedAt: new Date()
      });

      await patientRepository.save(newPatient);
    });


    return res.status(201).json({ 
      message: 'Patient records created successfully',
    });

  } catch (error) {
    console.error('Error creating patient record:', error);
    return res.status(500).json({ 
      message: 'Error creating patient record',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}