
import { motion } from "framer-motion";
import { Download, Search, Music, Shield, Zap } from "lucide-react";
import DownloadDetailsDemo from "./components/DownloadDetailsDemo";
import TechArchitecture from "./components/TechArchitecture";

export default function App() {
  return (
    <div className="min-h-screen bg-black text-white">
      <Hero />
      <HowItWorks />
      <Features />
      <Philosophy />
      <TechArchitecture />
      <DownloadSection />
      <Footer />
    </div>
  );
}

function Hero() {
  return (
    <section className="min-h-screen flex flex-col justify-center items-center text-center px-6">
      <motion.img
        src="/images/neegde-logo.png"
        alt="Neegde — логотип приложения"
        width={240}
        height={240}
        initial={{ opacity: 0, scale: 0.92 }}
        animate={{ opacity: 1, scale: 1 }}
        className="mb-8 w-40 h-40 md:w-52 md:h-52 lg:w-60 lg:h-60 object-contain"
      />
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-6xl md:text-8xl font-bold tracking-tight"
      >
        Где слушаешь?
        <br />
        <span style={{ color: "rgb(252, 116, 29)" }}>
          Нигде.
        </span>
      </motion.h1>

      <p className="mt-8 max-w-2xl text-lg text-zinc-400">
        Музыкальный стриминг без подписок.
        Без блокировок.
        Без ограничений по стране.
      </p>

      <a
        href="https://github.com/neegde/neegde-tauri/releases"
        target="_blank"
        rel="noopener noreferrer"
        className="mt-10 px-8 py-4 bg-white text-black rounded-2xl font-medium flex items-center gap-2 hover:scale-105 transition"
      >
        <Download size={20} />
        Скачать Neegde
      </a>
    </section>
  );
}

function HowItWorks() {
  const steps = [
    {
      icon: Search,
      title: "Найди музыку",
      text: "Ищи альбомы и исполнителей прямо внутри приложения"
    },
    {
      icon: Zap,
      title: "Начни слушать сразу",
      text: "Музыка запускается без ожидания полной загрузки"
    },
    {
      icon: Music,
      title: "Слушай всё",
      text: "Без ограничений каталогов и регионов"
    }
  ];

  return (
    <section className="py-32 px-6 bg-zinc-950">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-4xl font-bold text-center mb-16">
          Как это работает
        </h2>

        <div className="grid md:grid-cols-3 gap-10">
          {steps.map((step, i) => (
            <div
              key={i}
              className="bg-black p-8 rounded-2xl border border-zinc-800"
            >
              <step.icon className="mb-4" size={32} />
              <h3 className="text-xl font-semibold mb-2">
                {step.title}
              </h3>
              <p className="text-zinc-400">
                {step.text}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Features() {
  const features = [
    {
      icon: Music,
      title: "Стриминг без загрузки",
      text: "Музыка начинает играть сразу"
    },
    {
      icon: Search,
      title: "Поиск альбомов",
      text: "Ищи музыку как в Spotify"
    },
    {
      icon: Zap,
      title: "Высокая скорость",
      text: "Оптимизированный потоковый движок"
    },
    {
      icon: Shield,
      title: "Без подписок",
      text: "Никаких ежемесячных платежей"
    }
  ];

  return (
    <section className="py-32 px-6 border-t border-zinc-800 bg-zinc-950">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-4xl font-bold text-center mb-16">
          Возможности
        </h2>

        <div className="grid md:grid-cols-2 gap-8">
          {features.map((feature, i) => (
            <div
              key={i}
              className="bg-black p-8 rounded-2xl border border-zinc-800"
            >
              <feature.icon className="mb-4" size={28} />
              <h3 className="text-xl font-semibold mb-2">
                {feature.title}
              </h3>
              <p className="text-zinc-400">
                {feature.text}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Philosophy() {
  return (
    <section className="py-32 px-6 border-t border-zinc-800 bg-zinc-950">
      <div className="max-w-3xl mx-auto text-center">
        <h2 className="text-4xl font-bold mb-10">
          Философия
        </h2>

        <div className="bg-black border border-zinc-800 rounded-2xl p-10">
          <p className="text-xl text-zinc-300 leading-relaxed">
            Музыка должна быть доступной каждому.
            <br />
            Без подписок.
            <br />
            Без цензуры.
            <br />
            Без искусственных ограничений.
          </p>
        </div>
      </div>
    </section>
  );
}

function DownloadSection() {
  return (
    <section className="py-32 px-6 border-t border-zinc-800 bg-zinc-950">
      <div className="max-w-3xl mx-auto text-center">
        <h2 className="text-4xl font-bold mb-6">
          Как выглядит процесс скачивания
        </h2>

        <p className="text-zinc-400 mb-16">
          Вот пример того, как работает реальное скачивание в приложении:
        </p>

        <DownloadDetailsDemo />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-16"
        >
          <h3 className="text-2xl font-bold mb-4">Попробуй сам</h3>

          <p className="text-zinc-400 mb-8">
            Скачивай музыку в полном качестве на всех платформах
          </p>

          <p className="text-sm text-zinc-500 mb-6">
            Windows · macOS · Linux
          </p>

          <a
            href="https://github.com/neegde/neegde-tauri/releases"
            target="_blank"
            rel="noopener noreferrer"
            className="px-10 py-5 bg-white text-black rounded-2xl font-medium hover:scale-105 transition inline-block"
          >
            Скачать Neegde
          </a>
        </motion.div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="py-12 text-center text-zinc-500 text-sm">
      <p>
        © {new Date().getFullYear()} Neegde
      </p>
      <p className="mt-2">
        Где слушаешь? Нигде.
      </p>
    </footer>
  );
}
