import Link from "next/link"

export default function DetailingPage() {
  return (
    <div className="min-h-screen bg-background dark:bg-gray-800">
      <main className="pt-20">
        {/* Hero Section */}
        <section className="bg-white dark:bg-gray-900 py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <nav className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                <Link href="/services" className="hover:text-green-600 dark:hover:text-green-400">
                  Services
                </Link>{" "}
                / Professional Detailing
              </nav>
              <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">Professional Vehicle Detailing</h1>
              <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                Transform your vehicle with our premium detailing services. From paint correction to ceramic coatings,
                we restore and protect your investment.
              </p>
            </div>
          </div>
        </section>

        {/* Service Details */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <img
                  src="/professional-car-showroom-with-luxury-vehicles.jpg"
                  alt="Professional car detailing"
                  className="rounded-lg shadow-lg"
                />
              </div>
              <div>
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Showroom Quality Results</h2>
                <p className="text-gray-600 dark:text-gray-300 mb-6">
                  Our professional detailing services go far beyond a simple car wash. Using premium products and
                  advanced techniques, we restore your vehicle's appearance while providing long-lasting protection.
                </p>
                <p className="text-gray-600 dark:text-gray-300 mb-8">
                  Whether you're preparing for a special event, maintaining a classic car, or simply want to keep your
                  daily driver looking its best, our detailing experts deliver exceptional results every time.
                </p>
                <Link
                  href="/contact"
                  className="inline-flex items-center px-6 py-3 bg-green-600 hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600 text-white font-semibold rounded-lg transition-colors"
                >
                  Book Detailing Service
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Detailing Packages */}
        <section className="bg-white dark:bg-gray-900 py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Detailing Packages</h2>
              <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                Choose from our comprehensive range of detailing packages, each designed to deliver exceptional results
                for different needs and budgets.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* Express Detail */}
              <div className="bg-background dark:bg-gray-800 rounded-lg p-8">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Express Detail</h3>
                <div className="text-3xl font-bold text-green-600 dark:text-green-400 mb-6">£45</div>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-center text-gray-600 dark:text-gray-300">
                    <svg
                      className="w-5 h-5 text-green-600 dark:text-green-400 mr-3"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Exterior wash & dry
                  </li>
                  <li className="flex items-center text-gray-600 dark:text-gray-300">
                    <svg
                      className="w-5 h-5 text-green-600 dark:text-green-400 mr-3"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Wheel & tyre cleaning
                  </li>
                  <li className="flex items-center text-gray-600 dark:text-gray-300">
                    <svg
                      className="w-5 h-5 text-green-600 dark:text-green-400 mr-3"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Interior vacuum
                  </li>
                  <li className="flex items-center text-gray-600 dark:text-gray-300">
                    <svg
                      className="w-5 h-5 text-green-600 dark:text-green-400 mr-3"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Window cleaning
                  </li>
                </ul>
                <div className="text-sm text-gray-500 dark:text-gray-400 mb-6">Duration: 1-2 hours</div>
                <Link
                  href="/contact"
                  className="block w-full text-center px-6 py-3 border-2 border-green-600 dark:border-green-400 text-green-600 dark:text-green-400 font-semibold rounded-lg hover:bg-green-600 hover:text-white dark:hover:bg-green-400 dark:hover:text-gray-900 transition-colors"
                >
                  Book Now
                </Link>
              </div>

              {/* Premium Detail */}
              <div className="bg-green-600 dark:bg-green-700 rounded-lg p-8 text-white relative">
                <div className="absolute top-4 right-4 bg-white dark:bg-gray-800 text-green-600 dark:text-green-400 px-3 py-1 rounded-full text-sm font-semibold">
                  Popular
                </div>
                <h3 className="text-xl font-bold mb-4">Premium Detail</h3>
                <div className="text-3xl font-bold mb-6">£125</div>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-center">
                    <svg className="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Everything in Express Detail
                  </li>
                  <li className="flex items-center">
                    <svg className="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Paint decontamination
                  </li>
                  <li className="flex items-center">
                    <svg className="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Machine polishing
                  </li>
                  <li className="flex items-center">
                    <svg className="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Interior deep clean
                  </li>
                  <li className="flex items-center">
                    <svg className="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Leather conditioning
                  </li>
                </ul>
                <div className="text-sm mb-6">Duration: 3-4 hours</div>
                <Link
                  href="/contact"
                  className="block w-full text-center px-6 py-3 bg-white dark:bg-gray-800 text-green-600 dark:text-green-400 font-semibold rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  Book Now
                </Link>
              </div>

              {/* Ceramic Coating */}
              <div className="bg-background dark:bg-gray-800 rounded-lg p-8">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Ceramic Coating</h3>
                <div className="text-3xl font-bold text-green-600 dark:text-green-400 mb-6">£350</div>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-center text-gray-600 dark:text-gray-300">
                    <svg
                      className="w-5 h-5 text-green-600 dark:text-green-400 mr-3"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Everything in Premium Detail
                  </li>
                  <li className="flex items-center text-gray-600 dark:text-gray-300">
                    <svg
                      className="w-5 h-5 text-green-600 dark:text-green-400 mr-3"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Paint correction
                  </li>
                  <li className="flex items-center text-gray-600 dark:text-gray-300">
                    <svg
                      className="w-5 h-5 text-green-600 dark:text-green-400 mr-3"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Ceramic coating application
                  </li>
                  <li className="flex items-center text-gray-600 dark:text-gray-300">
                    <svg
                      className="w-5 h-5 text-green-600 dark:text-green-400 mr-3"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    5-year protection warranty
                  </li>
                  <li className="flex items-center text-gray-600 dark:text-gray-300">
                    <svg
                      className="w-5 h-5 text-green-600 dark:text-green-400 mr-3"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Maintenance kit included
                  </li>
                </ul>
                <div className="text-sm text-gray-500 dark:text-gray-400 mb-6">Duration: Full day service</div>
                <Link
                  href="/contact"
                  className="block w-full text-center px-6 py-3 border-2 border-green-600 dark:border-green-400 text-green-600 dark:text-green-400 font-semibold rounded-lg hover:bg-green-600 hover:text-white dark:hover:bg-green-400 dark:hover:text-gray-900 transition-colors"
                >
                  Book Now
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                Why Choose Professional Detailing?
              </h2>
              <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                Professional detailing offers benefits that go far beyond aesthetics, protecting your investment and
                enhancing your driving experience.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="bg-green-100 dark:bg-green-900 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg
                    className="w-8 h-8 text-green-600 dark:text-green-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Paint Protection</h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm">
                  Professional treatments protect your paint from UV damage, contaminants, and environmental hazards.
                </p>
              </div>

              <div className="text-center">
                <div className="bg-green-100 dark:bg-green-900 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg
                    className="w-8 h-8 text-green-600 dark:text-green-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Increased Value</h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm">
                  Regular professional detailing maintains your vehicle's appearance and helps preserve its resale
                  value.
                </p>
              </div>

              <div className="text-center">
                <div className="bg-green-100 dark:bg-green-900 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg
                    className="w-8 h-8 text-green-600 dark:text-green-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Time Saving</h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm">
                  Professional treatments last longer and require less frequent maintenance than DIY solutions.
                </p>
              </div>

              <div className="text-center">
                <div className="bg-green-100 dark:bg-green-900 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg
                    className="w-8 h-8 text-green-600 dark:text-green-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Pride of Ownership</h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm">
                  There's nothing quite like the satisfaction of driving a perfectly detailed, pristine vehicle.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}
