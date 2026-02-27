import { Snowflake } from "lucide-react";

interface WelcomeScreenProps {
  onStart: () => void;
}

export function WelcomeScreen({ onStart }: WelcomeScreenProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[100dvh] bg-background px-6 text-center">
      <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-6">
        <Snowflake size={32} className="text-primary" />
      </div>

      <h1 className="text-2xl font-extrabold text-foreground mb-1">
        CLIM TECH
      </h1>
      <p className="text-sm text-muted-foreground mb-8 font-medium">
        Ar-condicionado · Climatização
      </p>

      <p className="text-base text-foreground leading-relaxed mb-10 max-w-xs">
        Olá! 👋 Vamos solicitar seu atendimento com a{" "}
        <strong>CLIM TECH</strong>. Responda rapidinho e já te atendemos no
        WhatsApp.
      </p>

      <button
        onClick={onStart}
        className="w-full max-w-xs py-4 rounded-xl font-bold text-base tracking-wide bg-primary text-primary-foreground active:scale-[0.97] transition-transform"
      >
        COMEÇAR
      </button>
    </div>
  );
}
