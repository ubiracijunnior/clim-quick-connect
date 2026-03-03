import { useNavigate } from "react-router-dom";
import { Wrench, Wind, SprayCan, ShieldCheck, Settings } from "lucide-react";
import { ScrollFadeIn } from "./ScrollFadeIn";

const services = [
  { icon: Wrench, name: "Instalação", desc: "Montagem completa com segurança", tag: "Mais pedido" },
  { icon: SprayCan, name: "Higienização Básica", desc: "Limpeza da evaporadora" },
  { icon: Wind, name: "Higienização Completa", desc: "Evaporadora + condensadora", tag: "Recomendado" },
  { icon: ShieldCheck, name: "Manutenção Preventiva", desc: "Revisão periódica para evitar falhas" },
  { icon: Settings, name: "Manutenção Corretiva", desc: "Reparo de defeitos e problemas" },
];

export function ServicesSection() {
  const navigate = useNavigate();

  return (
    <section className="w-full max-w-[480px] mx-auto px-4 py-8">
      <ScrollFadeIn>
        <h2 className="text-lg font-bold text-foreground mb-4">Serviços</h2>
      </ScrollFadeIn>
      <div className="flex flex-col gap-3">
        {services.map((s, i) => (
          <ScrollFadeIn key={s.name} delay={i * 0.07}>
            <button
              onClick={() => navigate("/?quiz=1")}
              className="w-full flex items-center gap-3 p-4 rounded-xl border border-border bg-card text-left active:scale-[0.98] transition-transform"
              style={{ minHeight: "64px" }}
            >
              <div className="shrink-0 w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <s.icon className="w-5 h-5 text-primary" aria-hidden="true" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-semibold text-sm text-foreground">{s.name}</span>
                  {s.tag && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-accent/15 text-accent">
                      {s.tag}
                    </span>
                  )}
                </div>
                <p className="text-xs text-muted-foreground mt-0.5 truncate">{s.desc}</p>
              </div>
            </button>
          </ScrollFadeIn>
        ))}
      </div>
    </section>
  );
}
