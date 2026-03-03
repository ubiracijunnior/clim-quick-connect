import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { ArrowLeft, Copy, Save, Search, LogOut } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface City {
  id: string;
  name: string;
}

interface NeighborhoodWithFee {
  id: string;
  name: string;
  fee_id: string | null;
  fee_value: number;
}

export default function Admin() {
  const navigate = useNavigate();
  const [cities, setCities] = useState<City[]>([]);
  const [selectedCityId, setSelectedCityId] = useState("");
  const [neighborhoods, setNeighborhoods] = useState<NeighborhoodWithFee[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [editingFees, setEditingFees] = useState<Record<string, string>>({});
  const [savingId, setSavingId] = useState<string | null>(null);
  const [copyModalFor, setCopyModalFor] = useState<string | null>(null);
  const [copySource, setCopySource] = useState("");
  const [bulkFee, setBulkFee] = useState("");

  // Auth check
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        navigate("/admin-login");
        return;
      }
      supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", session.user.id)
        .eq("role", "admin")
        .then(({ data: roles }) => {
          if (!roles || roles.length === 0) navigate("/admin-login");
        });
    });
  }, [navigate]);

  // Load cities
  useEffect(() => {
    supabase
      .from("cities")
      .select("id, name")
      .order("name")
      .then(({ data }) => {
        const c = (data as City[]) || [];
        setCities(c);
        if (c.length > 0) setSelectedCityId(c[0].id);
        setLoading(false);
      });
  }, []);

  // Load neighborhoods + fees
  const loadNeighborhoods = useCallback(async () => {
    if (!selectedCityId) return;
    const { data: neighs } = await supabase
      .from("neighborhoods")
      .select("id, name")
      .eq("city_id", selectedCityId)
      .eq("active", true)
      .order("name");

    const ids = (neighs || []).map((n: any) => n.id);
    const { data: fees } = await supabase
      .from("visit_fees")
      .select("id, neighborhood_id, fee_value")
      .in("neighborhood_id", ids.length > 0 ? ids : ["none"]);

    const feeMap = new Map((fees || []).map((f: any) => [f.neighborhood_id, f]));

    setNeighborhoods(
      (neighs || []).map((n: any) => {
        const fee = feeMap.get(n.id) as any;
        return {
          id: n.id,
          name: n.name,
          fee_id: fee?.id || null,
          fee_value: fee?.fee_value ?? 0,
        };
      })
    );
  }, [selectedCityId]);

  useEffect(() => {
    loadNeighborhoods();
  }, [loadNeighborhoods]);

  const handleSaveFee = async (neighborhoodId: string) => {
    const raw = editingFees[neighborhoodId];
    if (raw === undefined) return;
    const value = parseFloat(raw.replace(",", "."));
    if (isNaN(value) || value < 0) return;

    setSavingId(neighborhoodId);
    const existing = neighborhoods.find((n) => n.id === neighborhoodId);

    if (existing?.fee_id) {
      await supabase
        .from("visit_fees")
        .update({ fee_value: value })
        .eq("id", existing.fee_id);
    } else {
      await supabase
        .from("visit_fees")
        .insert({ neighborhood_id: neighborhoodId, fee_value: value });
    }

    setSavingId(null);
    setEditingFees((prev) => {
      const next = { ...prev };
      delete next[neighborhoodId];
      return next;
    });
    toast({ title: "Taxa salva!", description: `R$ ${value.toFixed(2)}` });
    loadNeighborhoods();
  };

  const handleCopyFee = async (targetId: string) => {
    if (!copySource) return;
    const source = neighborhoods.find((n) => n.id === copySource);
    if (!source) return;

    setEditingFees((prev) => ({ ...prev, [targetId]: source.fee_value.toFixed(2) }));
    setCopyModalFor(null);
    setCopySource("");
    toast({ title: "Valor copiado!", description: `R$ ${source.fee_value.toFixed(2)} — clique Salvar para confirmar` });
  };

  const handleBulkApply = async () => {
    const value = parseFloat(bulkFee.replace(",", "."));
    if (isNaN(value) || value < 0) return;

    for (const n of neighborhoods) {
      if (n.fee_id) {
        await supabase.from("visit_fees").update({ fee_value: value }).eq("id", n.fee_id);
      } else {
        await supabase.from("visit_fees").insert({ neighborhood_id: n.id, fee_value: value });
      }
    }
    setBulkFee("");
    toast({ title: "Taxa aplicada a todos os bairros desta cidade" });
    loadNeighborhoods();
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/admin-login");
  };

  const filtered = neighborhoods.filter((n) =>
    n.name.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <div className="p-8 text-muted-foreground">Carregando…</div>;

  return (
    <div className="min-h-screen relative">
      {/* Background pattern */}
      <div className="fixed inset-0 bg-gradient-to-br from-primary/10 via-background to-accent/10 -z-10" />
      <div className="fixed inset-0 opacity-[0.03] -z-10" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23000\' fill-opacity=\'1\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")' }} />
      {/* Header */}
      <div className="sticky top-0 z-10 bg-card border-b border-border px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate("/")} className="text-muted-foreground hover:text-foreground">
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-lg font-bold text-foreground">Taxas de Visita</h1>
        </div>
        <button onClick={handleLogout} className="text-muted-foreground hover:text-foreground flex items-center gap-1 text-sm">
          <LogOut size={16} /> Sair
        </button>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-6 space-y-5">
        {/* City filter */}
        <div>
          <label className="block text-sm font-semibold text-foreground mb-2">Cidade</label>
          <select
            value={selectedCityId}
            onChange={(e) => setSelectedCityId(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border-2 border-quiz-border bg-card text-foreground text-sm focus:outline-none focus:border-quiz-selected transition-colors"
          >
            {cities.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>

        {/* Search */}
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Buscar bairro…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 rounded-xl border-2 border-quiz-border bg-card text-foreground text-sm focus:outline-none focus:border-quiz-selected transition-colors"
          />
        </div>

        {/* Bulk apply */}
        <div className="flex gap-2 items-end">
          <div className="flex-1">
            <label className="block text-xs text-muted-foreground mb-1">Aplicar mesma taxa para todos</label>
            <input
              type="text"
              placeholder="R$ 0,00"
              value={bulkFee}
              onChange={(e) => setBulkFee(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl border-2 border-quiz-border bg-card text-foreground text-sm focus:outline-none focus:border-quiz-selected transition-colors"
            />
          </div>
          <button
            onClick={handleBulkApply}
            disabled={!bulkFee}
            className="px-4 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-semibold disabled:opacity-40"
          >
            Aplicar
          </button>
        </div>

        {/* Table */}
        <div className="bg-card rounded-2xl border border-border overflow-hidden shadow-lg shadow-primary/5">
          <div className="grid grid-cols-[1fr_auto_auto] gap-2 px-4 py-2.5 bg-muted text-xs font-semibold text-muted-foreground uppercase tracking-wide">
            <span>Bairro</span>
            <span className="w-24 text-center">Taxa (R$)</span>
            <span className="w-20 text-center">Ações</span>
          </div>

          {filtered.length === 0 && (
            <p className="px-4 py-6 text-sm text-muted-foreground text-center">Nenhum bairro encontrado</p>
          )}

          {filtered.map((n) => (
            <div key={n.id} className="grid grid-cols-[1fr_auto_auto] gap-2 items-center px-4 py-3 border-t border-border">
              <span className="text-sm font-medium text-foreground truncate">{n.name}</span>
              <input
                type="text"
                value={editingFees[n.id] ?? n.fee_value.toFixed(2)}
                onChange={(e) =>
                  setEditingFees((prev) => ({ ...prev, [n.id]: e.target.value }))
                }
                className="w-24 px-2 py-1.5 rounded-lg border border-border bg-background text-foreground text-sm text-center focus:outline-none focus:border-quiz-selected"
              />
              <div className="flex gap-1 w-20 justify-center">
                <button
                  onClick={() => handleSaveFee(n.id)}
                  disabled={editingFees[n.id] === undefined || savingId === n.id}
                  className="p-1.5 rounded-lg hover:bg-muted text-primary disabled:opacity-30 transition-colors"
                  title="Salvar"
                >
                  <Save size={16} />
                </button>
                <button
                  onClick={() => {
                    setCopyModalFor(n.id);
                    setCopySource("");
                  }}
                  className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground transition-colors"
                  title="Copiar de…"
                >
                  <Copy size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Copy modal */}
      {copyModalFor && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center px-4" onClick={() => setCopyModalFor(null)}>
          <div className="bg-card rounded-2xl border border-border p-5 w-full max-w-sm shadow-lg" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-base font-bold text-foreground mb-3">Copiar taxa de…</h3>
            <select
              value={copySource}
              onChange={(e) => setCopySource(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl border-2 border-quiz-border bg-card text-foreground text-sm mb-4"
            >
              <option value="">Selecione o bairro de origem</option>
              {neighborhoods
                .filter((n) => n.id !== copyModalFor)
                .map((n) => (
                  <option key={n.id} value={n.id}>
                    {n.name} — R$ {n.fee_value.toFixed(2)}
                  </option>
                ))}
            </select>
            <div className="flex gap-2">
              <button
                onClick={() => setCopyModalFor(null)}
                className="flex-1 py-2.5 rounded-xl border border-border text-sm font-medium text-foreground"
              >
                Cancelar
              </button>
              <button
                onClick={() => handleCopyFee(copyModalFor)}
                disabled={!copySource}
                className="flex-1 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-bold disabled:opacity-40"
              >
                Copiar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
