import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Download, Check, Pause, Play, Server, Zap, Network, Music } from "lucide-react";

const tracks = [
  { id: 1, name: "The Nights", artist: "Avicii", duration: "4:09", size: "5.3 MB" },
  { id: 2, name: "Levitating", artist: "Dua Lipa", duration: "3:23", size: "4.8 MB" },
  { id: 3, name: "Blinding Lights", artist: "The Weeknd", duration: "3:20", size: "4.5 MB" },
  { id: 4, name: "Shape of You", artist: "Ed Sheeran", duration: "3:54", size: "5.1 MB" },
];

export default function DownloadDemo() {
  const [isRunning, setIsRunning] = useState(false);
  const [progress, setProgress] = useState({
    phase: "idle",
    currentFile: 0,
    fileProgress: 0,
    totalFiles: tracks.length,
  });

  useEffect(() => {
    if (!isRunning) return;

    const interval = setInterval(() => {
      setProgress((prev) => {
        let nextFile = prev.currentFile;
        let nextProgress = prev.fileProgress + Math.random() * 12;

        if (nextProgress >= 100) {
          nextFile += 1;
          nextProgress = 0;
        }

        if (nextFile >= tracks.length) {
          setIsRunning(false);
          return {
            phase: "completed",
            currentFile: nextFile - 1,
            fileProgress: 100,
            totalFiles: tracks.length,
          };
        }

        const phaseMap = {
          0: "connecting",
          1: "buffering",
          2: "downloading",
          3: "caching"
        };
        const progressStage = Math.floor(nextProgress / 25);

        return {
          phase: phaseMap[Math.min(progressStage, 3)],
          currentFile: nextFile,
          fileProgress: Math.min(nextProgress, 99),
          totalFiles: tracks.length,
        };
      });
    }, 400);

    return () => clearInterval(interval);
  }, [isRunning]);

  const currentTrack = tracks[progress.currentFile];
  const displayProgress = Math.round(
    (progress.currentFile * 100 + progress.fileProgress) / tracks.length
  );

  const phaseDescriptions = {
    idle: { icon: Download, label: "Готово к скачиванию", color: "text-zinc-400" },
    connecting: { icon: Network, label: "⚡ Подключение к узлам торрента", color: "text-yellow-500" },
    buffering: { icon: Zap, label: "📡 Буферизация первых данных", color: "text-amber-500" },
    downloading: { icon: Download, label: "📥 Скачивание трека", color: "text-orange-500" },
    caching: { icon: Server, label: "💾 Сохранение в кэш и готовка к воспроизведению", color: "text-blue-500" },
    completed: { icon: Check, label: "✓ Все треки готовы", color: "text-green-500" },
  };

  const currentPhaseInfo = phaseDescriptions[progress.phase] || phaseDescriptions.idle;

  return (
    <section className="py-32 px-6 bg-gradient-to-br from-zinc-900 via-black to-zinc-950">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-4xl font-bold text-center mb-6">
          Как скачивается музыка
        </h2>

        <p className="text-zinc-400 text-center mb-16">
          Посмотри анимацию процесса скачивания треков с полной информацией о
          ходе загрузки
        </p>

        {/* Main Progress Container */}
        <motion.div
          className="bg-black border border-zinc-800 rounded-2xl p-8 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {/* Phase Indicator */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <p className="text-sm text-zinc-500 uppercase tracking-wide mb-2">
                Текущий процесс
              </p>
              <motion.div
                key={progress.phase}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center gap-2"
              >
                <motion.div
                  animate={progress.phase !== "idle" && progress.phase !== "completed" ? { rotate: 360 } : {}}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                >
                  <currentPhaseInfo.icon size={24} className={currentPhaseInfo.color} />
                </motion.div>
                <p className={`text-lg font-semibold ${currentPhaseInfo.color}`}>
                  {currentPhaseInfo.label}
                </p>
              </motion.div>
            </div>

            <motion.div className="text-right">
              <p className="text-sm text-zinc-500 uppercase tracking-wide mb-2">
                Общий прогресс
              </p>
              <motion.p
                key={displayProgress}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="text-3xl font-bold"
                style={{
                  color: "rgb(252, 116, 29)",
                }}
              >
                {displayProgress}%
              </motion.p>
              <p className="text-xs text-zinc-500 mt-1">{progress.currentFile + 1} из {tracks.length}</p>
            </motion.div>
          </div>

          {/* Overall Progress Bar */}
          <div className="mb-8">
            <p className="text-xs text-zinc-400 mb-2">Всего: {tracks.length} треков</p>
            <div className="relative h-2 bg-zinc-800 rounded-full overflow-hidden">
              <motion.div
                className="h-full rounded-full"
                style={{
                  background:
                    "linear-gradient(90deg, rgb(252, 116, 29), rgb(249, 115, 22))",
                }}
                animate={{ width: `${displayProgress}%` }}
                transition={{ duration: 0.5, ease: "easeOut" }}
              />
            </div>
          </div>

          {/* Current File Progress */}
          {progress.phase !== "idle" && currentTrack && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gradient-to-r from-zinc-900 to-zinc-950 rounded-lg p-5 mb-6 border border-zinc-800"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <p className="text-xs text-zinc-500 uppercase tracking-wide mb-1">
                    Трек {progress.currentFile + 1}/{tracks.length}
                  </p>
                  <p className="font-semibold text-lg text-white mb-1">{currentTrack.name}</p>
                  <p className="text-sm text-zinc-400">{currentTrack.artist} · {currentTrack.duration}</p>
                </div>

                {progress.fileProgress === 100 && (
                  <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    className="flex-shrink-0 ml-4"
                  >
                    <Check
                      size={28}
                      className="text-green-500"
                      strokeWidth={3}
                    />
                  </motion.div>
                )}
              </div>

              {progress.fileProgress < 100 && (
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <div className="flex-1">
                      <div className="relative h-3 bg-zinc-800 rounded-full overflow-hidden">
                        <motion.div
                          className="h-full rounded-full bg-gradient-to-r from-orange-500 to-orange-400"
                          animate={{
                            width: `${progress.fileProgress}%`,
                          }}
                          transition={{ duration: 0.4, ease: "easeOut" }}
                        />
                      </div>
                    </div>
                    <p className="text-sm font-semibold text-orange-400 ml-3 w-12 text-right">
                      {Math.round(progress.fileProgress)}%
                    </p>
                  </div>
                  <p className="text-xs text-zinc-500">~{currentTrack.size}</p>
                </div>
              )}
            </motion.div>
          )}

          {/* Queue List */}
          <div>
            <p className="text-sm text-zinc-500 uppercase tracking-wide mb-3">
              Очередь скачивания
            </p>

            <div className="space-y-2">
              {tracks.map((track, index) => {
                const isCompleted = index < progress.currentFile;
                const isCurrent = index === progress.currentFile;

                return (
                  <motion.div
                    key={track.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={`flex items-center gap-3 p-3 rounded-lg transition ${
                      isCompleted
                        ? "bg-zinc-900 opacity-60"
                        : isCurrent
                          ? "bg-zinc-800 border border-zinc-700"
                          : "bg-zinc-950"
                    }`}
                  >
                    {isCompleted ? (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                      >
                        <Check size={18} className="text-green-500" />
                      </motion.div>
                    ) : isCurrent ? (
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{
                          duration: 1,
                          repeat: Infinity,
                          ease: "linear",
                        }}
                      >
                        <Download size={18} className="text-orange-500" />
                      </motion.div>
                    ) : (
                      <Download size={18} className="text-zinc-600" />
                    )}

                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">
                        {track.name}
                      </p>
                      <p className="text-xs text-zinc-500 truncate">
                        {track.artist}
                      </p>
                    </div>

                    {isCompleted && (
                      <span className="text-xs text-green-500 font-medium">
                        100%
                      </span>
                    )}
                  </motion.div>
                );
              })}
            </div>
          </div>
        </motion.div>

        {/* Control Buttons */}
        <div className="flex gap-4 justify-center">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              if (progress.phase === "completed") {
                setProgress({
                  phase: "idle",
                  currentFile: 0,
                  fileProgress: 0,
                  totalFiles: tracks.length,
                });
              }
              setIsRunning(!isRunning);
            }}
            className={`px-8 py-3 rounded-lg font-medium flex items-center gap-2 transition ${
              isRunning
                ? "bg-red-600 hover:bg-red-700"
                : "bg-orange-600 hover:bg-orange-700"
            }`}
          >
            {isRunning ? (
              <>
                <Pause size={18} />
                Пауза
              </>
            ) : (
              <>
                <Play size={18} />
                {progress.phase === "completed" ? "Снова" : "Начать"}
              </>
            )}
          </motion.button>

          {progress.phase !== "idle" && (
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              onClick={() => {
                setIsRunning(false);
                setProgress({
                  phase: "idle",
                  currentFile: 0,
                  fileProgress: 0,
                  totalFiles: tracks.length,
                });
              }}
              className="px-8 py-3 rounded-lg font-medium border border-zinc-700 hover:border-zinc-600 transition"
            >
              Отменить
            </motion.button>
          )}
        </div>

        {/* Info Box */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-12 space-y-4"
        >
          <div className="bg-cyan-900/20 border border-cyan-800/50 rounded-lg p-5">
            <h4 className="font-semibold text-cyan-300 mb-2 flex items-center gap-2">
              <Network size={18} />
              Как это работает изнутри
            </h4>
            <ul className="text-sm text-cyan-200/80 space-y-2">
              <li>🔗 <strong>Подключение:</strong> Приложение находит пиры в торрент сети для синхронизации</li>
              <li>📡 <strong>Буферизация:</strong> Загружаются первые 20-30% файла для начала воспроизведения</li>
              <li>📥 <strong>Потоковая загрузка:</strong> Остальное скачивается в фоне пока ты слушаешь</li>
              <li>💾 <strong>Кэширование:</strong> Загруженные данные сохраняются на диск (потом не нужно перекачивать)</li>
              <li>🎵 <strong>Воспроизведение:</strong> Музыка начинает играть ~2-3 сек после буферизации</li>
            </ul>
          </div>

          <div className="bg-amber-900/20 border border-amber-800/50 rounded-lg p-5">
            <h4 className="font-semibold text-amber-300 mb-2 flex items-center gap-2">
              <Music size={18} />
              Фазы загрузки
            </h4>
            <div className="space-y-2 text-sm">
              <div className="flex items-start gap-3">
                <span className="w-2 h-2 mt-1.5 rounded-full bg-yellow-500 flex-shrink-0"></span>
                <span><strong className="text-amber-200">Подключение (0-25%):</strong> связь с пирами, обмен инфой о файле</span>
              </div>
              <div className="flex items-start gap-3">
                <span className="w-2 h-2 mt-1.5 rounded-full bg-amber-500 flex-shrink-0"></span>
                <span><strong className="text-amber-200">Буферизация (25-50%):</strong> загрузка начального куска (~30% файла)</span>
              </div>
              <div className="flex items-start gap-3">
                <span className="w-2 h-2 mt-1.5 rounded-full bg-orange-500 flex-shrink-0"></span>
                <span><strong className="text-amber-200">Загрузка (50-75%):</strong> музыка уже играет, качается остально</span>
              </div>
              <div className="flex items-start gap-3">
                <span className="w-2 h-2 mt-1.5 rounded-full bg-blue-500 flex-shrink-0"></span>
                <span><strong className="text-amber-200">Завершение (75-100%):</strong> последние куски + запись в кэш</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
