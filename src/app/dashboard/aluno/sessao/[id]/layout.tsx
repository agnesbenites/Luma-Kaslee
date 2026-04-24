export default function SessaoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#FAF9FF] flex items-center justify-center px-4 py-12">
      {children}
    </div>
  );
}