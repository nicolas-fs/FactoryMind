'use client';
import { useState } from 'react';

export default function UploadPage() {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState('');

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/upload`, {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      setMessage(`✅ ${data.message}`);
      setFile(null);
    } catch (error) {
      setMessage('❌ Error al subir el documento');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">📤 Subir Documento</h1>
      <form onSubmit={handleUpload} className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
        <label className="block mb-4">
          <span className="text-gray-700 font-medium">Selecciona un archivo PDF o TXT</span>
          <input
            type="file"
            accept=".pdf,.txt"
            onChange={e => setFile(e.target.files?.[0] || null)}
            className="mt-2 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          />
        </label>
        <button
          type="submit"
          disabled={!file || uploading}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-300"
        >
          {uploading ? 'Procesando...' : 'Subir e Indexar'}
        </button>
        {message && <p className="mt-4 text-sm text-gray-600">{message}</p>}
      </form>
    </div>
  );
}