import { motion } from "framer-motion";
import { ArrowRight, Activity, Droplets, ShieldCheck, Thermometer, Play } from "lucide-react";
import truck from "@/assets/truck.png";
import { Counter, LiveDot } from "./primitives";

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.09, delayChildren: 0.1 } },
};
const item = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] as const } },
};

function FloatingStat({
  icon: Icon,
  value,
  label,
  className,
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
      initial={{ opacity: 0, scale: 0.85, y: 16 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ delay, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      className={className}
    >
      <motion.div
        animate={{ y: [0, -9, 0] }}
        transition={{ duration: 5 + delay, repeat: Infinity, ease: "easeInOut" }}
        className="flex items-center gap-3 rounded-2xl border border-border bg-surface/95 px-4 py-3 shadow-[var(--shadow-float)] backdrop-blur"
      >
        <span className={`grid h-9 w-9 place-items-center rounded-xl bg-secondary ${toneMap[tone]}`}>
          <Icon className="h-4.5 w-4.5" />
        </span>
        <span className="leading-tight">
          <span className="block font-display text-lg font-bold tracking-tight">{value}</span>
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
    <div id="top" className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent/40 to-transparent" />
      <div className="mx-auto grid w-full max-w-7xl items-center gap-16 px-5 pb-16 pt-14 sm:px-8 lg:grid-cols-[1.05fr_1fr] lg:gap-10 lg:pb-24 lg:pt-20">
        <motion.div variants={container} initial="hidden" animate="show">
          <motion.div variants={item}>
            <span className="inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent/8 px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-[0.18em] text-primary">
              <LiveDot />
              Live Cold-Chain Intelligence
            </span>
          </motion.div>

          <motion.h1
            variants={item}
            className="mt-7 text-[2.6rem] font-semibold leading-[1.02] sm:text-6xl lg:text-[4.1rem]"
          >
            Protect Every Shipment.
            <span className="block text-gradient-primary">Before Spoilage Happens.</span>
          </motion.h1>

          <motion.p variants={item} className="mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground">
            ChillChain transforms real-time IoT data into AI-powered shipment intelligence, helping detect
            risk and prevent cold-chain losses.
          </motion.p>

          <motion.div variants={item} className="mt-9 flex flex-wrap items-center gap-3">
            <a
              href="#shipments"
              className="group inline-flex items-center gap-2 rounded-full px-6 py-3.5 text-sm font-semibold text-primary-foreground shadow-[var(--shadow-glow)] transition-transform hover:-translate-y-0.5"
              style={{ backgroundImage: "var(--gradient-primary)" }}
            >
              View Live Shipments
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </a>
            <a
              href="#temperature"
              className="inline-flex items-center gap-2 rounded-full border border-border-strong bg-surface px-6 py-3.5 text-sm font-semibold text-foreground transition-all hover:-translate-y-0.5 hover:border-accent/50"
            >
              <Play className="h-4 w-4 text-accent" />
              Run Live Simulation
            </a>
          </motion.div>

          <motion.dl
  variants={item}
  className="mt-12 grid max-w-lg grid-cols-3 gap-6 border-t border-border pt-8"
>
  {[
    { k: "Active shipments", v: 24, s: "" },
    { k: "On-time rate", v: 96.4, s: "%", d: 1 },
    { k: "Fleet health", v: 78, s: "/100" },
  ].map((s) => (
    <div key={s.k}>
      <dd className="font-display text-2xl font-bold">
        <Counter
          to={s.v}
          decimals={s.d ?? 0}
          suffix={s.s}
        />
      </dd>

      <dt className="mt-1 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
        {s.k}
      </dt>
    </div>
  ))}
</motion.dl>
        </motion.div>

        <div className="relative">
          <motion.div
            initial={{ opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="relative aspect-[4/3.2] w-full"
          >
            <div
              className="absolute inset-6 rounded-[2.5rem] opacity-90"
              style={{ backgroundImage: "var(--gradient-deep)" }}
            />
            <div className="absolute inset-6 rounded-[2.5rem] border border-primary/20" />
            <svg className="absolute inset-6 h-[calc(100%-3rem)] w-[calc(100%-3rem)] opacity-25" aria-hidden>
              <defs>
                <pattern id="hero-grid" width="34" height="34" patternUnits="userSpaceOnUse">
                  <path d="M34 0H0v34" fill="none" stroke="oklch(0.9 0.05 158)" strokeWidth="0.5" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#hero-grid)" />
            </svg>

            <motion.img
  src={truck}
  alt="Refrigerated ChillChain delivery truck carrying crates of fresh fruits and vegetables"
  width={1280}
  height={960}
  className="absolute left-[8%] top-[2%] h-[96%] w-[100%] object-contain drop-shadow-[0_40px_45px_oklch(0.2_0.04_158/0.45)]"
  initial={{ x: 60, opacity: 0 }}
  animate={{ x: 0, opacity: 1 }}
  transition={{
    duration: 1.1,
    delay: 0.15,
    ease: [0.16, 1, 0.3, 1],
  }}
/>

            <FloatingStat
              icon={Thermometer}
              value="4.8°C"
              label="Temperature"
              delay={0.8}
              className="absolute -left-2 top-8 sm:left-0"
            />
            <FloatingStat
              icon={Droplets}
              value="68%"
              label="Humidity"
              delay={1}
              tone="primary"
              className="absolute -left-3 bottom-24 sm:left-2"
            />
            <FloatingStat
              icon={ShieldCheck}
              value={<Counter to={92} suffix="/100" />}
              label="Shipment Health"
              delay={1.15}
              className="absolute -right-2 top-20 sm:right-0"
            />
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
              className="absolute bottom-10 right-2 sm:right-6"
            />
          </motion.div>
        </div>
      </div>
    </div>
  );
}
