import { useState, useRef } from "react";
import { Camera, X, CheckCircle2, ImageIcon } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface ApplianceLabelStepProps {
  imageUrl: string;
  imageName: string;
  uploaded: boolean;
  onUpload: (url: string, name: string) => void;
  onRemove: () => void;
  onSkip: () => void;
  skipped: boolean;
}

const MAX_SIZE = 8 * 1024 * 1024; // 8MB
const ACCEPTED = ".jpg,.jpeg,.png,.webp";

export function ApplianceLabelStep({
  imageUrl,
  uploaded,
  onUpload,
  onRemove,
  onSkip,
  skipped,
}: ApplianceLabelStepProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (file: File) => {
    setError("");

    if (!file.type.match(/^image\/(jpeg|png|webp)$/)) {
      setError("Formato não suportado. Use JPG, PNG ou WEBP.");
      return;
    }

    if (file.size > MAX_SIZE) {
      setError("Arquivo muito grande. Máximo 8MB.");
      return;
    }

    setUploading(true);
    try {
      const ext = file.name.split(".").pop() || "jpg";
      const fileName = `appliance-labels/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

      const { error: uploadError } = await supabase.storage
        .from("quiz-uploads")
        .upload(fileName, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { data: urlData } = supabase.storage
        .from("quiz-uploads")
        .getPublicUrl(fileName);

      onUpload(urlData.publicUrl, file.name);
    } catch (err: any) {
      setError("Erro ao enviar. Tente novamente.");
      console.error("Upload error:", err);
    } finally {
      setUploading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
    e.target.value = "";
  };

  const handleRemove = () => {
    onRemove();
    setError("");
  };

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground leading-relaxed">
        Você pode tirar uma foto da etiqueta lateral, traseira ou da caixa do aparelho, desde que as informações estejam legíveis.
      </p>

      <input
        ref={inputRef}
        type="file"
        accept={ACCEPTED}
        capture="environment"
        className="hidden"
        onChange={handleChange}
      />

      {uploaded && imageUrl ? (
        <div className="space-y-3">
          <div className="relative rounded-xl overflow-hidden border-2 border-accent bg-card">
            <img
              src={imageUrl}
              alt="Etiqueta do aparelho"
              className="w-full max-h-64 object-contain bg-muted/30"
            />
            <button
              onClick={handleRemove}
              className="absolute top-2 right-2 p-1.5 rounded-full bg-destructive text-destructive-foreground shadow-md hover:bg-destructive/90 transition-colors"
              aria-label="Remover imagem"
            >
              <X size={16} />
            </button>
          </div>
          <div className="flex items-center gap-2 text-accent">
            <CheckCircle2 size={18} />
            <span className="text-sm font-semibold">Foto enviada com sucesso!</span>
          </div>
          <button
            onClick={() => inputRef.current?.click()}
            className="w-full py-3 rounded-xl border-2 border-border text-sm font-semibold text-muted-foreground hover:border-muted-foreground/30 transition-all active:scale-[0.97]"
          >
            Trocar imagem
          </button>
        </div>
      ) : (
        <button
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="w-full flex flex-col items-center gap-3 py-8 rounded-xl border-2 border-dashed border-quiz-border bg-card hover:border-muted-foreground/30 transition-all active:scale-[0.97] disabled:opacity-50"
        >
          {uploading ? (
            <>
              <div className="w-10 h-10 border-3 border-primary border-t-transparent rounded-full animate-spin" />
              <span className="text-sm font-semibold text-muted-foreground">Enviando...</span>
            </>
          ) : (
            <>
              <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center">
                <Camera size={28} className="text-primary" />
              </div>
              <span className="text-sm font-semibold text-foreground">Tirar foto ou escolher da galeria</span>
              <span className="text-xs text-muted-foreground">JPG, PNG ou WEBP • Máx. 8MB</span>
            </>
          )}
        </button>
      )}

      {error && (
        <p className="text-sm text-destructive font-medium">{error}</p>
      )}

      {/* Skip option */}
      {!uploaded && (
        <button
          onClick={onSkip}
          className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl border-2 text-left font-medium text-sm transition-all duration-200 active:scale-[0.97] ${
            skipped
              ? "border-quiz-selected bg-quiz-hover text-foreground shadow-sm"
              : "border-quiz-border bg-card text-foreground hover:border-muted-foreground/30"
          }`}
        >
          <ImageIcon size={18} className="text-muted-foreground flex-shrink-0" />
          <span>Não consigo enviar agora</span>
        </button>
      )}
    </div>
  );
}
