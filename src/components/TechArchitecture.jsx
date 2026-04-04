import { motion } from "framer-motion";
import { Server, Network, HardDrive, Music, Zap } from "lucide-react";

export default function TechArchitecture() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", stiffness: 300, damping: 30 },
    },
  };

  return (
    <section className="relative py-20 px-6 bg-black">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold mb-4">
            Как это работает
          </h2>
          <p className="text-zinc-400 max-w-2xl mx-auto">
            Полный процесс загрузки музыки от подключения до начала воспроизведения. Каждый этап оптимизирован для максимальной скорости.
          </p>
        </motion.div>

        {/* Architecture Diagram */}
        <motion.div variants={containerVariants} initial="hidden" whileInView="visible" viewport={{ once: true }} className="mb-16">
          <div className="relative bg-gradient-to-br from-zinc-900 to-black border border-zinc-800 rounded-2xl p-8 overflow-hidden">
            {/* Background animation */}
            <div className="absolute inset-0 opacity-20">
              <motion.div
                className="absolute top-0 left-0 w-96 h-96 bg-orange-500 rounded-full blur-3xl"
                animate={{ opacity: [0.1, 0.2, 0.1] }}
                transition={{ duration: 4, repeat: Infinity }}
              />
            </div>

            <div className="relative z-10">
              {/* Stage 1: Connection */}
              <motion.div variants={itemVariants} className="mb-12">
                <div className="flex items-start gap-6">
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    className="flex-shrink-0 w-16 h-16 rounded-full bg-yellow-500/20 border border-yellow-500/50 flex items-center justify-center"
                  >
                    <Network size={32} className="text-yellow-400" />
                  </motion.div>
                  <div className="flex-1 pt-2">
                    <h3 className="text-xl font-bold text-white mb-2">Этап 1: Поиск источников</h3>
                    <p className="text-zinc-400 leading-relaxed">
                      Приложение подключается к торрент сети и ищет людей (пиров) которые уже скачали эту музыку. 
                      Также загружается информация о структуре файла и том, где находятся отдельные куски музыки.
                    </p>
                    <div className="mt-3 text-xs text-zinc-500">Время: 2-5 секунд | Данных: около 100 МБ</div>
                  </div>
                </div>
              </motion.div>

              {/* Arrow down */}
              <motion.div className="flex justify-center my-4">
                <motion.div
                  animate={{ y: [0, 8, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="text-orange-500 text-2xl"
                >
                  ↓
                </motion.div>
              </motion.div>

              {/* Stage 2: Priority buffering */}
              <motion.div variants={itemVariants} className="mb-12">
                <div className="flex items-start gap-6">
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    className="flex-shrink-0 w-16 h-16 rounded-full bg-amber-500/20 border border-amber-500/50 flex items-center justify-center"
                  >
                    <Zap size={32} className="text-amber-400" />
                  </motion.div>
                  <div className="flex-1 pt-2">
                    <h3 className="text-xl font-bold text-white mb-2">Этап 2: Приоритетная буферизация</h3>
                    <p className="text-zinc-400 leading-relaxed">
                      Приложение загружает первые 30% трека в приоритетном порядке, одновременно из нескольких источников. 
                      Этого вполне достаточно чтобы начать слушать музыку. Остальное будет загружено пока ты уже слушаешь.
                    </p>
                    <div className="mt-3 text-xs text-zinc-500">Время: 15-30 секунд | Данных: около 135 МБ</div>
                  </div>
                </div>
              </motion.div>

              {/* Arrow down */}
              <motion.div className="flex justify-center my-4">
                <motion.div
                  animate={{ y: [0, 8, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="text-green-500 text-2xl"
                >
                  ↓
                </motion.div>
              </motion.div>

              {/* Stage 3: Streaming playback */}
              <motion.div variants={itemVariants} className="mb-12">
                <div className="flex items-start gap-6">
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    className="flex-shrink-0 w-16 h-16 rounded-full bg-green-500/20 border border-green-500/50 flex items-center justify-center"
                  >
                    <Music size={32} className="text-green-400" />
                  </motion.div>
                  <div className="flex-1 pt-2">
                    <h3 className="text-xl font-bold text-white mb-2">Этап 3: Музыка начинает играть</h3>
                    <p className="text-zinc-400 leading-relaxed">
                      После того как загрузилось достаточно данных, музыка начинает воспроизводиться сразу. 
                      Ты слушаешь музыку, а остальная часть загружается в фоне без каких-либо задержек или прерываний.
                    </p>
                    <div className="mt-3 text-xs text-zinc-500">Задержка перед началом: 30-50 миллисекунд</div>
                  </div>
                </div>
              </motion.div>

              {/* Arrow down */}
              <motion.div className="flex justify-center my-4">
                <motion.div
                  animate={{ y: [0, 8, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="text-blue-500 text-2xl"
                >
                  ↓
                </motion.div>
              </motion.div>

              {/* Stage 4: Background download */}
              <motion.div variants={itemVariants} className="mb-12">
                <div className="flex items-start gap-6">
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    className="flex-shrink-0 w-16 h-16 rounded-full bg-blue-500/20 border border-blue-500/50 flex items-center justify-center"
                  >
                    <Server size={32} className="text-blue-400" />
                  </motion.div>
                  <div className="flex-1 pt-2">
                    <h3 className="text-xl font-bold text-white mb-2">Этап 4: Фоновая загрузка</h3>
                    <p className="text-zinc-400 leading-relaxed">
                      Пока ты слушаешь, приложение продолжает загружать оставшиеся 70% трека от нескольких источников одновременно. 
                      При хорошем интернете (20 Мбит/с и выше) остаток загружается быстрее чем идёт музыка.
                    </p>
                    <div className="mt-3 text-xs text-zinc-500">Время: 2-4 минуты | Данных: около 280 МБ | Источников: 5-15 одновременно</div>
                  </div>
                </div>
              </motion.div>

              {/* Arrow down */}
              <motion.div className="flex justify-center my-4">
                <motion.div
                  animate={{ y: [0, 8, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="text-purple-500 text-2xl"
                >
                  ↓
                </motion.div>
              </motion.div>

              {/* Stage 5: Caching */}
              <motion.div variants={itemVariants}>
                <div className="flex items-start gap-6">
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    className="flex-shrink-0 w-16 h-16 rounded-full bg-purple-500/20 border border-purple-500/50 flex items-center justify-center"
                  >
                    <HardDrive size={32} className="text-purple-400" />
                  </motion.div>
                  <div className="flex-1 pt-2">
                    <h3 className="text-xl font-bold text-white mb-2">Этап 5: Сохранение на диск</h3>
                    <p className="text-zinc-400 leading-relaxed">
                      После полной загрузки треки сохраняются на диск компьютера. Это означает что в следующий раз 
                      музыка запустится мгновенно, без интернета и без торрента. Как обычный плеер, но без ограничений.
                    </p>
                    <div className="mt-3 text-xs text-zinc-500">Папка: ~/.neegde/cache | Автоматическая очистка при нехватке места</div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* Key Components */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="grid md:grid-cols-3 gap-6 mb-16"
        >
          {/* Client */}
          <motion.div
            whileHover={{ y: -5 }}
            className="bg-gradient-to-br from-cyan-900/30 to-cyan-900/10 border border-cyan-700/50 rounded-xl p-6"
          >
            <h3 className="text-lg font-bold text-cyan-300 mb-3">Ваш компьютер</h3>
            <ul className="space-y-2 text-sm text-cyan-100/70">
              <li>- Приложение для Windows, macOS и Linux</li>
              <li>- Управление загрузками</li>
              <li>- Декодирование и проигрывание музыки</li>
              <li>- Управление местным хранилищем</li>
              <li>- Автоматическое удаление старых файлов</li>
            </ul>
          </motion.div>

          {/* Network */}
          <motion.div
            whileHover={{ y: -5 }}
            className="bg-gradient-to-br from-orange-900/30 to-orange-900/10 border border-orange-700/50 rounded-xl p-6"
          >
            <h3 className="text-lg font-bold text-orange-300 mb-3">Торрент сеть</h3>
            <ul className="space-y-2 text-sm text-orange-100/70">
              <li>- Полностью децентрализована</li>
              <li>- Никакого центрального сервера</li>
              <li>- Миллионы пользователей делятся музыкой</li>
              <li>- Работает везде без блокировок</li>
              <li>- Защита приватности каждого пользователя</li>
            </ul>
          </motion.div>

          {/* Backend */}
          <motion.div
            whileHover={{ y: -5 }}
            className="bg-gradient-to-br from-purple-900/30 to-purple-900/10 border border-purple-700/50 rounded-xl p-6"
          >
            <h3 className="text-lg font-bold text-purple-300 mb-3">Торрент движок</h3>
            <ul className="space-y-2 text-sm text-purple-100/70">
              <li>- Современный движок на Rust</li>
              <li>- Загрузка от нескольких источников сразу</li>
              <li>- Умная очередность загрузки</li>
              <li>- Проверка целостности каждого куска</li>
              <li>- Оптимизирован для потокового воспроизведения</li>
            </ul>
          </motion.div>
        </motion.div>

        {/* Why this architecture */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-gradient-to-r from-green-900/20 to-green-900/10 border border-green-700/50 rounded-xl p-8"
        >
          <h3 className="text-2xl font-bold text-green-300 mb-6">Почему торрент вместо обычного сервера?</h3>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <p className="font-semibold text-green-200 mb-3">Проблемы традиционного стриминга:</p>
              <ul className="space-y-2 text-sm text-green-100/70">
                <li>- Огромные расходы на серверы</li>
                <li>- Может быть заблокирован правительством</li>
                <li>- Если сервис закроется, вся музыка теряется</li>
                <li>- Геоблокировки в разных странах</li>
                <li>❌ Цензура и удаление контента</li>
              </ul>
            </div>
            <div>
              <p className="font-semibold text-green-200 mb-3">Преимущества торрента:</p>
              <ul className="space-y-2 text-sm text-green-100/70">
                <li>- Невозможно заблокировать</li>
                <li>- Загрузка отовсюду одновременно</li>
                <li>- Данные хранятся миллионами пользователей</li>
                <li>- Работает везде без ограничений</li>
                <li>- Полностью бесплатно навсегда</li>
              </ul>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
