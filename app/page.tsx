import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { Button } from '@/components/ui/button'
import Image from 'next/image'

export const metadata = {
  title: 'Academix - Discover 50,000+ Courses from Top Universities & Providers',
  description: 'Find and compare free and paid courses from Harvard, MIT, Coursera, Udacity, and more. Learn at your own pace with courses for everyone.',
}

export default async function Home() {
  const session = await auth.api.getSession({ headers: await headers() })
  
  if (session?.user) {
    redirect('/student/dashboard')
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b border-border bg-card sticky top-0 z-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-lg bg-primary" />
              <span className="font-bold text-foreground text-lg">Academix</span>
            </Link>
            <div className="flex items-center space-x-2">
              <Link href="/sign-in">
                <Button variant="ghost">Sign In</Button>
              </Link>
              <Link href="/sign-up">
                <Button className="bg-primary hover:bg-primary/90">Get Started</Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative px-4 sm:px-6 lg:px-8 py-12 sm:py-20">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-foreground mb-6">
                Discover Courses<br />
                <span className="text-primary">From The World's Best Universities</span>
              </h1>
              <p className="text-lg text-foreground/70 mb-8 leading-relaxed">
                Browse 50,000+ free and paid courses from Harvard, MIT, Stanford, and other top universities. Learn from expert instructors at your own pace.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/courses">
                  <Button size="lg" className="bg-primary hover:bg-primary/90 text-base h-12 w-full sm:w-auto">
                    Browse Courses
                  </Button>
                </Link>
                <Link href="/sign-up">
                  <Button size="lg" variant="outline" className="text-base h-12 w-full sm:w-auto">
                    Create Account
                  </Button>
                </Link>
              </div>
              
              {/* Stats */}
              <div className="mt-12 grid grid-cols-3 gap-6">
                {[
                  { value: '50K+', label: 'Students' },
                  { value: '500+', label: 'Courses' },
                  { value: '94%', label: 'Success' },
                ].map((stat) => (
                  <div key={stat.label}>
                    <div className="text-2xl font-bold text-primary">{stat.value}</div>
                    <div className="text-sm text-foreground/60">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Image */}
            <div className="relative h-96 sm:h-[500px] rounded-xl overflow-hidden shadow-lg">
              <Image
                src="/hero-learning.png"
                alt="Students learning together"
                fill
                className="object-cover"
                priority
              />
            </div>
          </div>
        </div>
      </section>

      {/* Partners Section */}
      <section className="px-4 sm:px-6 lg:px-8 py-16 bg-gradient-to-r from-primary/5 to-accent/5">
        <div className="mx-auto max-w-7xl">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-3">Trusted by Students Worldwide</h2>
            <p className="text-foreground/70">Learn from top universities and industry leaders</p>
          </div>
          <div className="relative h-48 rounded-xl overflow-hidden shadow-md bg-white">
            <Image
              src="/partners.png"
              alt="Partner universities and institutions"
              fill
              className="object-contain p-8"
            />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="px-4 sm:px-6 lg:px-8 py-20 bg-secondary/50">
        <div className="mx-auto max-w-7xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">Why Choose Academix?</h2>
            <p className="text-lg text-foreground/70 max-w-2xl mx-auto">Find and compare thousands of courses from the world's best educators</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: '50,000+ Courses',
                description: 'Choose from thousands of courses across technology, business, arts, and more.',
                color: 'from-blue-500 to-blue-600',
              },
              {
                title: 'Free & Paid Options',
                description: 'Start with free courses or invest in comprehensive paid courses with certificates.',
                color: 'from-emerald-500 to-emerald-600',
              },
              {
                title: 'Top Universities',
                description: 'Learn from Harvard, MIT, Stanford, and other leading academic institutions.',
                color: 'from-amber-500 to-amber-600',
              },
              {
                title: 'Self-Paced Learning',
                description: 'Study whenever you want. Progress at your own speed with lifetime access.',
                color: 'from-purple-500 to-purple-600',
              },
              {
                title: 'Expert Instructors',
                description: 'Taught by industry professionals and university professors.',
                color: 'from-pink-500 to-pink-600',
              },
              {
                title: 'Course Comparison',
                description: 'Compare courses side-by-side to find the perfect fit for your goals.',
                color: 'from-indigo-500 to-indigo-600',
              },
            ].map((feature, idx) => (
              <div key={feature.title} className="bg-card rounded-xl border border-border hover:shadow-lg transition p-8">
                <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${feature.color} mb-4`} />
                <h3 className="text-xl font-semibold text-foreground mb-3">{feature.title}</h3>
                <p className="text-foreground/70">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-4 sm:px-6 lg:px-8 py-20 bg-gradient-to-r from-primary/10 to-accent/10">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">Start Learning for Free</h2>
          <p className="text-lg text-foreground/70 mb-8">Explore thousands of free courses or unlock premium content with a paid course.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/courses">
              <Button size="lg" className="bg-primary hover:bg-primary/90 text-base h-12 px-8">
                Browse All Courses
              </Button>
            </Link>
            <Link href="/sign-up">
              <Button size="lg" variant="outline" className="text-base h-12 px-8">
                Create Free Account
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-card py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
            <div className="lg:col-span-2">
              <Link href="/" className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-primary" />
                <span className="font-bold text-foreground text-lg">Academix</span>
              </Link>
              <p className="text-foreground/70 text-sm max-w-xs">Discover and compare thousands of free and paid courses from top universities and providers worldwide.</p>
            </div>
            {[
              { title: 'Explore', links: ['Browse Courses', 'Top Universities', 'Free Courses'] },
              { title: 'Company', links: ['About Us', 'Blog', 'Contact'] },
              { title: 'Resources', links: ['Help Center', 'Pricing', 'Terms'] },
            ].map((col) => (
              <div key={col.title}>
                <h4 className="font-semibold text-foreground mb-4">{col.title}</h4>
                <ul className="space-y-2">
                  {col.links.map((link) => (
                    <li key={link}>
                      <a href="#" className="text-foreground/60 hover:text-foreground transition text-sm">
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="border-t border-border pt-8 flex flex-col sm:flex-row justify-between items-center">
            <p className="text-foreground/60 text-sm">© 2024 Academix. All rights reserved.</p>
            <div className="flex gap-6 mt-4 sm:mt-0">
              {['Privacy', 'Terms', 'Cookies'].map((item) => (
                <a key={item} href="#" className="text-foreground/60 hover:text-foreground transition text-sm">
                  {item}
                </a>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
