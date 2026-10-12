import Image from "next/image"

export function BannerShowcase() {
  return (
    <section
      aria-label="Vietnam Analog Film Journey"
      className="relative w-full overflow-hidden bg-white py-6 sm:py-12"
    >
      <div className="mx-auto w-full sm:w-[80%] max-w-6xl px-4 sm:px-6">
        <div className="relative w-full overflow-hidden">
          <Image
            src="/images/vietnam-banner.png"
            alt="Vietnam Analog Film Journey - From Hanoi to Saigon, preserving memories through film"
            width={1920}
            height={1080}
            sizes="(max-width: 768px) 100vw, 80vw"
            priority
            className="w-full h-auto object-contain select-none transition-transform duration-700 ease-out hover:scale-[1.01]"
          />
        </div>
      </div>
    </section>
  )
}
