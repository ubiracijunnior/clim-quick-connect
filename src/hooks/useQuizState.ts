import { useState, useCallback, useMemo } from "react";
import { fetchVisitFee } from "@/hooks/useCityNeighborhoods";

export interface QuizData {
  servico: string;
  tipo_local: string;
  tipo_aparelho: string;
  quantidade: string;
  marca: string;
  bairro_cidade: string; // kept for backward compat
  // New city/neighborhood fields
  cidade: string;
  cidade_id: string;
  bairro: string;
  bairro_id: string;
  endereco: string;
  visit_fee_value: number;
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
  cidade: "",
  cidade_id: "",
  bairro: "",
  bairro_id: "",
  endereco: "",
  visit_fee_value: 0,
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
  | "cidade_bairro"
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

  // When city changes, clear neighborhood and fee
  const setCity = useCallback((cityId: string, cityName: string) => {
    setData((prev) => ({
      ...prev,
      cidade_id: cityId,
      cidade: cityName,
      bairro_id: "",
      bairro: "",
      visit_fee_value: 0,
      bairro_cidade: cityName, // backward compat
    }));
  }, []);

  // When neighborhood changes, fetch fee
  const setNeighborhood = useCallback(async (neighborhoodId: string, neighborhoodName: string) => {
    const fee = await fetchVisitFee(neighborhoodId);
    setData((prev) => ({
      ...prev,
      bairro_id: neighborhoodId,
      bairro: neighborhoodName,
      visit_fee_value: fee,
      bairro_cidade: `${prev.cidade} / ${neighborhoodName}`, // backward compat
    }));
  }, []);

  const steps = useMemo((): StepId[] => {
    const s: StepId[] = [
      "servico",
      "tipo_local",
      "tipo_aparelho",
      "quantidade",
      "marca",
      "cidade_bairro",
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
  const totalQuizSteps = steps.length - 1; // exclude resumo
  const quizStepNumber = currentStepIndex + 1; // 1-based

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
      case "cidade_bairro":
        return !!data.cidade_id && !!data.bairro_id && data.endereco.trim().length >= 3;
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
    setCity,
    setNeighborhood,
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

export function formatFee(value: number): string {
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

export function buildWhatsAppLink(data: QuizData): string {
  const numero = "5571996054191";

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
  const feeText = formatFee(data.visit_fee_value);

  const msg =
    `Olá! Meu nome é ${data.nome_cliente} e quero solicitar um atendimento na CLIM TECH.\n\n` +
    `✅ Serviço: ${data.servico}\n` +
    `🏢 Local: ${data.tipo_local}\n` +
    `❄️ Tipo de aparelho: ${data.tipo_aparelho}\n` +
    `🔢 Quantidade: ${data.quantidade}\n` +
    `🏷️ Marca: ${data.marca}\n` +
    `📍 Cidade: ${data.cidade}\n` +
    `📍 Bairro: ${data.bairro}\n` +
    `📌 Endereço: ${data.endereco}\n\n` +
    `🕒 Turno: ${data.turno}\n` +
    `⏰ Faixa preferencial: ${data.faixa_horario}\n` +
    `⚡ Urgência: ${data.urgencia}\n` +
    `📞 Telefone alternativo: ${telefone}\n\n` +
    (bloco ? bloco + "\n" : "") +
    `💰 Taxa de visita técnica: ${feeText}\n` +
    `ℹ️ Se o serviço for realizado, esse valor será abatido do total. Caso contrário, a taxa permanece como custo da visita.\n\n` +
    `Pode me passar os próximos horários disponíveis?`;

  return `https://wa.me/${numero}?text=${encodeURIComponent(msg)}`;
}
