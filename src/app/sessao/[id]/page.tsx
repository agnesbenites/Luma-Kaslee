import { ChatSessao } from "@/components/chat-sessao";

export default function PaginaSessao({
  params,
}: {
  params: { id: string };
}) {
  return (
    <main className="p-6">
      <ChatSessao sessaoId={params.id} />
    </main>
  );
}