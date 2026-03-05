import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { ArrowLeft, Shield } from "lucide-react";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const { data, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) {
      setError("Email ou senha inválidos.");
      setLoading(false);
      return;
    }

    // Check admin role
    const { data: roles } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", data.user.id)
      .eq("role", "admin");

    if (!roles || roles.length === 0) {
      setError("Acesso restrito a administradores.");
      await supabase.auth.signOut();
      setLoading(false);
      return;
    }

    navigate("/admin");
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center px-4">
      {/* Rich contextual background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[hsl(210,40%,12%)] via-[hsl(200,50%,8%)] to-[hsl(210,35%,6%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,hsl(200,80%,44%,0.15),transparent_60%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,hsl(168,65%,42%,0.1),transparent_60%)]" />
      <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23fff\' fill-opacity=\'1\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")' }} />

      {/* Back button */}
      <Link
        to="/"
        className="absolute top-6 left-6 z-20 flex items-center gap-2 text-sm text-white/60 hover:text-white transition-colors"
      >
        <ArrowLeft size={18} />
        <span>Voltar ao site</span>
      </Link>

      {/* Login card — elevated with glow */}
      <div className="relative z-10 w-full max-w-sm rounded-2xl border border-white/10 bg-white/[0.06] backdrop-blur-xl p-7 shadow-2xl shadow-black/40 ring-1 ring-white/5">
        <div className="absolute -inset-px rounded-2xl bg-gradient-to-b from-white/10 to-transparent pointer-events-none" />

        <div className="relative">
          <div className="flex items-center gap-3 mb-1">
            <div className="w-9 h-9 rounded-xl bg-primary/20 flex items-center justify-center">
              <Shield size={18} className="text-primary" />
            </div>
            <h1 className="text-xl font-bold text-white">Área Administrativa</h1>
          </div>
          <p className="text-sm text-white/50 mb-6 ml-12">Faça login para continuar</p>

          <form onSubmit={handleLogin} className="space-y-4">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-white/10 bg-white/[0.06] text-white placeholder:text-white/30 text-sm focus:outline-none focus:border-primary/60 focus:ring-1 focus:ring-primary/30 transition-all"
              required
            />
            <input
              type="password"
              placeholder="Senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-white/10 bg-white/[0.06] text-white placeholder:text-white/30 text-sm focus:outline-none focus:border-primary/60 focus:ring-1 focus:ring-primary/30 transition-all"
              required
            />
            {error && <p className="text-sm text-red-400">{error}</p>}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl font-bold text-base bg-primary text-primary-foreground disabled:opacity-50 transition-all hover:brightness-110"
            >
              {loading ? "Entrando…" : "ENTRAR"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
