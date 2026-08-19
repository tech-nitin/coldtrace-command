import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useInView, useMotionValue, animate } from "framer-motion";
import {
  Thermometer, Radio, Truck, MapPin, Bell, LayoutDashboard,
  LineChart as LineChartIcon, Sparkles, ShieldCheck,
  Pencil, History, Mail, Briefcase, Building2, CalendarDays, CheckCircle2,
  Package, Gauge, KeyRound, Smartphone, Clock,
  Wifi, Settings2, Sun, Moon, Monitor, Globe, RefreshCw, ArrowRight,
} from "lucide-react";

/* ─────────────────────────────────────────────────────────────
   DESIGN TOKENS — matched to the ChillChain dashboard reference
   ───────────────────────────────────────────────────────────── */
const T = {
  cream: "#F6F3EA",
  creamSoft: "#FBFAF5",
  ink: "#132A20",
  inkSoft: "#3F5348",
  forest: "#0F3324",
  emerald: "#1E7A4C",
  emeraldBright: "#1FA35C",
  mint: "#E4F1E8",
  mintLine: "#CFE6D6",
  amber: "#C4842A",
  amberSoft: "#F6E7CF",
  red: "#B23B34",
  redSoft: "#F5DEDB",
  line: "#E4DFD1",
};

const fontImport = `
@import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,340;9..144,480;9..144,600&family=Inter:wght@400;500;600;700&display=swap');
`;

/* ─────────────────────────────────────────────────────────────
   MOCK DATA — kept separate from UI, ready to swap for an API
   ───────────────────────────────────────────────────────────── */
const USER = {
  name: "Nitin Rathore",
  title: "Cold-Chain Operations Manager",
  org: "IET DAVV",
  location: "Indore, India",
  status: "Active",
  email: "nitinrathore56654@gmail.com",
  role: "Operations Manager",
  memberSince: "2026",
};

const PROFILE_FIELDS = [
  { label: "Full Name", value: USER.name, icon: Sparkles },
  { label: "Email", value: USER.email, icon: Mail },
  { label: "Role", value: USER.role, icon: Briefcase },
  { label: "Organization", value: USER.org, icon: Building2 },
  { label: "Location", value: USER.location, icon: MapPin },
  { label: "Member Since", value: USER.memberSince, icon: CalendarDays },
];

const ACTIVITY_STATS = [
  { key: "monitored", label: "Shipments Monitored", value: 24, suffix: "", icon: Package, tone: "good" },
  { key: "active", label: "Active Shipments", value: 18, suffix: "", icon: Truck, tone: "good" },
  { key: "resolved", label: "Alerts Resolved", value: 7, suffix: "", icon: CheckCircle2, tone: "warn" },
  { key: "response", label: "Response Rate", value: 94, suffix: "%", icon: Gauge, tone: "good" },
];

const TIMELINE = [
  { when: "Today", text: "Viewed shipment CHL-001", icon: Truck, tone: "good" },
  { when: "Today", text: "Resolved temperature alert", icon: Thermometer, tone: "bad" },
  { when: "Yesterday", text: "Added monitoring device", icon: Radio, tone: "good" },
  { when: "Yesterday", text: "Generated shipment report", icon: LineChartIcon, tone: "good" },
  { when: "3 days ago", text: "Generated shipment report", icon: LineChartIcon, tone: "good" },
];

const NOTIFICATIONS_INITIAL = [
  { key: "temp", label: "Temperature Breach Alerts", desc: "Notify when a shipment exceeds its safe range", on: true },
  { key: "humidity", label: "Humidity Alerts", desc: "Notify on abnormal humidity drift", on: true },
  { key: "offline", label: "Device Offline Alerts", desc: "Notify when a sensor loses connection", on: true },
  { key: "route", label: "Route Deviation Alerts", desc: "Notify when a shipment leaves its planned corridor", on: false },
  { key: "risk", label: "AI Risk Alerts", desc: "Notify when the AI risk score crosses a threshold", on: true },
  { key: "reports", label: "Daily Reports", desc: "A daily digest of shipment and sensor health", on: false },
];

const DEVICES = [
  { id: "CHL-001", model: "NodeMCU ESP8266", online: true },
  { id: "CHL-002", model: "NodeMCU ESP8266", online: true },
];

/* ─────────────────────────────────────────────────────────────
   PRIMITIVES
   ───────────────────────────────────────────────────────────── */
function CountUp({ value, decimals = 0, suffix = "" }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-10% 0px" });
  const mv = useMotionValue(0);
  const [display, setDisplay] = useState("0");

  useEffect(() => {
    if (!inView) return;
    const controls = animate(mv, value, {
      duration: 1.1,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => setDisplay(v.toFixed(decimals)),
    });
    return () => controls.stop();
  }, [inView, value]);

  return <span ref={ref}>{display}{suffix}</span>;
}

const toneStyles = {
  good: { fg: T.emerald, bg: T.mint, border: T.mintLine },
  warn: { fg: T.amber, bg: T.amberSoft, border: "#EAD3A5" },
  bad: { fg: T.red, bg: T.redSoft, border: "#E7C3BF" },
};

function Toggle({ on, onChange }) {
  return (
    <button
      onClick={onChange}
      className="relative h-6 w-11 shrink-0 rounded-full transition-colors"
      style={{ background: on ? T.emerald : T.line }}
      aria-pressed={on}
    >
      <motion.span
        className="absolute top-0.5 h-5 w-5 rounded-full bg-white shadow-sm"
        animate={{ left: on ? 22 : 2 }}
        transition={{ type: "spring", stiffness: 500, damping: 32 }}
      />
    </button>
  );
}


/* ─────────────────────────────────────────────────────────────
   HERO — avatar, identity, status, actions
   ───────────────────────────────────────────────────────────── */
const heroContainer = { hidden: {}, show: { transition: { staggerChildren: 0.09, delayChildren: 0.05 } } };
const heroItem = { hidden: { opacity: 0, y: 14 }, show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } } };

function ProfileHero() {
  const initials = USER.name.split(" ").map((w) => w[0]).join("");
  return (
    <section className="relative overflow-hidden border-b" style={{ borderColor: T.line, background: `linear-gradient(180deg, #EFF4EE 0%, ${T.cream} 65%)` }}>
      <motion.div
        className="pointer-events-none absolute -right-32 -top-32 h-[380px] w-[380px] rounded-full opacity-40 blur-3xl"
        style={{ background: "radial-gradient(circle, #CFE6D6 0%, transparent 70%)" }}
        animate={{ opacity: [0.3, 0.5, 0.3] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="pointer-events-none absolute -left-24 bottom-0 h-[260px] w-[260px] rounded-full opacity-30 blur-3xl"
        style={{ background: "radial-gradient(circle, #1E7A4C 0%, transparent 70%)" }}
        animate={{ opacity: [0.15, 0.3, 0.15] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 2 }}
      />

      <motion.div variants={heroContainer} initial="hidden" animate="show" className="relative mx-auto max-w-[1240px] px-6 pb-12 pt-14">
        <div className="flex flex-col items-start gap-8 sm:flex-row sm:items-center">
          <motion.div variants={heroItem} className="relative shrink-0">
            <motion.div
              className="absolute -inset-2 rounded-full"
              style={{ background: `conic-gradient(from 0deg, ${T.emerald}, ${T.mintLine}, ${T.emerald})`, opacity: 0.25 }}
              animate={{ rotate: 360 }}
              transition={{ duration: 14, repeat: Infinity, ease: "linear" }}
            />
            <div
              className="relative flex h-24 w-24 items-center justify-center rounded-full text-[26px] font-medium text-white sm:h-28 sm:w-28"
              style={{ background: `linear-gradient(155deg, ${T.emerald}, ${T.forest})`, fontFamily: "'Fraunces', serif" }}
            >
              {initials}
            </div>
            <span
              className="absolute bottom-1 right-1 flex h-5 w-5 items-center justify-center rounded-full border-2"
              style={{ background: T.emeraldBright, borderColor: T.creamSoft }}
            >
              <motion.span
                className="h-2 w-2 rounded-full bg-white"
                animate={{ scale: [1, 1.3, 1], opacity: [1, 0.6, 1] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              />
            </span>
          </motion.div>

          <div className="flex-1">
            <motion.div variants={heroItem} className="flex flex-wrap items-center gap-2.5">
              <h1 className="text-[30px] font-medium leading-tight sm:text-[36px]" style={{ fontFamily: "'Fraunces', serif", color: T.ink }}>
                {USER.name}
              </h1>
              <span className="inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10.5px] font-semibold uppercase tracking-[0.08em]" style={{ borderColor: T.mintLine, background: T.mint, color: T.emerald }}>
                <motion.span className="h-1.5 w-1.5 rounded-full" style={{ background: T.emerald }} animate={{ opacity: [1, 0.35, 1] }} transition={{ duration: 2, repeat: Infinity }} />
                {USER.status}
              </span>
            </motion.div>
            <motion.p variants={heroItem} className="mt-1.5 text-[15px] font-medium" style={{ color: T.inkSoft }}>
              {USER.title}
            </motion.p>
            <motion.p variants={heroItem} className="mt-1 flex items-center gap-1.5 text-[13px]" style={{ color: T.inkSoft }}>
              <Building2 size={13} /> {USER.org} <span style={{ color: T.line }}>•</span> <MapPin size={13} /> {USER.location}
            </motion.p>
          </div>

          <motion.div variants={heroItem} className="flex w-full gap-2.5 sm:w-auto">
            <button className="flex flex-1 items-center justify-center gap-1.5 rounded-full px-5 py-2.5 text-[13px] font-semibold text-white transition-transform hover:-translate-y-[1px] sm:flex-none" style={{ background: T.emerald }}>
              <Pencil size={13} /> Edit Profile
            </button>
            <button className="flex flex-1 items-center justify-center gap-1.5 rounded-full border px-5 py-2.5 text-[13px] font-semibold transition-transform hover:-translate-y-[1px] sm:flex-none" style={{ borderColor: T.line, background: T.creamSoft, color: T.ink }}>
              <History size={13} /> View Activity
            </button>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────────
   PROFILE INFORMATION — open layout, no card grid
   ───────────────────────────────────────────────────────────── */
function ProfileInformation() {
  return (
    <section className="mx-auto max-w-[1240px] px-6 py-10">
      <div className="mb-6">
        <div className="text-[11px] font-semibold uppercase tracking-[0.14em]" style={{ color: T.emerald }}>Profile Information</div>
        <h2 className="mt-1 text-[22px] font-medium" style={{ fontFamily: "'Fraunces', serif", color: T.ink }}>The essentials, at a glance</h2>
      </div>

      <div className="divide-y rounded-[20px] border" style={{ borderColor: T.line, background: T.creamSoft }}>
        {PROFILE_FIELDS.map((f, i) => (
          <motion.div
            key={f.label}
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-10% 0px" }}
            transition={{ duration: 0.4, delay: i * 0.05 }}
            className="group flex flex-col gap-1 px-6 py-5 transition-colors hover:bg-white/60 sm:flex-row sm:items-center sm:justify-between"
            style={{ borderColor: T.line }}
          >
            <div className="flex items-center gap-3 text-[12.5px] font-medium" style={{ color: T.inkSoft }}>
              <span className="flex h-8 w-8 items-center justify-center rounded-[10px]" style={{ background: T.mint, color: T.emerald }}>
                <f.icon size={14} />
              </span>
              {f.label}
            </div>
            <div className="pl-11 text-[15px] font-medium sm:pl-0" style={{ color: T.ink }}>{f.value}</div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────────
   COLD-CHAIN ACTIVITY — animated stat strip, open composition
   ───────────────────────────────────────────────────────────── */
function ColdChainActivity() {
  return (
    <section className="mx-auto max-w-[1240px] px-6 py-10">
      <div className="mb-6">
        <div className="text-[11px] font-semibold uppercase tracking-[0.14em]" style={{ color: T.emerald }}>Cold-Chain Activity</div>
        <h2 className="mt-1 text-[22px] font-medium" style={{ fontFamily: "'Fraunces', serif", color: T.ink }}>What Nitin has been watching over</h2>
      </div>

      <div className="grid grid-cols-2 gap-px overflow-hidden rounded-[20px] border sm:grid-cols-4" style={{ borderColor: T.line, background: T.line }}>
        {ACTIVITY_STATS.map((s, i) => {
          const st = toneStyles[s.tone];
          return (
            <motion.div
              key={s.key}
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-10% 0px" }}
              transition={{ duration: 0.5, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
              whileHover={{ y: -3 }}
              className="flex flex-col items-start gap-3 px-6 py-7 transition-colors"
              style={{ background: T.creamSoft }}
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-[11px]" style={{ background: st.bg, color: st.fg }}>
                <s.icon size={16} />
              </span>
              <div className="text-[30px] font-medium leading-none" style={{ fontFamily: "'Fraunces', serif", color: T.ink }}>
                <CountUp value={s.value} suffix={s.suffix} />
              </div>
              <div className="text-[12px] font-medium" style={{ color: T.inkSoft }}>{s.label}</div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────────
   ACTIVITY TIMELINE — vertical, reveals on scroll
   ───────────────────────────────────────────────────────────── */
function TimelineRow({ item, index, isLast }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-15% 0px" });
  const st = toneStyles[item.tone];
  return (
    <div ref={ref} className="relative flex gap-4 pb-8 last:pb-0">
      {!isLast && (
        <motion.span
          className="absolute left-[15px] top-8 w-px"
          style={{ background: T.line }}
          initial={{ height: 0 }}
          animate={inView ? { height: "calc(100% - 8px)" } : { height: 0 }}
          transition={{ duration: 0.6, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
        />
      )}
      <motion.span
        initial={{ opacity: 0, scale: 0.6 }}
        animate={inView ? { opacity: 1, scale: 1 } : {}}
        transition={{ duration: 0.4, delay: index * 0.1 }}
        className="relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2"
        style={{ background: st.bg, borderColor: T.creamSoft, color: st.fg }}
      >
        <item.icon size={13} />
      </motion.span>
      <motion.div
        initial={{ opacity: 0, x: -8 }}
        animate={inView ? { opacity: 1, x: 0 } : {}}
        transition={{ duration: 0.45, delay: index * 0.1 + 0.05 }}
        className="flex-1 pt-1"
      >
        <div className="text-[10.5px] font-semibold uppercase tracking-[0.08em]" style={{ color: T.inkSoft }}>{item.when}</div>
        <div className="mt-0.5 text-[14.5px] font-medium" style={{ color: T.ink }}>{item.text}</div>
      </motion.div>
    </div>
  );
}

function ActivityTimeline() {
  return (
    <section className="mx-auto max-w-[1240px] px-6 py-10">
      <div className="mb-6">
        <div className="text-[11px] font-semibold uppercase tracking-[0.14em]" style={{ color: T.emerald }}>Activity Timeline</div>
        <h2 className="mt-1 text-[22px] font-medium" style={{ fontFamily: "'Fraunces', serif", color: T.ink }}>Recent actions on the account</h2>
      </div>
      <div className="max-w-[560px]">
        {TIMELINE.map((item, i) => (
          <TimelineRow key={i} item={item} index={i} isLast={i === TIMELINE.length - 1} />
        ))}
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────────
   NOTIFICATION PREFERENCES
   ───────────────────────────────────────────────────────────── */
function NotificationPreferences() {
  const [prefs, setPrefs] = useState(NOTIFICATIONS_INITIAL);
  const toggle = (key) => setPrefs((p) => p.map((n) => (n.key === key ? { ...n, on: !n.on } : n)));

  return (
    <section className="mx-auto max-w-[1240px] px-6 py-10">
      <div className="mb-6">
        <div className="text-[11px] font-semibold uppercase tracking-[0.14em]" style={{ color: T.emerald }}>Notification Preferences</div>
        <h2 className="mt-1 text-[22px] font-medium" style={{ fontFamily: "'Fraunces', serif", color: T.ink }}>Choose what deserves your attention</h2>
      </div>

      <div className="divide-y rounded-[20px] border" style={{ borderColor: T.line, background: T.creamSoft }}>
        {prefs.map((n, i) => (
          <motion.div
            key={n.key}
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-10% 0px" }}
            transition={{ duration: 0.4, delay: i * 0.04 }}
            className="flex items-center justify-between gap-6 px-6 py-4.5"
            style={{ borderColor: T.line }}
          >
            <div>
              <div className="text-[13.5px] font-semibold" style={{ color: T.ink }}>{n.label}</div>
              <div className="mt-0.5 text-[12px]" style={{ color: T.inkSoft }}>{n.desc}</div>
            </div>
            <Toggle on={n.on} onChange={() => toggle(n.key)} />
          </motion.div>
        ))}
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────────
   SECURITY
   ───────────────────────────────────────────────────────────── */
function Security() {
  const rows = [
    { label: "Password", value: "••••••••", icon: KeyRound },
    { label: "Two-Factor Authentication", value: "Enabled", icon: ShieldCheck, tone: "good" },
    { label: "Active Sessions", value: "2 Devices", icon: Smartphone },
    { label: "Last Login", value: "Today, 10:42 AM", icon: Clock },
  ];
  return (
    <section className="mx-auto max-w-[1240px] px-6 py-10">
      <div className="mb-6">
        <div className="text-[11px] font-semibold uppercase tracking-[0.14em]" style={{ color: T.emerald }}>Security</div>
        <h2 className="mt-1 text-[22px] font-medium" style={{ fontFamily: "'Fraunces', serif", color: T.ink }}>Keep the account locked down</h2>
      </div>

      <div className="rounded-[20px] border p-6" style={{ borderColor: T.line, background: T.creamSoft }}>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {rows.map((r, i) => (
            <motion.div
              key={r.label}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-10% 0px" }}
              transition={{ duration: 0.4, delay: i * 0.06 }}
            >
              <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wide" style={{ color: T.inkSoft }}>
                <r.icon size={13} style={{ color: r.tone === "good" ? T.emerald : T.inkSoft }} />
                {r.label}
              </div>
              <div className="mt-1.5 text-[15px] font-medium" style={{ color: r.tone === "good" ? T.emerald : T.ink }}>{r.value}</div>
            </motion.div>
          ))}
        </div>

        <div className="mt-6 flex flex-wrap gap-2.5 border-t pt-5" style={{ borderColor: T.line }}>
          <button className="rounded-full px-4 py-2 text-[12.5px] font-semibold text-white" style={{ background: T.emerald }}>Change Password</button>
          <button className="rounded-full border px-4 py-2 text-[12.5px] font-semibold" style={{ borderColor: T.line, color: T.ink }}>Manage Sessions</button>
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────────
   CONNECTED DEVICES
   ───────────────────────────────────────────────────────────── */
function ConnectedDevices() {
  return (
    <section className="mx-auto max-w-[1240px] px-6 py-10">
      <div className="mb-6 flex items-end justify-between">
        <div>
          <div className="text-[11px] font-semibold uppercase tracking-[0.14em]" style={{ color: T.emerald }}>Connected Devices</div>
          <h2 className="mt-1 text-[22px] font-medium" style={{ fontFamily: "'Fraunces', serif", color: T.ink }}>Hardware linked to this account</h2>
        </div>
        <button className="hidden items-center gap-1 text-[12.5px] font-semibold sm:flex" style={{ color: T.emerald }}>
          Manage Devices <ArrowRight size={13} />
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {DEVICES.map((d, i) => (
          <motion.div
            key={d.id}
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-10% 0px" }}
            transition={{ duration: 0.45, delay: i * 0.08 }}
            whileHover={{ y: -2 }}
            className="flex items-center justify-between gap-4 rounded-[16px] border p-4"
            style={{ borderColor: T.line, background: T.creamSoft }}
          >
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-[12px]" style={{ background: T.mint, color: T.emerald }}>
                <Wifi size={16} />
              </span>
              <div>
                <div className="text-[13.5px] font-semibold" style={{ color: T.ink }}>{d.id}</div>
                <div className="text-[11.5px]" style={{ color: T.inkSoft }}>{d.model}</div>
              </div>
            </div>
            <span className="flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10.5px] font-semibold" style={{ background: T.mint, color: T.emerald }}>
              <motion.span className="h-1.5 w-1.5 rounded-full" style={{ background: T.emerald }} animate={{ opacity: [1, 0.35, 1] }} transition={{ duration: 2, repeat: Infinity, delay: i * 0.3 }} />
              Online
            </span>
          </motion.div>
        ))}
      </div>

      <button className="mt-4 flex items-center gap-1 text-[12.5px] font-semibold sm:hidden" style={{ color: T.emerald }}>
        Manage Devices <ArrowRight size={13} />
      </button>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────────
   PREFERENCES — elegant segmented controls, not form fields
   ───────────────────────────────────────────────────────────── */
function SegmentedControl({ options, value, onChange, icons }) {
  return (
    <div className="inline-flex items-center gap-0.5 rounded-full border p-1" style={{ borderColor: T.line, background: T.creamSoft }}>
      {options.map((opt) => {
        const Icon = icons?.[opt];
        return (
          <button
            key={opt}
            onClick={() => onChange(opt)}
            className="relative flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-[12px] font-semibold transition-colors"
            style={{ color: value === opt ? "#fff" : T.inkSoft }}
          >
            {value === opt && (
              <motion.span layoutId="pref-pill" className="absolute inset-0 rounded-full" style={{ background: T.emerald }} transition={{ type: "spring", stiffness: 400, damping: 32 }} />
            )}
            <span className="relative flex items-center gap-1.5">
              {Icon && <Icon size={12} />}
              {opt}
            </span>
          </button>
        );
      })}
    </div>
  );
}

function Preferences() {
  const [theme, setTheme] = useState("Light");
  const [unit, setUnit] = useState("°C");
  const [refresh, setRefresh] = useState("Real-time");

  return (
    <section className="mx-auto max-w-[1240px] px-6 py-10">
      <div className="mb-6">
        <div className="text-[11px] font-semibold uppercase tracking-[0.14em]" style={{ color: T.emerald }}>Preferences</div>
        <h2 className="mt-1 text-[22px] font-medium" style={{ fontFamily: "'Fraunces', serif", color: T.ink }}>Tune the experience</h2>
      </div>

      <div className="divide-y rounded-[20px] border" style={{ borderColor: T.line, background: T.creamSoft }}>
        <div className="flex flex-col gap-3 px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3 text-[13.5px] font-medium" style={{ color: T.ink }}>
            <Settings2 size={15} style={{ color: T.emerald }} /> Theme
          </div>
          <SegmentedControl options={["Light", "Dark", "System"]} value={theme} onChange={setTheme} icons={{ Light: Sun, Dark: Moon, System: Monitor }} />
        </div>

        <div className="flex flex-col gap-3 px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3 text-[13.5px] font-medium" style={{ color: T.ink }}>
            <Globe size={15} style={{ color: T.emerald }} /> Language
          </div>
          <span className="text-[13px] font-medium" style={{ color: T.inkSoft }}>English</span>
        </div>

        <div className="flex flex-col gap-3 px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3 text-[13.5px] font-medium" style={{ color: T.ink }}>
            <Thermometer size={15} style={{ color: T.emerald }} /> Temperature Unit
          </div>
          <SegmentedControl options={["°C", "°F"]} value={unit} onChange={setUnit} />
        </div>

        <div className="flex flex-col gap-3 px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3 text-[13.5px] font-medium" style={{ color: T.ink }}>
            <RefreshCw size={15} style={{ color: T.emerald }} /> Data Refresh
          </div>
          <SegmentedControl options={["Real-time", "Every 5 min"]} value={refresh} onChange={setRefresh} />
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────────
   PAGE
   ───────────────────────────────────────────────────────────── */
export default function ProfilePage() {
  return (
    <div style={{ background: T.cream, minHeight: "100vh", fontFamily: "'Inter', sans-serif" }}>
      <style>{fontImport}</style>
      <ProfileHero />
      <ProfileInformation />
      <ColdChainActivity />
      <ActivityTimeline />
      <NotificationPreferences />
      <Security />
      <ConnectedDevices />
      <Preferences />
      <div className="mx-auto max-w-[1240px] px-6 pb-16 pt-2 text-center text-[11.5px]" style={{ color: T.inkSoft }}>
        ChillChain AI · Profile — NodeMCU ESP8266 · Cold-Chain Operations
      </div>
    </div>
  );
}
