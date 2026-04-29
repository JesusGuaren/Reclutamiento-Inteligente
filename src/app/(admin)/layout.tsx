import Navbar from "@/components/Navbar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navbar />
      <main className="max-w-4xl mx-auto px-4 py-8 pb-32 md:pb-12 md:pt-24">
        {children}
      </main>
    </>
  );
}
