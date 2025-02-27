import { useEffect, useState } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface GeneAnalysisChartProps {
  patients: Array<{ geneAnalysis: string[] }>;
}

export default function GeneAnalysisChart({ patients }: GeneAnalysisChartProps) {
  const [geneData, setGeneData] = useState<{ [key: string]: number }>({});

  useEffect(() => {
    const geneCount: { [key: string]: number } = {};
    patients.forEach(patient => {
      patient.geneAnalysis.forEach(gene => {
        if (gene.trim()) {
          geneCount[gene] = (geneCount[gene] || 0) + 1;
        }
      });
    });
    // Verileri sayıya göre sırala (büyükten küçüğe)
    const sortedGeneCount = Object.fromEntries(
      Object.entries(geneCount).sort(([,a], [,b]) => b - a)
    );
    setGeneData(sortedGeneCount);
  }, [patients]);

  const chartData = {
    labels: Object.keys(geneData),
    datasets: [
      {
        label: 'Hasta Sayısı',
        data: Object.values(geneData),
        backgroundColor: 'rgba(54, 162, 235, 0.9)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1,
      },
    ],
  };

  const options = {
    indexAxis: 'y' as const, // Yatay bar için
    responsive: true,
    plugins: {
      legend: {
        display: false, // Legend'ı gizle
      },
      title: {
        display: true,
        text: 'Gen Analizi Dağılımı',
        font: {
          size: 16,
          weight: 'bold'
        }
      },
      tooltip: {
        callbacks: {
          label: function(context: any) {
            return `Hasta Sayısı: ${context.parsed.x}`;
          }
        }
      }
    },
    color: "red",
    scales: {
      x: {
        beginAtZero: true,
        ticks: {
          stepSize: 1,
          precision: 0
        },
        title: {
          display: true,
          text: 'Hasta Sayısı',
          font: {
            weight: 'bold'
          }
        }
      },
      y: {
        ticks: {
          font: {
            weight: 'bold'
          }
        }
      }
    },
    maintainAspectRatio: false
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow mb-6">
      <div style={{ height: `${Math.max(Object.keys(geneData).length * 40, 200)}px` }}>
        <Bar data={chartData} options={options as any} />
      </div>
      
      <div className="mt-6 overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-blue-600">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                Gen Analizi
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                Hasta Sayısı
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                Yüzde
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {Object.entries(geneData).map(([gene, count]) => {
              const percentage = ((count / patients.length) * 100).toFixed(1);
              return (
                <tr key={gene}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {gene}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {count}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    %{percentage}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
} 