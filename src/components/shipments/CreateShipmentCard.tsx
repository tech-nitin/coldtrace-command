import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Plus, CheckCircle2 } from "lucide-react";

/**
 * Shape of the data captured by the compact "New Shipment" form.
 * Mirrors the fields ChillChain needs before a shipment can be created.
 */
export interface CreateShipmentData {
  shipmentId: string;
  cargo: string;
  origin: string;
  destination: string;
  temperatureLimit: string;
  humidityLimit: string;
  sensorId: string;
}

const EMPTY_FORM: CreateShipmentData = {
  shipmentId: "",
  cargo: "",
  origin: "",
  destination: "",
  temperatureLimit: "",
  humidityLimit: "",
  sensorId: "",
};

// Mirrors the base URL used by ShipmentsPage.tsx. If your creation endpoint
// lives somewhere else, this is the only line you need to change.
const API_BASE_URL = "http://localhost:5000/api/v1";

const REQUIRED_FIELDS: (keyof CreateShipmentData)[] = [
  "shipmentId",
  "cargo",
  "origin",
  "destination",
];

interface CreateShipmentCardProps {
  /** Called after a shipment is successfully created, so the parent page can refresh its list. */
  onShipmentCreated?: (shipment: CreateShipmentData) => void;
}

export function CreateShipmentCard({ onShipmentCreated }: CreateShipmentCardProps) {
  const [form, setForm] = useState<CreateShipmentData>(EMPTY_FORM);
  const [touched, setTouched] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);

  const isValid = REQUIRED_FIELDS.every((field) => form[field].trim().length > 0);

  function updateField(field: keyof CreateShipmentData, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (error) setError(null);
  }

  /**
   * Isolated submit handler — swap the fetch call below for your real
   * shipment-creation service if it differs from this REST convention.
   */
  async function handleCreateShipment() {
    setTouched(true);
    if (!isValid) {
      setError("Please fill in Shipment ID, Cargo, Origin and Destination.");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const res = await fetch(`${API_BASE_URL}/shipments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          shipmentId: form.shipmentId,
          cargoType: form.cargo,
          origin: form.origin,
          destination: form.destination,
          temperatureLimit: form.temperatureLimit,
          humidityLimit: form.humidityLimit,
          sensorId: form.sensorId,
        }),
      });

      if (!res.ok) {
        throw new Error(`Request failed with status ${res.status}`);
      }

      onShipmentCreated?.(form);
      setForm(EMPTY_FORM);
      setTouched(false);
      setShowSuccess(true);
      window.setTimeout(() => setShowSuccess(false), 3200);
    } catch (err) {
      console.error("Error creating shipment:", err);
      setError("Couldn't create the shipment. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      className="relative rounded-3xl border border-[#E7E3D4] bg-[#FCFBF6] p-5 shadow-[0_1px_2px_rgba(20,35,27,0.03)] sm:p-6"
    >
      {/* Header */}
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-1.5 text-[15px] font-semibold text-[#14231B]">
            <Plus className="h-4 w-4 text-emerald-600" strokeWidth={2.5} />
            New Shipment
          </div>
          <p className="mt-0.5 text-xs text-[#6B7C71]">
            Add a shipment and assign its route
          </p>
        </div>

        <AnimatePresence>
          {showSuccess && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700"
            >
              <CheckCircle2 className="h-3.5 w-3.5" />
              Shipment created
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Field row 1: ID, Cargo, Origin -> Destination */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-[1fr_1fr_1fr_auto_1fr]">
        <Field
          label="Shipment ID"
          placeholder="CG-10491"
          value={form.shipmentId}
          onChange={(v) => updateField("shipmentId", v)}
          invalid={touched && !form.shipmentId.trim()}
        />
        <Field
          label="Cargo / Product"
          placeholder="Milk \ Ice-creame \ Vaccine"
          value={form.cargo}
          onChange={(v) => updateField("cargo", v)}
          invalid={touched && !form.cargo.trim()}
        />

        {/* Origin -> Destination, visually emphasized */}
        <div className="col-span-1 flex items-end gap-2 sm:col-span-2 lg:col-span-3 lg:contents">
          <Field
            label="Origin"
            placeholder="Mumbai"
            value={form.origin}
            onChange={(v) => updateField("origin", v)}
            invalid={touched && !form.origin.trim()}
            emphasize
            className="flex-1"
          />
          <div className="hidden pb-2.5 lg:flex lg:items-center lg:justify-center">
            <ArrowRight className="h-4 w-4 text-emerald-600" strokeWidth={2.5} />
          </div>
          <div className="flex items-center justify-center pb-2.5 lg:hidden">
            <ArrowRight className="h-4 w-4 shrink-0 text-emerald-600" strokeWidth={2.5} />
          </div>
          <Field
            label="Destination"
            placeholder="Pune"
            value={form.destination}
            onChange={(v) => updateField("destination", v)}
            invalid={touched && !form.destination.trim()}
            emphasize
            className="flex-1"
          />
        </div>
      </div>

      {/* Field row 2: Sensor, Temp, Humidity + submit */}
      <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-3 lg:grid-cols-[1fr_1fr_1fr_auto] lg:items-end">
        {/* <Field
          label="Sensor / Device ID"
          placeholder="CHL-001"
          value={form.sensorId}
          onChange={(v) => updateField("sensorId", v)}
        /> */}
        <Field
          label="Temp Limit"
          placeholder="2-8°C"
          value={form.temperatureLimit}
          onChange={(v) => updateField("temperatureLimit", v)}
        />
        <Field
          label="Humidity Limit"
          placeholder="60-80%"
          value={form.humidityLimit}
          onChange={(v) => updateField("humidityLimit", v)}
        />

        <button
          type="button"
          onClick={handleCreateShipment}
          disabled={!isValid || isSubmitting}
          className="h-[38px] shrink-0 whitespace-nowrap rounded-xl bg-emerald-600 px-4 text-sm font-medium text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:bg-[#D9E0D6] disabled:text-[#8A968D]"
        >
          {isSubmitting ? "Creating…" : "Create Shipment"}
        </button>
      </div>

      {/* Inline validation message */}
      <AnimatePresence>
        {error && (
          <motion.p
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-2 text-xs font-medium text-rose-600"
          >
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

interface FieldProps {
  label: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  invalid?: boolean;
  emphasize?: boolean;
  className?: string;
}

function Field({
  label,
  placeholder,
  value,
  onChange,
  invalid,
  emphasize,
  className = "",
}: FieldProps) {
  return (
    <div className={className}>
      <label className="mb-1 block text-[11px] font-medium uppercase tracking-wide text-[#8A968D]">
        {label}
      </label>
      <input
        type="text"
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className={`h-[38px] w-full rounded-xl border bg-white px-3 text-sm text-[#14231B] placeholder:text-[#B7BEB1] outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 ${
          invalid
            ? "border-rose-300"
            : emphasize
            ? "border-[#D6DED2] font-medium"
            : "border-[#E7E3D4]"
        }`}
      />
    </div>
  );
}
