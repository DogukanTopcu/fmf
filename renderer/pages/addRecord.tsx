import { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';
import { toast } from 'react-toastify';
import Link from 'next/link';
import Navbar from '../components/Navbar';
import { IPatient } from '../types/patient';
import GeneAnalysisSelect from '../components/GeneAnalysisSelect';

type PatientFormData = Omit<
  Partial<IPatient>,
  'birthday' | 'testDate' | 'applicationDate' | 'scannedDocument' | 'geneAnalysis'
> & {
  birthday: string;
  testDate: string;
  applicationDate: string;
  scannedDocument: File | null;
  geneAnalysis: string[];
};

export default function AddRecord() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
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
  const [file, setFile] = useState<File | null>(null);

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

      const { data } = await axios.post("/api/addRecord", payload);
      toast.success('Hasta kaydı başarıyla oluşturuldu');
      router.push('/home');
    } catch (error) {
      toast.error('Hasta kaydı oluşturulurken hata oluştu');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='bg-slate-300 h-screen w-screen'>
      <div className="container mx-auto max-w-4xl">
        <Navbar />
        <br />
        <div className="flex items-center gap-4 mb-6">
          <Link href="/home" className="text-blue-500 hover:text-blue-700 mr-4">
            ← Geri
          </Link>
          <h1 className="text-2xl font-bold">Yeni Hasta Kaydı</h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 w-full">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                pattern="[0-9]{11}"
                title="11 haneli TC kimlik numarası giriniz"
              />
            </div>

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
                <option value="Diğer">Diğer</option>
              </select>
            </div>

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

            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Gen Analizi:
              </label>
              <GeneAnalysisSelect
                value={formData.geneAnalysis[0] || ''}
                onChange={(value) => setFormData(prev => ({ ...prev, geneAnalysis: [value] }))}
              />
            </div>

            <div className="flex items-center space-x-4">
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

          <div className="flex justify-end mt-6">
            <button
              type="submit"
              disabled={loading}
              className={`bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 ${
                loading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {loading ? 'Kaydet...' : 'Kaydet'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}