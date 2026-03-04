import climLogo from "@/assets/clim-logo.png";
import welcomeBg from "@/assets/welcome-bg.jpg";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const ease = [0.22, 1, 0.36, 1] as [number, number, number, number];

export function HeroSection() {
  const navigate = useNavigate();

  const whatsappLink = `https://wa.me/5571996054191?text=${encodeURIComponent(
    "Olá! Quero agendar um serviço com a CLIM TECH. Pode me ajudar?"
  )}`;

  return (
    <section className="relative w-full overflow-hidden">
      {/* Background */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${welcomeBg})` }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/65 via-black/55 to-black/75" />

      <div className="relative z-10 w-full max-w-[480px] mx-auto px-4 pt-10 pb-10 flex flex-col items-center text-center">
        {/* Logo */}
        <motion.img
          src={climLogo}
          alt="CLIM TECH logo"
          className="w-48 h-48 object-contain mb-6 drop-shadow-lg"
          style={{ maxWidth: "200px" }}
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease }}
        />

        {/* Title */}
        <motion.h1
          className="text-2xl font-extrabold text-white leading-tight mb-3 drop-shadow-md"
          style={{ overflowWrap: "break-word", wordBreak: "break-word" }}
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease, delay: 0.15 }}
        >
          Ar-condicionado gelando de verdade.
        </motion.h1>

        <motion.p
          className="text-sm text-white/85 leading-relaxed mb-6 max-w-xs drop-shadow-sm"
          style={{ overflowWrap: "break-word", wordBreak: "break-word" }}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease, delay: 0.28 }}
        >
          Instalação, higienização e manutenção com atendimento organizado.
        </motion.p>

        {/* CTA Primary */}
        <motion.button
          onClick={() => navigate("/?quiz=1")}
          className="w-full py-4 rounded-xl font-bold text-base tracking-wide bg-primary text-primary-foreground active:scale-[0.97] transition-transform shadow-lg mb-3"
          style={{ minHeight: "52px" }}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease, delay: 0.4 }}
        >
          AGENDAR VISITA TÉCNICA 🛠️
        </motion.button>

        {/* CTA Secondary */}
        <motion.a
          href={whatsappLink}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full py-3.5 rounded-xl font-bold text-base tracking-wide border-2 border-white/40 text-white bg-white/10 backdrop-blur-sm text-center active:scale-[0.97] transition-transform block"
          style={{ minHeight: "48px" }}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease, delay: 0.5 }}
        >
          FALAR NO WHATSAPP 💬
        </motion.a>

        {/* Trust chips */}
        <motion.div
          className="flex flex-wrap justify-center gap-2 mt-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.6 }}
        >
          {["Atendimento rápido", "Técnicos experientes", "Transparência"].map((chip) => (
            <span
              key={chip}
              className="px-3 py-1.5 rounded-full text-xs font-semibold bg-white/15 text-white/90 backdrop-blur-sm border border-white/20"
            >
              {chip}
            </span>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
