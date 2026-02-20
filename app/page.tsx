import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex min-h-screen w-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex min-h-screen w-screen max-w-3xl flex-col items-center py-32 px-16 bg-white dark:bg-black sm:items-start">
        <Image
          className="dark:invert"
          src="/omaha_logo.svg"
          alt="Brand representation"
          width={100}
          height={20}
          priority
        />
        <div className="text-base font-medium">
          <Link
            className="flex h-12 w-full items-center justify-center rounded-full
              border border-solid border-black/8 px-5 transition-colors hover:border-transparent
            hover:bg-black/4 dark:border-white/[.145] dark:hover:bg-[#1a1a1a] md:w-39.5"
            href="/dashboard"
            rel="noopener noreferrer"
          >
            Dashboard
          </Link>
        </div>
      </main>
    </div>
  );
}
