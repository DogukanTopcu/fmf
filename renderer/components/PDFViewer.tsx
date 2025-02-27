import { useState } from 'react';

interface PDFViewerProps {
  pdfUrl: string;
  onClose: () => void;
}

export default function PDFViewer({ pdfUrl, onClose }: PDFViewerProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-4 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between mb-4">
          <h2 className="text-lg font-semibold">Belge Görüntüleyici</h2>
          <button
            onClick={onClose}
            className="px-3 py-1 bg-red-500 text-white rounded"
          >
            Kapat
          </button>
        </div>
        <iframe
          src={`${pdfUrl}#toolbar=0`}
          className="w-full h-[80vh]"
          title="PDF Viewer"
        />
      </div>
    </div>
  );
} 