import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Our Portfolio",
  description:
    "Discover the exceptional vehicles we've sourced and the quality work we've delivered for our customers.",
}

export default function PortfolioPage() {
  return (
    <div className="min-h-screen bg-background dark:bg-gray-800">
      <main className="pt-20">
        {/* Hero Section */}
        <section className="bg-white dark:bg-gray-900 py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">Our Portfolio</h1>
              <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                Discover the exceptional vehicles we've sourced and the quality work we've delivered for our customers.
              </p>
            </div>
          </div>
        </section>

        {/* Featured Work */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* Portfolio Item 1 */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
                <img
                  src="/bmw-3-series-silver.jpg"
                  alt="BMW 3 Series restoration"
                  className="w-full h-48 object-cover"
                />
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">BMW 3 Series Restoration</h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-4">
                    Complete restoration of a classic BMW 3 Series, including engine rebuild and interior refurbishment.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <span className="px-3 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 text-sm rounded-full">
                      Restoration
                    </span>
                    <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-sm rounded-full">
                      BMW
                    </span>
                  </div>
                </div>
              </div>

              {/* Portfolio Item 2 */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
                <img
                  src="/audi-a4-avant-black.jpg"
                  alt="Audi A4 Avant detailing"
                  className="w-full h-48 object-cover"
                />
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Audi A4 Avant Detailing</h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-4">
                    Premium detailing service bringing this Audi A4 Avant back to showroom condition.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <span className="px-3 py-1 bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 text-sm rounded-full">
                      Detailing
                    </span>
                    <span className="px-3 py-1 bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 text-sm rounded-full">
                      Audi
                    </span>
                  </div>
                </div>
              </div>

              {/* Portfolio Item 3 */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
                <img
                  src="/mercedes-c-class-white.jpg"
                  alt="Mercedes C-Class service"
                  className="w-full h-48 object-cover"
                />
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Mercedes C-Class Service</h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-4">
                    Comprehensive service and maintenance for this Mercedes C-Class, ensuring peak performance.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <span className="px-3 py-1 bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 text-sm rounded-full">
                      Service
                    </span>
                    <span className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 text-sm rounded-full">
                      Mercedes
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="bg-white dark:bg-gray-900 py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Our Track Record</h2>
              <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                Numbers that speak to our commitment to excellence and customer satisfaction.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="text-4xl font-bold text-green-600 dark:text-green-400 mb-2">500+</div>
                <div className="text-gray-600 dark:text-gray-300">Vehicles Sold</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-green-600 dark:text-green-400 mb-2">1,200+</div>
                <div className="text-gray-600 dark:text-gray-300">Services Completed</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-green-600 dark:text-green-400 mb-2">98%</div>
                <div className="text-gray-600 dark:text-gray-300">Customer Satisfaction</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-green-600 dark:text-green-400 mb-2">9</div>
                <div className="text-gray-600 dark:text-gray-300">Years Experience</div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}
