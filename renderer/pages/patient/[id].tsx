import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import Link from 'next/link';
import { toast } from 'react-toastify';
import Navbar from '../../components/Navbar';
import { IPatient } from '../../types/patient';
import PDFViewer from '../../components/PDFViewer';

export default function PatientDetail() {
  const router = useRouter();
  const { id } = router.query;
  const [patient, setPatient] = useState<IPatient | null>(null);
  const [loading, setLoading] = useState(true);
  const [showPDF, setShowPDF] = useState(false);

  useEffect(() => {
    if (id) {
      fetchPatientData();
    }
  }, [id]);

  const fetchPatientData = async () => {
    try {
      const { data } = await axios.get(`/api/patient/${id}`);
      setPatient(data.patient);
    } catch (error) {
      toast.error('Hasta bilgileri yüklenirken hata oluştu');
      console.error('Error fetching patient:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('tr-TR');
  };

  const handleDelete = async () => {
    if (!window.confirm('Bu hastayı silmek istediğinizden emin misiniz?')) {
      return;
    }

    try {
      await axios.delete(`/api/patient/${id}`);
      toast.success('Hasta başarıyla silindi');
      router.push('/home');
    } catch (error) {
      toast.error('Hasta silinirken bir hata oluştu');
      console.error('Error deleting patient:', error);
    }
  };

  const handleViewDocument = async () => {
    setShowPDF(true);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!patient) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <p className="text-xl mb-4">Hasta bulunamadı</p>
        <Link href="/home" className="text-blue-500 hover:text-blue-700">
          Ana Sayfaya Dön
        </Link>
      </div>
    );
  }

  return (
    <div className='bg-slate-300 min-h-screen'>
      <div className="container mx-auto max-w-4xl">
        <Navbar />
        <div className="mt-6 p-6 bg-white rounded-lg shadow-lg">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <Link href="/home" className="text-blue-500 hover:text-blue-700">
                ← Geri
              </Link>
              <h1 className="text-2xl font-bold">Hasta Detayları</h1>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => router.push(`/patient/edit/${id}`)}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                Düzenle
              </button>
              <button
                onClick={handleDelete}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
              >
                Sil
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-gray-500">Ad Soyad</h3>
                <p className="mt-1 text-lg">{patient.fullName}</p>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-500">TC Kimlik No</h3>
                <p className="mt-1 text-lg">{patient.government_ID}</p>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-500">Doğum Tarihi</h3>
                <p className="mt-1 text-lg">{formatDate(new Date(patient.birthday))}</p>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-500">Cinsiyet</h3>
                <p className="mt-1 text-lg">{patient.gender}</p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-gray-500">Test Tarihi</h3>
                <p className="mt-1 text-lg">{formatDate(new Date(patient.testDate))}</p>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-500">Başvuru Tarihi</h3>
                <p className="mt-1 text-lg">{formatDate(new Date(patient.applicationDate))}</p>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-500">Durum</h3>
                <div className="mt-1 space-x-4">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    patient.complaint ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-800'
                  }`}>
                    Şikayet: {patient.complaint ? 'Var' : 'Yok'}
                  </span>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    patient.treatment ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                  }`}>
                    Tedavi: {patient.treatment ? 'Var' : 'Yok'}
                  </span>
                </div>
              </div>
            </div>

            <div className="col-span-2">
              <h3 className="text-sm font-medium text-gray-500">Gen Analizi</h3>
              <div className="mt-2 flex flex-wrap gap-2">
                {patient.geneAnalysis.map((gene, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800"
                  >
                    {gene}
                  </span>
                ))}
              </div>
            </div>

            {patient.scannedDocument && (
              <div className="col-span-2">
                <h3 className="text-sm font-medium text-gray-500 mb-2">Taranmış Belge</h3>
                <div className="border rounded p-4">
                  <button
                    onClick={handleViewDocument}
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                  >
                    Belgeyi Görüntüle
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {showPDF && (
        <PDFViewer
          pdfUrl={`/api/document/${id}`}
          onClose={() => setShowPDF(false)}
        />
      )}
    </div>
  );
} 