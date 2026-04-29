import { useState, useEffect, useRef } from "react";
import Icon from "@/components/ui/icon";

const PORTFOLIO_IMAGES = {
  scraping: "https://cdn.poehali.dev/projects/b4883119-28f2-4b14-87a8-78e96b1776df/files/5e0f56be-7456-43b9-bc92-75aacec38627.jpg",
  bots: "https://cdn.poehali.dev/projects/b4883119-28f2-4b14-87a8-78e96b1776df/files/168620fe-2ed1-481a-9251-93a54b59b33c.jpg",
  analytics: "https://cdn.poehali.dev/projects/b4883119-28f2-4b14-87a8-78e96b1776df/files/d83bf085-ef3d-4658-9aac-d7476e629cc7.jpg",
};

function useInView(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setInView(true); },
      { threshold }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [threshold]);
  return { ref, inView };
}

function AnimatedSection({ children, className = "", delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const { ref, inView } = useInView();
  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: inView ? 1 : 0,
        transform: inView ? "translateY(0)" : "translateY(30px)",
        transition: `opacity 0.7s ease ${delay}ms, transform 0.7s ease ${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}

function ParticlesBackground() {
  const particles = Array.from({ length: 18 }, (_, i) => i);
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((i) => (
        <div
          key={i}
          className="absolute rounded-full"
          style={{
            left: `${(i * 17 + 5) % 100}%`,
            top: `${(i * 23 + 10) % 100}%`,
            background: i % 3 === 0 ? "#00F5FF" : i % 3 === 1 ? "#BF5AF2" : "#32D74B",
            opacity: 0.3,
            animation: `float ${3 + (i % 4)}s ease-in-out ${(i * 0.5) % 3}s infinite`,
            width: `${2 + (i % 4)}px`,
            height: `${2 + (i % 4)}px`,
          }}
        />
      ))}
      <div
        className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full blur-3xl opacity-10"
        style={{ background: "radial-gradient(circle, #00F5FF, transparent)" }}
      />
      <div
        className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full blur-3xl opacity-10"
        style={{ background: "radial-gradient(circle, #BF5AF2, transparent)" }}
      />
    </div>
  );
}

function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const links = [
    { href: "#services", label: "Услуги" },
    { href: "#advantages", label: "Преимущества" },
    { href: "#portfolio", label: "Портфолио" },
    { href: "#contacts", label: "Контакты" },
  ];

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
      style={{
        background: scrolled ? "rgba(6,10,16,0.92)" : "transparent",
        backdropFilter: scrolled ? "blur(20px)" : "none",
        borderBottom: scrolled ? "1px solid rgba(0,245,255,0.1)" : "none",
      }}
    >
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <a href="#" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: "linear-gradient(135deg, #00F5FF, #BF5AF2)" }}>
            <Icon name="Zap" size={16} className="text-black" />
          </div>
          <span className="font-montserrat font-black text-xl text-white">Auto<span className="text-gradient-cyan">Script</span></span>
        </a>

        <div className="hidden md:flex items-center gap-8">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="text-sm text-white/60 hover:text-[#00F5FF] transition-colors duration-200 font-medium"
            >
              {l.label}
            </a>
          ))}
        </div>

        <a href="#contacts" className="hidden md:block px-5 py-2.5 rounded-xl text-sm font-bold glow-btn">
          Обсудить проект
        </a>

        <button className="md:hidden text-white/70" onClick={() => setMobileOpen(!mobileOpen)}>
          <Icon name={mobileOpen ? "X" : "Menu"} size={24} />
        </button>
      </div>

      {mobileOpen && (
        <div className="md:hidden px-6 pb-4 flex flex-col gap-3" style={{ background: "rgba(6,10,16,0.98)" }}>
          {links.map((l) => (
            <a key={l.href} href={l.href} className="text-white/70 py-2 border-b border-white/5" onClick={() => setMobileOpen(false)}>
              {l.label}
            </a>
          ))}
          <a href="#contacts" className="mt-2 text-center px-5 py-2.5 rounded-xl text-sm font-bold glow-btn">
            Обсудить проект
          </a>
        </div>
      )}
    </nav>
  );
}

function Hero() {
  const [codeIdx, setCodeIdx] = useState(0);
  const codeLines = [
    "import zenno from 'zennoposter';",
    "const bot = new TelegramBot(TOKEN);",
    "await page.goto('https://wb.ru');",
    "const data = await parser.scrape();",
    "bot.sendMessage(chat_id, result);",
    "await browser.launch({ headless: true });",
  ];

  useEffect(() => {
    const t = setInterval(() => setCodeIdx((p) => (p + 1) % codeLines.length), 2200);
    return () => clearInterval(t);
  }, []);

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-grid pt-20">
      <ParticlesBackground />

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-20 grid md:grid-cols-2 gap-16 items-center">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium mb-6"
            style={{ background: "rgba(0,245,255,0.1)", border: "1px solid rgba(0,245,255,0.25)", color: "#00F5FF" }}>
            <div className="w-1.5 h-1.5 rounded-full bg-[#32D74B] animate-pulse" />
            Принимаем новые проекты
          </div>

          <h1 className="font-montserrat text-5xl md:text-6xl lg:text-7xl font-black leading-none mb-6 tracking-tight">
            <span className="text-white">Автомати</span>
            <span className="text-gradient-cyan">зация</span>
            <br />
            <span className="text-white">на </span>
            <span className="text-gradient-cyan">полной</span>
            <br />
            <span className="text-white">скорости</span>
          </h1>

          <p className="text-white/55 text-lg leading-relaxed mb-10 max-w-md">
            Скрипты ZennoPoster, Telegram-боты, парсинг маркетплейсов и аналитика данных — под ключ, с гарантией результата.
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            <a href="#contacts" className="px-8 py-4 rounded-2xl text-base font-bold glow-btn text-center">
              Начать проект →
            </a>
            <a href="#portfolio" className="px-8 py-4 rounded-2xl text-base font-semibold glow-btn-outline text-center">
              Смотреть работы
            </a>
          </div>

          <div className="flex items-center gap-8 mt-12">
            {[
              { num: "150+", label: "проектов" },
              { num: "5 лет", label: "опыта" },
              { num: "99%", label: "довольных" },
            ].map((s) => (
              <div key={s.label}>
                <div className="font-montserrat text-2xl font-black text-gradient-cyan">{s.num}</div>
                <div className="text-white/40 text-xs mt-0.5">{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="relative animate-float">
          <div className="relative rounded-2xl overflow-hidden neon-border-cyan" style={{ background: "rgba(0,10,20,0.8)" }}>
            <div className="flex items-center gap-1.5 px-4 py-3" style={{ background: "rgba(255,255,255,0.04)", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
              <div className="w-3 h-3 rounded-full bg-red-500/70" />
              <div className="w-3 h-3 rounded-full bg-yellow-500/70" />
              <div className="w-3 h-3 rounded-full bg-green-500/70" />
              <span className="ml-2 text-white/30 text-xs font-mono">autoscript.py</span>
            </div>
            <div className="p-6 font-mono text-sm space-y-2">
              {codeLines.map((line, i) => (
                <div
                  key={i}
                  className="transition-all duration-500"
                  style={{
                    color: i === codeIdx ? "#00F5FF" : i === (codeIdx - 1 + codeLines.length) % codeLines.length ? "rgba(255,255,255,0.4)" : "rgba(255,255,255,0.15)",
                    transform: i === codeIdx ? "translateX(4px)" : "translateX(0)",
                    textShadow: i === codeIdx ? "0 0 20px rgba(0,245,255,0.6)" : "none",
                  }}
                >
                  <span className="text-white/20 mr-3 select-none">{i + 1}</span>
                  {line}
                </div>
              ))}
            </div>
          </div>

          <div className="absolute -top-4 -right-4 w-20 h-20 rounded-2xl flex items-center justify-center animate-pulse-glow"
            style={{ background: "linear-gradient(135deg, #BF5AF2, #00F5FF)" }}>
            <Icon name="Bot" size={32} className="text-black" />
          </div>
          <div className="absolute -bottom-4 -left-4 px-4 py-2 rounded-xl font-mono text-xs"
            style={{ background: "rgba(50,215,75,0.15)", border: "1px solid rgba(50,215,75,0.4)", color: "#32D74B" }}>
            ✓ Running · 0.3ms
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-32 pointer-events-none"
        style={{ background: "linear-gradient(transparent, #060A10)" }} />
    </section>
  );
}

function Services() {
  const services = [
    {
      icon: "Globe",
      title: "ZennoPoster скрипты",
      desc: "Разработка сложных сценариев автоматизации браузера: регистрация аккаунтов, обход капчи, эмуляция поведения пользователя.",
      tags: ["ZennoPoster", "Браузер", "Капча"],
      color: "#00F5FF",
    },
    {
      icon: "Bot",
      title: "Telegram-боты и API",
      desc: "Боты для продаж, поддержки, уведомлений. Интеграция с CRM, 1С, Google Sheets. Автоматизация бизнес-процессов через API.",
      tags: ["Telegram", "API", "CRM"],
      color: "#BF5AF2",
    },
    {
      icon: "Database",
      title: "Парсинг маркетплейсов",
      desc: "Сбор данных с Wildberries, Ozon, Яндекс.Маркет: цены, остатки, отзывы. Мониторинг конкурентов в реальном времени.",
      tags: ["WB", "Ozon", "Яндекс.Маркет"],
      color: "#32D74B",
    },
    {
      icon: "BarChart3",
      title: "Аналитика данных",
      desc: "Обработка и визуализация собранных данных. Дашборды, отчёты, автоматическая выгрузка в Excel/Google Sheets.",
      tags: ["Excel", "Google Sheets", "Дашборды"],
      color: "#FF3B30",
    },
    {
      icon: "Cpu",
      title: "Кастомные решения",
      desc: "Нестандартные задачи автоматизации: парсинг сложных SPA, работа с WebSocket, интеграции с любыми сервисами.",
      tags: ["WebSocket", "SPA", "Custom"],
      color: "#00F5FF",
    },
  ];

  return (
    <section id="services" className="py-28 relative">
      <div className="max-w-7xl mx-auto px-6">
        <AnimatedSection className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium mb-4"
            style={{ background: "rgba(191,90,242,0.1)", border: "1px solid rgba(191,90,242,0.25)", color: "#BF5AF2" }}>
            <Icon name="Layers" size={12} />
            Что мы делаем
          </div>
          <h2 className="font-montserrat text-4xl md:text-5xl font-black text-white mb-4">
            Наши <span className="text-gradient-cyan">услуги</span>
          </h2>
          <p className="text-white/45 text-lg max-w-xl mx-auto">
            Полный цикл разработки — от идеи до готового работающего решения
          </p>
        </AnimatedSection>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {services.map((s, i) => (
            <AnimatedSection key={s.title} delay={i * 80}>
              <div className="glass-card glass-card-hover rounded-2xl p-6 h-full cursor-pointer group">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
                  style={{ background: `${s.color}18`, border: `1px solid ${s.color}30` }}>
                  <Icon name={s.icon} size={22} style={{ color: s.color }} />
                </div>
                <h3 className="font-montserrat font-bold text-lg text-white mb-3 group-hover:text-[#00F5FF] transition-colors">{s.title}</h3>
                <p className="text-white/50 text-sm leading-relaxed mb-4">{s.desc}</p>
                <div className="flex flex-wrap gap-2">
                  {s.tags.map((tag) => (
                    <span key={tag} className="text-xs px-2.5 py-1 rounded-lg"
                      style={{ background: `${s.color}12`, color: s.color, border: `1px solid ${s.color}20` }}>
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
}

function Advantages() {
  const items = [
    { icon: "Rocket", title: "Быстрый старт", desc: "Приступаем к работе в течение 24 часов после обсуждения задачи.", color: "#00F5FF" },
    { icon: "Lock", title: "NDA и конфиденциальность", desc: "Подписываем соглашение о неразглашении. Ваши данные и скрипты под защитой.", color: "#BF5AF2" },
    { icon: "RefreshCw", title: "Поддержка после сдачи", desc: "Бесплатные правки в течение 30 дней. Сопровождение и обновления по договору.", color: "#32D74B" },
    { icon: "Code2", title: "Чистый код", desc: "Документированный, понятный код. Вы всегда знаете, как работает ваш скрипт.", color: "#FF9F0A" },
    { icon: "TrendingUp", title: "Результат измерим", desc: "Договариваемся о KPI: скорость, объём данных, процент успешных запросов.", color: "#FF3B30" },
    { icon: "Headphones", title: "На связи с 8 до 22ч", desc: "Telegram, email — отвечаем быстро. Никаких недель ожидания.", color: "#00F5FF" },
  ];

  return (
    <section id="advantages" className="py-28 relative">
      <div
        className="absolute inset-0 opacity-30 pointer-events-none"
        style={{ background: "radial-gradient(ellipse 80% 50% at 50% 50%, rgba(191,90,242,0.08) 0%, transparent 70%)" }}
      />
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <AnimatedSection className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium mb-4"
            style={{ background: "rgba(50,215,75,0.1)", border: "1px solid rgba(50,215,75,0.25)", color: "#32D74B" }}>
            <Icon name="Star" size={12} />
            Почему мы
          </div>
          <h2 className="font-montserrat text-4xl md:text-5xl font-black text-white mb-4">
            Наши <span className="text-gradient-green">преимущества</span>
          </h2>
          <p className="text-white/45 text-lg max-w-xl mx-auto">
            То, что отличает нас от фрилансеров и студий
          </p>
        </AnimatedSection>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {items.map((item, i) => (
            <AnimatedSection key={item.title} delay={i * 80}>
              <div className="flex gap-4 glass-card glass-card-hover rounded-2xl p-6 h-full cursor-pointer">
                <div className="flex-shrink-0 w-11 h-11 rounded-xl flex items-center justify-center"
                  style={{ background: `${item.color}15`, border: `1px solid ${item.color}25` }}>
                  <Icon name={item.icon} size={20} style={{ color: item.color }} />
                </div>
                <div>
                  <h3 className="font-semibold text-white mb-1.5">{item.title}</h3>
                  <p className="text-white/45 text-sm leading-relaxed">{item.desc}</p>
                </div>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
}

function Portfolio() {
  const [active, setActive] = useState(0);
  const projects = [
    {
      img: PORTFOLIO_IMAGES.scraping,
      tag: "ZennoPoster",
      tagColor: "#00F5FF",
      title: "Автоматизация регистраций и прогрева аккаунтов",
      desc: "Разработали скрипт для массовой регистрации и прогрева аккаунтов на крупном сервисе. Обход fingerprint-защиты, ротация прокси, имитация поведения реального пользователя.",
      metrics: [
        { label: "Аккаунтов/день", value: "500+" },
        { label: "Успешных", value: "97%" },
        { label: "Срок", value: "5 дней" },
      ],
    },
    {
      img: PORTFOLIO_IMAGES.bots,
      tag: "Telegram Bot",
      tagColor: "#BF5AF2",
      title: "Бот для автоматизации продаж в Telegram",
      desc: "Полноценная воронка продаж в Telegram: квалификация лидов, отправка КП, интеграция с CRM и уведомления менеджерам. Обрабатывает до 1000 диалогов одновременно.",
      metrics: [
        { label: "Диалогов", value: "1000" },
        { label: "Конверсия", value: "+34%" },
        { label: "Срок", value: "7 дней" },
      ],
    },
    {
      img: PORTFOLIO_IMAGES.analytics,
      tag: "Парсинг",
      tagColor: "#32D74B",
      title: "Мониторинг цен на Wildberries и Ozon",
      desc: "Ежедневный сбор цен 50,000 товаров с WB и Ozon. Сравнение с конкурентами, алерты при изменении цены, выгрузка в Google Sheets и Telegram-уведомления.",
      metrics: [
        { label: "Товаров", value: "50,000" },
        { label: "Обновление", value: "2 раза/день" },
        { label: "Срок", value: "4 дня" },
      ],
    },
  ];

  const p = projects[active];

  return (
    <section id="portfolio" className="py-28 relative">
      <div className="max-w-7xl mx-auto px-6">
        <AnimatedSection className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium mb-4"
            style={{ background: "rgba(0,245,255,0.1)", border: "1px solid rgba(0,245,255,0.25)", color: "#00F5FF" }}>
            <Icon name="Briefcase" size={12} />
            Кейсы
          </div>
          <h2 className="font-montserrat text-4xl md:text-5xl font-black text-white mb-4">
            Наше <span className="text-gradient-cyan">портфолио</span>
          </h2>
          <p className="text-white/45 text-lg max-w-xl mx-auto">
            Реальные проекты с измеримыми результатами
          </p>
        </AnimatedSection>

        <div className="flex justify-center gap-3 mb-10 flex-wrap">
          {projects.map((proj, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              className="px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300"
              style={{
                background: active === i ? `${proj.tagColor}20` : "rgba(255,255,255,0.05)",
                border: `1px solid ${active === i ? proj.tagColor : "rgba(255,255,255,0.08)"}`,
                color: active === i ? proj.tagColor : "rgba(255,255,255,0.5)",
                boxShadow: active === i ? `0 0 20px ${proj.tagColor}20` : "none",
              }}
            >
              {proj.tag}
            </button>
          ))}
        </div>

        <div className="grid md:grid-cols-2 gap-8 glass-card rounded-3xl overflow-hidden" style={{ border: `1px solid ${p.tagColor}20` }}>
          <div className="relative overflow-hidden" style={{ minHeight: "280px" }}>
            <img src={p.img} alt={p.title} className="w-full h-full object-cover absolute inset-0" />
            <div className="absolute inset-0" style={{ background: "linear-gradient(135deg, rgba(6,10,16,0.3), transparent)" }} />
            <span className="absolute top-4 left-4 px-3 py-1.5 rounded-lg text-xs font-bold"
              style={{ background: `${p.tagColor}25`, border: `1px solid ${p.tagColor}50`, color: p.tagColor }}>
              {p.tag}
            </span>
          </div>

          <div className="p-8 flex flex-col justify-center">
            <h3 className="font-montserrat font-black text-2xl text-white mb-4 leading-tight">{p.title}</h3>
            <p className="text-white/50 leading-relaxed mb-8">{p.desc}</p>

            <div className="grid grid-cols-3 gap-4">
              {p.metrics.map((m) => (
                <div key={m.label} className="rounded-xl p-4 text-center"
                  style={{ background: `${p.tagColor}08`, border: `1px solid ${p.tagColor}15` }}>
                  <div className="font-montserrat text-xl font-black" style={{ color: p.tagColor }}>{m.value}</div>
                  <div className="text-white/35 text-xs mt-1">{m.label}</div>
                </div>
              ))}
            </div>

            <a href="#contacts" className="mt-8 px-6 py-3 rounded-xl text-sm font-semibold text-center transition-all duration-300"
              style={{ background: `${p.tagColor}15`, border: `1px solid ${p.tagColor}30`, color: p.tagColor }}>
              Хочу похожий проект →
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

function Ticker() {
  const items = ["ZennoPoster", "Telegram Боты", "Парсинг WB", "Парсинг Ozon", "Яндекс.Маркет", "Аналитика данных", "API Интеграции", "Автоматизация"];
  const doubled = [...items, ...items];

  return (
    <div className="py-5 overflow-hidden relative" style={{ borderTop: "1px solid rgba(0,245,255,0.08)", borderBottom: "1px solid rgba(0,245,255,0.08)", background: "rgba(0,245,255,0.02)" }}>
      <div className="flex animate-ticker whitespace-nowrap">
        {doubled.map((item, i) => (
          <span key={i} className="inline-flex items-center gap-3 px-6 text-sm font-medium text-white/30">
            <span className="w-1.5 h-1.5 rounded-full bg-[#00F5FF] opacity-60" />
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}

function Contacts() {
  const [form, setForm] = useState({ name: "", contact: "", task: "" });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const handleSubmit = async () => {
    if (!form.contact.trim() || !form.task.trim()) return;
    setStatus("loading");
    try {
      const res = await fetch("https://functions.poehali.dev/b8dccf1a-db95-4009-bd43-7f96d8de1ee8", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        setStatus("success");
        setForm({ name: "", contact: "", task: "" });
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  };

  return (
    <section id="contacts" className="py-28 relative">
      <div
        className="absolute inset-0 pointer-events-none opacity-20"
        style={{ background: "radial-gradient(ellipse 60% 50% at 50% 100%, rgba(0,245,255,0.12) 0%, transparent 70%)" }}
      />
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <AnimatedSection>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium mb-6"
              style={{ background: "rgba(0,245,255,0.1)", border: "1px solid rgba(0,245,255,0.25)", color: "#00F5FF" }}>
              <Icon name="MessageCircle" size={12} />
              Связаться
            </div>
            <h2 className="font-montserrat text-4xl md:text-5xl font-black text-white mb-6 leading-tight">
              Обсудим <span className="text-gradient-cyan">ваш проект</span>
            </h2>
            <p className="text-white/50 text-lg leading-relaxed mb-10">
              Расскажите задачу — предложим решение и озвучим стоимость в течение нескольких часов.
            </p>

            <div className="space-y-5">
              {[
                { icon: "MessageSquare", label: "Telegram", value: "@Aleksey_job", color: "#00F5FF" },
                { icon: "Clock", label: "Режим работы", value: "С 8:00 до 22:00", color: "#32D74B" },
              ].map((c) => (
                <div key={c.label} className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ background: `${c.color}12`, border: `1px solid ${c.color}25` }}>
                    <Icon name={c.icon} size={18} style={{ color: c.color }} />
                  </div>
                  <div>
                    <div className="text-white/35 text-xs">{c.label}</div>
                    <div className="text-white font-medium text-sm">{c.value}</div>
                  </div>
                </div>
              ))}
            </div>
          </AnimatedSection>

          <AnimatedSection delay={150}>
            <div className="glass-card neon-border-cyan rounded-3xl p-8">
              <h3 className="font-montserrat font-bold text-xl text-white mb-6">Оставить заявку</h3>
              <div className="space-y-4">
                <div>
                  <label className="text-white/40 text-xs mb-1.5 block">Ваше имя</label>
                  <input
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="Иван Иванов"
                    className="w-full px-4 py-3 rounded-xl text-sm text-white placeholder-white/25 outline-none"
                    style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)" }}
                  />
                </div>
                <div>
                  <label className="text-white/40 text-xs mb-1.5 block">Telegram или Email</label>
                  <input
                    value={form.contact}
                    onChange={(e) => setForm({ ...form, contact: e.target.value })}
                    placeholder="@username или email@mail.ru"
                    className="w-full px-4 py-3 rounded-xl text-sm text-white placeholder-white/25 outline-none"
                    style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)" }}
                  />
                </div>
                <div>
                  <label className="text-white/40 text-xs mb-1.5 block">Опишите задачу</label>
                  <textarea
                    value={form.task}
                    onChange={(e) => setForm({ ...form, task: e.target.value })}
                    placeholder="Что нужно автоматизировать? Какие данные собрать?"
                    rows={4}
                    className="w-full px-4 py-3 rounded-xl text-sm text-white placeholder-white/25 outline-none resize-none"
                    style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)" }}
                  />
                </div>
                {status === "success" ? (
                  <div className="w-full py-4 rounded-xl text-base font-semibold text-center"
                    style={{ background: "rgba(50,215,75,0.15)", border: "1px solid rgba(50,215,75,0.4)", color: "#32D74B" }}>
                    ✓ Заявка отправлена! Свяжемся с вами скоро.
                  </div>
                ) : (
                  <button
                    onClick={handleSubmit}
                    disabled={status === "loading" || !form.contact.trim() || !form.task.trim()}
                    className="w-full py-4 rounded-xl text-base font-bold glow-btn disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {status === "loading" ? "Отправляем..." : "Отправить заявку →"}
                  </button>
                )}
                {status === "error" && (
                  <p className="text-red-400 text-xs text-center">Ошибка отправки. Напишите напрямую в Telegram.</p>
                )}
                <p className="text-white/25 text-xs text-center">
                  Нажимая кнопку, вы соглашаетесь с политикой конфиденциальности
                </p>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="py-10 relative" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: "linear-gradient(135deg, #00F5FF, #BF5AF2)" }}>
              <Icon name="Zap" size={14} className="text-black" />
            </div>
            <span className="font-montserrat font-bold text-lg text-white">Auto<span className="text-gradient-cyan">Script</span></span>
          </div>

          <div className="flex items-center gap-6 text-sm text-white/35">
            <a href="#services" className="hover:text-white/70 transition-colors">Услуги</a>
            <a href="#portfolio" className="hover:text-white/70 transition-colors">Портфолио</a>
            <a href="#contacts" className="hover:text-white/70 transition-colors">Контакты</a>
          </div>

          <div className="text-white/25 text-xs text-center md:text-right">
            © 2024 AutoScript · Автоматизация и парсинг
          </div>
        </div>
      </div>
    </footer>
  );
}

export default function Index() {
  return (
    <div className="min-h-screen" style={{ background: "#060A10" }}>
      <Navbar />
      <Hero />
      <Ticker />
      <Services />
      <div className="section-divider mx-8 my-4" />
      <Advantages />
      <div className="section-divider mx-8 my-4" />
      <Portfolio />
      <Ticker />
      <Contacts />
      <Footer />
    </div>
  );
}