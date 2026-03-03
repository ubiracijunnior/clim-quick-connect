import { useNavigate } from "react-router-dom";

export function HomeFooter() {
  const navigate = useNavigate();

  return (
    <footer className="w-full max-w-[480px] mx-auto px-4 py-6 border-t border-border">
      <div className="flex items-center justify-between">
        <p className="text-xs text-muted-foreground">
          © {new Date().getFullYear()} CLIM TECH
        </p>
        <button
          onClick={() => navigate("/admin-login")}
          className="text-[11px] text-muted-foreground/50 hover:text-muted-foreground transition-colors"
        >
          Área do Admin
        </button>
      </div>
    </footer>
  );
}
