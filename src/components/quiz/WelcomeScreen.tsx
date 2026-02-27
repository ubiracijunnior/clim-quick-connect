import climLogo from "@/assets/clim-logo.png";
import welcomeBg from "@/assets/welcome-bg.jpg";

interface WelcomeScreenProps {
  onStart: () => void;
}

export function WelcomeScreen({ onStart }: WelcomeScreenProps) {
  return (
    <div
      className="relative flex flex-col items-center justify-center min-h-[100dvh] px-6 text-center"
    >
      {/* Background image with overlay */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${welcomeBg})` }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-black/70" />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center">
        <img
          src={climLogo}
          alt="CLIM TECH logo"
          className="w-48 h-48 object-contain mb-8 drop-shadow-lg"
        />

        <p className="text-base text-white/90 leading-relaxed mb-10 max-w-xs drop-shadow-sm">
          Olá! 👋 Vamos solicitar seu atendimento com a{" "}
          <strong className="text-white">CLIM TECH</strong>. Responda rapidinho e já te atendemos no
          WhatsApp.
        </p>

        <button
          onClick={onStart}
          className="w-full max-w-xs py-4 rounded-xl font-bold text-base tracking-wide bg-primary text-primary-foreground active:scale-[0.97] transition-transform shadow-lg"
        >
          COMEÇAR
        </button>
      </div>
    </div>
  );
}
