export default function DashboardPage() {
  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">🏭 FactoryMind Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-600">📄 Documentos Indexados</h3>
          <p className="text-4xl font-bold text-blue-600 mt-2">24</p>
          <p className="text-sm text-gray-400 mt-1">+3 esta semana</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-600">💬 Consultas Hoy</h3>
          <p className="text-4xl font-bold text-green-600 mt-2">47</p>
          <p className="text-sm text-gray-400 mt-1">Tiempo promedio: 1.8s</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-600">📊 Precisión RAG</h3>
          <p className="text-4xl font-bold text-purple-600 mt-2">94%</p>
          <p className="text-sm text-gray-400 mt-1">Chunks relevantes recuperados</p>
        </div>
      </div>
    </div>
  );
}