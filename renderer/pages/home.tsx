import type { NextPage } from "next";
import Head from "next/head";
import Navbar from "../components/Navbar";
import { Plus, Users } from "lucide-react";
import { useEffect, useState } from "react";
import { IPatient } from '../types/patient';
import axios from 'axios';
import GeneAnalysisChart from '../components/GeneAnalysisChart';
import GeneMutationTypeChart from '../components/GeneMutationTypeChart';

const Home: NextPage = () => {
  const [patients, setPatients] = useState<IPatient[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    loadPatients();
  }, []);

  const loadPatients = async () => {
    try {
      const { data } = await axios.get("/api/getPatients");
      setPatients(data.patients);
    } catch (error) {
      console.error('Error loading patients:', error);
    }
  };

  const handleSearch = async () => {
    try {
      const { data } = await axios.get(`/api/getPatients${searchTerm ? `?search=${searchTerm}` : ''}`);
      setPatients(data.patients);
    } catch (error) {
      console.error('Error searching patients:', error);
    }
  };

  // Arama inputu değiştiğinde otomatik arama yapmak için
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      handleSearch();
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm]);

  // const handleMockData = async () => {
  //   try {
  //     const { data } = await axios.post("/api/mock", {
  //       name: "Defne KOÇOĞLU",
  //       birthday: "0001-01-01",
  //       testDay: "2025-02-26",
  //       gender: "KADIN",
  //       gene: "K695R/ A289V/R202Q BIRLESIK HETEROZIGOT"
  //     });
  //     console.log(data);
  //   } catch (error) {
  //     console.error('Error adding mock data:', error);
  //   }
  // };

  return (
    <div className="bg-slate-300 text-white">
      <Head>
        <title>FMF Database</title>
        <meta
          name="description"
          content="Patient Database Management System"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="w-screen min-h-screen py-10">
        <Navbar />
        <div className="container max-w-4xl mx-auto px-2">
          {/* Üst kısımdaki butonlar */}
          <div className="flex justify-between items-center mb-6">
            <a href="/addRecord" className="bg-slate-800 px-4 py-2 rounded flex gap-4 w-fit">
              <Plus /> Yeni Kayıt Ekle
            </a>

            {/* <button onClick={handleMockData} className="bg-slate-800 px-4 py-2 rounded flex gap-4 w-fit">Mock Data Ekle</button> */}
            
            <div className="flex gap-2 items-center justify-end">
              <input 
                type="text" 
                placeholder="İsme Göre Ara" 
                className="p-2 rounded transition-all w-48 duration-300 focus:w-64 text-black"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              />
              <button 
                className="bg-slate-800 rounded px-4 py-2"
                onClick={handleSearch}
              >
                Ara
              </button>
            </div>
          </div>

          {/* Toplam Hasta Sayısı */}
          <div className="bg-white p-6 rounded-lg shadow mb-6 flex items-center">
            <div className="bg-blue-500 p-3 rounded-full mr-4">
              <Users size={24} className="text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-800">Toplam Hasta Sayısı</h2>
              <p className="text-3xl font-bold text-blue-600">{patients.length}</p>
            </div>
          </div>

          {/* Gen Analizi Grafiği */}
          <GeneAnalysisChart patients={patients} />
          
          {/* Gen Mutasyon Tipi Grafiği */}
          <GeneMutationTypeChart patients={patients} />
          
          {/* Hasta Tablosu */}
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ad Soyad</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">TC Kimlik No</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Test Tarihi</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">İşlemler</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {patients.map((patient) => (
                  <tr key={patient.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{patient.fullName}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{patient.government_ID}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {new Date(patient.testDate).toLocaleDateString('tr-TR')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <a href={`/patient/${patient.id}`} className="text-indigo-600 hover:text-indigo-900">
                        Detay
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Home;
