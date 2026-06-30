import Sidebar from "@/components/Sidebar";
import MobileNav from "@/components/MobileNav";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen bg-love-bg">
      <Sidebar />
      <div className="pb-16 lg:pb-0 lg:pl-64">{children}</div>
      <MobileNav />
    </div>
  );
}
