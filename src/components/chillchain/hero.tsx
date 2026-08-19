import { motion } from "framer-motion";
import {
  Activity,
  ArrowRight,
  Droplets,
  Play,
  ShieldCheck,
  Thermometer,
} from "lucide-react";
import truck from "@/assets/truck.png";
import { Counter, LiveDot } from "./primitives";

const container = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.12,
    },
  },
};

const item = {
  hidden: {
    opacity: 0,
    y: 26,
  },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.75,
      ease: [0.16, 1, 0.3, 1] as const,
    },
  },
};

function FloatingStat({
  icon: Icon,
  value,
  label,
  className = "",
  delay,
  tone = "accent",
}: {
  icon: typeof Thermometer;
  value: React.ReactNode;
  label: string;
  className?: string;
  delay: number;
  tone?: "accent" | "warning" | "primary";
}) {
  const toneMap = {
    accent: "text-accent",
    warning: "text-warning",
    primary: "text-primary",
  } as const;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8, y: 18 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{
        delay,
        duration: 0.7,
        ease: [0.16, 1, 0.3, 1],
      }}
      className={className}
    >
      <motion.div
        animate={{
          y: [0, -8, 0],
        }}
        transition={{
          duration: 4.5 + delay,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        whileHover={{
          scale: 1.04,
          y: -4,
        }}
        className="group flex items-center gap-3 rounded-2xl border border-border/80 bg-surface/95 px-4 py-3 shadow-[var(--shadow-float)] backdrop-blur-xl transition-shadow duration-300 hover:shadow-xl"
      >
        <span
          className={`grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-secondary ${toneMap[tone]}`}
        >
          <Icon className="h-4.5 w-4.5" />
        </span>

        <span className="leading-tight">
          <span className="block font-display text-lg font-bold tracking-tight">
            {value}
          </span>

          <span className="block text-[10px] font-bold uppercase tracking-[0.16em] text-muted-foreground">
            {label}
          </span>
        </span>
      </motion.div>
    </motion.div>
  );
}

export function Hero() {
  return (
    <section
      id="top"
      className="relative isolate overflow-hidden border-b border-border/60"
    >
      {/* Ambient background */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-[8%] top-20 h-72 w-72 rounded-full bg-primary/8 blur-3xl" />
        <div className="absolute right-[5%] top-24 h-96 w-96 rounded-full bg-accent/8 blur-3xl" />

        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent/40 to-transparent" />
      </div>

      <div className="mx-auto grid w-full max-w-7xl items-center gap-12 px-5 pb-16 pt-14 sm:px-8 lg:grid-cols-[1fr_1fr] lg:gap-8 lg:pb-20 lg:pt-20">
        {/* ========================================================= */}
        {/* LEFT CONTENT */}
        {/* ========================================================= */}

        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="relative z-10"
        >
          {/* Live badge */}
          <motion.div variants={item}>
            <span className="inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent/8 px-3.5 py-1.5 text-[10px] font-bold uppercase tracking-[0.18em] text-primary shadow-sm">
              <LiveDot />
              Live Cold-Chain Intelligence
            </span>
          </motion.div>

          {/* Heading */}
          <motion.h1
            variants={item}
            className="mt-7 max-w-3xl text-[2.75rem] font-semibold leading-[0.98] tracking-[-0.045em] sm:text-6xl lg:text-[4.35rem]"
          >
            Protect Every
            <br />
            Shipment.
            <span className="block text-gradient-primary">
              Before Spoilage
              <br />
              Happens.
            </span>
          </motion.h1>

          {/* Description */}
          <motion.p
            variants={item}
            className="mt-6 max-w-xl text-base leading-7 text-muted-foreground sm:text-lg"
          >
            ChillChain transforms real-time IoT data into AI-powered shipment
            intelligence, helping detect risk and prevent cold-chain losses.
          </motion.p>

          {/* CTA */}
          <motion.div
            variants={item}
            className="mt-8 flex flex-wrap items-center gap-3"
          >
            <motion.a
              href="/shipments"
              whileHover={{
                y: -2,
                scale: 1.015,
              }}
              whileTap={{
                scale: 0.98,
              }}
              className="group inline-flex items-center gap-2 rounded-full px-6 py-3.5 text-sm font-semibold text-primary-foreground shadow-[var(--shadow-glow)]"
              style={{
                backgroundImage: "var(--gradient-primary)",
              }}
            >
              View Live Shipments

              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </motion.a>

            <motion.a
              href="#temperature"
              whileHover={{
                y: -2,
                scale: 1.015,
              }}
              whileTap={{
                scale: 0.98,
              }}
              className="group inline-flex items-center gap-2 rounded-full border border-border-strong bg-surface px-6 py-3.5 text-sm font-semibold text-foreground shadow-sm transition-colors hover:border-accent/50 hover:bg-secondary"
            >
              <span className="grid h-6 w-6 place-items-center rounded-full bg-accent/10">
                <Play className="h-3 w-3 fill-current text-accent transition-transform group-hover:scale-110" />
              </span>

              Run Live Simulation
            </motion.a>
          </motion.div>

          {/* Metrics */}
          <motion.dl
            variants={item}
            className="mt-11 grid max-w-xl grid-cols-3 border-t border-border pt-7"
          >
            {[
              {
                k: "Active shipments",
                v: 24,
                s: "",
              },
              {
                k: "On-time rate",
                v: 96.4,
                s: "%",
                d: 1,
              },
              {
                k: "Fleet health",
                v: 78,
                s: "/100",
              },
            ].map((stat, index) => (
              <motion.div
                key={stat.k}
                whileHover={{
                  y: -3,
                }}
                className={`group relative ${
                  index !== 0
                    ? "border-l border-border pl-5 sm:pl-7"
                    : ""
                }`}
              >
                <dd className="font-display text-2xl font-bold tracking-tight sm:text-3xl">
                  <Counter
                    to={stat.v}
                    decimals={stat.d ?? 0}
                    suffix={stat.s}
                  />
                </dd>

                <dt className="mt-1 text-[9px] font-bold uppercase tracking-[0.14em] text-muted-foreground sm:text-[10px]">
                  {stat.k}
                </dt>

                <span
                  className={`absolute -bottom-7 left-0 h-0.5 w-0 rounded-full bg-primary transition-all duration-500 group-hover:w-8 ${
                    index !== 0 ? "ml-5 sm:ml-7" : ""
                  }`}
                />
              </motion.div>
            ))}
          </motion.dl>
        </motion.div>

        {/* ========================================================= */}
        {/* RIGHT VISUAL */}
        {/* ========================================================= */}

        <div className="relative min-h-[390px] sm:min-h-[500px]">
          <motion.div
            initial={{
              opacity: 0,
              scale: 0.92,
              y: 20,
            }}
            animate={{
              opacity: 1,
              scale: 1,
              y: 0,
            }}
            transition={{
              duration: 1,
              ease: [0.16, 1, 0.3, 1],
            }}
            className="relative mx-auto aspect-[4/3.2] w-full max-w-2xl"
          >
            {/* Green visual container */}
            <motion.div
              animate={{
                scale: [1, 1.012, 1],
              }}
              transition={{
                duration: 6,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="absolute inset-6 overflow-hidden rounded-[2.5rem]"
              style={{
                backgroundImage: "var(--gradient-deep)",
              }}
            >
              {/* Grid */}
              <svg
                className="absolute inset-0 h-full w-full opacity-20"
                aria-hidden
              >
                <defs>
                  <pattern
                    id="hero-grid"
                    width="34"
                    height="34"
                    patternUnits="userSpaceOnUse"
                  >
                    <path
                      d="M34 0H0v34"
                      fill="none"
                      stroke="oklch(0.9 0.05 158)"
                      strokeWidth="0.5"
                    />
                  </pattern>
                </defs>

                <rect
                  width="100%"
                  height="100%"
                  fill="url(#hero-grid)"
                />
              </svg>

              {/* Radial glow */}
              <motion.div
                animate={{
                  opacity: [0.2, 0.35, 0.2],
                  scale: [0.95, 1.05, 0.95],
                }}
                transition={{
                  duration: 5,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="absolute left-1/2 top-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent/20 blur-3xl"
              />
            </motion.div>

            {/* Border */}
            <div className="absolute inset-6 rounded-[2.5rem] border border-primary/20" />

            {/* Truck */}
            <motion.img
              src={truck}
              alt="Refrigerated ChillChain delivery truck carrying crates of fresh fruits and vegetables"
              width={1280}
              height={960}
              className="absolute left-[5%] top-[1%] h-[98%] w-[104%] object-contain drop-shadow-[0_40px_45px_oklch(0.2_0.04_158/0.45)]"
              initial={{
                x: 70,
                opacity: 0,
              }}
              animate={{
                x: 0,
                opacity: 1,
              }}
              transition={{
                duration: 1.1,
                delay: 0.15,
                ease: [0.16, 1, 0.3, 1],
              }}
            />

            {/* Subtle floating animation around truck */}
            <motion.div
              animate={{
                y: [0, -5, 0],
              }}
              transition={{
                duration: 5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="absolute inset-0 pointer-events-none"
            >
              {/* Temperature */}
              <FloatingStat
                icon={Thermometer}
                value="4.8°C"
                label="Temperature"
                delay={0.8}
                className="absolute -left-1 top-8 sm:left-0"
              />

              {/* Humidity */}
              <FloatingStat
                icon={Droplets}
                value="68%"
                label="Humidity"
                delay={1}
                tone="primary"
                className="absolute -left-2 bottom-20 sm:left-2"
              />

              {/* Health */}
              <FloatingStat
                icon={ShieldCheck}
                value={<Counter to={92} suffix="/100" />}
                label="Shipment Health"
                delay={1.15}
                className="absolute -right-1 top-20 sm:right-0"
              />

              {/* Live */}
              <FloatingStat
                icon={Activity}
                value={
                  <span className="flex items-center gap-2">
                    <LiveDot />
                    LIVE
                  </span>
                }
                label="Status"
                delay={1.3}
                tone="warning"
                className="absolute bottom-7 right-2 sm:right-6"
              />
            </motion.div>

            {/* Live pulse */}
            <motion.span
              animate={{
                scale: [1, 1.35, 1],
                opacity: [0.7, 0, 0.7],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeOut",
              }}
              className="absolute right-[19%] bottom-[15%] h-3 w-3 rounded-full bg-primary"
            />
          </motion.div>
        </div>
      </div>

      {/* Bottom transition */}
      <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-background/60 to-transparent" />
    </section>
  );
}