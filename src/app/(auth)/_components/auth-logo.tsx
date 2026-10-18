import Link from "next/link"

export function AuthLogo() {
  return (
    <Link
      href="/"
      className="flex items-center gap-2.5 mx-auto group focus-visible:outline-none"
      aria-label="Back to Homepage"
    >
      {/* Dark rounded square with aperture shutter blades */}
      <div className="flex size-9 items-center justify-center rounded-xl bg-zinc-900 text-white shadow-sm transition-transform duration-200 group-hover:scale-105">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="size-5"
          aria-hidden="true"
        >
          <circle cx="12" cy="12" r="10" />
          <path d="m14.31 8 5.74 9.94" />
          <path d="M9.69 8h11.48" />
          <path d="m7.38 12 5.74-9.94" />
          <path d="M9.69 16 3.95 6.06" />
          <path d="M14.31 16H2.83" />
          <path d="m16.62 12-5.74 9.94" />
        </svg>
      </div>

      <span className="text-xl font-extrabold tracking-tight text-zinc-900">
        Film<span className="text-[#D94848]">Flow</span>
      </span>
    </Link>
  )
}
