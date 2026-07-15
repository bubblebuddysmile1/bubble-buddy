import Image from 'next/image'
import { Headphones, Leaf, ShieldCheck, Sparkles, Truck } from 'lucide-react'
import BestSellingProducts from '@/components/store/BestSellingProducts'
import PromoBannerSection from '@/components/store/PromoBannerSection'
import FlashSaleSection from '@/components/store/FlashSaleSection'

export const metadata = {
  title: 'About Bubble Buddy Smile | Premium Skincare, Haircare & Makeup',
  description:
    'Learn how Bubble Buddy Smile brings premium skincare, haircare, and makeup essentials to customers with quality ingredients, trusted values, and friendly support.',
}

const features = [
  {
    title: 'Premium Quality Ingredients',
    description: 'Thoughtfully selected formulas created to look beautiful and feel gentle on your skin.',
    icon: Sparkles,
  },
  {
    title: 'Cruelty-Free Products',
    description: 'We believe in beauty that respects both people and animals.',
    icon: ShieldCheck,
  },
  {
    title: 'Fast & Secure Delivery',
    description: 'Your order is packed with care and delivered with dependable shipping support.',
    icon: Truck,
  },
  {
    title: 'Dedicated Customer Support',
    description: 'Our team is here to guide you before, during, and after every purchase.',
    icon: Headphones,
  },
]

const faqItems = [
  {
    question: 'What is Bubble Buddy Smile?',
    answer:
      'Bubble Buddy Smile is a beauty and skincare destination focused on premium essentials for glowing skin, healthy hair, and confident makeup looks.',
  },
  {
    question: 'Where are your products made?',
    answer:
      'We source and curate products from trusted manufacturers that follow quality standards and responsible production practices.',
  },
  {
    question: 'Are your products cruelty-free?',
    answer:
      'Yes. We are committed to offering products that support cruelty-free beauty choices whenever possible.',
  },
  {
    question: 'How can I contact customer support?',
    answer:
      'You can reach us through the contact page, email, or our support channels for order questions, product advice, and returns.',
  },
  {
    question: 'Do you offer products for different skin needs?',
    answer:
      'Absolutely. Our collections are designed to suit a wide range of beauty goals, from everyday care to special occasion routines.',
  },
]

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faqItems.map((item) => ({
    '@type': 'Question',
    name: item.question,
    acceptedAnswer: {
      '@type': 'Answer',
      text: item.answer,
    },
  })),
}

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-background py-12 text-foreground">
      <div className="mx-auto max-w-7xl px-4 contrast-more:mt-12 sm:px-6 lg:px-8">
        <section className="mb-8 overflow-hidden rounded-[2rem] border border-border bg-card p-8 shadow-lg sm:p-10 lg:p-12" aria-labelledby="about-hero-title">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-primary">About Us</p>
          <h1 id="about-hero-title" className="mt-3 text-4xl font-bold leading-tight sm:text-5xl">
            We are a team of passionate beauty enthusiasts who are dedicated to providing the best products for your beauty needs.
          </h1>
          <p className="mt-6 max-w-3xl text-lg leading-8 text-muted-foreground">
            At <span className="font-semibold text-primary">Bubble Buddy Smile</span>, we believe beauty starts with confidence, self-care, and a natural glow. Our mission is to bring premium skincare, makeup, and beauty essentials that help you feel beautiful every single day.
          </p>
        </section>

        <section id="our-story" className="mb-8 grid gap-8 rounded-[2rem] border border-border bg-card/80 p-6 shadow-sm sm:p-8 lg:grid-cols-[1.1fr_0.9fr] lg:p-10" aria-labelledby="our-story-title">
          <div>
            <h2 id="our-story-title" className="text-3xl font-semibold tracking-tight text-foreground">
              Our Story
            </h2>
            <div className="mt-6 space-y-4 text-base leading-8 text-muted-foreground">
              <p>
                Bubble Buddy Smile began with a simple belief: beautiful routines should feel joyful, attainable, and rooted in quality. What started as a passion for skincare, haircare, and makeup grew into a destination for people who want elevated beauty essentials without the overwhelm.
              </p>
              <p>
                Our mission is to make premium beauty products easier to discover, with thoughtful curation, honest guidance, and formulas that support confidence from the first swipe to the final finish.
              </p>
            </div>
          </div>
          <div className="overflow-hidden rounded-[1.75rem] border border-border bg-background/70">
            <Image
              src="/about-us-hero.svg"
              alt="Illustration of skincare, haircare, and makeup essentials curated by Bubble Buddy Smile"
              width={900}
              height={650}
              className="h-full w-full object-cover"
            />
          </div>
        </section>

        <section id="why-choose-us" className="mb-8 rounded-[2rem] border border-border bg-card/70 p-6 shadow-sm sm:p-8 lg:p-10" aria-labelledby="why-choose-title">
          <div className="max-w-2xl">
            <h2 id="why-choose-title" className="text-3xl font-semibold tracking-tight text-foreground">
              Why Choose Bubble Buddy Smile
            </h2>
            <p className="mt-3 text-base leading-7 text-muted-foreground">
              We combine premium selections, thoughtful service, and a customer-first approach to make every beauty purchase feel effortless.
            </p>
          </div>
          <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {features.map((feature) => {
              const Icon = feature.icon
              return (
                <article key={feature.title} className="rounded-[1.5rem] border border-border bg-background/80 p-6 shadow-sm">
                  <div className="inline-flex rounded-2xl bg-primary/10 p-3 text-primary">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="mt-4 text-lg font-semibold text-foreground">{feature.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">{feature.description}</p>
                </article>
              )
            })}
          </div>
        </section>

        <section id="our-values" className="mb-8 rounded-[2rem] border border-border bg-card/70 p-6 shadow-sm sm:p-8 lg:p-10" aria-labelledby="our-values-title">
          <div className="max-w-2xl">
            <h2 id="our-values-title" className="text-3xl font-semibold tracking-tight text-foreground">
              What We Stand For
            </h2>
            <p className="mt-3 text-base leading-7 text-muted-foreground">
              Our values guide every product selection, packaging decision, and customer interaction.
            </p>
          </div>
          <div className="mt-8 grid gap-6 lg:grid-cols-3">
            <article className="rounded-[1.5rem] border border-border bg-background/80 p-6">
              <div className="inline-flex rounded-2xl bg-primary/10 p-3 text-primary">
                <Leaf className="h-5 w-5" />
              </div>
              <h3 className="mt-4 text-xl font-semibold text-foreground">Natural Ingredients</h3>
              <p className="mt-3 text-sm leading-7 text-muted-foreground">
                We champion beauty essentials that feel mindful, refreshing, and supportive of daily self-care rituals.
              </p>
            </article>
            <article className="rounded-[1.5rem] border border-border bg-background/80 p-6">
              <div className="inline-flex rounded-2xl bg-primary/10 p-3 text-primary">
                <Sparkles className="h-5 w-5" />
              </div>
              <h3 className="mt-4 text-xl font-semibold text-foreground">Affordable Luxury</h3>
              <p className="mt-3 text-sm leading-7 text-muted-foreground">
                Premium beauty should feel within reach, giving you a polished experience without compromising on quality.
              </p>
            </article>
            <article className="rounded-[1.5rem] border border-border bg-background/80 p-6">
              <div className="inline-flex rounded-2xl bg-primary/10 p-3 text-primary">
                <Headphones className="h-5 w-5" />
              </div>
              <h3 className="mt-4 text-xl font-semibold text-foreground">Customer First</h3>
              <p className="mt-3 text-sm leading-7 text-muted-foreground">
                From helpful guidance to responsive support, we put your confidence and comfort at the center of every interaction.
              </p>
            </article>
          </div>
        </section>

        <section id="faq" className="rounded-[2rem] border border-border bg-card/70 p-6 shadow-sm sm:p-8 lg:p-10" aria-labelledby="faq-title">
          <div className="max-w-2xl">
            <h2 id="faq-title" className="text-3xl font-semibold tracking-tight text-foreground">
              Frequently Asked Questions
            </h2>
            <p className="mt-3 text-base leading-7 text-muted-foreground">
              Everything you need to know about our brand, our products, and how we support your beauty journey.
            </p>
          </div>
          <div className="mt-8 space-y-4">
            {faqItems.map((item, index) => (
              <details key={item.question} className="group rounded-[1.5rem] border border-border bg-background/80 p-0 shadow-sm">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 rounded-[1.5rem] p-5 text-left text-base font-medium text-foreground">
                  <span className="flex items-center gap-3">
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
                      {index + 1}
                    </span>
                    <span>{item.question}</span>
                  </span>
                  <svg className="h-5 w-5 shrink-0 text-muted-foreground transition-transform group-open:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </summary>
                <p className="px-5 pb-5 text-sm leading-7 text-muted-foreground">{item.answer}</p>
              </details>
            ))}
          </div>
        </section>
      </div>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      <BestSellingProducts />
      <PromoBannerSection />
      <FlashSaleSection />
    </main>
  )
}
