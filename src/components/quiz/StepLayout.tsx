import { ArrowLeft } from "lucide-react";

interface StepLayoutProps {
  title: string;
  subtitle?: string;
  stepNumber: number;
  totalSteps: number;
  showBack: boolean;
  onBack: () => void;
  canGoNext: boolean;
  onNext: () => void;
  nextLabel?: string;
  children: React.ReactNode;
  hideFooter?: boolean;
}

export function StepLayout({
  title,
  subtitle,
  stepNumber,
  totalSteps,
  showBack,
  onBack,
  canGoNext,
  onNext,
  nextLabel = "CONTINUAR",
  children,
  hideFooter = false,
}: StepLayoutProps) {
  const progress = totalSteps > 0 ? (stepNumber / totalSteps) * 100 : 0;

  return (
    <div className="flex flex-col min-h-[100dvh] bg-background">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-card border-b border-border px-4 pt-3 pb-2">
        <div className="flex items-center gap-3 mb-2">
          {showBack ? (
            <button
              onClick={onBack}
              className="p-1 -ml-1 text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Voltar"
            >
              <ArrowLeft size={20} />
            </button>
          ) : (
            <div className="w-5" />
          )}
          <span className="text-xs font-semibold text-muted-foreground tracking-wide">
            {stepNumber}/{totalSteps}
          </span>
        </div>
        {/* Progress bar */}
        <div className="h-1.5 rounded-full bg-progress-track overflow-hidden">
          <div
            className="h-full rounded-full bg-progress-fill transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 px-5 pt-6 pb-28 overflow-y-auto">
        <h2 className="text-xl font-bold text-foreground mb-1 leading-tight">
          {title}
        </h2>
        {subtitle && (
          <p className="text-sm text-muted-foreground mb-5">{subtitle}</p>
        )}
        <div className="mt-4">{children}</div>
      </div>

      {/* Fixed bottom button */}
      {!hideFooter && (
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-card border-t border-border">
          <button
            onClick={onNext}
            disabled={!canGoNext}
            className="w-full py-3.5 rounded-xl font-bold text-base tracking-wide transition-all duration-200 bg-primary text-primary-foreground disabled:opacity-40 disabled:cursor-not-allowed active:scale-[0.98]"
          >
            {nextLabel}
          </button>
        </div>
      )}
    </div>
  );
}
