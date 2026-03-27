import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import { BottomNav } from "@/components/layout/BottomNav";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-background text-foreground selection:bg-primary-yellow/30">
      <Sidebar />
      <main className="flex-1 flex flex-col relative w-full overflow-hidden">
        <Header />
        <div className="flex-1 overflow-y-auto p-4 md:p-8 pb-20 md:pb-8">
          <div className="mx-auto max-w-7xl">
            {children}
          </div>
        </div>
      </main>
      <BottomNav />
    </div>
  );
}
