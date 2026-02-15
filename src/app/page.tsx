"use client";

import { useEffect, useState, useRef, ReactNode } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { ChevronDown, Sparkles, Eye, Brain, Heart, Compass, ArrowRight } from "lucide-react";

// Custom hook for scroll-triggered animations using Intersection Observer
function useScrollReveal(threshold = 0.1) {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    // Check if already in view on mount (for SSR/hydration)
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
      { 
        threshold,
        rootMargin: "0px 0px -50px 0px" // Trigger slightly before fully in view
      }
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, [threshold]);

  return { ref, isVisible };
}

// Reveal wrapper component
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
      className={`${className} transition-all duration-700 ease-out`}
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translateY(0)' : 'translateY(30px)',
        transitionDelay: `${delay}ms`
      }}
    >
      {children}
    </div>
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
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
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
            <span
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                activeSection === section.id
                  ? "bg-[#c9a961] scale-125"
                  : "bg-[#f5f5f0] group-hover:bg-[#c9a961]"
              }`}
            />
            <span
              className={`text-xs tracking-widest uppercase transition-all duration-300 ${
                activeSection === section.id ? "text-[#c9a961]" : "text-[#f5f5f0]/60"
              }`}
            >
              {section.label}
            </span>
          </button>
        ))}
      </div>
    </nav>
  );
}

// Progress Bar Component
function ProgressBar() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  return (
    <motion.div
      className="progress-bar"
      style={{ scaleX, transformOrigin: "0%" }}
    />
  );
}

// Hero Section
function HeroSection() {
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 500], [0, 150]);

  return (
    <section
      id="hero"
      className="relative min-h-[100dvh] flex items-center justify-center overflow-hidden particle-grid"
    >
      {/* Floating Particles */}
      <div className="absolute inset-0 overflow-hidden z-0">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-[#c9a961]/30 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0.2, 0.6, 0.2],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      <motion.div
        style={{ y: y1 }}
        className="relative z-10 text-center px-4 sm:px-6 max-w-5xl mx-auto"
      >
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mb-4 sm:mb-6"
        >
          <span className="inline-flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full border border-[#c9a961]/30 text-[#c9a961] text-xs sm:text-sm tracking-widest uppercase">
            <Sparkles className="w-3 h-3 sm:w-4 sm:h-4" />
            Visual Essay
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="font-serif text-3xl sm:text-5xl md:text-7xl lg:text-8xl font-light leading-tight mb-6 sm:mb-8"
        >
          <span className="gradient-text">AI 时代</span>
          <br />
          <span className="text-[#f5f5f0]/90">界面设计的未来</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="font-sans text-base sm:text-lg md:text-xl text-[#f5f5f0]/60 max-w-2xl mx-auto mb-8 sm:mb-12 leading-relaxed px-2 sm:px-0"
        >
          从危机到融合，探索人工智能如何重新定义设计实践、审美价值与人类创造力的边界
        </motion.p>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 1 }}
          className="animate-bounce"
        >
          <ChevronDown className="w-5 h-5 sm:w-6 sm:h-6 mx-auto text-[#c9a961]/60" />
        </motion.div>
      </motion.div>

      {/* Gradient Overlay */}
      <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-[#1a1a1a] to-transparent" />
    </section>
  );
}

// Crisis Section
function CrisisSection() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  
  const y = useTransform(scrollYProgress, [0, 1], [100, -100]);

  return (
    <section
      id="crisis"
      ref={ref}
      className="relative min-h-[100dvh] flex items-center py-20 sm:py-32"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-12">
        <div className="grid lg:grid-cols-2 gap-8 sm:gap-16 items-center">
          <div>
            <Reveal delay={0} className="mb-6 sm:mb-8">
              <span className="text-[#c9a961] text-xs sm:text-sm tracking-widest uppercase font-sans">
                01 / 危机
              </span>
            </Reveal>

            <Reveal delay={100}>
              <h2 className="font-serif text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-light leading-tight mb-6 sm:mb-8">
                AI 没有制造危机
                <br />
                <span className="text-[#c9a961]">它暴露了危机</span>
              </h2>
            </Reveal>

            <Reveal delay={200}>
              <div className="space-y-4 sm:space-y-6 text-[#f5f5f0]/70 font-sans leading-relaxed text-sm sm:text-base">
                <p>
                  2024 年 Figma Config，Dylan Field 在 10,000 名设计师面前输入提示词：
                  <span className="text-[#f5f5f0] italic">"一个为中土世界可持续建筑师设计的个人作品集网站"</span>。
                  几秒钟后，完整的 UI 布局生成完毕。
                </p>
                
                <p>
                  设计师 Sebastiaan de With 写道：「如果某人可以一键生成那张海报，
                  人们大多数时候会选择那个。」
                </p>

                <div className="accent-border pl-4 sm:pl-6 py-2 my-6 sm:my-8">
                  <p className="text-base sm:text-xl text-[#f5f5f0] font-light">
                    「如果 AI 能用文本提示完成你的工作，那你的工作到底是什么？」
                  </p>
                </div>

                <p className="text-xs sm:text-sm text-[#f5f5f0]/50">
                  — Dolphia, UX Collective, 2025
                </p>
              </div>
            </Reveal>
          </div>

          <motion.div style={{ y }} className="relative order-first lg:order-last mb-8 lg:mb-0">
            <div className="relative aspect-square max-w-[280px] sm:max-w-md mx-auto">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 border border-[#c9a961]/20 rounded-full"
              />
              <motion.div
                animate={{ rotate: -360 }}
                transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                className="absolute inset-8 sm:inset-12 border border-[#c9a961]/30 rounded-full"
              />
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                className="absolute inset-16 sm:inset-24 border border-[#c9a961]/40 rounded-full"
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <Eye className="w-10 h-10 sm:w-16 sm:h-16 text-[#c9a961]/60" />
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// Debate Section
function DebateSection() {
  const [activeView, setActiveView] = useState<"victor" | "control" | null>(null);

  return (
    <section id="debate" className="relative min-h-[100dvh] py-20 sm:py-32">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-12">
        <Reveal className="text-center mb-12 sm:mb-20">
          <span className="text-[#c9a961] text-xs sm:text-sm tracking-widest uppercase font-sans">02 / 争论</span>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-light mt-4 sm:mt-6 mb-6 sm:mb-8">
            两种极端的<span className="text-[#c9a961]">碰撞</span>
          </h2>
          <p className="text-[#f5f5f0]/60 font-sans max-w-2xl mx-auto text-sm sm:text-base">
            当 AI 足够强大时，我们还需要界面吗？
          </p>
        </Reveal>

        <Reveal delay={100}>
          <div className="flex justify-center gap-3 sm:gap-4 mb-10 sm:mb-16">
            <button 
              onClick={() => setActiveView("victor")}
              className={`px-4 py-2 sm:px-6 sm:py-3 rounded-full border transition-all duration-300 font-sans text-xs sm:text-sm ${
                activeView === "victor" 
                  ? "border-[#c9a961] bg-[#c9a961]/10 text-[#c9a961]" 
                  : "border-[#c9a961]/30 text-[#c9a961] hover:border-[#c9a961]"
              }`}
            >
              Bret Victor 派
            </button>
            <button 
              onClick={() => setActiveView("control")}
              className={`px-4 py-2 sm:px-6 sm:py-3 rounded-full border transition-all duration-300 font-sans text-xs sm:text-sm ${
                activeView === "control" 
                  ? "border-[#c9a961] bg-[#c9a961]/10 text-[#c9a961]" 
                  : "border-[#c9a961]/30 text-[#c9a961] hover:border-[#c9a961]"
              }`}
            >
              控制派
            </button>
          </div>
        </Reveal>

        <div className="grid md:grid-cols-2 gap-4 sm:gap-8">
          <Reveal delay={200} className="p-5 sm:p-8 rounded-2xl border border-[#f5f5f0]/10 bg-[#f5f5f0]/5 hover:border-[#c9a961]/50 transition-all duration-500">
            <div className="flex items-center gap-3 mb-4 sm:mb-6">
              <Brain className="w-5 h-5 sm:w-6 sm:h-6 text-[#c9a961]" />
              <h3 className="font-serif text-lg sm:text-2xl">界面是一种必要的恶</h3>
            </div>
            <ul className="space-y-3 sm:space-y-4 text-[#f5f5f0]/70 font-sans text-sm sm:text-base">
              <li className="flex gap-3"><span className="text-[#c9a961]">→</span>屏幕是单用户的、封闭的、静态的媒介</li>
              <li className="flex gap-3"><span className="text-[#c9a961]">→</span>真正的理解需要看到系统内部、跨越时间</li>
              <li className="flex gap-3"><span className="text-[#c9a961]">→</span>我们被困在「手指触摸玻璃」的贫乏想象中</li>
              <li className="flex gap-3"><span className="text-[#c9a961]">→</span>当 AI 足够强大时，为什么还需要固定界面？</li>
            </ul>
            <div className="mt-4 sm:mt-6 pt-4 sm:pt-6 border-t border-[#f5f5f0]/10">
              <p className="text-xs sm:text-sm text-[#c9a961]">Bret Victor · Seeing Spaces</p>
            </div>
          </Reveal>

          <Reveal delay={300} className="p-5 sm:p-8 rounded-2xl border border-[#f5f5f0]/10 bg-[#f5f5f0]/5 hover:border-[#c9a961]/50 transition-all duration-500">
            <div className="flex items-center gap-3 mb-4 sm:mb-6">
              <Compass className="w-5 h-5 sm:w-6 sm:h-6 text-[#c9a961]" />
              <h3 className="font-serif text-lg sm:text-2xl">没有界面，就没有控制</h3>
            </div>
            <ul className="space-y-3 sm:space-y-4 text-[#f5f5f0]/70 font-sans text-sm sm:text-base">
              <li className="flex gap-3"><span className="text-[#c9a961]">→</span>可见性是信任的基础</li>
              <li className="flex gap-3"><span className="text-[#c9a961]">→</span>语言是模糊的，界面是精确的</li>
              <li className="flex gap-3"><span className="text-[#c9a961]">→</span>用户失去了心智模型，无法预测失败</li>
              <li className="flex gap-3"><span className="text-[#c9a961]">→</span>美学是功能的一部分，不是奢侈品</li>
            </ul>
            <div className="mt-4 sm:mt-6 pt-4 sm:pt-6 border-t border-[#f5f5f0]/10">
              <p className="text-xs sm:text-sm text-[#c9a961]">Jakob Nielsen · UX 权威</p>
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
    <section id="scarcity" className="relative min-h-[100dvh] py-20 sm:py-32 overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-12">
        <div className="grid lg:grid-cols-2 gap-8 sm:gap-16 items-center">
          <Reveal delay={0} className="order-2 lg:order-1">
            <div className="relative aspect-[4/5] max-w-[300px] sm:max-w-none mx-auto bg-gradient-to-br from-[#c9a961]/10 to-transparent rounded-2xl overflow-hidden">
              <div className="absolute inset-0" />
              <div className="absolute inset-0 flex items-center justify-center">
                <Heart className="w-16 h-16 sm:w-24 sm:h-24 text-[#c9a961]/40" />
              </div>
            </div>
          </Reveal>

          <div className="order-1 lg:order-2">
            <Reveal delay={100}>
              <span className="text-[#c9a961] text-xs sm:text-sm tracking-widest uppercase font-sans">03 / 稀缺</span>
              <h2 className="font-serif text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-light mt-4 sm:mt-6 mb-6 sm:mb-8 leading-tight">
                「平均」的<br/><span className="text-[#c9a961]">暴政</span>
              </h2>
            </Reveal>

            <Reveal delay={200}>
              <div className="space-y-4 sm:space-y-6 text-[#f5f5f0]/70 font-sans leading-relaxed text-sm sm:text-base">
                <p className="text-base sm:text-lg text-[#f5f5f0]">
                  AI 生成的设计有一个隐藏的特性：<span className="text-[#c9a961]">它是统计学意义上的平均</span>。
                </p>
                
                <p>
                  当 AI 学习数百万个界面时，它学到的是「最常见的圆角半径」、
                  「最安全的配色方案」、「最不容易被投诉的布局」。
                  它生成的是<span className="italic">最大公约数</span>——不会冒犯任何人，也不会打动任何人。
                </p>

                <div className="accent-border pl-4 sm:pl-6 py-3 sm:py-4 my-6 sm:my-8 bg-[#c9a961]/5">
                  <p className="text-base sm:text-xl text-[#f5f5f0] font-light font-serif">
                    「美不是安全，美是冒险。」
                  </p>
                </div>

                <p>
                  真正打动人的设计往往是深植于特定文化语境的：荷兰设计的理性与秩序感、
                  斯堪的纳维亚的 hygge 美学、日本设计的空寂与禅意。
                  AI 无法真正「理解」这些文化密码，它只能<span className="text-[#c9a961]">模仿表面</span>。
                </p>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}

// Fusion Section
function FusionSection() {
  return (
    <section id="fusion" className="relative min-h-[100dvh] py-20 sm:py-32">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-12">
        <Reveal className="text-center mb-12 sm:mb-20">
          <span className="text-[#c9a961] text-xs sm:text-sm tracking-widest uppercase font-sans">04 / 融合</span>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-light mt-4 sm:mt-6 mb-6 sm:mb-8">
            混合形态的<span className="text-[#c9a961]">三种实现</span>
          </h2>
        </Reveal>

        <div className="grid md:grid-cols-3 gap-4 sm:gap-8">
          <Reveal delay={100} className="group p-5 sm:p-8 rounded-2xl border border-[#f5f5f0]/10 bg-[#f5f5f0]/5 hover:border-[#c9a961]/50 transition-all duration-500">
            <div className="mb-4 sm:mb-6">
              <span className="text-[#c9a961]/60 text-xs tracking-widest uppercase font-sans">Curator</span>
              <h3 className="font-serif text-xl sm:text-2xl mt-2 group-hover:text-[#c9a961] transition-colors">策展者模式</h3>
            </div>
            <p className="text-[#f5f5f0]/60 font-sans text-sm leading-relaxed mb-4 sm:mb-6">
              人类成为品味的守门人——不亲手制作，但决定什么是好的。画廊策展人选择 AI 生成的作品，音乐制作人从 AI 生成的 100 个旋律中挑选并打磨。
            </p>
            <div className="flex flex-wrap gap-2">
              <span className="px-2 sm:px-3 py-1 rounded-full bg-[#c9a961]/10 text-[#c9a961] text-xs font-sans">审美判断力</span>
              <span className="px-2 sm:px-3 py-1 rounded-full bg-[#c9a961]/10 text-[#c9a961] text-xs font-sans">文化敏感度</span>
              <span className="px-2 sm:px-3 py-1 rounded-full bg-[#c9a961]/10 text-[#c9a961] text-xs font-sans">表达能力</span>
            </div>
          </Reveal>

          <Reveal delay={200} className="group p-5 sm:p-8 rounded-2xl border border-[#f5f5f0]/10 bg-[#f5f5f0]/5 hover:border-[#c9a961]/50 transition-all duration-500">
            <div className="mb-4 sm:mb-6">
              <span className="text-[#c9a961]/60 text-xs tracking-widest uppercase font-sans">Director</span>
              <h3 className="font-serif text-xl sm:text-2xl mt-2 group-hover:text-[#c9a961] transition-colors">导演模式</h3>
            </div>
            <p className="text-[#f5f5f0]/60 font-sans text-sm leading-relaxed mb-4 sm:mb-6">
              人类设定愿景和约束，AI 执行，人类迭代反馈。像拍电影：导演不亲自摄影，但决定每一个镜头的意图。AI 是剧组，人类是导演。
            </p>
            <div className="flex flex-wrap gap-2">
              <span className="px-2 sm:px-3 py-1 rounded-full bg-[#c9a961]/10 text-[#c9a961] text-xs font-sans">清晰的愿景</span>
              <span className="px-2 sm:px-3 py-1 rounded-full bg-[#c9a961]/10 text-[#c9a961] text-xs font-sans">对细节的执着</span>
              <span className="px-2 sm:px-3 py-1 rounded-full bg-[#c9a961]/10 text-[#c9a961] text-xs font-sans">决策能力</span>
            </div>
          </Reveal>

          <Reveal delay={300} className="group p-5 sm:p-8 rounded-2xl border border-[#f5f5f0]/10 bg-[#f5f5f0]/5 hover:border-[#c9a961]/50 transition-all duration-500">
            <div className="mb-4 sm:mb-6">
              <span className="text-[#c9a961]/60 text-xs tracking-widest uppercase font-sans">Symbiosis</span>
              <h3 className="font-serif text-xl sm:text-2xl mt-2 group-hover:text-[#c9a961] transition-colors">共生模式</h3>
            </div>
            <p className="text-[#f5f5f0]/60 font-sans text-sm leading-relaxed mb-4 sm:mb-6">
              人类和 AI 共同演化，界限模糊。设计师用 AI 生成初稿，初稿改变了设计师的想法，新想法再输入 AI，最终产出是涌现的。
            </p>
            <div className="flex flex-wrap gap-2">
              <span className="px-2 sm:px-3 py-1 rounded-full bg-[#c9a961]/10 text-[#c9a961] text-xs font-sans">开放的思维</span>
              <span className="px-2 sm:px-3 py-1 rounded-full bg-[#c9a961]/10 text-[#c9a961] text-xs font-sans">放弃控制</span>
              <span className="px-2 sm:px-3 py-1 rounded-full bg-[#c9a961]/10 text-[#c9a961] text-xs font-sans">欣赏意外</span>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

// Action Section
function ActionSection() {
  return (
    <section id="action" className="relative min-h-[100dvh] py-20 sm:py-32">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-12 text-center">
        <Reveal>
          <span className="text-[#c9a961] text-xs sm:text-sm tracking-widest uppercase font-sans">05 / 行动</span>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-light mt-4 sm:mt-6 mb-6 sm:mb-8">
            成为 AI 的<span className="text-[#c9a961]">导演</span>
          </h2>
          <p className="text-[#f5f5f0]/60 font-sans text-base sm:text-lg max-w-2xl mx-auto mb-10 sm:mb-16">
            三个维度的具体行动路径
          </p>
        </Reveal>

        <div className="space-y-4 sm:space-y-8">
          <Reveal delay={100} className="text-left p-5 sm:p-8 rounded-2xl border border-[#f5f5f0]/10 bg-[#f5f5f0]/5">
            <h3 className="font-serif text-lg sm:text-xl mb-3 sm:mb-4 text-[#c9a961]">审美：从「看很多」到「看得深」</h3>
            <ul className="space-y-2">
              <li className="flex items-center gap-3 text-[#f5f5f0]/70 font-sans text-sm sm:text-base">
                <ArrowRight className="w-4 h-4 text-[#c9a961]/60 flex-shrink-0" />
                研究单一作品的完整决策链
              </li>
              <li className="flex items-center gap-3 text-[#f5f5f0]/70 font-sans text-sm sm:text-base">
                <ArrowRight className="w-4 h-4 text-[#c9a961]/60 flex-shrink-0" />
                跨媒介审美训练（电影、建筑、时尚）
              </li>
              <li className="flex items-center gap-3 text-[#f5f5f0]/70 font-sans text-sm sm:text-base">
                <ArrowRight className="w-4 h-4 text-[#c9a961]/60 flex-shrink-0" />
                建立个人「反例库」
              </li>
            </ul>
          </Reveal>

          <Reveal delay={200} className="text-left p-5 sm:p-8 rounded-2xl border border-[#f5f5f0]/10 bg-[#f5f5f0]/5">
            <h3 className="font-serif text-lg sm:text-xl mb-3 sm:mb-4 text-[#c9a961]">视野：成为「T 型人才」</h3>
            <ul className="space-y-2">
              <li className="flex items-center gap-3 text-[#f5f5f0]/70 font-sans text-sm sm:text-base">
                <ArrowRight className="w-4 h-4 text-[#c9a961]/60 flex-shrink-0" />
                了解基础 AI 原理
              </li>
              <li className="flex items-center gap-3 text-[#f5f5f0]/70 font-sans text-sm sm:text-base">
                <ArrowRight className="w-4 h-4 text-[#c9a961]/60 flex-shrink-0" />
                学习一个完全无关的领域
              </li>
              <li className="flex items-center gap-3 text-[#f5f5f0]/70 font-sans text-sm sm:text-base">
                <ArrowRight className="w-4 h-4 text-[#c9a961]/60 flex-shrink-0" />
                选择一个细分领域深耕
              </li>
            </ul>
          </Reveal>

          <Reveal delay={300} className="text-left p-5 sm:p-8 rounded-2xl border border-[#f5f5f0]/10 bg-[#f5f5f0]/5">
            <h3 className="font-serif text-lg sm:text-xl mb-3 sm:mb-4 text-[#c9a961]">思辨：培养「对抗性思维」</h3>
            <ul className="space-y-2">
              <li className="flex items-center gap-3 text-[#f5f5f0]/70 font-sans text-sm sm:text-base">
                <ArrowRight className="w-4 h-4 text-[#c9a961]/60 flex-shrink-0" />
                每天问自己：什么证据会改变我的想法？
              </li>
              <li className="flex items-center gap-3 text-[#f5f5f0]/70 font-sans text-sm sm:text-base">
                <ArrowRight className="w-4 h-4 text-[#c9a961]/60 flex-shrink-0" />
                每月写一篇「反对自己」的文章
              </li>
              <li className="flex items-center gap-3 text-[#f5f5f0]/70 font-sans text-sm sm:text-base">
                <ArrowRight className="w-4 h-4 text-[#c9a961]/60 flex-shrink-0" />
                参与批评：不只是点评「好不好看」
              </li>
            </ul>
          </Reveal>
        </div>

        <Reveal delay={400}>
          <div className="mt-16 sm:mt-20 pt-12 sm:pt-20 border-t border-[#f5f5f0]/10">
            <p className="font-serif text-xl sm:text-2xl md:text-3xl text-[#f5f5f0]/80 mb-6 sm:mb-8">
              「当 AI 让「足够好」变得廉价时，<br/>
              <span className="text-[#c9a961]">「有灵魂」变得珍贵。</span>」
            </p>
            <p className="text-[#f5f5f0]/40 font-sans text-xs sm:text-sm">
              一场关于 Paula Meng 与 AI 的对话 · 2026
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

// Main Page Component
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
      
      <footer className="py-8 sm:py-12 border-t border-[#f5f5f0]/10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-12 flex flex-col md:flex-row justify-between items-center gap-3 sm:gap-4">
          <p className="text-[#f5f5f0]/40 font-sans text-xs sm:text-sm text-center md:text-left">
            Visual Essay · AI 时代界面设计的未来
          </p>
          <p className="text-[#c9a961]/60 font-sans text-xs">
            Created with Cursor + Next.js + Framer Motion
          </p>
        </div>
      </footer>
    </main>
  );
}
