export default function TrustedSection() {
  const companies = [
    { name: "Vodafone", style: "text-red-500" },
    { name: "intel.", style: "text-blue-700" },
    { name: "TESLA", style: "text-gray-800 tracking-widest" },
    { name: "AMD\u0394", style: "text-gray-800" },
    { name: "Talkit", style: "text-gray-700" },
  ];

  return (
    <section className="bg-white border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-12">
        <p className="text-sm text-gray-400 font-medium mb-8">
          Companies we helped grow
        </p>
        <div className="flex flex-wrap items-center justify-between">
          {companies.map((c) => (
            <span
              key={c.name}
              className={`text-xl sm:text-2xl font-bold opacity-50 hover:opacity-80 transition-opacity cursor-default select-none ${c.style}`}
            >
              {c.name}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
