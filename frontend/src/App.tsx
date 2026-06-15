function App() {
  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <nav className="flex items-center justify-between px-8 py-6 border-b border-slate-800">
        <h1 className="text-3xl font-bold">BillStream</h1>

        <div className="space-x-4">
          <button className="px-4 py-2">
            Login
          </button>

          <button className="px-4 py-2 bg-blue-600 rounded-lg">
            Get Started
          </button>
        </div>
      </nav>

      <section className="flex flex-col items-center justify-center text-center px-6 py-32">
        <h1 className="text-6xl font-bold mb-6">
          Monetize APIs at Scale
        </h1>

        <p className="text-slate-400 text-xl max-w-3xl mb-8">
          Multi-Tenant API Billing, Usage Metering,
          Analytics and Rate Limiting Platform.
        </p>

        <div className="space-x-4">
          <button className="px-6 py-3 bg-blue-600 rounded-lg">
            Start Free
          </button>

          <button className="px-6 py-3 border border-slate-700 rounded-lg">
            View Pricing
          </button>
        </div>
      </section>
    </div>
  );
}

export default App;