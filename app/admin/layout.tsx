export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen">
      <aside className="w-60 bg-gray-900 text-white p-4">
        <nav className="flex flex-col gap-2">
          <a href="/admin/catalog">Catálogo</a>
          <a href="/admin/users">Usuarios</a>
        </nav>
      </aside>
      <main className="flex-1 overflow-y-auto p-6 bg-gray-50">{children}</main>
    </div>
  );
}