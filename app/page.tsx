import Header from "@/components/Header"
import Footer from "@/components/Footer"
import VehicleCard from "@/components/VehicleCard"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import Image from "next/image"
import { Car, Wrench, Sparkles, Shield, Clock, Star, ArrowRight, CheckCircle } from "lucide-react"

// Sample data - replace with actual Supabase data later
const featuredVehicles = [
  {
    id: 1,
    title: "BMW 3 Series 320d M Sport",
    make: "BMW",
    model: "3 Series",
    year: 2020,
    mileage: 45000,
    price: 22995,
    images: ["/bmw-3-series-silver.jpg"],
    status: "available",
  },
  {
    id: 2,
    title: "Audi A4 Avant S Line",
    make: "Audi",
    model: "A4",
    year: 2019,
    mileage: 38000,
    price: 24995,
    images: ["/audi-a4-avant-black.jpg"],
    status: "available",
  },
  {
    id: 3,
    title: "Mercedes C-Class C220d AMG Line",
    make: "Mercedes",
    model: "C-Class",
    year: 2021,
    mileage: 28000,
    price: 28995,
    images: ["/mercedes-c-class-white.jpg"],
    status: "available",
  },
]

const services = [
  {
    icon: Car,
    title: "Quality Used Cars",
    description: "Carefully selected, thoroughly inspected vehicles with full service history.",
    features: ["HPI Checked", "Full Service History", "Warranty Included", "Finance Available"],
  },
  {
    icon: Wrench,
    title: "Professional Servicing",
    description: "Expert maintenance and repairs using genuine parts and modern equipment.",
    features: ["MOT Testing", "Diagnostic Services", "Brake & Clutch", "Engine Repairs"],
  },
  {
    icon: Sparkles,
    title: "Premium Detailing",
    description: "Transform your vehicle with our comprehensive cleaning and protection services.",
    features: ["Paint Correction", "Ceramic Coating", "Interior Deep Clean", "Paint Protection"],
  },
]

const testimonials = [
  {
    name: "Sarah Johnson",
    location: "Kendal",
    rating: 5,
    text: "Excellent service from start to finish. Found the perfect car and the team made the whole process stress-free.",
  },
  {
    name: "Mike Thompson",
    location: "Windermere",
    rating: 5,
    text: "Outstanding detailing service. My car looks better than when I first bought it. Highly recommended!",
  },
  {
    name: "Emma Wilson",
    location: "Ambleside",
    rating: 5,
    text: "Professional and honest service. They went above and beyond to help me find the right vehicle.",
  },
]

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <Header />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-primary/10 to-accent/10 py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <Badge className="w-fit">Trusted in Cumbria Since 2015</Badge>
              <h1 className="text-4xl lg:text-6xl font-bold text-balance">
                Quality Cars &<span className="text-primary"> Expert Service</span>
                in Kendal
              </h1>
              <p className="text-xl text-muted-foreground text-pretty">
                From premium used vehicles to professional servicing and detailing, we're your trusted automotive
                partner in the Lake District.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" asChild>
                  <Link href="/vehicles">
                    Browse Vehicles <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link href="/services">Our Services</Link>
                </Button>
              </div>
            </div>
            <div className="relative">
              <Image
                src="/professional-car-showroom-with-luxury-vehicles.jpg"
                alt="Shiftbox showroom"
                width={600}
                height={500}
                className="rounded-lg shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Featured Vehicles */}
      <section className="py-16 bg-card">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4 text-balance">Featured Vehicles</h2>
            <p className="text-muted-foreground text-lg">Hand-picked quality cars, ready for their next adventure</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {featuredVehicles.map((vehicle) => (
              <VehicleCard key={vehicle.id} vehicle={vehicle} />
            ))}
          </div>

          <div className="text-center">
            <Button size="lg" variant="outline" asChild>
              <Link href="/vehicles">
                View All Vehicles <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4 text-balance">Our Services</h2>
            <p className="text-muted-foreground text-lg">Comprehensive automotive solutions for every need</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                <CardContent className="p-8">
                  <service.icon className="h-12 w-12 text-primary mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-3">{service.title}</h3>
                  <p className="text-muted-foreground mb-6 text-pretty">{service.description}</p>
                  <ul className="space-y-2">
                    {service.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center justify-center space-x-2 text-sm">
                        <CheckCircle className="h-4 w-4 text-primary" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16 bg-card">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6 text-balance">Why Choose Shiftbox?</h2>
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <Shield className="h-6 w-6 text-primary mt-1" />
                  <div>
                    <h3 className="font-semibold mb-2">Trusted & Transparent</h3>
                    <p className="text-muted-foreground">
                      No hidden fees, honest assessments, and transparent pricing on all our services.
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <Clock className="h-6 w-6 text-primary mt-1" />
                  <div>
                    <h3 className="font-semibold mb-2">Fast & Reliable</h3>
                    <p className="text-muted-foreground">
                      Quick turnaround times without compromising on quality or attention to detail.
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <Star className="h-6 w-6 text-primary mt-1" />
                  <div>
                    <h3 className="font-semibold mb-2">Expert Team</h3>
                    <p className="text-muted-foreground">
                      Experienced professionals passionate about cars and committed to excellence.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="relative">
              <Image
                src="/professional-automotive-workshop-with-modern-equip.jpg"
                alt="Professional workshop"
                width={500}
                height={400}
                className="rounded-lg shadow-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4 text-balance">What Our Customers Say</h2>
            <p className="text-muted-foreground text-lg">Don't just take our word for it</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <Card key={index}>
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-primary text-primary" />
                    ))}
                  </div>
                  <p className="text-muted-foreground mb-4 text-pretty">"{testimonial.text}"</p>
                  <div>
                    <p className="font-semibold">{testimonial.name}</p>
                    <p className="text-sm text-muted-foreground">{testimonial.location}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4 text-balance">Ready to Get Started?</h2>
          <p className="text-xl mb-8 text-pretty opacity-90">
            Whether you're looking for your next car or need professional servicing, we're here to help.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" asChild>
              <Link href="/contact">Get in Touch</Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="bg-transparent border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary"
              asChild
            >
              <Link href="/vehicles">Browse Vehicles</Link>
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
