import AdminGuard from "./admin-guard";
import AdminLayout from "./admin-layout";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <AdminGuard>
      <AdminLayout>{children}</AdminLayout>
    </AdminGuard>
  );
}
