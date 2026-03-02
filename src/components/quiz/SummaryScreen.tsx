import { useState } from "react";
import { ArrowLeft, CheckCircle2, MessageCircle, AlertTriangle } from "lucide-react";
import { type QuizData, buildWhatsAppLink, formatFee } from "@/hooks/useQuizState";

interface SummaryScreenProps {
  data: QuizData;
  onBack: () => void;
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between py-2 border-b border-border last:border-b-0">
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className="text-sm font-semibold text-foreground text-right max-w-[55%]">
        {value}
      </span>
    </div>
  );
}

export function SummaryScreen({ data, onBack }: SummaryScreenProps) {
  const [confirmed, setConfirmed] = useState(false);

  const handleSend = () => {
    if (!confirmed) return;
    const url = buildWhatsAppLink(data);
    window.open(url, "_blank", "noopener");
  };

  const feeDisplay = data.visit_fee_value > 0
    ? formatFee(data.visit_fee_value)
    : "R$ 0,00 (a confirmar)";

  return (
    <div className="flex flex-col min-h-[100dvh] bg-background">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-card border-b border-border px-4 py-3">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors text-sm"
        >
          <ArrowLeft size={18} />
          Voltar
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 px-5 pt-6 pb-48 overflow-y-auto">
        <div className="flex items-center gap-2 mb-1">
          <CheckCircle2 size={24} className="text-accent" />
          <h2 className="text-xl font-bold text-foreground">
            Perfeito, {data.nome_cliente}! ✅
          </h2>
        </div>
        <p className="text-sm text-muted-foreground mb-5">
          Confira seu resumo abaixo. Se estiver tudo certo, envie no WhatsApp
          para agilizar seu atendimento.
        </p>

        {/* Summary card */}
        <div className="bg-card rounded-2xl border border-border p-4 shadow-sm">
          <SummaryRow label="Serviço" value={data.servico} />
          <SummaryRow label="Local" value={data.tipo_local} />
          <SummaryRow label="Tipo de aparelho" value={data.tipo_aparelho} />
          <SummaryRow label="Quantidade" value={data.quantidade} />
          <SummaryRow label="Marca" value={data.marca} />
          <SummaryRow label="Cidade" value={data.cidade} />
          <SummaryRow label="Bairro" value={data.bairro} />
          <SummaryRow label="Turno" value={data.turno} />
          <SummaryRow label="Faixa preferencial" value={data.faixa_horario} />
          <SummaryRow label="Urgência" value={data.urgencia} />
          <SummaryRow
            label="Telefone alt."
            value={data.telefone_alternativo.trim() || "Não informado"}
          />

          {/* Conditional blocks */}
          {data.servico === "Instalação" && (
            <>
              <div className="mt-3 pt-3 border-t border-border">
                <p className="text-xs font-semibold text-primary mb-2 uppercase tracking-wide">
                  📌 Instalação
                </p>
                <SummaryRow label="BTUs" value={data.btus} />
                <SummaryRow label="Infraestrutura" value={data.infra} />
              </div>
            </>
          )}
          {data.servico === "Higienização" && (
            <div className="mt-3 pt-3 border-t border-border">
              <p className="text-xs font-semibold text-primary mb-2 uppercase tracking-wide">
                🧼 Higienização
              </p>
              <SummaryRow label="Plano" value={data.plano_higienizacao} />
            </div>
          )}
          {data.servico === "Manutenção Corretiva" && (
            <div className="mt-3 pt-3 border-t border-border">
              <p className="text-xs font-semibold text-primary mb-2 uppercase tracking-wide">
                🛠️ Corretiva
              </p>
              <SummaryRow label="Problema" value={data.problema} />
              {data.detalhes.trim() && (
                <SummaryRow label="Detalhes" value={data.detalhes} />
              )}
            </div>
          )}

          {/* Visit fee */}
          <div className="mt-3 pt-3 border-t border-border">
            <p className="text-xs font-semibold text-primary mb-2 uppercase tracking-wide">
              💰 Taxa de Visita Técnica
            </p>
            <SummaryRow label="Valor" value={feeDisplay} />
          </div>
        </div>

        {/* Attention block */}
        <div className="mt-4 bg-warning/10 border border-warning/30 rounded-2xl p-4">
          <div className="flex items-start gap-2.5">
            <AlertTriangle size={20} className="text-warning flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-bold text-foreground mb-1">ATENÇÃO</p>
              <p className="text-sm text-foreground leading-relaxed">
                Será cobrada uma taxa de visita técnica de{" "}
                <strong>{feeDisplay}</strong> para cobrir custos de deslocamento.
              </p>
              <p className="text-sm text-foreground leading-relaxed mt-1">
                Se o serviço for realizado, esse valor será abatido do total. Caso não seja realizado, a taxa permanece como custo da visita.
              </p>
            </div>
          </div>
        </div>

        {/* Confirmation */}
        <label className="flex items-start gap-3 mt-5 cursor-pointer">
          <input
            type="checkbox"
            checked={confirmed}
            onChange={(e) => setConfirmed(e.target.checked)}
            className="mt-0.5 w-5 h-5 rounded border-2 border-quiz-border accent-primary"
          />
          <span className="text-sm text-foreground leading-snug">
            Confirmo que as informações estão corretas.
          </span>
        </label>
      </div>

      {/* Fixed bottom */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-card border-t border-border">
        <button
          onClick={handleSend}
          disabled={!confirmed}
          className="w-full py-3.5 rounded-xl font-bold text-base tracking-wide transition-all duration-200 flex items-center justify-center gap-2 bg-accent text-accent-foreground disabled:opacity-40 disabled:cursor-not-allowed active:scale-[0.98]"
        >
          <MessageCircle size={20} />
          ENVIAR NO WHATSAPP AGORA
        </button>
        <p className="text-xs text-center text-muted-foreground mt-2">
          Ao tocar em enviar, você será direcionado para o WhatsApp da CLIM
          TECH.
        </p>
      </div>
    </div>
  );
}
