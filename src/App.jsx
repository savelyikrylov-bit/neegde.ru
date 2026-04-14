import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform, useMotionValueEvent, useReducedMotion } from "framer-motion";
import { Download, Github, ArrowDown, Apple, Monitor, Terminal, ChevronDown, Play, Pause, Loader2, Star, Check, X } from "lucide-react";

const FIRST_BYTE_MS = 820;

const RELEASES_URL = "https://github.com/neegde/neegde-tauri/releases";
const REPO_URL = "https://github.com/neegde/neegde-tauri";
const VOZDUXAN_URL = "https://github.com/neegde/vozduxan";

export default function App() {
  return (
    <div className="min-h-screen bg-black text-white antialiased selection:bg-brand selection:text-black">
      <ScrollProgress />
      <Nav />
      <Hero />
      <ScrollStory />
      <Manifest />
      <HowItWorks />
      <Specs />
      <Compare />
      <Faq />
      <DownloadBlock />
      <Footer />
    </div>
  );
}

/* ──────────────────────────────────────────────────────────────────── */
/*  SCROLL PROGRESS — thin orange bar at top                            */
/* ──────────────────────────────────────────────────────────────────── */

function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  return (
    <motion.div
      style={{ scaleX: scrollYProgress }}
      className="fixed top-0 left-0 right-0 h-0.5 bg-brand z-[60] origin-left"
    />
  );
}

/* ──────────────────────────────────────────────────────────────────── */
/*  NAV                                                                 */
/* ──────────────────────────────────────────────────────────────────── */

function Nav() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 20);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        scrolled ? "backdrop-blur-xl bg-black/60 border-b border-white/5" : ""
      }`}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
        <a href="#top" className="flex items-center gap-2.5">
          <img src="/images/neegde-logo.png" alt="" className="w-8 h-8" />
          <span className="font-semibold tracking-tight">neegde</span>
        </a>

        <nav className="hidden md:flex items-center gap-8 text-sm text-white/70">
          <a href="#how" className="hover:text-white transition">Как работает</a>
          <a href="#specs" className="hover:text-white transition">Возможности</a>
          <a href="#faq" className="hover:text-white transition">Вопросы</a>
          <a
            href={REPO_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-white transition inline-flex items-center gap-1.5"
          >
            <Github size={14} />
            GitHub
          </a>
        </nav>

        <a
          href={RELEASES_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="px-4 py-2 text-sm font-medium bg-white text-black rounded-full hover:bg-white/90 transition"
        >
          Скачать
        </a>
      </div>
    </header>
  );
}

/* ──────────────────────────────────────────────────────────────────── */
/*  GITHUB INFO — live stars + latest release + downloadable assets     */
/* ──────────────────────────────────────────────────────────────────── */

const FALLBACK_VERSION = "v0.1.7-dev";

/* module-level cache so all callers share ONE network round-trip */
let _githubPromise = null;

function fetchGithubInfo() {
  if (_githubPromise) return _githubPromise;
  _githubPromise = Promise.all([
    fetch("https://api.github.com/repos/neegde/neegde-tauri").then((r) => (r.ok ? r.json() : null)),
    fetch("https://api.github.com/repos/neegde/neegde-tauri/releases/latest").then((r) => (r.ok ? r.json() : null)),
  ])
    .then(([repo, release]) => ({
      stars: repo?.stargazers_count ?? null,
      version: release?.tag_name ?? null,
      assets: release?.assets ?? [],
    }))
    .catch(() => ({ stars: null, version: null, assets: [] }));
  return _githubPromise;
}

function useGithubInfo() {
  const [info, setInfo] = useState({ stars: null, version: null, assets: [] });
  useEffect(() => {
    let cancelled = false;
    fetchGithubInfo().then((d) => { if (!cancelled) setInfo(d); });
    return () => { cancelled = true; };
  }, []);
  return info;
}

/* ──────────────────────────────────────────────────────────────────── */
/*  USER OS DETECT                                                      */
/* ──────────────────────────────────────────────────────────────────── */

function useUserOs() {
  const [os, setOs] = useState(null);
  useEffect(() => {
    const ua = typeof navigator !== "undefined" ? navigator.userAgent : "";
    if (/Mac|iPhone|iPad/.test(ua)) setOs("macOS");
    else if (/Win/.test(ua)) setOs("Windows");
    else if (/Linux|X11/.test(ua)) setOs("Linux");
  }, []);
  return os;
}

/* ──────────────────────────────────────────────────────────────────── */
/*  ASSET MATCHING — pick the best download for each OS                 */
/* ──────────────────────────────────────────────────────────────────── */

const ASSET_PATTERNS = {
  macOS:   [/universal\.dmg$/i, /aarch64\.dmg$/i, /arm64\.dmg$/i, /x64\.dmg$/i, /\.dmg$/i],
  Windows: [/x64.*setup\.exe$/i, /setup\.exe$/i, /\.msi$/i, /\.exe\.zip$/i, /\.exe$/i],
  Linux:   [/\.AppImage$/i, /amd64\.deb$/i, /\.deb$/i, /\.rpm$/i, /\.tar\.gz$/i],
};

function pickAsset(assets, os) {
  if (!assets?.length || !os) return null;
  for (const pattern of ASSET_PATTERNS[os] ?? []) {
    const hit = assets.find((a) => pattern.test(a.name));
    if (hit) return hit;
  }
  return null;
}

function formatSize(bytes) {
  if (!bytes || typeof bytes !== "number") return null;
  const mb = bytes / 1024 / 1024;
  if (mb >= 1) return `${mb.toFixed(mb < 10 ? 1 : 0)} MB`;
  return `${(bytes / 1024).toFixed(0)} KB`;
}

function GithubEyebrow() {
  const { stars, version } = useGithubInfo();

  return (
    <a
      href={REPO_URL}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-3 text-xs font-mono uppercase tracking-widest text-white/50 border border-white/10 hover:border-white/25 hover:text-white/80 rounded-full pl-4 pr-4 py-1.5 transition"
    >
      <span className="w-1.5 h-1.5 bg-brand rounded-full animate-pulse" />
      <span>{version ?? FALLBACK_VERSION} · rust + c++</span>
      <span className="text-white/20">·</span>
      <span className="inline-flex items-center gap-1.5">
        <Star size={11} className="fill-current" />
        {stars !== null ? stars.toLocaleString("en-US") : "open source"}
      </span>
    </a>
  );
}

/* ──────────────────────────────────────────────────────────────────── */
/*  PLAY SIMULATOR — interactive proof of the 0.82s promise             */
/* ──────────────────────────────────────────────────────────────────── */

/* procedural stinger: A3 → E4 → A4 ascending arpeggio via Web Audio.
   triangle wave through lowpass, short attack, ~800ms decay each note. */
function playStinger() {
  try {
    const Ctx = window.AudioContext || window.webkitAudioContext;
    if (!Ctx) return;
    const ctx = new Ctx();
    const now = ctx.currentTime;
    const notes = [
      { freq: 220.0, at: 0.00, dur: 0.45 }, // A3
      { freq: 329.6, at: 0.10, dur: 0.45 }, // E4
      { freq: 440.0, at: 0.20, dur: 0.90 }, // A4
    ];
    notes.forEach(({ freq, at, dur }) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const filter = ctx.createBiquadFilter();
      osc.type = "triangle";
      osc.frequency.value = freq;
      filter.type = "lowpass";
      filter.frequency.value = 2400;
      filter.Q.value = 0.8;
      osc.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);
      gain.gain.setValueAtTime(0, now + at);
      gain.gain.linearRampToValueAtTime(0.14, now + at + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + at + dur);
      osc.start(now + at);
      osc.stop(now + at + dur + 0.05);
    });
    setTimeout(() => ctx.close?.(), 1500);
  } catch {
    /* silent fail — some browsers block Web Audio without gesture */
  }
}

function PlaySimulator() {
  const [state, setState] = useState("idle"); // idle | connecting | playing
  const [elapsed, setElapsed] = useState(0);
  const startRef = useRef(0);
  const rafRef = useRef(0);
  const resetRef = useRef(0);

  const tick = () => {
    const ms = performance.now() - startRef.current;
    if (ms < FIRST_BYTE_MS) {
      setElapsed(ms);
      rafRef.current = requestAnimationFrame(tick);
    } else {
      setElapsed(FIRST_BYTE_MS);
      setState("playing");
      playStinger();
      /* auto-reset after 4s in playing state so CTA doesn't stick */
      resetRef.current = window.setTimeout(() => {
        setState("idle");
        setElapsed(0);
      }, 4000);
    }
  };

  const toggle = () => {
    if (state === "idle") {
      setState("connecting");
      setElapsed(0);
      startRef.current = performance.now();
      rafRef.current = requestAnimationFrame(tick);
    } else {
      cancelAnimationFrame(rafRef.current);
      clearTimeout(resetRef.current);
      setState("idle");
      setElapsed(0);
    }
  };

  useEffect(() => () => {
    cancelAnimationFrame(rafRef.current);
    clearTimeout(resetRef.current);
  }, []);

  const statusText =
    state === "idle"       ? "готов"
    : state === "connecting" ? "ищу раздачу…"
    :                         "играет · меньше секунды";

  return (
    <div className="flex items-center gap-4 bg-white/[0.04] backdrop-blur-xl border border-white/10 rounded-2xl p-4 pr-5 max-w-md w-full shadow-2xl">
      {/* cover */}
      <div className="relative w-14 h-14 rounded-lg overflow-hidden flex-none bg-gradient-to-br from-brand to-brand-700 flex items-center justify-center">
        <div className="absolute inset-0 bg-black/20" />
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" className="relative text-black/60">
          <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5"/>
          <circle cx="12" cy="12" r="2" fill="currentColor"/>
        </svg>
      </div>

      {/* meta */}
      <div className="flex-1 min-w-0 text-left">
        <div className="text-sm font-semibold truncate">Radiohead — 15 Step</div>
        <div className="mt-0.5 flex items-center gap-2 text-[11px] font-mono text-white/50">
          <span
            className={`tabular-nums transition-colors ${
              state === "playing" ? "text-brand" : ""
            }`}
          >
            {(elapsed / 1000).toFixed(2)}s
          </span>
          <span className="text-white/20">·</span>
          <span className="truncate">{statusText}</span>
        </div>
        <div className="h-5 mt-1">{state === "playing" && <Waveform />}</div>
      </div>

      {/* button */}
      <button
        onClick={toggle}
        aria-label={state === "idle" ? "Play" : "Stop"}
        className="flex-none w-12 h-12 rounded-full bg-brand text-black flex items-center justify-center hover:scale-105 active:scale-95 transition shadow-lg shadow-brand/30"
      >
        {state === "connecting" ? (
          <Loader2 size={20} className="animate-spin" strokeWidth={2.5} />
        ) : state === "playing" ? (
          <Pause size={20} strokeWidth={2.5} fill="currentColor" />
        ) : (
          <Play size={20} strokeWidth={2.5} fill="currentColor" className="translate-x-0.5" />
        )}
      </button>
    </div>
  );
}

function Waveform() {
  const BARS = 28;
  const [bars, setBars] = useState(() => Array.from({ length: BARS }, () => 0.2 + Math.random() * 0.8));
  useEffect(() => {
    const id = setInterval(() => {
      setBars((prev) => prev.map(() => 0.15 + Math.random() * 0.85));
    }, 120);
    return () => clearInterval(id);
  }, []);
  return (
    <div className="flex items-end gap-0.5 h-5">
      {bars.map((b, i) => (
        <div
          key={i}
          className="w-0.5 bg-brand/80 rounded-full transition-[height] duration-150 ease-out"
          style={{ height: `${b * 100}%` }}
        />
      ))}
    </div>
  );
}

/* ──────────────────────────────────────────────────────────────────── */
/*  HERO                                                                */
/* ──────────────────────────────────────────────────────────────────── */

function Hero() {
  const { assets } = useGithubInfo();
  const userOs = useUserOs();
  const userAsset = pickAsset(assets, userOs);
  const heroHref = userAsset?.browser_download_url ?? RELEASES_URL;
  const heroLabel = userOs ? `Скачать для ${userOs}` : "Скачать Neegde";
  const heroSub = userAsset
    ? formatSize(userAsset.size) ?? "windows · mac · linux"
    : "windows · mac · linux";

  return (
    <section id="top" className="relative pt-40 pb-24 overflow-hidden grain">
      <div className="absolute inset-0 spotlight pointer-events-none" />

      <div className="relative max-w-6xl mx-auto px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <GithubEyebrow />
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.05 }}
          className="font-extrabold tracking-super-tight leading-[0.92] text-[clamp(3rem,10vw,9rem)]"
        >
          Где слушаешь?
          <br />
          <span className="text-brand">Нигде.</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.15 }}
          className="mt-8 max-w-2xl mx-auto text-lg md:text-xl text-white/60 leading-relaxed"
        >
          Плеер, который играет музыку прямо из&nbsp;торрентов. Нажимаешь на&nbsp;трек —{" "}
          <span className="text-white font-medium">слышишь его через секунду</span>.
          Без&nbsp;подписок, без&nbsp;регистрации, без&nbsp;блокировок по&nbsp;стране.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.25 }}
          className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-3"
        >
          <a
            href={heroHref}
            target={userAsset ? "_self" : "_blank"}
            rel="noopener noreferrer"
            download={userAsset ? userAsset.name : undefined}
            className="group px-7 py-4 bg-white text-black rounded-full font-semibold inline-flex items-center gap-2.5 hover:bg-brand transition-all duration-300"
          >
            <Download size={18} />
            {heroLabel}
            <span className="text-xs font-mono font-normal opacity-50 group-hover:opacity-80">{heroSub}</span>
          </a>
          <a
            href={REPO_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="px-7 py-4 text-white/80 hover:text-white rounded-full font-medium inline-flex items-center gap-2 border border-white/15 hover:border-white/30 transition"
          >
            <Github size={18} />
            Код на GitHub
          </a>
        </motion.div>

        {/* live play simulator — proof of the 0.82s promise */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4 }}
          className="mt-10 flex flex-col items-center"
        >
          <PlaySimulator />
          <div className="mt-3 text-[11px] font-mono uppercase tracking-widest text-white/30">
            нажми и засеки секунду
          </div>
        </motion.div>

        {/* hero screenshot */}
        <motion.div
          initial={{ opacity: 0, y: 60, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 1.1, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="relative mt-20 md:mt-24"
        >
          <div className="absolute -inset-x-10 -top-10 bottom-0 bg-gradient-to-b from-brand/20 via-brand/5 to-transparent blur-3xl pointer-events-none" />
          <img
            src="/images/screen-album.png"
            alt="Интерфейс музыкального плеера Neegde — открытый альбом Radiohead In Rainbows с треклистом, поиском по Rutracker и поддержкой FLAC"
            className="relative w-full max-w-5xl mx-auto rounded-2xl shot-shadow"
            loading="eager"
            decoding="async"
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.6 }}
          className="mt-16 text-xs font-mono uppercase tracking-widest text-white/30 flex items-center justify-center gap-2"
        >
          <ArrowDown size={12} />
          Скроль — покажу как
        </motion.div>
      </div>
    </section>
  );
}

/* ──────────────────────────────────────────────────────────────────── */
/*  SCROLL STORY — sticky mockup, swapping content                      */
/* ──────────────────────────────────────────────────────────────────── */

const STORY = [
  {
    img: "/images/screen-search.png",
    alt: "Поиск альбомов на Rutracker в плеере Neegde — результаты по Radiohead In Rainbows с бейджами FLAC и числом раздающих",
    num: "01",
    kicker: "Поиск",
    title: "Ищи что угодно.",
    body:
      "Поиск работает по Rutracker — там почти вся музыка, которую ты знаешь. Пишешь название, видишь раздачи с качеством и количеством раздающих. Если трекер заблокирован, приложение само подключается через зеркало или прокси.",
  },
  {
    img: "/images/screen-album.png",
    alt: "Открытый альбом Radiohead In Rainbows в плеере Neegde с обложкой, треклистом и поддержкой FLAC",
    num: "02",
    kicker: "Альбом",
    title: "Открывай. Листай. Выбирай.",
    body:
      "Обложка, треклист, битрейт, размер — всё как в обычном плеере. Разница только в том, что музыка берётся напрямую из торрентов, а не с чужого сервера с лицензиями и блокировками.",
  },
  {
    img: "/images/screen-playing.png",
    alt: "Трек играет в плеере Neegde — мгновенный запуск из торрента, меньше секунды до первого звука",
    num: "03",
    kicker: "Запуск",
    title: "Звук — через секунду.",
    body:
      "Нажимаешь на трек — он начинает играть почти сразу. Движок vozduxan, написанный на C++, в первую очередь просит из сети начало файла, а не весь целиком. Поэтому ждать полной загрузки не надо — перемотка, пауза, следующий трек работают как в любом плеере.",
  },
  {
    img: "/images/screen-library-tracks.png",
    alt: "Локальная библиотека треков в Neegde — без аккаунтов, синхронизации и облака",
    num: "04",
    kicker: "Библиотека",
    title: "Всё у тебя.",
    body:
      "Отмечаешь понравившееся — оно сохраняется прямо на твоём компьютере. Без аккаунта, без синхронизации, без отправки куда-то наружу. Никто не знает какую музыку ты слушаешь — включая нас.",
  },
  {
    img: "/images/screen-library-albums.png",
    alt: "Коллекция альбомов в плеере Neegde — сетка обложек лайкнутых релизов",
    num: "05",
    kicker: "Коллекция",
    title: "Твоя, а не чья-то.",
    body:
      "Листай по альбомам, переключай виды, забирай понравившееся на диск целиком. Папки, обложки, теги — всё сохраняется как надо. Это реально твоя библиотека, а не список в чужой базе данных.",
  },
];

function ScrollStory() {
  const containerRef = useRef(null);
  const [active, setActive] = useState(0);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    const idx = Math.min(STORY.length - 1, Math.max(0, Math.floor(v * STORY.length)));
    setActive(idx);
  });

  return (
    <section ref={containerRef} className="relative" style={{ height: `${STORY.length * 70}vh` }}>
      <div className="sticky top-0 h-screen flex items-center overflow-hidden">
        <div className="max-w-7xl w-full mx-auto px-6 grid md:grid-cols-12 gap-8 items-center">
          {/* left: text */}
          <div className="md:col-span-5 md:order-1 order-2">
            <div className="mb-6 flex items-center gap-3 text-xs font-mono uppercase tracking-widest text-white/40">
              <span>{STORY[active].num}</span>
              <span className="h-px flex-1 bg-white/10" />
              <span>{STORY[active].kicker}</span>
            </div>

            <div className="relative min-h-[220px] md:min-h-[280px]">
              {STORY.map((s, i) => (
                <motion.div
                  key={i}
                  animate={{
                    opacity: i === active ? 1 : 0,
                    y: i === active ? 0 : 20,
                  }}
                  transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                  className="absolute inset-0"
                  style={{ pointerEvents: i === active ? "auto" : "none" }}
                >
                  <h3 className="font-extrabold tracking-super-tight leading-[0.95] text-5xl md:text-6xl mb-6">
                    {s.title}
                  </h3>
                  <p className="text-lg text-white/60 leading-relaxed max-w-md">{s.body}</p>
                </motion.div>
              ))}
            </div>

            {/* progress dots */}
            <div className="mt-10 flex items-center gap-2">
              {STORY.map((_, i) => (
                <div
                  key={i}
                  className={`h-1 rounded-full transition-all duration-500 ${
                    i === active ? "w-10 bg-brand" : "w-4 bg-white/15"
                  }`}
                />
              ))}
            </div>
          </div>

          {/* right: mockup stack */}
          <div className="md:col-span-7 md:order-2 order-1 relative min-h-[280px] md:min-h-[520px] flex items-center justify-center">
            {STORY.map((s, i) => (
              <motion.img
                key={i}
                src={s.img}
                alt={s.alt}
                className="absolute max-w-full md:max-w-[110%] w-auto max-h-[80vh] rounded-2xl shot-shadow"
                animate={{
                  opacity: i === active ? 1 : 0,
                  scale: i === active ? 1 : 0.94,
                  y: i === active ? 0 : 30,
                }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                loading="lazy"
                decoding="async"
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ──────────────────────────────────────────────────────────────────── */
/*  HOW IT WORKS — 3-step tech explanation                              */
/* ──────────────────────────────────────────────────────────────────── */

function HowItWorks() {
  const steps = [
    {
      n: "01",
      t: "Находим музыку",
      d: "Ищем нужный альбом по Rutracker. Отбираем раздачу с лучшим качеством и активными раздающими. Если трекер заблокирован — приложение само подключается через зеркало или прокси.",
    },
    {
      n: "02",
      t: "Подключаемся",
      d: "Движок vozduxan — это наша библиотека на C++ — начинает скачивать выбранную раздачу. Но не весь файл подряд, а в первую очередь его начало, чтобы плеер мог запуститься сразу.",
    },
    {
      n: "03",
      t: "Играем на ходу",
      d: "Как только приходят первые секунды файла, плеер начинает звучать. Перемотка, пауза, следующий трек — всё работает, пока остальное ещё скачивается в фоне.",
    },
  ];

  return (
    <section id="how" className="relative py-40 border-t border-white/5">
      <div className="max-w-6xl mx-auto px-6">
        <div className="mb-20 text-center">
          <div className="text-xs font-mono uppercase tracking-widest text-white/40 mb-4">
            How it works
          </div>
          <h2 className="font-extrabold tracking-super-tight text-5xl md:text-7xl leading-[0.95]">
            Никакой магии.
            <br />
            <span className="text-white/40">Просто инженерия.</span>
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {steps.map((s) => (
            <div
              key={s.n}
              className="relative border border-white/10 rounded-2xl p-8 bg-white/[0.02] hover:bg-white/[0.04] transition"
            >
              <div className="text-xs font-mono text-brand mb-4">{s.n}</div>
              <h3 className="text-xl font-bold mb-3 tracking-tight">{s.t}</h3>
              <p className="text-white/55 leading-relaxed text-[15px]">{s.d}</p>
            </div>
          ))}
        </div>

        <FlowDiagram />
      </div>
    </section>
  );
}

function FlowDiagram() {
  /* three animated particles per segment, staggered by phase.
     each loops forever, re-using the same keyframe trajectory. */
  const segments = [
    { from: 180, to: 320 },
    { from: 480, to: 620 },
  ];
  const phases = [0, 0.5, 1.0];

  return (
    <div className="mt-20 max-w-4xl mx-auto">
      <svg viewBox="0 0 800 140" className="w-full" aria-hidden="true">
        <defs>
          <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="3" result="b" />
            <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>

        {/* node: торрент-сеть */}
        <g>
          <rect x="20" y="50" width="160" height="40" rx="10" fill="rgba(255,255,255,0.03)" stroke="rgba(255,255,255,0.12)" />
          <text x="100" y="68" textAnchor="middle" fill="rgba(255,255,255,0.7)" fontFamily="'JetBrains Mono', monospace" fontSize="11">торрент-сеть</text>
          <text x="100" y="82" textAnchor="middle" fill="rgba(255,255,255,0.35)" fontFamily="'JetBrains Mono', monospace" fontSize="9">другие пользователи</text>
        </g>

        {/* node: vozduxan (highlighted) */}
        <g>
          <rect x="320" y="44" width="160" height="52" rx="10" fill="rgba(252,116,29,0.08)" stroke="rgba(252,116,29,0.5)" />
          <text x="400" y="66" textAnchor="middle" fill="rgb(252,116,29)" fontFamily="'JetBrains Mono', monospace" fontSize="13" fontWeight="600">vozduxan</text>
          <text x="400" y="82" textAnchor="middle" fill="rgba(252,116,29,0.55)" fontFamily="'JetBrains Mono', monospace" fontSize="9">наш движок на c++</text>
        </g>

        {/* node: плеер */}
        <g>
          <rect x="620" y="50" width="160" height="40" rx="10" fill="rgba(255,255,255,0.03)" stroke="rgba(255,255,255,0.12)" />
          <text x="700" y="68" textAnchor="middle" fill="rgba(255,255,255,0.7)" fontFamily="'JetBrains Mono', monospace" fontSize="11">плеер</text>
          <text x="700" y="82" textAnchor="middle" fill="rgba(255,255,255,0.35)" fontFamily="'JetBrains Mono', monospace" fontSize="9">играет · 0.8 сек</text>
        </g>

        {/* connecting lines */}
        <line x1="180" y1="70" x2="320" y2="70" stroke="rgba(255,255,255,0.12)" strokeWidth="1" strokeDasharray="2 4" />
        <line x1="480" y1="70" x2="620" y2="70" stroke="rgba(255,255,255,0.12)" strokeWidth="1" strokeDasharray="2 4" />

        {/* flowing particles */}
        {segments.flatMap((seg, sIdx) =>
          phases.map((phase, pIdx) => (
            <motion.circle
              key={`${sIdx}-${pIdx}`}
              r="3.5"
              cy="70"
              fill="rgb(252,116,29)"
              filter="url(#glow)"
              initial={{ cx: seg.from, opacity: 0 }}
              animate={{
                cx: [seg.from, seg.to],
                opacity: [0, 1, 1, 0],
              }}
              transition={{
                duration: 2,
                delay: phase * 2 + sIdx * 0.3,
                repeat: Infinity,
                ease: "linear",
                times: [0, 0.1, 0.9, 1],
              }}
            />
          ))
        )}
      </svg>

      <div className="mt-4 text-center text-[10px] font-mono uppercase tracking-widest text-white/30">
        начало файла → движок → звук · без ожидания загрузки
      </div>
    </div>
  );
}

/* ──────────────────────────────────────────────────────────────────── */
/*  SPECS — bento grid of concrete features                             */
/* ──────────────────────────────────────────────────────────────────── */

function Specs() {
  const [eqBars, setEqBars] = useState(() =>
    [40, 70, 55, 85, 60, 75, 45, 80, 55, 65]
  );
  useEffect(() => {
    const id = setInterval(() => {
      setEqBars((prev) => prev.map(() => 20 + Math.round(Math.random() * 75)));
    }, 380);
    return () => clearInterval(id);
  }, []);

  return (
    <section id="specs" className="relative py-40 border-t border-white/5">
      <div className="max-w-6xl mx-auto px-6">
        <div className="mb-20 text-center">
          <div className="text-xs font-mono uppercase tracking-widest text-white/40 mb-4">
            Возможности
          </div>
          <h2 className="font-extrabold tracking-super-tight text-5xl md:text-7xl leading-[0.95]">
            Плеер как плеер.
            <br />
            <span className="text-white/40">Только честный.</span>
          </h2>
        </div>

        <div className="grid md:grid-cols-6 gap-4">
          {/* big tile: EQ */}
          <div className="md:col-span-3 md:row-span-2 border border-white/10 rounded-3xl p-10 bg-gradient-to-br from-brand/10 to-transparent relative overflow-hidden">
            <div className="text-xs font-mono text-white/40 mb-6">01 · Звук</div>
            <div className="text-6xl font-extrabold tracking-super-tight mb-4">Эквалайзер на 10 полос</div>
            <p className="text-white/60 max-w-sm">
              Подкручивай звук как хочешь. Медиа-клавиши на клавиатуре работают.
              Играющий трек показывается в Discord. Всё как у нормальных плееров.
            </p>
            <div className="mt-10 flex items-end gap-1.5 h-20">
              {eqBars.map((h, i) => (
                <div
                  key={i}
                  className="flex-1 bg-brand/60 rounded-sm transition-[height] duration-500 ease-out"
                  style={{ height: `${h}%` }}
                />
              ))}
            </div>
          </div>

          {/* prefetch */}
          <div className="md:col-span-3 border border-white/10 rounded-3xl p-8 bg-white/[0.02]">
            <div className="text-xs font-mono text-white/40 mb-4">02 · Предзагрузка</div>
            <div className="text-2xl md:text-3xl font-bold tracking-tight mb-3">Подводишь курсор — загрузка уже идёт</div>
            <p className="text-white/55 text-[15px] leading-relaxed">
              Пока ты выбираешь трек, приложение уже тихо подгружает его начало.
              Нажмёшь — играет без задержки.
            </p>
          </div>

          {/* export */}
          <div className="md:col-span-3 border border-white/10 rounded-3xl p-8 bg-white/[0.02]">
            <div className="text-xs font-mono text-white/40 mb-4">03 · Скачивание</div>
            <div className="text-2xl md:text-3xl font-bold tracking-tight mb-3">Понравилось — забирай на диск</div>
            <p className="text-white/55 text-[15px] leading-relaxed">
              Скачай весь альбом одной кнопкой. Папки, обложки, теги дорожек — всё на своих местах, как на нормальном CD.
            </p>
          </div>

          {/* platforms */}
          <div className="md:col-span-2 border border-white/10 rounded-3xl p-8 bg-white/[0.02]">
            <div className="text-xs font-mono text-white/40 mb-4">04 · Системы</div>
            <div className="flex items-center gap-5 text-white/70 text-3xl mt-6">
              <Apple />
              <Monitor />
              <Terminal />
            </div>
            <p className="mt-4 text-sm text-white/50">macOS · Windows · Linux</p>
          </div>

          {/* open source */}
          <div className="md:col-span-2 border border-white/10 rounded-3xl p-8 bg-white/[0.02]">
            <div className="text-xs font-mono text-white/40 mb-4">05 · Открытый код</div>
            <div className="text-2xl font-bold tracking-tight mb-2">MIT</div>
            <p className="text-white/55 text-[15px] leading-relaxed">
              И плеер, и движок — с открытым исходным кодом. Посмотри, как сделано. Дорабатывай под себя. Собери свою версию.
            </p>
          </div>

          {/* stack */}
          <div className="md:col-span-2 border border-white/10 rounded-3xl p-8 bg-white/[0.02]">
            <div className="text-xs font-mono text-white/40 mb-4">06 · Технологии</div>
            <ul className="space-y-1.5 font-mono text-sm text-white/60">
              <li><span className="text-brand">tauri</span> 2</li>
              <li><span className="text-brand">rust</span> + tokio</li>
              <li><span className="text-brand">vue</span> 3 + vite</li>
              <li><span className="text-brand">c++</span> libtorrent</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ──────────────────────────────────────────────────────────────────── */
/*  FAQ                                                                 */
/* ──────────────────────────────────────────────────────────────────── */

function Faq() {
  const qs = [
    {
      q: "Это легально?",
      a: "Neegde — это плеер, ничего больше. Музыку он берёт с публичных торрент-трекеров, сам ничего не хранит и никому не раздаёт. За то, что ты слушаешь, отвечаешь ты сам — ровно как и везде, где работают торренты.",
    },
    {
      q: "Это правда бесплатно? Подвоха нет?",
      a: "Бесплатно. Подвоха нет. Ни подписки, ни платных функций, ни «премиум» версии. Исходный код открыт, можешь посмотреть сам что внутри.",
    },
    {
      q: "Почему через торренты?",
      a: "Чтобы не зависеть от чужих серверов, чужих лицензий и чужих блокировок. Торренты работают сами по себе — мы просто научили плеер читать из них так, как будто это обычный файл на диске.",
    },
    {
      q: "Откуда берётся музыка?",
      a: "Из Rutracker — крупнейшего русскоязычного торрент-трекера. Там есть почти вся музыка, которую ты знаешь, включая редкости и FLAC. Если Rutracker заблокирован, приложение автоматически подключается через зеркало или прокси.",
    },
    {
      q: "Почему так быстро?",
      a: "Обычный торрент-клиент качает файл кусками откуда получится — поэтому ждать приходится долго. Наш движок специально просит у сети в первую очередь начало трека, а не весь файл сразу. Как только первые секунды пришли, плеер начинает играть. Обычно это занимает меньше секунды.",
    },
    {
      q: "А мои данные — история, отметки — куда уходят?",
      a: "Никуда не уходят. Всё хранится на твоём компьютере. Мы не знаем, какую музыку ты слушаешь: нет ни аналитики, ни облачной синхронизации, ни аккаунта. Удалишь приложение — файлы с твоей историей всё равно останутся на диске, пока ты сам их не удалишь.",
    },
    {
      q: "Почему Tauri, а не Electron?",
      a: "Tauri использует системный браузер (тот, что уже есть в вашей ОС), а не тащит с собой встроенный Chromium. И написан на Rust. Поэтому приложение весит десятки мегабайт, а не сотни, и потребляет в разы меньше памяти чем большинство современных программ.",
    },
  ];

  return (
    <section id="faq" className="py-40 border-t border-white/5">
      <div className="max-w-3xl mx-auto px-6">
        <div className="mb-16 text-center">
          <div className="text-xs font-mono uppercase tracking-widest text-white/40 mb-4">FAQ</div>
          <h2 className="font-extrabold tracking-super-tight text-5xl md:text-6xl leading-[0.95]">
            Частые вопросы.
          </h2>
        </div>

        <div className="divide-y divide-white/10 border-y border-white/10">
          {qs.map((item, i) => (
            <details key={i} className="group py-6">
              <summary className="flex items-center justify-between gap-6">
                <span className="text-lg md:text-xl font-semibold tracking-tight">{item.q}</span>
                <ChevronDown
                  size={20}
                  className="flex-none text-white/50 group-open:rotate-180 transition-transform"
                />
              </summary>
              <p className="mt-4 text-white/60 leading-relaxed max-w-2xl">{item.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ──────────────────────────────────────────────────────────────────── */
/*  DOWNLOAD BLOCK                                                      */
/* ──────────────────────────────────────────────────────────────────── */

function DownloadBlock() {
  const { version, assets } = useGithubInfo();
  const userOs = useUserOs();

  const platforms = [
    { Icon: Apple,    name: "macOS",   fallback: ".dmg · universal" },
    { Icon: Monitor,  name: "Windows", fallback: ".exe · x64" },
    { Icon: Terminal, name: "Linux",   fallback: ".AppImage · .deb" },
  ];

  return (
    <section className="relative py-40 border-t border-white/5 overflow-hidden grain">
      <div className="absolute inset-0 spotlight" />
      <div className="relative max-w-5xl mx-auto px-6 text-center">
        <h2 className="font-extrabold tracking-super-tight text-6xl md:text-8xl leading-[0.9] mb-6">
          Попробуй.
          <br />
          <span className="text-brand">Бесплатно.</span>
        </h2>
        <p className="text-xl text-white/55 max-w-xl mx-auto mb-16">
          Скачай версию под свою систему. Запусти. Выбери любой трек. Засеки секунду.
        </p>

        <div className="grid sm:grid-cols-3 gap-4 max-w-3xl mx-auto">
          {platforms.map(({ Icon, name, fallback }) => {
            const isYours = userOs === name;
            const asset = pickAsset(assets, name);
            const href = asset?.browser_download_url ?? RELEASES_URL;
            const size = asset ? formatSize(asset.size) : null;
            const sub = size ? `${size} · ${asset.name.split(".").pop()}` : fallback;
            return (
              <a
                key={name}
                href={href}
                target={asset ? "_self" : "_blank"}
                rel="noopener noreferrer"
                download={asset ? asset.name : undefined}
                className={`group relative rounded-2xl p-8 transition flex flex-col items-center ${
                  isYours
                    ? "border border-brand/60 bg-brand/[0.06] ring-1 ring-brand/40 shadow-[0_0_40px_-10px_rgba(252,116,29,0.5)]"
                    : "border border-white/15 hover:bg-white/5 hover:border-white/30"
                }`}
              >
                {isYours && (
                  <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 px-2.5 py-0.5 bg-brand text-black text-[10px] font-mono uppercase tracking-widest rounded-full">
                    твоя система
                  </div>
                )}
                <Icon
                  size={32}
                  className={`transition ${
                    isYours ? "text-brand" : "text-white/80 group-hover:text-brand"
                  }`}
                />
                <div className="mt-4 text-lg font-semibold">{name}</div>
                <div className="text-xs font-mono text-white/40 mt-1">{sub}</div>
              </a>
            );
          })}
        </div>

        <div className="mt-12 text-xs font-mono uppercase tracking-widest text-white/30">
          {version ?? FALLBACK_VERSION} · MIT · <a href={REPO_URL} className="hover:text-white/60" target="_blank" rel="noopener noreferrer">github</a>
        </div>
      </div>
    </section>
  );
}

/* ──────────────────────────────────────────────────────────────────── */
/*  MANIFEST — serif emotional breath                                   */
/* ──────────────────────────────────────────────────────────────────── */

function Manifest() {
  return (
    <section className="relative py-40 border-t border-white/5 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-brand/[0.03] to-transparent pointer-events-none" />
      <div className="relative max-w-4xl mx-auto px-6 text-center">
        <motion.blockquote
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          className="font-serif italic font-normal tracking-tight leading-[1.02] text-[clamp(2.5rem,7vw,6rem)]"
        >
          Ты не арендуешь песни.
          <br />
          <span className="text-brand">Ты их слушаешь.</span>
        </motion.blockquote>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-12 flex items-center justify-center gap-3 text-xs font-mono uppercase tracking-widest text-white/30"
        >
          <span className="h-px w-12 bg-white/20" />
          философия neegde
          <span className="h-px w-12 bg-white/20" />
        </motion.div>
      </div>
    </section>
  );
}

/* ──────────────────────────────────────────────────────────────────── */
/*  COMPARE — vs Spotify / Apple Music / YouTube Music                  */
/* ──────────────────────────────────────────────────────────────────── */

const COMPARE_ROWS = [
  { label: "Цена",                    neegde: "0 ₽",     spotify: "от 199 ₽/мес", apple: "от 199 ₽/мес", ytm: "от 179 ₽/мес" },
  { label: "Доступ из России",        neegde: true,      spotify: false,          apple: false,          ytm: "warn" },
  { label: "Качество FLAC",           neegde: true,      spotify: false,          apple: true,           ytm: false },
  { label: "Без регистрации",         neegde: true,      spotify: false,          apple: false,          ytm: false },
  { label: "Данные на твоём компьютере", neegde: true,   spotify: false,          apple: false,          ytm: false },
  { label: "Открытый исходный код",   neegde: "MIT",     spotify: false,          apple: false,          ytm: false },
];

function Cell({ value }) {
  if (value === true)  return <Check size={18} className="text-brand mx-auto" strokeWidth={3} />;
  if (value === false) return <X size={18} className="text-white/25 mx-auto" strokeWidth={2.5} />;
  if (value === "warn")
    return (
      <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-amber-500/20 text-amber-400 text-xs font-bold">
        !
      </span>
    );
  return <span className="text-sm font-mono">{value}</span>;
}

function Compare() {
  return (
    <section className="relative py-40 border-t border-white/5">
      <div className="max-w-5xl mx-auto px-6">
        <div className="mb-16 text-center">
          <div className="text-xs font-mono uppercase tracking-widest text-white/40 mb-4">
            vs
          </div>
          <h2 className="font-extrabold tracking-super-tight text-5xl md:text-7xl leading-[0.95]">
            Считай сам.
          </h2>
          <p className="mt-6 text-lg text-white/50 max-w-xl mx-auto">
            Одна таблица без маркетинга. Только то, что важно, когда слушаешь музыку каждый день.
          </p>
        </div>

        {/* desktop table */}
        <div className="hidden md:block overflow-hidden rounded-3xl border border-white/10 bg-white/[0.02]">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-xs font-mono uppercase tracking-widest text-white/40 border-b border-white/10">
                <th className="py-5 px-6 text-left font-normal"></th>
                <th className="py-5 px-6 text-center font-normal bg-brand/[0.06] text-brand">
                  <div className="flex items-center justify-center gap-1.5">
                    <img src="/images/neegde-logo.png" alt="" className="w-4 h-4" />
                    neegde
                  </div>
                </th>
                <th className="py-5 px-6 text-center font-normal">Spotify</th>
                <th className="py-5 px-6 text-center font-normal">Apple&nbsp;Music</th>
                <th className="py-5 px-6 text-center font-normal">YT&nbsp;Music</th>
              </tr>
            </thead>
            <tbody>
              {COMPARE_ROWS.map((r, i) => (
                <tr
                  key={r.label}
                  className={`border-b border-white/5 last:border-0 ${
                    i % 2 === 0 ? "bg-white/[0.01]" : ""
                  }`}
                >
                  <td className="py-5 px-6 text-white/70">{r.label}</td>
                  <td className="py-5 px-6 text-center bg-brand/[0.04]">
                    <Cell value={r.neegde} />
                  </td>
                  <td className="py-5 px-6 text-center">
                    <Cell value={r.spotify} />
                  </td>
                  <td className="py-5 px-6 text-center">
                    <Cell value={r.apple} />
                  </td>
                  <td className="py-5 px-6 text-center">
                    <Cell value={r.ytm} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* mobile — neegde card + compact rows */}
        <div className="md:hidden space-y-4">
          <div className="rounded-2xl border border-brand/40 bg-brand/[0.06] p-6">
            <div className="flex items-center gap-2 text-brand font-semibold mb-4">
              <img src="/images/neegde-logo.png" alt="" className="w-5 h-5" />
              neegde
            </div>
            <ul className="space-y-2.5 text-sm">
              {COMPARE_ROWS.map((r) => (
                <li key={r.label} className="flex items-center justify-between gap-4">
                  <span className="text-white/60">{r.label}</span>
                  <span className="font-mono text-white">
                    {r.neegde === true ? "да" : r.neegde === false ? "нет" : r.neegde}
                  </span>
                </li>
              ))}
            </ul>
          </div>
          <details className="rounded-2xl border border-white/10 bg-white/[0.02] p-6">
            <summary className="text-sm font-mono uppercase tracking-widest text-white/50 flex items-center justify-between">
              конкуренты
              <ChevronDown size={16} className="text-white/40 group-open:rotate-180 transition" />
            </summary>
            <div className="mt-5 space-y-4 text-sm">
              {["spotify","apple","ytm"].map((key) => {
                const name = key === "spotify" ? "Spotify" : key === "apple" ? "Apple Music" : "YT Music";
                return (
                  <div key={key} className="pt-4 border-t border-white/5 first:border-0 first:pt-0">
                    <div className="font-semibold mb-2">{name}</div>
                    <ul className="space-y-1.5">
                      {COMPARE_ROWS.map((r) => {
                        const v = r[key];
                        const display = v === true ? "да" : v === false ? "нет" : v === "warn" ? "частично" : v;
                        return (
                          <li key={r.label} className="flex items-center justify-between gap-4">
                            <span className="text-white/50">{r.label}</span>
                            <span className={`font-mono ${v === false ? "text-white/25" : "text-white/80"}`}>{display}</span>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                );
              })}
            </div>
          </details>
        </div>

        <p className="mt-10 text-xs font-mono uppercase tracking-widest text-white/25 text-center">
          данные на апрель 2026 · цены приблизительные
        </p>
      </div>
    </section>
  );
}

/* ──────────────────────────────────────────────────────────────────── */
/*  FOOTER                                                              */
/* ──────────────────────────────────────────────────────────────────── */

function Footer() {
  return (
    <footer className="border-t border-white/5 py-16">
      <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-3 gap-10">
        <div>
          <div className="flex items-center gap-2.5 mb-4">
            <img src="/images/neegde-logo.png" alt="" className="w-8 h-8" />
            <span className="font-semibold tracking-tight">neegde</span>
          </div>
          <p className="text-sm text-white/40 leading-relaxed max-w-xs">
            Бесплатный музыкальный плеер, который играет треки прямо из&nbsp;торрентов. Написан на&nbsp;Rust и&nbsp;C++.
          </p>
        </div>

        <div>
          <div className="text-xs font-mono uppercase tracking-widest text-white/30 mb-4">Ссылки</div>
          <ul className="space-y-2 text-sm text-white/60">
            <li><a href={REPO_URL} target="_blank" rel="noopener noreferrer" className="hover:text-white">neegde-tauri</a></li>
            <li><a href={VOZDUXAN_URL} target="_blank" rel="noopener noreferrer" className="hover:text-white">vozduxan</a></li>
            <li><a href={RELEASES_URL} target="_blank" rel="noopener noreferrer" className="hover:text-white">Релизы</a></li>
          </ul>
        </div>

        <div>
          <div className="text-xs font-mono uppercase tracking-widest text-white/30 mb-4">Технологии</div>
          <ul className="space-y-2 text-sm text-white/60 font-mono">
            <li>tauri · rust · tokio</li>
            <li>vue 3 · vite · pinia</li>
            <li>c++ · libtorrent</li>
          </ul>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 mt-12 flex flex-col md:flex-row md:items-center md:justify-between gap-4 text-xs font-mono text-white/30 uppercase tracking-widest">
        <div>© {new Date().getFullYear()} neegde · MIT</div>
        <div>Где слушаешь? Нигде.</div>
      </div>
    </footer>
  );
}
