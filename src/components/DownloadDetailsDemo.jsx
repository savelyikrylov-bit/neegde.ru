import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Download, FileMusic, Network, Server, Info, AlertCircle } from "lucide-react";

export default function DownloadDetailsDemo() {
  const [expanded, setExpanded] = useState(false);
  const [downloadStats, setDownloadStats] = useState({
    downloadedMB: 0,
    totalMB: 450,
    speed: 0,
    timeRemaining: "5 мін",
    currentPhase: "preparing",
    peersCount: 0,
    bufferPercent: 0,
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setDownloadStats((prev) => {
        // Stop updating if download is complete
        if (prev.downloadedMB >= prev.totalMB) {
          return prev;
        }

        const newDownloaded = Math.min(
          prev.downloadedMB + Math.random() * 15,
          prev.totalMB
        );
        const isComplete = newDownloaded >= prev.totalMB;
        const speed = isComplete ? 0 : parseFloat((Math.random() * 40 + 20).toFixed(1));
        const remaining = Math.max(0, prev.totalMB - newDownloaded);
        let timeRemaining = "Готово";
        if (remaining > 0) {
          const totalSeconds = remaining / parseFloat(Math.random() * 40 + 20);
          const minutes = Math.floor(totalSeconds / 60);
          const seconds = Math.round(totalSeconds % 60);
          timeRemaining = minutes > 0 ? `${minutes}м ${seconds}с` : `${seconds}с`;
        }

        let phase = "preparing";
        let bufferPercent = 0;

        if (newDownloaded < 100) {
          phase = "preparing";
          bufferPercent = Math.min((newDownloaded / 100) * 100, 100);
        } else if (newDownloaded < 135) {
          phase = "buffering";
          bufferPercent = 100;
        } else if (newDownloaded < 300) {
          phase = "downloading";
          bufferPercent = Math.min(100, ((newDownloaded - 100) / 200) * 100);
        } else {
          phase = "copying";
          bufferPercent = Math.min(100, ((newDownloaded - 300) / 150) * 30 + 100);
        }

        return {
          downloadedMB: newDownloaded,
          totalMB: prev.totalMB,
          speed: speed,
          timeRemaining,
          currentPhase: isComplete ? "copying" : phase,
          peersCount: isComplete ? 0 : Math.min(Math.floor(newDownloaded / 50) + 1, 15),
          bufferPercent: Math.min(bufferPercent, 100),
        };
      });
    }, 800);

    return () => clearInterval(interval);
  }, []);

  const percentage = Math.round(
    (downloadStats.downloadedMB / downloadStats.totalMB) * 100
  );
  const isCompleted = downloadStats.downloadedMB >= downloadStats.totalMB;
  const canPlayMusic = percentage >= 25;

  const phaseInfo = {
    preparing: {
      label: "Поиск источников",
      description: "Подущение к сети, поиск людей с музыкой",
      color: "text-yellow-500",
      bg: "from-yellow-900/20 to-yellow-900/5",
      border: "border-yellow-800/50",
    },
    buffering: {
      label: "Загрузка начала",
      description: "Загружается первая часть для начала воспроизведения",
      color: "text-amber-500",
      bg: "from-amber-900/20 to-amber-900/5",
      border: "border-amber-800/50",
    },
    downloading: {
      label: "Воспроизведение",
      description: "Музыка уже играет, остальное загружается в фоне",
      color: "text-blue-500",
      bg: "from-blue-900/20 to-blue-900/5",
      border: "border-blue-800/50",
    },
    copying: {
      label: "Сохранение",
      description: "Сохранение на диск для следующего раза",
      color: "text-purple-500",
      bg: "from-purple-900/20 to-purple-900/5",
      border: "border-purple-800/50",
    },
  };

  const currentPhaseData = phaseInfo[downloadStats.currentPhase] || phaseInfo.preparing;

  return (
    <div className="max-w-4xl mx-auto">
      {/* Compact View */}
      <motion.div
        className={`bg-gradient-to-r ${currentPhaseData.bg} ${currentPhaseData.border} border rounded-2xl p-6 cursor-pointer hover:shadow-lg hover:shadow-orange-500/20 transition group relative`}
        onClick={() => setExpanded(!expanded)}
        whileHover={{ scale: 1.02 }}
      >
        {/* Click indicator */}
        <motion.div
          className="absolute top-3 right-3 text-orange-400/50 text-xs font-semibold"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          Нажми →
        </motion.div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3 flex-1">
            <motion.div
              animate={downloadStats.currentPhase !== "copying" && downloadStats.currentPhase !== "preparing" ? { rotate: 360 } : {}}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="flex-shrink-0"
            >
              <Download size={28} className={currentPhaseData.color} />
            </motion.div>

            <div className="flex-1">
              <p className="font-semibold text-lg">{currentPhaseData.label}</p>
              <p className="text-sm text-zinc-400">{currentPhaseData.description}</p>
            </div>
          </div>

          <div className="text-right ml-4">
            <motion.p
              key={percentage}
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              className="text-4xl font-bold"
              style={{ color: "rgb(252, 116, 29)" }}
            >
              {percentage}%
            </motion.p>
            {!isCompleted && <p className="text-sm text-zinc-400">{downloadStats.speed} МБ/с</p>}
          </div>
        </div>

        {/* Main Progress Bar */}
        <div className="mb-4">
          <div className="relative h-4 bg-zinc-800 rounded-full overflow-hidden border border-zinc-700">
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-orange-500 to-orange-400"
              animate={{ width: `${percentage}%` }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            />
            {/* Shimmer effect */}
            <motion.div
              className="absolute top-0 bottom-0 w-1/3 bg-white/20 blur-lg"
              animate={{ left: `${percentage * 1.2}%` }}
              transition={{ duration: 1.2, ease: "linear" }}
            />
          </div>

          {/* Music playback indicator */}
          {canPlayMusic && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-2 flex items-center gap-2 text-sm text-green-400"
            >
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
                className="w-2 h-2 rounded-full bg-green-400"
              />
              Музыка воспроизводится прямо сейчас!
            </motion.div>
          )}
        </div>

        <p className="text-xs text-zinc-400 text-center">
          {isCompleted ? "Готово к использованию" : `Осталось: ${downloadStats.timeRemaining}`}
        </p>
      </motion.div>

      {/* Expanded View */}
      <motion.div
        initial={{ opacity: 0, height: 0 }}
        animate={{ opacity: expanded ? 1 : 0, height: expanded ? "auto" : 0 }}
        transition={{ duration: 0.3 }}
        className="overflow-hidden"
      >
        <div className="mt-6 space-y-6">
          {/* How it works internally */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-gradient-to-r from-cyan-900/20 to-cyan-900/5 border border-cyan-800/50 rounded-lg p-5"
          >
            <h4 className="font-semibold text-cyan-300 mb-4 flex items-center gap-2">
              <Network size={20} />
              Как происходит загрузка
            </h4>

            <div className="space-y-3">
              {/* Phase 1 */}
              <div className="bg-black/40 rounded p-4 border border-cyan-900/30 hover:border-cyan-800/50 transition">
                <div className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-8 h-8 rounded-full bg-yellow-500/20 flex items-center justify-center text-xs font-bold text-yellow-400 mt-0.5">
                    1
                  </span>
                  <div className="flex-1">
                    <p className="font-semibold text-cyan-200">Подключение к торрент-сети (0-25%)</p>
                    <p className="text-sm text-cyan-200/70 mt-1 leading-relaxed">
                      Приложение подключается к торрент-сети для поиска людей, у которых уже есть эта музыка. 
                      Загружаются метаданные торента (~100 МБ) с информацией о структуре всего файла, 
                      хешах блоков и доступных источниках данных.
                    </p>
                    <p className="text-xs text-cyan-300/50 mt-2">Время: ~2-3 сек на хорошем интернете</p>
                  </div>
                </div>
              </div>

              {/* Phase 2 */}
              <div className="bg-black/40 rounded p-4 border border-amber-900/30 hover:border-amber-800/50 transition">
                <div className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-8 h-8 rounded-full bg-amber-500/20 flex items-center justify-center text-xs font-bold text-amber-400 mt-0.5">
                    2
                  </span>
                  <div className="flex-1">
                    <p className="font-semibold text-cyan-200">Приоритетная загрузка (25-30%)</p>
                    <p className="text-sm text-cyan-200/70 mt-1 leading-relaxed">
                      Приложение загружает <strong>первые 30% трека</strong> с максимальным приоритетом от всех пиров одновременно. 
                      Этого достаточно чтобы начать воспроизведение. Остальное будет загружено пока ты слушаешь. (~35 МБ из 450 МБ)
                    </p>
                    <p className="text-xs text-green-400 mt-2 font-semibold">✓ ПОСЛЕ ЭТОГО МУЗЫКА НАЧИНАЕТ ИГРАТЬ!</p>
                  </div>
                </div>
              </div>

              {/* Phase 3 */}
              <div className="bg-black/40 rounded p-4 border border-blue-900/30 hover:border-blue-800/50 transition">
                <div className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center text-xs font-bold text-blue-400 mt-0.5">
                    3
                  </span>
                  <div className="flex-1">
                    <p className="font-semibold text-cyan-200">Фоновая загрузка (30-80%)</p>
                    <p className="text-sm text-cyan-200/70 mt-1 leading-relaxed">
                      Пока музыка играет, приложение продолжает загружать остальное в фоне. 
                      приложение продолжает загружать оставшиеся <strong>70% трека</strong> с нормальными приоритетами от нескольких пиров параллельно. 
                      При нормальном интернете (20+ Мбит/с) остаток загружается быстрее чем идет трек. (~280 МБ)
                    </p>
                    <p className="text-xs text-cyan-300/50 mt-2">Параллельные загрузки = быстрее, надежнее</p>
                  </div>
                </div>
              </div>

              {/* Phase 4 */}
              <div className="bg-black/40 rounded p-4 border border-purple-900/30 hover:border-purple-800/50 transition">
                <div className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center text-xs font-bold text-purple-400 mt-0.5">
                    4
                  </span>
                  <div className="flex-1">
                    <p className="font-semibold text-cyan-200">Сохранение на диск (80-100%)</p>
                    <p className="text-sm text-cyan-200/70 mt-1 leading-relaxed">
                      Полностью загруженная музыка сохраняется в памяти приложения. 
                      <strong> Следующий раз этот трек будет играть МГНОВЕННО без интернета и торрента</strong>, 
                      так как уже находится на диске. Это работает как обычный плеер, но с возможностью скачивания через торрент. (~55 МБ)
                    </p>
                    <p className="text-xs text-cyan-300/50 mt-2">Локальный кэш = быстрая повторная игра, экономия трафика</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Network & Peers Stats */}
          {!isCompleted && (
          <div className="grid grid-cols-3 gap-4">
            {/* Connected Peers */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-black border border-zinc-800 rounded-lg p-4 hover:border-zinc-700 transition"
            >
              <p className="text-xs text-zinc-500 uppercase tracking-wide mb-2">Активных источников</p>
              <motion.p key={downloadStats.peersCount} initial={{ scale: 0.8 }} animate={{ scale: 1 }} className="text-3xl font-bold text-orange-400">
                {downloadStats.peersCount}
              </motion.p>
              <p className="text-xs text-zinc-500 mt-2">используют этот трек</p>
            </motion.div>

            {/* Speed */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
              className="bg-black border border-zinc-800 rounded-lg p-4 hover:border-zinc-700 transition"
            >
              <p className="text-xs text-zinc-500 uppercase tracking-wide mb-2">Скорость загрузки</p>
              <motion.p key={Math.round(downloadStats.speed)} initial={{ scale: 0.8 }} animate={{ scale: 1 }} className="text-3xl font-bold text-blue-400">
                {downloadStats.speed.toFixed(0)} МБ/с
              </motion.p>
              <p className="text-xs text-zinc-500 mt-2">{(downloadStats.speed * 8).toFixed(0)} Мбит/с</p>
            </motion.div>

            {/* Buffer Health */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-black border border-zinc-800 rounded-lg p-4 hover:border-zinc-700 transition"
            >
              <p className="text-xs text-zinc-500 uppercase tracking-wide mb-2">Буфер готовности</p>
              <motion.p key={Math.round(downloadStats.bufferPercent)} initial={{ scale: 0.8 }} animate={{ scale: 1 }} className="text-3xl font-bold text-green-400">
                {Math.round(downloadStats.bufferPercent)}%
              </motion.p>
              <p className="text-xs text-zinc-500 mt-2">от нужного минимума</p>
            </motion.div>
          </div>
          )}

          {/* Technical Details */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
            className="bg-black border border-zinc-800 rounded-lg p-5"
          >
            <h4 className="font-semibold text-zinc-200 mb-4">Статистика загрузки</h4>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <p className="text-xs text-zinc-500 uppercase tracking-wide mb-1">Загружено</p>
                <p className="text-2xl font-bold">{downloadStats.downloadedMB.toFixed(1)} МБ</p>
                <p className="text-xs text-zinc-500 mt-1">/ {downloadStats.totalMB} МБ всього</p>
              </div>
              <div>
                <p className="text-xs text-zinc-500 uppercase tracking-wide mb-1">Осталось</p>
                <p className="text-2xl font-bold">{(downloadStats.totalMB - downloadStats.downloadedMB).toFixed(1)} МБ</p>
                <p className="text-xs text-zinc-500 mt-1">до завершения</p>
              </div>
              <div>
                <p className="text-xs text-zinc-500 uppercase tracking-wide mb-1">Время</p>
                <p className="text-2xl font-bold">{isCompleted ? "00:00" : downloadStats.timeRemaining}</p>
                <p className="text-xs text-zinc-500 mt-1">примерно</p>
              </div>
              <div>
                <p className="text-xs text-zinc-500 uppercase tracking-wide mb-1">В кэше на диске</p>
                <p className="text-2xl font-bold">2.3 ГБ</p>
                <p className="text-xs text-zinc-500 mt-1">музыки</p>
              </div>
            </div>
          </motion.div>

          {/* Key Benefits Box */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-gradient-to-r from-green-900/20 to-green-900/5 border border-green-800/50 rounded-lg p-5"
          >
            <h4 className="font-semibold text-green-300 mb-3">
              Преимущества торрента
            </h4>
            <ul className="space-y-2 text-sm text-green-200/80">
              <li className="flex gap-2">
                <span className="flex-shrink-0">-</span>
                <span><strong>Мгновенное воспроизведение:</strong> музыка играет через 30-40 миллисекунд</span>
              </li>
              <li className="flex gap-2">
                <span className="flex-shrink-0">-</span>
                <span><strong>Загрузка от нескольких источников:</strong> быстрее и надёжнее</span>
              </li>
              <li className="flex gap-2">
                <span className="flex-shrink-0">-</span>
                <span><strong>Остаток загружается в фоне:</strong> ты слушаешь, а остальное качается сам собой</span>
              </li>
              <li className="flex gap-2">
                <span className="flex-shrink-0">-</span>
                <span><strong>Сохранение на диск:</strong> следующий раз музыка запустится мгновенно</span>
              </li>
              <li className="flex gap-2">
                <span className="flex-shrink-0">-</span>
                <span><strong>Простота:</strong> не нужно ничего знать о торрентах, всё работает автоматически</span>
              </li>
            </ul>
          </motion.div>

          {/* Warning/Info */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45 }}
            className="bg-gradient-to-r from-amber-900/20 to-amber-900/5 border border-amber-800/50 rounded-lg p-5"
          >
            <h4 className="font-semibold text-amber-300 mb-2">
              Интересный факт о торрентах
            </h4>
            <p className="text-sm text-amber-200/80 leading-relaxed">
              Когда ты скачиваешь музику через торрент, одновременно её раздаёшь тем, кто качает это же. 
              Это делает интернет децентрализованным — вместо одного сервера, копией владеют тысячи людей. 
              Поэтому торрент <strong>невозможно заблокировать</strong> одной страной или компанией. 
              Это технология свободы информации.
            </p>
          </motion.div>
        </div>
      </motion.div>

      {/* Click to Expand Hint */}
      <motion.div
        className="text-sm text-zinc-400 text-center mt-5 cursor-pointer transition flex items-center justify-center gap-2 hover:text-orange-400"
        onClick={() => setExpanded(!expanded)}
        whileHover={{ scale: 1.05 }}
      >
        <motion.span animate={expanded ? { rotate: 180 } : { rotate: 0 }} transition={{ duration: 0.3 }}>
          ⬇
        </motion.span>
        <span>
          {expanded ? "Свернуть" : "Расширить и узнать как работает"}
        </span>
      </motion.div>
    </div>
  );
}
