import Image from "next/image";
import Link from "next/link";

export default function BeautyBannerSection() {
  return (
    <section aria-label="Featured beauty collections" className="w-full overflow-hidden bg-[#fff1f4]">
      <div className="group relative aspect-2048/760 min-h-62.5 w-full overflow-hidden sm:min-h-90 lg:min-h-0">
        <Image
          src="/slider/slider1.png"
          alt="Bubble Buddy skincare essentials for naturally glowing skin"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center transition-transform duration-1000 group-hover:scale-[1.015]"
        />
        <Link
          href="/shop"
          aria-label="Shop the featured collection"
          className="absolute bottom-8 left-6 rounded-full bg-white/95 px-6 py-3 text-sm font-semibold text-[#b94d6b] shadow-lg transition hover:bg-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#b94d6b] sm:bottom-10 sm:left-10"
        >
          Shop collection
        </Link>
      </div>
    </section>
  );
}
