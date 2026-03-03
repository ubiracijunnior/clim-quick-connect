import { useNavigate } from "react-router-dom";
import { Thermometer, HeartPulse, CalendarCheck, MessageCircle, Headphones } from "lucide-react";
import { ScrollFadeIn } from "./ScrollFadeIn";

const benefits = [
  { icon: Thermometer, text: "Conforto e economia com manutenção em dia" },
  { icon: HeartPulse, text: "Higienização melhora a qualidade do ar" },
  { icon: CalendarCheck, text: "Agendamento organizado para evitar espera" },
  { icon: MessageCircle, text: "Atendimento claro e objetivo" },
  { icon: Headphones, text: "Suporte via WhatsApp" },
];

export function BenefitsSection() {
  const navigate = useNavigate();

  return (
    <section className="w-full max-w-[480px] mx-auto px-4 py-8">
      <ScrollFadeIn>
        <h2 className="text-lg font-bold text-foreground mb-4">Benefícios</h2>
      </ScrollFadeIn>
      <div className="flex flex-col gap-3 mb-8">
        {benefits.map((b, i) => (
          <ScrollFadeIn key={b.text} delay={i * 0.06}>
            <div
              className="w-full flex items-center gap-3 p-4 rounded-xl border border-border bg-card"
              style={{ minHeight: "56px" }}
            >
              <div className="shrink-0 w-9 h-9 rounded-lg bg-accent/10 flex items-center justify-center">
                <b.icon className="w-4.5 h-4.5 text-accent" aria-hidden="true" />
              </div>
              <p className="text-sm text-foreground leading-snug flex-1 min-w-0"
                 style={{ overflowWrap: "break-word", wordBreak: "break-word" }}>
                {b.text}
              </p>
            </div>
          </ScrollFadeIn>
        ))}
      </div>

      {/* CTA Banner */}
      <ScrollFadeIn delay={0.1}>
        <div className="w-full rounded-2xl bg-primary p-5 text-center">
          <p className="text-sm font-medium text-primary-foreground/90 mb-3">
            Leva menos de 1 minuto para agendar.
          </p>
          <button
            onClick={() => navigate("/?quiz=1")}
            className="w-full py-3.5 rounded-xl font-bold text-base bg-white text-primary active:scale-[0.97] transition-transform shadow-md"
            style={{ minHeight: "48px" }}
          >
            AGENDAR VISITA TÉCNICA 🛠️
          </button>
        </div>
      </ScrollFadeIn>
    </section>
  );
}
