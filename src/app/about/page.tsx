import BestSellingProducts from '@/components/store/BestSellingProducts'
import PromoBannerSection from '@/components/store/PromoBannerSection'
import FlashSaleSection from '@/components/store/FlashSaleSection'

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-background text-foreground py-12">
      <div className=" mx-auto px-4 contrast-more:mt-12 max-w-7xl">
        <div className="mb-8 rounded-[2rem] border border-border bg-card p-8 shadow-lg">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-primary">About Us</p>
          <h1 className="mt-3 text-4xl font-bold">We are a team of passionate beauty enthusiasts who are dedicated to providing the best products for your beauty needs.</h1>
          <p className="mt-6 text-lg text-muted-foreground leading-8 max-w-3xl">
            At <span className="font-semibold text-primary">Bubble Buddy Smile</span>,
            we believe beauty starts with confidence, self-care, and a natural glow.
            Our mission is to bring premium skincare, makeup, and beauty essentials
            that help you feel beautiful every single day.
          </p>
        </div>
      </div>
        <BestSellingProducts/>
        <PromoBannerSection/>
        <FlashSaleSection/>
    </main>
  )
}
