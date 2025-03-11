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

interface GeneMutationTypeChartProps {
  patients: Array<{ geneAnalysis: string[] }>;
}

export default function GeneMutationTypeChart({ patients }: GeneMutationTypeChartProps) {
  const [mutationTypeData, setMutationTypeData] = useState<{ [key: string]: number }>({});

  useEffect(() => {
    const mutationTypeCount: { [key: string]: number } = {};
    
    patients.forEach(patient => {
      patient.geneAnalysis.forEach(gene => {
        if (gene.trim()) {
          // Initialize a set to track which mutation types we've counted for this gene
          // to avoid double counting in complex cases
          const countedTypes = new Set<string>();
          
          // Check for compound heterozygous mutations first (most specific)
          if (gene.includes('BIRLESIK HETEROZIGOT') || gene.includes('BIRLEŞIK HETEROZIGOT')) {
            mutationTypeCount['BIRLEŞIK HETEROZIGOT'] = (mutationTypeCount['BIRLEŞIK HETEROZIGOT'] || 0) + 1;
            countedTypes.add('BIRLEŞIK HETEROZIGOT');
          }
          
          // Check for compound homozygous mutations
          if (gene.includes('BIRLESIK HOMOZIGOT') || gene.includes('BIRLEŞIK HOMOZIGOT')) {
            mutationTypeCount['BIRLEŞIK HOMOZIGOT'] = (mutationTypeCount['BIRLEŞIK HOMOZIGOT'] || 0) + 1;
            countedTypes.add('BIRLEŞIK HOMOZIGOT');
          }
          
          // Check for simple homozygous mutations if not already counted as compound
          if (!countedTypes.has('BIRLEŞIK HOMOZIGOT') && gene.includes('HOMOZIGOT')) {
            mutationTypeCount['HOMOZIGOT'] = (mutationTypeCount['HOMOZIGOT'] || 0) + 1;
            countedTypes.add('HOMOZIGOT');
          }
          
          // Check for simple heterozygous mutations if not already counted as compound
          if (!countedTypes.has('BIRLEŞIK HETEROZIGOT') && gene.includes('HETEROZIGOT')) {
            mutationTypeCount['HETEROZIGOT'] = (mutationTypeCount['HETEROZIGOT'] || 0) + 1;
            countedTypes.add('HETEROZIGOT');
          }
          
          // If no recognized mutation type was found, count as "OTHER"
          if (countedTypes.size === 0) {
            mutationTypeCount['DİĞER'] = (mutationTypeCount['DİĞER'] || 0) + 1;
          }
        }
      });
    });
    
    // Sort data by count (descending)
    const sortedMutationTypeCount = Object.fromEntries(
      Object.entries(mutationTypeCount).sort(([,a], [,b]) => b - a)
    );
    
    setMutationTypeData(sortedMutationTypeCount);
  }, [patients]);

  const chartData = {
    labels: Object.keys(mutationTypeData),
    datasets: [
      {
        label: 'Hasta Sayısı',
        data: Object.values(mutationTypeData),
        backgroundColor: [
          'rgba(75, 192, 192, 0.9)',  // Teal
          'rgba(54, 162, 235, 0.9)',  // Blue
          'rgba(153, 102, 255, 0.9)', // Purple
          'rgba(255, 159, 64, 0.9)',  // Orange
          'rgba(255, 99, 132, 0.9)',  // Red
        ],
        borderColor: [
          'rgba(75, 192, 192, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(153, 102, 255, 1)',
          'rgba(255, 159, 64, 1)',
          'rgba(255, 99, 132, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: 'Gen Mutasyon Tipi Dağılımı',
        font: {
          size: 16,
          weight: 'bold'
        }
      },
      tooltip: {
        callbacks: {
          label: function(context: any) {
            return `Hasta Sayısı: ${context.parsed.y}`;
          }
        }
      }
    },
    scales: {
      y: {
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
      x: {
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
      <div style={{ height: '400px' }}>
        <Bar data={chartData} options={options as any} />
      </div>
      
      <div className="mt-6 overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-teal-600">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                Mutasyon Tipi
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
            {Object.entries(mutationTypeData).map(([mutationType, count]) => {
              const percentage = ((count / patients.length) * 100).toFixed(1);
              return (
                <tr key={mutationType}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {mutationType}
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