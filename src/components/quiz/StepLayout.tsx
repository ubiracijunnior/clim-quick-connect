import { useEffect, useCallback } from "react";
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

const isFormEl = (el: Element | null): boolean => {
  if (!el) return false;
  const tag = el.tagName?.toLowerCase();
  return tag === "input" || tag === "textarea" || tag === "select";
};

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

  // Blur active field before advancing
  const handleNext = useCallback(() => {
    if (document.activeElement && isFormEl(document.activeElement)) {
      (document.activeElement as HTMLElement).blur();
    }
    setTimeout(() => {
      onNext();
    }, 50);
  }, [onNext]);

  // Scroll focused field into view + lift footer on iOS keyboard
  useEffect(() => {
    const onFocusIn = (e: FocusEvent) => {
      const target = e.target as Element;
      if (!isFormEl(target)) return;
      setTimeout(() => {
        try {
          target.scrollIntoView({ behavior: "smooth", block: "center" });
        } catch {}
      }, 250);
    };
    document.addEventListener("focusin", onFocusIn);

    const vv = window.visualViewport;
    let cleanupVV: (() => void) | null = null;
    if (vv) {
      const handleVV = () => {
        const footer = document.querySelector(".quiz-footer") as HTMLElement | null;
        if (!footer) return;
        const heightDiff = window.innerHeight - vv.height;
        footer.style.transform = heightDiff > 0 ? `translateY(-${heightDiff}px)` : "translateY(0px)";
      };
      vv.addEventListener("resize", handleVV);
      vv.addEventListener("scroll", handleVV);
      cleanupVV = () => {
        vv.removeEventListener("resize", handleVV);
        vv.removeEventListener("scroll", handleVV);
      };
    }

    return () => {
      document.removeEventListener("focusin", onFocusIn);
      if (cleanupVV) cleanupVV();
    };
  }, []);

  return (
    <div className="quiz-screen bg-background">
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
      <div className="quiz-content px-5 pt-6 pb-28">
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
        <div className="quiz-footer">
          <button
            onClick={handleNext}
            disabled={!canGoNext}
            className="primary-button py-3.5 rounded-xl font-bold text-base tracking-wide transition-all duration-200 bg-primary text-primary-foreground disabled:opacity-40 disabled:cursor-not-allowed active:scale-[0.98]"
          >
            {nextLabel}
          </button>
        </div>
      )}
    </div>
  );
}