import { useState, useEffect } from 'react';

interface GeneAnalysisSelectProps {
  value: string;
  onChange: (value: string) => void;
}

const FMF_TYPES = ['fmf+', 'fmf-'] as const;
const MUTATION_TYPES = [
  'Homozigot',
  'Heterozigot',
  'Birleşik Homozigot',
  'Birleşik Heterozigot'
] as const;
const GENES = ['M694V', 'M680I', 'R202Q', 'V726A', 'R761H', 'E148Q'] as const;

export default function GeneAnalysisSelect({ value, onChange }: GeneAnalysisSelectProps) {
  const [fmfType, setFmfType] = useState<typeof FMF_TYPES[number] | ''>('');
  const [mutationType, setMutationType] = useState<typeof MUTATION_TYPES[number] | ''>('');
  const [selectedGenes, setSelectedGenes] = useState<typeof GENES[number][]>([]);

  useEffect(() => {
    if (fmfType === 'fmf-') {
      onChange('CONTROL');
    } else if (fmfType === 'fmf+' && mutationType && selectedGenes.length > 0) {
      if (['Birleşik Homozigot', 'Birleşik Heterozigot'].includes(mutationType)) {
        if (selectedGenes.length >= 2) {
          onChange(`${selectedGenes.join('/')} ${mutationType}`.toUpperCase());
        }
      } else {
        if (selectedGenes.length === 1) {
          onChange(`${selectedGenes[0]} ${mutationType}`.toUpperCase());
        }
      }
    }
  }, [fmfType, mutationType, selectedGenes]);

  const handleGeneSelect = (gene: typeof GENES[number]) => {
    if (['Homozigot', 'Heterozigot'].includes(mutationType)) {
      setSelectedGenes([gene]);
    } else {
      if (selectedGenes.includes(gene)) {
        setSelectedGenes(selectedGenes.filter(g => g !== gene));
      } else {
        setSelectedGenes([...selectedGenes, gene]);
      }
    }
  };

  return (
    <div className="flex gap-2 items-start">
      <div className="flex-1 space-y-2">
        {/* FMF Tipi Seçimi */}
        <select
          value={fmfType}
          onChange={(e) => {
            setFmfType(e.target.value as typeof FMF_TYPES[number]);
            setMutationType('');
            setSelectedGenes([]);
          }}
          className="w-full p-2 border rounded"
        >
          <option value="">FMF Tipini Seçin</option>
          {FMF_TYPES.map(type => (
            <option key={type} value={type}>{type}</option>
          ))}
        </select>

        {/* Mutasyon Tipi Seçimi */}
        {fmfType === 'fmf+' && (
          <select
            value={mutationType}
            onChange={(e) => {
              setMutationType(e.target.value as typeof MUTATION_TYPES[number]);
              setSelectedGenes([]);
            }}
            className="w-full p-2 border rounded"
          >
            <option value="">Mutasyon Tipini Seçin</option>
            {MUTATION_TYPES.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        )}

        {/* Gen Seçimi */}
        {fmfType === 'fmf+' && mutationType && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              {['Birleşik Homozigot', 'Birleşik Heterozigot'].includes(mutationType)
                ? 'En az 2 gen seçin'
                : 'Bir gen seçin'}
            </label>
            <div className="flex flex-wrap gap-2">
              {GENES.map(gene => (
                <button
                  key={gene}
                  type="button"
                  onClick={() => handleGeneSelect(gene)}
                  className={`px-3 py-1 rounded text-sm ${
                    selectedGenes.includes(gene)
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {gene}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 