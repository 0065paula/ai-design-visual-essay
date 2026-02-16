"use client";

import { useEffect, useState, useRef, ReactNode } from "react";
import { motion, useScroll, useSpring } from "framer-motion";
import { ChevronDown, Sparkles } from "lucide-react";

// Custom hook for scroll-triggered animations
function useScrollReveal(threshold = 0.1) {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const rect = element.getBoundingClientRect();
    if (rect.top < window.innerHeight && rect.bottom > 0) {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold, rootMargin: "0px 0px -50px 0px" }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [threshold]);

  return { ref, isVisible };
}

// Editorial reveal animation
function Reveal({ 
  children, 
  className = "",
  delay = 0 
}: { 
  children: ReactNode; 
  className?: string;
  delay?: number;
}) {
  const { ref, isVisible } = useScrollReveal();

  return (
    <div
      ref={ref}
      className={`${className} transition-all duration-1000 ease-out`}
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translateY(0)' : 'translateY(40px)',
        transitionDelay: `${delay}ms`
      }}
    >
      {children}
    </div>
  );
}

// Editorial Paragraph with drop cap option
function EditorialParagraph({ 
  children, 
  dropCap = false,
  className = ""
}: { 
  children: React.ReactNode; 
  dropCap?: boolean;
  className?: string;
}) {
  if (dropCap && typeof children === 'string') {
    const firstChar = children.charAt(0);
    const rest = children.slice(1);
    return (
      <p className={`editorial-text ${className}`}>
        <span className="drop-cap">{firstChar}</span>
        {rest}
      </p>
    );
  }
  return <p className={`editorial-text ${className}`}>{children}</p>;
}

// Pull Quote - editorial style
function PullQuote({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <blockquote className={`pull-quote ${className}`}>
      {children}
    </blockquote>
  );
}

// Navigation Component
function Navigation() {
  const [activeSection, setActiveSection] = useState("hero");
  
  const sections = [
    { id: "hero", label: "引言" },
    { id: "crisis", label: "危机" },
    { id: "debate", label: "争论" },
    { id: "scarcity", label: "稀缺" },
    { id: "fusion", label: "融合" },
    { id: "action", label: "行动" },
  ];

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + window.innerHeight / 3;
      sections.forEach((section) => {
        const element = document.getElementById(section.id);
        if (element) {
          const { offsetTop, offsetHeight } = element;
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(section.id);
          }
        }
      });
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) element.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <nav className="fixed right-8 top-1/2 -translate-y-1/2 z-50 hidden lg:block">
      <div className="flex flex-col gap-4">
        {sections.map((section) => (
          <button
            key={section.id}
            onClick={() => scrollToSection(section.id)}
            className={`group flex items-center gap-3 transition-all duration-300 ${
              activeSection === section.id ? "opacity-100" : "opacity-40 hover:opacity-70"
            }`}
          >
            <span className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
              activeSection === section.id ? "bg-[#c9a961]" : "bg-[#f5f5f0]"
            }`} />
            <span className={`text-xs tracking-widest uppercase font-sans ${
              activeSection === section.id ? "text-[#c9a961]" : "text-[#f5f5f0]/60"
            }`}>
              {section.label}
            </span>
          </button>
        ))}
      </div>
    </nav>
  );
}

// Progress Bar
function ProgressBar() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });

  return <motion.div className="progress-bar" style={{ scaleX }} />;
}

// Hero Section - Editorial style
function HeroSection() {
  return (
    <section id="hero" className="relative min-h-[100dvh] flex flex-col justify-center px-6 sm:px-12 lg:px-24 py-20">
      {/* Subtle background texture */}
      <div className="absolute inset-0 opacity-30">
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-px h-px bg-[#c9a961]/40 rounded-full"
            style={{ left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%` }}
            animate={{ y: [0, -20, 0], opacity: [0.3, 0.8, 0.3] }}
            transition={{ duration: 4 + Math.random() * 3, repeat: Infinity, delay: Math.random() * 2 }}
          />
        ))}
      </div>

      <div className="relative z-10 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-8"
        >
          <span className="inline-flex items-center gap-2 text-[#c9a961] text-xs tracking-[0.3em] uppercase font-sans">
            <Sparkles className="w-3 h-3" />
            Visual Essay
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="editorial-title mb-8"
        >
          AI 时代
          <br />
          <span className="text-[#f5f5f0]/70">界面设计的未来</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="editorial-lead max-w-2xl"
        >
          从危机到融合，探索人工智能如何重新定义设计实践、审美价值与人类创造力的边界
        </motion.p>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="mt-16"
        >
          <ChevronDown className="w-5 h-5 text-[#c9a961]/50 animate-bounce" />
        </motion.div>
      </div>
    </section>
  );
}

// Section Header
function SectionHeader({ 
  number, 
  title, 
  subtitle 
}: { 
  number: string; 
  title: string; 
  subtitle?: string;
}) {
  return (
    <div className="mb-16 sm:mb-24">
      <span className="section-number">{number}</span>
      <h2 className="editorial-heading mt-4">{title}</h2>
      {subtitle && <p className="editorial-subheading mt-4">{subtitle}</p>}
    </div>
  );
}

// Crisis Section
function CrisisSection() {
  return (
    <section id="crisis" className="editorial-section">
      <div className="editorial-container">
        <Reveal>
          <SectionHeader 
            number="01" 
            title="AI 没有制造危机，它暴露了危机"
          />
        </Reveal>

        <div className="editorial-grid">
          <div className="editorial-main">
            <Reveal delay={100}>
              <EditorialParagraph dropCap>
                2024 年{" "}
                <a 
                  href="https://www.figma.com/blog/whats-happening-at-config-2024/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-[#c9a961] hover:underline underline-offset-4"
                >
                  Figma Config
                </a>
                ，Dylan Field 在 10,000 名设计师面前输入提示词：「一个为中土世界可持续建筑师设计的个人作品集网站」。几秒钟后，完整的 UI 布局生成完毕。设计师{" "}
                <a 
                  href="https://medium.com/@dolphia.n.arnstein" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-[#c9a961] hover:underline underline-offset-4"
                >
                  Sebastiaan de With
                </a>
                {" "}写道：「如果某人可以一键生成那张海报，人们大多数时候会选择那个。」
              </EditorialParagraph>
            </Reveal>

            <Reveal delay={200}>
              <PullQuote>
                如果 AI 能用文本提示完成你的工作，那你的工作到底是什么？
              </PullQuote>
            </Reveal>

            <Reveal delay={300}>
              <EditorialParagraph>
                这个问题像一面镜子，照出的不是 AI 的威胁，而是设计行业长期以来的集体幻觉——我们以为自己在做「创造性工作」，实际上只是在重复模式。AI 没有制造危机，它暴露了危机。
              </EditorialParagraph>
            </Reveal>
          </div>

          <Reveal delay={200} className="editorial-aside">
            <div className="sticky top-32">
              <p className="text-sm text-[#f5f5f0]/40 font-sans tracking-wider uppercase mb-2">Reference</p>
              <p className="text-sm text-[#f5f5f0]/60 font-sans italic">
                <a 
                  href="https://uxdesign.cc/why-ai-is-exposing-designs-craft-crisis-434bcb652848" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:text-[#c9a961] transition-colors"
                >
                  Dolphia, UX Collective, 2025
                </a>
              </p>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

// Debate Section
function DebateSection() {
  const [activeView, setActiveView] = useState<"victor" | "control" | null>(null);

  return (
    <section id="debate" className="editorial-section bg-[#1a1a1a]/50">
      <div className="editorial-container">
        <Reveal>
          <SectionHeader 
            number="02" 
            title="两种极端的碰撞"
            subtitle="当 AI 足够强大时，我们还需要界面吗？"
          />
        </Reveal>

        <Reveal delay={100}>
          <div className="flex gap-4 mb-16">
            {["victor", "control"].map((view) => (
              <button
                key={view}
                onClick={() => setActiveView(view as "victor" | "control")}
                className={`px-6 py-3 text-xs tracking-[0.2em] uppercase font-sans transition-all duration-300 ${
                  activeView === view 
                    ? "text-[#c9a961] border-b border-[#c9a961]" 
                    : "text-[#f5f5f0]/40 hover:text-[#f5f5f0]/70"
                }`}
              >
                {view === "victor" ? "Bret Victor 派" : "控制派"}
              </button>
            ))}
          </div>
        </Reveal>

        <div className="grid md:grid-cols-2 gap-16">
          <Reveal delay={200}>
            <div className={`transition-opacity duration-500 ${activeView && activeView !== "victor" ? "opacity-30" : "opacity-100"}`}>
              <h3 className="font-serif text-2xl mb-6 text-[#c9a961]">界面是一种必要的恶</h3>
              <div className="space-y-4">
                <EditorialParagraph className="text-[#f5f5f0]/80">
                  屏幕是单用户的、封闭的、静态的媒介。真正的理解需要看到系统内部、跨越时间。我们被困在「手指触摸玻璃」的贫乏想象中。当 AI 足够强大时，为什么还需要固定界面？
                </EditorialParagraph>
                <p className="text-xs text-[#f5f5f0]/40 font-sans tracking-wider mt-8">
                  —{" "}
                  <a 
                    href="https://worrydream.com/SeeingSpaces/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="hover:text-[#c9a961] transition-colors"
                  >
                    Bret Victor · Seeing Spaces
                  </a>
                </p>
              </div>
            </div>
          </Reveal>

          <Reveal delay={300}>
            <div className={`transition-opacity duration-500 ${activeView && activeView !== "control" ? "opacity-30" : "opacity-100"}`}>
              <h3 className="font-serif text-2xl mb-6 text-[#c9a961]">没有界面，就没有控制</h3>
              <div className="space-y-4">
                <EditorialParagraph className="text-[#f5f5f0]/80">
                  可见性是信任的基础。语言是模糊的，界面是精确的。用户失去了心智模型，无法预测失败。美学是功能的一部分，不是奢侈品。
                </EditorialParagraph>
                <p className="text-xs text-[#f5f5f0]/40 font-sans tracking-wider mt-8">
                  —{" "}
                  <a 
                    href="https://www.nngroup.com/people/jakob-nielsen/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="hover:text-[#c9a961] transition-colors"
                  >
                    Jakob Nielsen · UX 权威
                  </a>
                </p>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

// Scarcity Section
function ScarcitySection() {
  return (
    <section id="scarcity" className="editorial-section">
      <div className="editorial-container">
        <Reveal>
          <SectionHeader 
            number="03" 
            title="「平均」的暴政"
          />
        </Reveal>

        <div className="editorial-grid">
          <div className="editorial-main">
            <Reveal delay={100}>
              <EditorialParagraph dropCap>
                AI 生成的设计有一个隐藏的特性：<em className="text-[#c9a961] not-italic">它是统计学意义上的平均</em>。当 AI 学习数百万个界面时，它学到的是「最常见的圆角半径」、「最安全的配色方案」、「最不容易被投诉的布局」。它生成的是最大公约数——不会冒犯任何人，也不会打动任何人。
              </EditorialParagraph>
            </Reveal>

            <Reveal delay={200}>
              <PullQuote className="border-l-2 border-[#c9a961] pl-8">
                美不是安全，美是冒险。
              </PullQuote>
            </Reveal>

            <Reveal delay={300}>
              <EditorialParagraph>
                真正打动人的设计往往是深植于特定文化语境的：荷兰设计的理性与秩序感、斯堪的纳维亚的 hygge 美学、日本设计的空寂与禅意。AI 无法真正「理解」这些文化密码，它只能<em className="text-[#c9a961] not-italic">模仿表面</em>。
              </EditorialParagraph>
            </Reveal>
          </div>

          <Reveal delay={200} className="editorial-aside">
            <div className="sticky top-32 space-y-8">
              <div>
                <p className="text-4xl font-serif text-[#c9a961] mb-2">最大公约数</p>
                <p className="text-xs text-[#f5f5f0]/40 font-sans uppercase tracking-wider">Statistical Average</p>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

// Fusion Section
function FusionSection() {
  const modes = [
    { 
      id: "curator", 
      label: "Curator", 
      title: "策展者模式",
      desc: "人类成为品味的守门人——不亲手制作，但决定什么是好的。画廊策展人选择 AI 生成的作品，音乐制作人从 AI 生成的 100 个旋律中挑选并打磨。",
      skills: ["审美判断力", "文化敏感度", "表达能力"]
    },
    { 
      id: "director", 
      label: "Director", 
      title: "导演模式",
      desc: "人类设定愿景和约束，AI 执行，人类迭代反馈。像拍电影：导演不亲自摄影，但决定每一个镜头的意图。AI 是剧组，人类是导演。",
      skills: ["清晰的愿景", "对细节的执着", "决策能力"]
    },
    { 
      id: "symbiosis", 
      label: "Symbiosis", 
      title: "共生模式",
      desc: "人类和 AI 共同演化，界限模糊。设计师用 AI 生成初稿，初稿改变了设计师的想法，新想法再输入 AI，最终产出是涌现的。",
      skills: ["开放的思维", "放弃控制", "欣赏意外"]
    },
  ];

  return (
    <section id="fusion" className="editorial-section">
      <div className="editorial-container">
        <Reveal>
          <SectionHeader 
            number="04" 
            title="混合形态的三种实现"
          />
        </Reveal>

        <div className="space-y-24">
          {modes.map((mode, index) => (
            <Reveal key={mode.id} delay={index * 100}>
              <div className="editorial-grid">
                <div className="w-32">
                  <p className="text-xs text-[#c9a961]/60 font-sans tracking-[0.3em] uppercase">{mode.label}</p>
                </div>
                <div className="flex-1">
                  <h3 className="font-serif text-3xl mb-6">{mode.title}</h3>
                  <p className="editorial-text text-[#f5f5f0]/80 mb-8">{mode.desc}</p>
                  <div className="flex flex-wrap gap-3">
                    {mode.skills.map((skill) => (
                      <span 
                        key={skill} 
                        className="text-xs text-[#f5f5f0]/50 font-sans tracking-wider"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

// Action Section
function ActionSection() {
  const actions = [
    {
      title: "审美：从「看很多」到「看得深」",
      items: ["研究单一作品的完整决策链", "跨媒介审美训练（电影、建筑、时尚）", "建立个人「反例库」"]
    },
    {
      title: "视野：成为「T 型人才」",
      items: ["了解基础 AI 原理", "学习一个完全无关的领域", "选择一个细分领域深耕"]
    },
    {
      title: "思辨：培养「对抗性思维」",
      items: ["每天问自己：什么证据会改变我的想法？", "每月写一篇「反对自己」的文章", "参与批评：不只是点评「好不好看」"]
    },
  ];

  return (
    <section id="action" className="editorial-section bg-[#1a1a1a]/50">
      <div className="editorial-container">
        <Reveal>
          <SectionHeader 
            number="05" 
            title="成为 AI 的导演"
            subtitle="三个维度的具体行动路径"
          />
        </Reveal>

        <div className="space-y-20">
          {actions.map((action, index) => (
            <Reveal key={action.title} delay={index * 100}>
              <div className="editorial-grid">
                <div className="w-24">
                  <p className="text-5xl font-serif text-[#c9a961]/20">0{index + 1}</p>
                </div>
                <div className="flex-1">
                  <h3 className="font-serif text-xl mb-6 text-[#c9a961]">{action.title}</h3>
                  <ul className="space-y-3">
                    {action.items.map((item) => (
                      <li key={item} className="editorial-text text-[#f5f5f0]/70 flex items-start gap-4">
                        <span className="text-[#c9a961]/40 mt-2">—</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal delay={400}>
          <div className="mt-32 pt-16 border-t border-[#f5f5f0]/10 text-center">
            <blockquote className="font-serif text-2xl sm:text-3xl text-[#f5f5f0]/90 mb-4">
              「当 AI 让「足够好」变得廉价时，
              <br />
              <span className="text-[#c9a961]">「有灵魂」变得珍贵。」</span>
            </blockquote>
            <p className="text-xs text-[#f5f5f0]/30 font-sans tracking-wider">
              一场关于 Paula Meng 与 AI 的对话 · 2026
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

// Main Page
export default function Home() {
  return (
    <main className="relative">
      <ProgressBar />
      <Navigation />
      
      <HeroSection />
      <CrisisSection />
      <DebateSection />
      <ScarcitySection />
      <FusionSection />
      <ActionSection />
      
      <footer className="py-16 px-6 sm:px-12 lg:px-24 border-t border-[#f5f5f0]/5">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <p className="text-xs text-[#f5f5f0]/30 font-sans tracking-wider">
            AI 时代界面设计的未来
          </p>
          <p className="text-xs text-[#c9a961]/30 font-sans">
            Editorial Essay · 2026
          </p>
        </div>
      </footer>
    </main>
  );
}
