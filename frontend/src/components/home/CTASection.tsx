import Link from "next/link";
import Image from "next/image";

export default function CTASection() {
  return (
    <section className="bg-indigo-600">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        <div className="grid lg:grid-cols-2 gap-8 items-center">
          {/* Left Content */}
          <div className="py-16 sm:py-20 lg:py-24">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight mb-4">
              Start posting
              <br />
              jobs today
            </h2>

            <p className="text-indigo-100 text-lg mb-8">
              Start posting jobs for only $10.
            </p>

            <Link
              href="/admin"
              className="inline-block bg-white text-indigo-700 font-semibold px-8 py-3.5 rounded-sm hover:bg-gray-50 transition-colors"
            >
              Sign Up For Free
            </Link>
          </div>

          {/* Right Content - Dashboard Image */}
          <div className="relative hidden lg:flex items-end justify-center pt-10">
            <Image
              src="/dashboard.png"
              alt="Dashboard preview"
              width={600}
              height={450}
              className="object-contain rounded-t-lg shadow-2xl"
              priority
            />
          </div>
        </div>
      </div>
    </section>
  );
}
