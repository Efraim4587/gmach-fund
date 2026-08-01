export default function Home() {
  return (
    <main className="min-h-screen p-8 bg-gray-50 text-gray-900">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-4">Gmach / Shared Investment Pool</h1>
        <p className="text-lg mb-8">
          Welcome to the Unitized NAV Fund Management System.
        </p>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h2 className="text-xl font-semibold mb-2">System Status</h2>
          <p>Database schema and core math engine loaded successfully.</p>
        </div>
      </div>
    </main>
  );
}
