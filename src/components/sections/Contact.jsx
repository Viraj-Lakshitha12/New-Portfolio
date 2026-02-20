import { useState, useEffect, useRef } from "react";
import { contactInfo } from "../../data/portfolioData";

// ── Leaflet via npm (no CDN / window.L needed) ──────────────────────────────
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix Leaflet's broken default icon paths when bundled by Vite
import iconUrl from "leaflet/dist/images/marker-icon.png";
import iconRetinaUrl from "leaflet/dist/images/marker-icon-2x.png";
import shadowUrl from "leaflet/dist/images/marker-shadow.png";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({ iconUrl, iconRetinaUrl, shadowUrl });
// ────────────────────────────────────────────────────────────────────────────

const INITIAL_FORM = { name: "", email: "", subject: "", message: "" };

/* ── Map Component ─────────────────────────────────────────────────────────── */
function ContactMap() {
  const containerRef = useRef(null);
  const mapRef = useRef(null); // Leaflet map instance

  useEffect(() => {
    const el = containerRef.current;
    if (!el || mapRef.current) return; // already initialised

    const map = L.map(el).setView([6.9271, 79.8612], 13);
    mapRef.current = map;

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "© OpenStreetMap contributors",
    }).addTo(map);

    // Custom glowing marker
    const icon = L.divIcon({
      className: "",
      html: `<div style="
        background: var(--accent, #00f5ff);
        width: 30px; height: 30px;
        border-radius: 50%;
        border: 3px solid white;
        box-shadow: 0 0 25px var(--accent, #00f5ff);
      "></div>`,
      iconSize: [30, 30],
      iconAnchor: [15, 15],
    });

    L.marker([6.9271, 79.8612], { icon })
      .addTo(map)
      .bindPopup("<b>Colombo, Sri Lanka</b><br>Available for opportunities");

    // Ensure tiles render correctly (fixes blank-map in hidden / lazy containers)
    setTimeout(() => map.invalidateSize(), 250);

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  return <div ref={containerRef} className="map-container" />;
}

/* ── Contact Form ──────────────────────────────────────────────────────────── */
function ContactForm() {
  const [formData, setFormData] = useState(INITIAL_FORM);
  const [formStatus, setFormStatus] = useState(""); // '' | 'sending' | 'success' | 'error'

  const handleChange = (e) =>
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormStatus("sending");
    try {
      const res = await fetch(
        "https://formsubmit.co/viraj.lakshitha.22222@gmail.com",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify(formData),
        },
      );
      if (res.ok) {
        setFormStatus("success");
        setFormData(INITIAL_FORM);
        setTimeout(() => setFormStatus(""), 3000);
      } else {
        setFormStatus("error");
      }
    } catch {
      setFormStatus("error");
    }
  };

  const btnLabel =
    formStatus === "sending"
      ? "Sending…"
      : formStatus === "success"
        ? "Message Sent! ✓"
        : "Submit Message";

  const fields = [
    {
      name: "name",
      type: "text",
      label: "Name",
      placeholder: "e.g. Viraj Lakshitha Adhikari",
    },
    {
      name: "email",
      type: "email",
      label: "Email",
      placeholder: "e.g. contact@example.com",
    },
    {
      name: "subject",
      type: "text",
      label: "Subject",
      placeholder: "e.g. Just saying Hi!",
    },
  ];

  return (
    <div className="contact-form-container">
      <h3
        style={{
          fontSize: "2.1rem",
          fontWeight: 700,
          marginBottom: 28,
          textAlign: "center",
        }}
      >
        Send Me a Message
      </h3>

      <form onSubmit={handleSubmit} noValidate>
        {fields.map((f) => (
          <div key={f.name} className="form-group">
            <label className="form-label" htmlFor={f.name}>
              {f.label}
            </label>
            <input
              id={f.name}
              type={f.type}
              name={f.name}
              className="form-input"
              placeholder={f.placeholder}
              value={formData[f.name]}
              onChange={handleChange}
              required
            />
          </div>
        ))}

        <div className="form-group">
          <label className="form-label" htmlFor="message">
            Message
          </label>
          <textarea
            id="message"
            name="message"
            className="form-textarea"
            placeholder="e.g. Hello Viraj! I'd like to discuss an opportunity."
            value={formData.message}
            onChange={handleChange}
            required
          />
        </div>

        <button
          type="submit"
          className="submit-btn"
          disabled={formStatus === "sending"}
        >
          <span>{btnLabel}</span>
        </button>

        {formStatus === "error" && (
          <p style={{ color: "#ff6b6b", textAlign: "center", marginTop: 12 }}>
            Error sending message. Please try again.
          </p>
        )}
      </form>
    </div>
  );
}

/* ── Contact Section ───────────────────────────────────────────────────────── */
export default function Contact() {
  return (
    <section id="contact" style={{ background: "var(--bg-secondary)" }}>
      <h2
        className="gradient-text"
        style={{
          fontSize: "clamp(2.5rem, 6vw, 4.2rem)",
          marginBottom: 18,
          textAlign: "center",
        }}
      >
        Let's Work Together
      </h2>
      <p
        style={{
          fontSize: "1.15rem",
          color: "var(--text-secondary)",
          lineHeight: 1.75,
          textAlign: "center",
          maxWidth: 700,
          margin: "0 auto 50px",
        }}
      >
        I'm currently available for freelance work and full-time opportunities.
        Feel free to reach out!
      </p>

      {/* Form */}
      <ContactForm />

      {/* Contact info cards */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          gap: 22,
          marginBottom: 70,
        }}
      >
        {(contactInfo || []).map((item) => (
          <div
            key={item.title}
            className="modern-card"
            style={{ textAlign: "center" }}
          >
            <div style={{ fontSize: "3.2rem", marginBottom: 14 }}>
              {item.icon}
            </div>
            <h4
              style={{
                marginBottom: 10,
                fontSize: "1.25rem",
                position: "relative",
                zIndex: 1,
              }}
            >
              {item.title}
            </h4>
            {item.link ? (
              <a
                href={item.link}
                style={{
                  color: "var(--accent)",
                  textDecoration: "none",
                  wordBreak: "break-word",
                  fontSize: "1.02rem",
                  position: "relative",
                  zIndex: 1,
                }}
              >
                {item.content}
              </a>
            ) : (
              <p
                style={{
                  color: "var(--text-secondary)",
                  fontSize: "1.02rem",
                  position: "relative",
                  zIndex: 1,
                }}
              >
                {item.content}
              </p>
            )}
          </div>
        ))}
      </div>

      {/* Map */}
      <div style={{ marginBottom: 70 }}>
        <h3 style={{ fontSize: "2.1rem", fontWeight: 700, marginBottom: 28 }}>
          Find Me Here
        </h3>
        <ContactMap />
      </div>
    </section>
  );
}
