import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "About Shiftbox",
  description:
    "Providing quality cars and expert services.",
}

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background dark:bg-gray-800">
      <main className="pt-20">
        {/* Hero Section */}
        <section className="bg-white dark:bg-gray-900 py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">About Shiftbox</h1>
              <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                Providing quality cars and expert services.
              </p>
            </div>
          </div>
        </section>

        {/* Story Section */}
        <section className="py-16 bg-gray-100 dark:bg-gray-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Our Story</h2>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  Founded in 2025 outside of Milnthorpe, Shiftbox began serving the Lake District community with
                  quality pre-owned vehicles and premium automotive services.
                </p>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  We specialize in carefully sourcing great vehicles and providing comprehensive automotive services, from
                  routine maintenance and servicing to comprehensive detailing. Our commitment to quality and customer satisfaction
                  intends to make us a cornerstone of the local automotive community.
                </p>
                <p className="text-gray-600 dark:text-gray-300">
                  Located in the heart of beautiful countryside, we understand the unique needs of drivers in the Lake District, whether
                  you're navigating country roads or travelling further afield.
                </p>
              </div>
              <div>
                <img
                  src="/professional-automotive-workshop-with-modern-equip.jpg"
                  alt="Shiftbox workshop"
                  className="rounded-lg shadow-lg"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="bg-white dark:bg-gray-900 py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Our Values</h2>
              <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                These core principles guide everything we do at Shiftbox.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
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
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Quality First</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Every vehicle and service meets our rigorous standards for excellence and reliability.
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
                      d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Customer Focus</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Your satisfaction is our priority. We build lasting relationships through exceptional service.
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
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Innovation</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  We embrace the latest automotive technologies and techniques to serve you better.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}
