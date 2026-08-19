import { motion } from "framer-motion";
import { ROUTES, type RiskLevel } from "@/lib/ChillChain-data";
import {
  LiveDot,
  Reveal,
  Section,
  SectionHeading,
} from "./primitives";
import { GoogleShipmentMap } from "./GoogleShipmentMap";

const riskLabels: Record<RiskLevel, string> = {
  healthy: "In safe band",
  warning: "Drifting",
  critical: "Breach active",
};

export function ShipmentMap() {
  return (
    <Section
  id="map"
  className="!py-6 sm:!py-8 lg:!py-10"
>
      {/* ====================================================== */}
      {/* SECTION HEADING */}
      {/* ====================================================== */}

      <SectionHeading
        eyebrow="Live Shipment Map"
        title={
          <>
            Every corridor,{" "}
            <span className="text-gradient-primary">
              watched in motion
            </span>
            .
          </>
        }
        description="Active cold-chain routes across India with health-coded markers streaming from onboard ESP32 gateways."
      />

      {/* ====================================================== */}
      {/* MAP + SIDEBAR */}
      {/* ====================================================== */}

      <Reveal delay={0.1} className="mt-6">
        <div className="grid items-start gap-5 lg:grid-cols-[minmax(0,1fr)_320px]">
          
          {/* ================================================== */}
          {/* GOOGLE MAP */}
          {/* ================================================== */}

          <motion.div
            initial={{
              opacity: 0,
              scale: 0.985,
            }}
            whileInView={{
              opacity: 1,
              scale: 1,
            }}
            viewport={{
              once: true,
              margin: "-60px",
            }}
            transition={{
              duration: 0.7,
              ease: "easeOut",
            }}
            className="
              relative
              h-[380px]
              overflow-hidden
              rounded-[2rem]
              border
              border-border
              bg-surface
              shadow-[var(--shadow-soft)]
              sm:h-[460px]
              lg:h-[500px]
            "
          >
            {/* Soft background glow */}

            <div
              className="
                pointer-events-none
                absolute
                inset-0
                z-0
                opacity-60
              "
              style={{
                backgroundImage: "var(--gradient-canvas)",
              }}
            />

            {/* Google Maps */}

            <div className="absolute inset-0 z-[1]">
              <GoogleShipmentMap />
            </div>
          </motion.div>

          {/* ================================================== */}
          {/* SIDEBAR */}
          {/* ================================================== */}

          <div className="space-y-3">
            
            {/* ================================================= */}
            {/* MARKER LEGEND */}
            {/* ================================================= */}

            <motion.div
              initial={{
                opacity: 0,
                y: 12,
              }}
              whileInView={{
                opacity: 1,
                y: 0,
              }}
              viewport={{
                once: true,
              }}
              transition={{
                duration: 0.5,
              }}
              className="
                surface-panel
                rounded-2xl
                p-5
              "
            >
              <div className="flex items-center justify-between">
                <p className="eyebrow">
                  Marker legend
                </p>

                <span
                  className="
                    flex
                    items-center
                    gap-1.5
                    text-[10px]
                    font-semibold
                    uppercase
                    tracking-wider
                    text-muted-foreground
                  "
                >
                  <span
                    className="
                      h-1.5
                      w-1.5
                      animate-pulse
                      rounded-full
                      bg-success
                    "
                  />

                  Live
                </span>
              </div>

              <ul className="mt-4 space-y-2">
                {(
                  ["healthy", "warning", "critical"] as RiskLevel[]
                ).map((level, index) => (
                  <motion.li
                    key={level}
                    initial={{
                      opacity: 0,
                      x: 10,
                    }}
                    whileInView={{
                      opacity: 1,
                      x: 0,
                    }}
                    viewport={{
                      once: true,
                    }}
                    transition={{
                      delay: index * 0.06,
                      duration: 0.35,
                    }}
                    className="
                      flex
                      items-center
                      gap-3
                      rounded-xl
                      px-2
                      py-1.5
                      transition-colors
                      hover:bg-muted/50
                    "
                  >
                    <LiveDot level={level} />

                    <span className="text-sm font-semibold capitalize">
                      {level}
                    </span>

                    <span className="ml-auto text-xs text-muted-foreground">
                      {riskLabels[level]}
                    </span>
                  </motion.li>
                ))}
              </ul>
            </motion.div>

            {/* ================================================= */}
            {/* ROUTES */}
            {/* ================================================= */}

            <div className="space-y-3">
              {ROUTES.map((route, index) => (
                <motion.div
                  key={route.id}
                  initial={{
                    opacity: 0,
                    x: 18,
                  }}
                  whileInView={{
                    opacity: 1,
                    x: 0,
                  }}
                  viewport={{
                    once: true,
                  }}
                  transition={{
                    delay: index * 0.06,
                    duration: 0.45,
                    ease: "easeOut",
                  }}
                  whileHover={{
                    x: -4,
                    scale: 1.005,
                  }}
                  className="
                    group
                    surface-panel
                    cursor-pointer
                    rounded-2xl
                    px-5
                    py-4
                    transition-shadow
                    hover:shadow-[var(--shadow-soft)]
                  "
                >
                  {/* Route information */}

                  <div className="flex items-center justify-between gap-4">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="font-display text-sm font-bold">
                          {route.from} → {route.to}
                        </p>

                        <span
                          className="
                            h-1.5
                            w-1.5
                            shrink-0
                            rounded-full
                            bg-success
                            opacity-0
                            transition-opacity
                            group-hover:opacity-100
                          "
                        />
                      </div>

                      <p className="mt-1 text-xs text-muted-foreground">
                        {route.id}
                      </p>
                    </div>

                    <LiveDot level={route.level} />
                  </div>

                  {/* Route status */}

                  <div className="mt-3 flex items-center justify-between">
                    <span
                      className="
                        text-[10px]
                        font-semibold
                        uppercase
                        tracking-wider
                        text-muted-foreground
                      "
                    >
                      Route status
                    </span>

                    <span className="text-xs font-semibold capitalize">
                      {route.level}
                    </span>
                  </div>

                  {/* Progress */}

                  <div
                    className="
                      mt-3
                      h-1
                      overflow-hidden
                      rounded-full
                      bg-muted
                    "
                  >
                    <motion.div
                      initial={{
                        width: 0,
                      }}
                      whileInView={{
                        width:
                          route.level === "healthy"
                            ? "88%"
                            : route.level === "warning"
                              ? "62%"
                              : "34%",
                      }}
                      viewport={{
                        once: true,
                      }}
                      transition={{
                        delay: 0.15 + index * 0.06,
                        duration: 0.7,
                        ease: "easeOut",
                      }}
                      className={`
                        h-full
                        rounded-full
                        ${
                          route.level === "healthy"
                            ? "bg-success"
                            : route.level === "warning"
                              ? "bg-warning"
                              : "bg-destructive"
                        }
                      `}
                    />
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </Reveal>
    </Section>
  );
}