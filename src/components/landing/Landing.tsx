import { HeroGlass } from "./HeroGlass";

const wineBtn =
  "inline-flex items-center justify-center gap-8 bg-midnight-wine text-paper-white rounded-buttons px-16 h-[48px] text-body font-w460 hover:opacity-90 transition-opacity";
const lilacBtn =
  "inline-flex items-center justify-center bg-lilac-mist text-ink-charcoal border border-ink-charcoal rounded-small-buttons px-16 py-8 text-body font-w460";

const steps = [
  {
    title: "Sign up with one email",
    body: "Use email and password, or continue with Google. One login covers everyone at home.",
  },
  {
    title: "Add each student",
    body: "Name, class (5 to 9), first language and medium. Add as many students as you need.",
  },
  {
    title: "Ask anything",
    body: "Answers come only from the resources for that student's class and medium.",
  },
];

export function Landing() {
  return (
    <div className="bg-warm-parchment">
      {/* Header: transparent + blur, hairline border (DESIGN.md Navigation Header) */}
      <header className="safe-top sticky top-0 z-50 border-b border-soft-mist bg-warm-parchment/70 backdrop-blur-[12px]">
        <div className="mx-auto flex h-[64px] max-w-page items-center justify-between px-16">
          <a href="/" className="text-label-bold font-w540 tracking-[-0.01em]">
            Keralite AI
          </a>
          <nav className="flex items-center gap-12">
            <a href="/auth" className="px-8 py-8 text-body hover:underline underline-offset-4">
              Log in
            </a>
            <a href="/auth?mode=signup" className={lilacBtn}>
              Sign up
            </a>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section id="hero-scene" className="hero-scene relative">
        <div className="mx-auto max-w-page px-16 pb-64 pt-64 text-center md:pb-96 md:pt-96">
          <span className="inline-flex rounded-pill bg-lilac-mist px-12 py-4 text-body-sm">
            For Kerala students · Class 5 to 9
          </span>
          <h1 className="mx-auto mt-24 max-w-[760px] text-[40px] font-w460 leading-[1.05] tracking-[-0.028em] md:text-display">
            Study help that knows your textbook.
          </h1>
          <p className="mx-auto mt-20 max-w-[560px] text-label-bold leading-[1.4]">
            Ask a question and Keralite AI answers from the resources for your class and medium.
          </p>
          <div className="mt-32 flex flex-col items-center justify-center gap-12 sm:flex-row">
            <a href="/auth?mode=signup" className={`${wineBtn} w-full sm:w-auto`}>
              Get started <span aria-hidden>→</span>
            </a>
            <a href="/auth" className="px-16 py-12 text-body hover:underline underline-offset-4">
              I already have an account
            </a>
          </div>

          <HeroGlass />
        </div>
      </section>

      {/* How it works */}
      <section id="how" className="mx-auto max-w-page scroll-mt-[80px] px-16 py-64 md:py-96">
        <h2 className="max-w-[640px] text-[32px] font-w460 leading-[1.1] tracking-[-0.022em] md:text-[48px] md:leading-[0.96]">
          Set up once, then just ask.
        </h2>
        <div className="mt-40 grid gap-16 md:grid-cols-3">
          {steps.map((s, i) => (
            <div key={s.title} className="rounded-cards border border-soft-mist bg-paper-white p-16">
              <p className="text-caption text-stone-gray">Step {i + 1}</p>
              <h3 className="mt-8 text-label-bold font-w540">{s.title}</h3>
              <p className="mt-8 text-body leading-[1.5]">{s.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Dark feature band: the only dark surface (DESIGN.md) */}
      <section className="bg-deep-lagoon text-paper-white">
        <div className="mx-auto grid max-w-page items-center gap-48 px-16 py-64 md:grid-cols-2 md:py-96">
          <div aria-hidden className="relative h-[220px] md:h-[320px]">
            <div className="absolute left-0 top-0 h-[70%] w-[62%] rounded-cards" style={{ background: "rgba(212,199,255,0.5)" }} />
            <div className="absolute right-[6%] top-[18%] h-[60%] w-[50%] rounded-cards" style={{ background: "rgba(130,160,255,0.5)" }} />
            <div className="absolute bottom-0 left-[22%] h-[46%] w-[56%] rounded-cards" style={{ background: "rgba(255,160,205,0.5)" }} />
          </div>
          <div>
            <h2 className="text-[32px] font-w460 leading-[1.1] tracking-[-0.022em] md:text-[48px] md:leading-[0.96]">
              One email for the whole family.
            </h2>
            <p className="mt-20 max-w-[480px] text-body leading-[1.5] text-paper-white/80">
              Brothers and sisters share one login, but each student gets their own profile, their
              own class and their own resources. Pick who is studying, or switch any time.
            </p>
            <a
              href="/auth?mode=signup"
              className="mt-32 inline-flex items-center rounded-small-buttons border border-paper-white px-20 py-8 text-body font-w460 text-paper-white"
            >
              Create an account
            </a>
          </div>
        </div>
      </section>

      {/* Coverage */}
      <section id="coverage" className="mx-auto max-w-page scroll-mt-[80px] px-16 py-64 md:py-96">
        <h2 className="max-w-[640px] text-[32px] font-w460 leading-[1.1] tracking-[-0.022em] md:text-[48px] md:leading-[0.96]">
          Built for Kerala classrooms.
        </h2>
        <div className="mt-40 grid gap-16 md:grid-cols-3">
          <div className="rounded-cards border border-soft-mist bg-paper-white p-16">
            <h3 className="text-label-bold font-w540">Classes</h3>
            <div className="mt-12 flex flex-wrap gap-8">
              {["5", "6", "7", "8", "9"].map((c) => (
                <span key={c} className="rounded-pill bg-lilac-mist px-12 py-4 text-body-sm">
                  Class {c}
                </span>
              ))}
              {["Classes 1–4", "SSLC"].map((c) => (
                <span key={c} className="rounded-pill border border-soft-mist px-12 py-4 text-body-sm text-stone-gray">
                  {c} · soon
                </span>
              ))}
            </div>
          </div>
          <div className="rounded-cards border border-soft-mist bg-paper-white p-16">
            <h3 className="text-label-bold font-w540">First language</h3>
            <div className="mt-12 flex flex-wrap gap-8">
              {["Malayalam", "Urdu", "Arabic", "Sanskrit"].map((l) => (
                <span key={l} className="rounded-pill bg-lilac-mist px-12 py-4 text-body-sm">
                  {l}
                </span>
              ))}
            </div>
          </div>
          <div className="rounded-cards border border-soft-mist bg-paper-white p-16">
            <h3 className="text-label-bold font-w540">Medium</h3>
            <div className="mt-12 flex flex-wrap gap-8">
              {["English", "Malayalam"].map((m) => (
                <span key={m} className="rounded-pill bg-lilac-mist px-12 py-4 text-body-sm">
                  {m}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Closing CTA */}
      <section className="mx-auto max-w-page px-16 pb-64 md:pb-96">
        <div className="rounded-cards border border-soft-mist bg-paper-white p-24 md:p-48">
          <h2 className="max-w-[560px] text-[32px] font-w460 leading-[1.1] tracking-[-0.022em] md:text-[48px] md:leading-[0.96]">
            Ready when you are.
          </h2>
          <p className="mt-16 max-w-[480px] text-body leading-[1.5] text-stone-gray">
            Free to start. Works in your phone&apos;s browser, and you can add it to your home screen.
          </p>
          <div className="mt-24 flex flex-col gap-12 sm:flex-row sm:items-center">
            <a href="/auth?mode=signup" className={`${wineBtn} sm:w-auto`}>
              Get started <span aria-hidden>→</span>
            </a>
            <a href="/auth" className="px-16 py-12 text-body hover:underline underline-offset-4">
              Log in
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="safe-bottom bg-midnight-wine text-paper-white">
        <div className="mx-auto grid max-w-page gap-32 px-16 py-64 md:grid-cols-[2fr_1fr_1fr]">
          <div>
            <p className="text-label-bold font-w540">Keralite AI</p>
            <p className="mt-8 max-w-[320px] text-body-sm leading-[1.5] text-paper-white/70">
              An AI study assistant for Kerala students.
            </p>
          </div>
          <div>
            <p className="text-body-sm font-bold">Product</p>
            <ul className="mt-12 flex flex-col gap-12 text-body-sm text-paper-white/70">
              <li><a href="#how" className="hover:underline">How it works</a></li>
              <li><a href="#coverage" className="hover:underline">Classes &amp; languages</a></li>
            </ul>
          </div>
          <div>
            <p className="text-body-sm font-bold">Account</p>
            <ul className="mt-12 flex flex-col gap-12 text-body-sm text-paper-white/70">
              <li><a href="/auth" className="hover:underline">Log in</a></li>
              <li><a href="/auth?mode=signup" className="hover:underline">Sign up</a></li>
              <li><a href="/privacy" className="hover:underline">Privacy policy</a></li>
            </ul>
          </div>
        </div>
      </footer>
    </div>
  );
}
