import { useQuizState } from "@/hooks/useQuizState";
import { WelcomeScreen } from "./WelcomeScreen";
import { SummaryScreen } from "./SummaryScreen";
import { StepLayout } from "./StepLayout";
import { RadioCards } from "./RadioCards";
import { QuizInput } from "./QuizInput";

const STEP_CONFIG: Record<
  string,
  { title: string; subtitle?: string }
> = {
  servico: { title: "Qual serviço você precisa?", subtitle: "Selecione uma opção abaixo" },
  tipo_local: { title: "Tipo de local", subtitle: "Onde será o atendimento?" },
  tipo_aparelho: { title: "Tipo de aparelho" },
  quantidade: { title: "Quantos aparelhos?", subtitle: "Selecione a quantidade" },
  marca: { title: "Marca / Fabricante", subtitle: "Informe a marca do aparelho" },
  bairro_cidade: { title: "Bairro / Cidade", subtitle: "Onde você está localizado?" },
  turno: { title: "Turno preferido", subtitle: "Qual melhor horário para você?" },
  faixa_horario: { title: "Faixa de horário", subtitle: "Confirme a faixa preferencial" },
  urgencia: { title: "Qual a urgência?", subtitle: "Nos ajude a priorizar seu atendimento" },
  nome_cliente: { title: "Qual o seu nome?" },
  telefone_alternativo: { title: "Telefone alternativo", subtitle: "Opcional — outro número para contato" },
  btus: { title: "Capacidade (BTUs)", subtitle: "Selecione a potência desejada" },
  infra: { title: "Infraestrutura", subtitle: "Você já possui suporte/tubos/conexões?" },
  plano_higienizacao: { title: "Plano de Higienização", subtitle: "Escolha o plano ideal" },
  problema: { title: "Qual o problema?", subtitle: "Selecione o que melhor descreve" },
  detalhes: { title: "Descreva o problema", subtitle: "Opcional — conte mais detalhes" },
};

export function QuizApp() {
  const quiz = useQuizState();
  const { data, updateField, currentStep, goNext, goBack, canGoNext, quizStepNumber, totalQuizSteps } = quiz;

  if (currentStep === "welcome") {
    return <WelcomeScreen onStart={goNext} />;
  }

  if (currentStep === "resumo") {
    return <SummaryScreen data={data} onBack={goBack} />;
  }

  const config = STEP_CONFIG[currentStep] || { title: "" };

  const renderContent = () => {
    switch (currentStep) {
      case "servico":
        return (
          <RadioCards
            options={["Instalação", "Higienização", "Manutenção Preventiva", "Manutenção Corretiva"]}
            value={data.servico}
            onChange={(v) => updateField("servico", v)}
          />
        );
      case "tipo_local":
        return (
          <RadioCards
            options={["Residencial", "Comercial"]}
            value={data.tipo_local}
            onChange={(v) => updateField("tipo_local", v)}
            columns={2}
          />
        );
      case "tipo_aparelho": {
        const opts =
          data.tipo_local === "Residencial"
            ? ["Split Hi-Wall", "Janela", "Piso Teto"]
            : ["Split Hi-Wall", "Cassete", "Teto (Piso Teto)", "Dutado"];
        return (
          <RadioCards
            options={opts}
            value={data.tipo_aparelho}
            onChange={(v) => updateField("tipo_aparelho", v)}
          />
        );
      }
      case "quantidade":
        return (
          <RadioCards
            options={["1", "2", "3", "4+"]}
            value={data.quantidade}
            onChange={(v) => updateField("quantidade", v)}
            columns={2}
          />
        );
      case "marca":
        return (
          <QuizInput
            value={data.marca}
            onChange={(v) => updateField("marca", v)}
            placeholder="Ex: LG, Samsung, Gree…"
            maxLength={20}
            minLength={2}
          />
        );
      case "bairro_cidade":
        return (
          <QuizInput
            value={data.bairro_cidade}
            onChange={(v) => updateField("bairro_cidade", v)}
            placeholder="Ex: Itapuã / Salvador"
            maxLength={40}
            minLength={3}
          />
        );
      case "turno":
        return (
          <RadioCards
            options={["Manhã", "Tarde", "Noite", "Tanto faz"]}
            value={data.turno}
            onChange={(v) => updateField("turno", v)}
            columns={2}
          />
        );
      case "faixa_horario": {
        const faixas: Record<string, string> = {
          Manhã: "Das 9h às 12h",
          Tarde: "Das 13h às 17h",
          Noite: "Das 18h às 20h",
        };
        const faixa = faixas[data.turno] || "";
        return (
          <RadioCards
            options={[faixa]}
            value={data.faixa_horario}
            onChange={(v) => updateField("faixa_horario", v)}
          />
        );
      }
      case "urgencia":
        return (
          <RadioCards
            options={[
              "Posso aguardar agendamento normal",
              "Preciso com prioridade",
              "É urgente (parou totalmente)",
            ]}
            value={data.urgencia}
            onChange={(v) => updateField("urgencia", v)}
          />
        );
      case "nome_cliente":
        return (
          <QuizInput
            value={data.nome_cliente}
            onChange={(v) => updateField("nome_cliente", v)}
            placeholder="Digite seu nome"
            maxLength={30}
            minLength={2}
          />
        );
      case "telefone_alternativo":
        return (
          <QuizInput
            value={data.telefone_alternativo}
            onChange={(v) => updateField("telefone_alternativo", v)}
            placeholder="(Opcional) outro telefone para contato"
            maxLength={20}
          />
        );
      case "btus":
        return (
          <RadioCards
            options={["9.000", "12.000", "18.000", "24.000+"]}
            value={data.btus}
            onChange={(v) => updateField("btus", v)}
            columns={2}
          />
        );
      case "infra":
        return (
          <RadioCards
            options={["Sim", "Não"]}
            value={data.infra}
            onChange={(v) => updateField("infra", v)}
            columns={2}
          />
        );
      case "plano_higienizacao":
        return (
          <RadioCards
            options={["Basic (somente evaporadora)", "Premium (evaporadora + condensadora)"]}
            value={data.plano_higienizacao}
            onChange={(v) => updateField("plano_higienizacao", v)}
          />
        );
      case "problema":
        return (
          <RadioCards
            options={["Não gela", "Vazando água", "Barulho", "Não liga", "Cheiro forte", "Outro"]}
            value={data.problema}
            onChange={(v) => updateField("problema", v)}
            columns={2}
          />
        );
      case "detalhes":
        return (
          <QuizInput
            value={data.detalhes}
            onChange={(v) => updateField("detalhes", v)}
            placeholder="Descreva em poucas palavras…"
            maxLength={80}
          />
        );
      default:
        return null;
    }
  };

  return (
    <StepLayout
      title={config.title}
      subtitle={config.subtitle}
      stepNumber={quizStepNumber}
      totalSteps={totalQuizSteps}
      showBack={true}
      onBack={goBack}
      canGoNext={canGoNext}
      onNext={goNext}
    >
      {renderContent()}
    </StepLayout>
  );
}
