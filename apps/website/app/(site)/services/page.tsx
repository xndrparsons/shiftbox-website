import Link from "next/link"

export default function ServicesPage() {
  return (
    <div className="min-h-screen bg-background dark:bg-gray-800">
      <main className="pt-20">
        {/* Hero Section */}
        <section className="bg-white dark:bg-gray-900 py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">Our Services</h1>
              <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                Comprehensive automotive services from routine maintenance to specialized detailing, all delivered with
                expert care and attention to detail.
              </p>
            </div>
          </div>
        </section>

        {/* Main Services */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Vehicle Servicing */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
                <img
                  src="/professional-automotive-workshop-with-modern-equip.jpg"
                  alt="Vehicle servicing"
                  className="w-full h-64 object-cover"
                />
                <div className="p-8">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                    Vehicle Servicing & Maintenance
                  </h2>
                  <p className="text-gray-600 dark:text-gray-300 mb-6">
                    Keep your vehicle running at peak performance with our comprehensive servicing and maintenance
                    programs. From routine oil changes to complex engine diagnostics.
                  </p>
                  <ul className="space-y-2 mb-6">
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
                      Full service inspections
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
                      Engine diagnostics & repair
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
                      Brake & suspension work
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
                      MOT preparation & testing
                    </li>
                  </ul>
                  <Link
                    href="/services/servicing"
                    className="inline-flex items-center px-6 py-3 bg-green-600 hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600 text-white font-semibold rounded-lg transition-colors"
                  >
                    Learn More
                    <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                </div>
              </div>

              {/* Vehicle Detailing */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
                <img
                  src="/professional-car-showroom-with-luxury-vehicles.jpg"
                  alt="Vehicle detailing"
                  className="w-full h-64 object-cover"
                />
                <div className="p-8">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Professional Detailing</h2>
                  <p className="text-gray-600 dark:text-gray-300 mb-6">
                    Restore your vehicle to showroom condition with our premium detailing services. From basic washes to
                    complete paint correction and protection.
                  </p>
                  <ul className="space-y-2 mb-6">
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
                      Paint correction & polishing
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
                      Interior deep cleaning
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
                      Leather treatment & protection
                    </li>
                  </ul>
                  <Link
                    href="/services/detailing"
                    className="inline-flex items-center px-6 py-3 bg-green-600 hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600 text-white font-semibold rounded-lg transition-colors"
                  >
                    Learn More
                    <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Additional Services */}
        <section className="bg-white dark:bg-gray-900 py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Additional Services</h2>
              <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                Beyond our core services, we offer specialized solutions for all your automotive needs.
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
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Pre-Purchase Inspections</h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm">
                  Comprehensive vehicle inspections before you buy to ensure you're making a smart investment.
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
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Performance Tuning</h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm">
                  Enhance your vehicle's performance with professional tuning and modification services.
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
                      d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Vehicle Sourcing</h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm">
                  Can't find the right vehicle? We'll source it for you from our extensive network of dealers.
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
                      d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Extended Warranties</h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm">
                  Protect your investment with comprehensive extended warranty options for peace of mind.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-green-600 dark:bg-green-700 rounded-lg px-8 py-12 text-center">
              <h2 className="text-3xl font-bold text-white mb-4">Ready to Get Started?</h2>
              <p className="text-green-100 dark:text-green-200 text-lg mb-8 max-w-2xl mx-auto">
                Contact us today for a quote or to schedule your service appointment. Our expert team is ready to help
                with all your automotive needs.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/contact"
                  className="inline-flex items-center px-8 py-3 bg-white text-green-600 font-semibold rounded-lg hover:bg-gray-100 transition-colors"
                >
                  Get a Quote
                </Link>
                <Link
                  href="/contact"
                  className="inline-flex items-center px-8 py-3 border-2 border-white text-white font-semibold rounded-lg hover:bg-white hover:text-green-600 transition-colors"
                >
                  Schedule Service
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}
