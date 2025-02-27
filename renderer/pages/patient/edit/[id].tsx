import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import Link from 'next/link';
import { toast } from 'react-toastify';
import Navbar from '../../../components/Navbar';
import { IPatient } from '../../../types/patient';

export default function EditPatient() {
  const router = useRouter();
  const { id } = router.query;
  const [loading, setLoading] = useState(true);
  const [file, setFile] = useState<File | null>(null);
  const [formData, setFormData] = useState({
    fullName: '',
    government_ID: '',
    birthday: '',
    gender: '',
    testDate: '',
    applicationDate: '',
    geneAnalysis: [''],
    complaint: false,
    treatment: false
  });

  useEffect(() => {
    if (id) {
      fetchPatientData();
    }
  }, [id]);

  const fetchPatientData = async () => {
    try {
      const { data } = await axios.get(`/api/patient/${id}`);
      const patient = data.patient;
      
      setFormData({
        ...patient,
        birthday: new Date(patient.birthday).toISOString().split('T')[0],
        testDate: new Date(patient.testDate).toISOString().split('T')[0],
        applicationDate: new Date(patient.applicationDate).toISOString().split('T')[0],
      });
    } catch (error) {
      toast.error('Hasta bilgileri yüklenirken hata oluştu');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const handleGeneAnalysisChange = (value: string, index: number) => {
    setFormData(prev => ({
      ...prev,
      geneAnalysis: prev.geneAnalysis.map((item, i) => 
        i === index ? value.toUpperCase() : item
      )
    }));
  };

  const handleGeneAnalysisDelete = (indexToDelete: number) => {
    setFormData(prev => ({
      ...prev,
      geneAnalysis: prev.geneAnalysis.filter((_, index) => index !== indexToDelete)
    }));
  };

  const addGeneAnalysisField = () => {
    setFormData(prev => ({
      ...prev,
      geneAnalysis: [...prev.geneAnalysis, '']
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      let scannedDocumentBase64: string | null = null;
      if (file) {
        const arrayBuffer = await file.arrayBuffer();
        scannedDocumentBase64 = Buffer.from(arrayBuffer).toString('base64');
      }

      const payload = {
        ...formData,
        scannedDocument: scannedDocumentBase64,
      };

      await axios.put(`/api/patient/${id}`, payload);
      toast.success('Hasta kaydı başarıyla güncellendi');
      router.push(`/patient/${id}`);
    } catch (error) {
      toast.error('Hasta kaydı güncellenirken hata oluştu');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className='bg-slate-300 min-h-screen'>
      <div className="container mx-auto max-w-4xl">
        <Navbar />
        <div className="mt-6">
          <div className="flex items-center gap-4 mb-6">
            <Link href={`/patient/${id}`} className="text-blue-500 hover:text-blue-700">
              ← Geri
            </Link>
            <h1 className="text-2xl font-bold">Hasta Bilgilerini Düzenle</h1>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded-lg shadow-lg">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Ad Soyad */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Ad Soyad:
                </label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  className="w-full p-2 border rounded focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>

              {/* TC Kimlik No */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  TC Kimlik No:
                </label>
                <input
                  type="text"
                  name="government_ID"
                  value={formData.government_ID}
                  onChange={handleChange}
                  className="w-full p-2 border rounded focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>

              {/* Doğum Tarihi */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Doğum Tarihi:
                </label>
                <input
                  type="date"
                  name="birthday"
                  value={formData.birthday}
                  onChange={handleChange}
                  className="w-full p-2 border rounded focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>

              {/* Cinsiyet */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Cinsiyet:
                </label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  className="w-full p-2 border rounded focus:ring-blue-500 focus:border-blue-500"
                  required
                >
                  <option value="">Seçiniz</option>
                  <option value="Erkek">Erkek</option>
                  <option value="Kadın">Kadın</option>
                </select>
              </div>

              {/* Test Tarihi */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Test Tarihi:
                </label>
                <input
                  type="date"
                  name="testDate"
                  value={formData.testDate}
                  onChange={handleChange}
                  className="w-full p-2 border rounded focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>

              {/* Başvuru Tarihi */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Başvuru Tarihi:
                </label>
                <input
                  type="date"
                  name="applicationDate"
                  value={formData.applicationDate}
                  onChange={handleChange}
                  className="w-full p-2 border rounded focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>

              {/* Gen Analizi */}
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Gen Analizi:
                </label>
                <div className="space-y-2">
                  {formData.geneAnalysis.map((gene, index) => (
                    <div key={index} className="flex gap-2">
                      <input
                        type="text"
                        value={gene}
                        onChange={(e) => handleGeneAnalysisChange(e.target.value, index)}
                        className="flex-1 p-2 border rounded focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Gen analizi sonucunu giriniz"
                      />
                      <button
                        type="button"
                        onClick={() => handleGeneAnalysisDelete(index)}
                        className="px-3 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                        title="Sil"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                  <div className='flex justify-end'>
                    <button
                        type="button"
                        onClick={addGeneAnalysisField}
                        className="px-3 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                        title="Yeni ekle"
                    >
                        +
                    </button>
                  </div>
                </div>
                {formData.geneAnalysis.length === 0 && (
                  <button
                    type="button"
                    onClick={addGeneAnalysisField}
                    className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                  >
                    Gen Analizi Ekle
                  </button>
                )}
              </div>

              {/* Şikayet ve Tedavi */}
              <div className="col-span-2 flex space-x-6">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="complaint"
                    checked={formData.complaint}
                    onChange={handleChange}
                    className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                  />
                  <span className="ml-2">Şikayet</span>
                </label>

                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="treatment"
                    checked={formData.treatment}
                    onChange={handleChange}
                    className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                  />
                  <span className="ml-2">Tedavi</span>
                </label>
              </div>

              {/* Taranmış Belge */}
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Taranmış Belge (.pdf):
                </label>
                <input
                  type="file"
                  onChange={handleFileChange}
                  className="w-full p-2 border rounded focus:ring-blue-500 focus:border-blue-500"
                  accept=".pdf,.jpg,.jpeg,.png"
                />
              </div>
            </div>

            {/* Buttons */}
            <div className="flex justify-end space-x-4 mt-6">
              <button
                type="button"
                onClick={() => router.push(`/patient/${id}`)}
                className="px-4 py-2 border rounded hover:bg-gray-100"
              >
                İptal
              </button>
              <button
                type="submit"
                disabled={loading}
                className={`px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 ${
                  loading ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {loading ? 'Kaydediliyor...' : 'Kaydet'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
} 