import { useState, useCallback, useMemo } from "react";

export interface QuizData {
  servico: string;
  tipo_local: string;
  tipo_aparelho: string;
  quantidade: string;
  marca: string;
  bairro_cidade: string;
  turno: string;
  faixa_horario: string;
  urgencia: string;
  nome_cliente: string;
  telefone_alternativo: string;
  // Conditional
  btus: string;
  infra: string;
  plano_higienizacao: string;
  problema: string;
  detalhes: string;
}

const initialData: QuizData = {
  servico: "",
  tipo_local: "",
  tipo_aparelho: "",
  quantidade: "",
  marca: "",
  bairro_cidade: "",
  turno: "",
  faixa_horario: "",
  urgencia: "",
  nome_cliente: "",
  telefone_alternativo: "",
  btus: "",
  infra: "",
  plano_higienizacao: "",
  problema: "",
  detalhes: "",
};

export type StepId =
  | "welcome"
  | "servico"
  | "tipo_local"
  | "tipo_aparelho"
  | "quantidade"
  | "marca"
  | "bairro_cidade"
  | "btus"
  | "infra"
  | "plano_higienizacao"
  | "problema"
  | "detalhes"
  | "turno"
  | "faixa_horario"
  | "urgencia"
  | "nome_cliente"
  | "telefone_alternativo"
  | "resumo";

export function useQuizState() {
  const [data, setData] = useState<QuizData>(initialData);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  const updateField = useCallback(
    <K extends keyof QuizData>(field: K, value: QuizData[K]) => {
      setData((prev) => ({ ...prev, [field]: value }));
    },
    []
  );

  const steps = useMemo((): StepId[] => {
    const s: StepId[] = [
      "welcome",
      "servico",
      "tipo_local",
      "tipo_aparelho",
      "quantidade",
      "marca",
      "bairro_cidade",
    ];

    // Conditional blocks based on service
    if (data.servico === "Instalação") {
      s.push("btus", "infra");
    } else if (data.servico === "Higienização") {
      s.push("plano_higienizacao");
    } else if (data.servico === "Manutenção Corretiva") {
      s.push("problema");
      if (data.problema === "Outro") {
        s.push("detalhes");
      }
    }

    s.push("turno");

    if (data.turno && data.turno !== "Tanto faz") {
      s.push("faixa_horario");
    }

    s.push("urgencia", "nome_cliente", "telefone_alternativo", "resumo");

    return s;
  }, [data.servico, data.problema, data.turno]);

  const currentStep = steps[currentStepIndex];
  const totalQuizSteps = steps.length - 2; // exclude welcome and resumo
  const quizStepNumber = Math.max(0, currentStepIndex - 1); // 0-based after welcome

  const canGoNext = useMemo(() => {
    switch (currentStep) {
      case "welcome":
        return true;
      case "servico":
        return !!data.servico;
      case "tipo_local":
        return !!data.tipo_local;
      case "tipo_aparelho":
        return !!data.tipo_aparelho;
      case "quantidade":
        return !!data.quantidade;
      case "marca":
        return data.marca.trim().length >= 2;
      case "bairro_cidade":
        return data.bairro_cidade.trim().length >= 3;
      case "btus":
        return !!data.btus;
      case "infra":
        return !!data.infra;
      case "plano_higienizacao":
        return !!data.plano_higienizacao;
      case "problema":
        return !!data.problema;
      case "detalhes":
        return true; // optional
      case "turno":
        return !!data.turno;
      case "faixa_horario":
        return !!data.faixa_horario;
      case "urgencia":
        return !!data.urgencia;
      case "nome_cliente":
        return data.nome_cliente.trim().length >= 2;
      case "telefone_alternativo":
        return true; // optional
      default:
        return true;
    }
  }, [currentStep, data]);

  const goNext = useCallback(() => {
    if (!canGoNext) return;

    // Auto-set faixa_horario when turno changes
    if (currentStep === "turno") {
      if (data.turno === "Tanto faz") {
        setData((prev) => ({ ...prev, faixa_horario: "Flexível" }));
      } else if (data.turno === "Manhã") {
        setData((prev) => ({ ...prev, faixa_horario: "Das 9h às 12h" }));
      } else if (data.turno === "Tarde") {
        setData((prev) => ({ ...prev, faixa_horario: "Das 13h às 17h" }));
      } else if (data.turno === "Noite") {
        setData((prev) => ({ ...prev, faixa_horario: "Das 18h às 20h" }));
      }
    }

    // When changing servico, reset conditional fields
    if (currentStep === "servico") {
      setData((prev) => ({
        ...prev,
        btus: "",
        infra: "",
        plano_higienizacao: "",
        problema: "",
        detalhes: "",
      }));
    }

    // When changing tipo_local, reset tipo_aparelho
    if (currentStep === "tipo_local") {
      setData((prev) => ({ ...prev, tipo_aparelho: "" }));
    }

    setCurrentStepIndex((i) => Math.min(i + 1, steps.length - 1));
  }, [canGoNext, currentStep, data.turno, steps.length]);

  const goBack = useCallback(() => {
    setCurrentStepIndex((i) => Math.max(i - 1, 0));
  }, []);

  return {
    data,
    updateField,
    currentStep,
    currentStepIndex,
    steps,
    totalQuizSteps,
    quizStepNumber,
    canGoNext,
    goNext,
    goBack,
  };
}

export function buildWhatsAppLink(data: QuizData): string {
  const numero = "55719966054191";

  let bloco = "";
  if (data.servico === "Instalação") {
    bloco = `📌 Instalação:\n• BTUs: ${data.btus}\n• Infraestrutura (suporte/tubos/conexões): ${data.infra}\n`;
  } else if (data.servico === "Higienização") {
    bloco = `🧼 Higienização:\n• Plano: ${data.plano_higienizacao}\n`;
  } else if (data.servico === "Manutenção Corretiva") {
    bloco = `🛠️ Corretiva:\n• Problema: ${data.problema}\n`;
    if (data.detalhes.trim()) {
      bloco += `• Detalhes: ${data.detalhes}\n`;
    }
  }

  const telefone = data.telefone_alternativo.trim() || "Não informado";

  const msg =
    `Olá! Meu nome é ${data.nome_cliente} e quero solicitar um atendimento na CLIM TECH.\n\n` +
    `✅ Serviço: ${data.servico}\n` +
    `🏢 Local: ${data.tipo_local}\n` +
    `❄️ Tipo de aparelho: ${data.tipo_aparelho}\n` +
    `🔢 Quantidade: ${data.quantidade}\n` +
    `🏷️ Marca: ${data.marca}\n` +
    `📍 Bairro/Cidade: ${data.bairro_cidade}\n\n` +
    `🕒 Turno: ${data.turno}\n` +
    `⏰ Faixa preferencial: ${data.faixa_horario}\n` +
    `⚡ Urgência: ${data.urgencia}\n` +
    `📞 Telefone alternativo: ${telefone}\n\n` +
    (bloco ? bloco + "\n" : "") +
    `Pode me passar os próximos horários disponíveis?`;

  return `https://wa.me/${numero}?text=${encodeURIComponent(msg)}`;
}
