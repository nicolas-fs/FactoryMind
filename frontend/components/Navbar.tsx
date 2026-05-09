import Link from 'next/link';

export default function Navbar() {
  return (
    <nav className="bg-white border-b border-gray-200 shadow-sm">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/dashboard" className="text-xl font-bold text-blue-600">
          🏭 FactoryMind
        </Link>
        <div className="flex gap-6 text-sm font-medium text-gray-600">
          <Link href="/dashboard" className="hover:text-blue-600 transition-colors">Dashboard</Link>
          <Link href="/upload" className="hover:text-blue-600 transition-colors">Subir Documento</Link>
          <Link href="/chat" className="hover:text-blue-600 transition-colors">Chat</Link>
        </div>
      </div>
    </nav>
  );
}