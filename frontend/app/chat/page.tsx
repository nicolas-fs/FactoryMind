import ChatWindow from '@/components/ChatWindow';

export default function ChatPage() {
  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">💬 Consultas al Agente</h1>
      <ChatWindow />
    </div>
  );
}