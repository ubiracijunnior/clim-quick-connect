import { useCities, useNeighborhoods } from "@/hooks/useCityNeighborhoods";
import { ChevronDown } from "lucide-react";

interface CityNeighborhoodStepProps {
  cityId: string;
  neighborhoodId: string;
  endereco: string;
  onCityChange: (cityId: string, cityName: string) => void;
  onNeighborhoodChange: (neighborhoodId: string, neighborhoodName: string) => void;
  onEnderecoChange: (value: string) => void;
}

export function CityNeighborhoodStep({
  cityId,
  neighborhoodId,
  endereco,
  onCityChange,
  onNeighborhoodChange,
  onEnderecoChange,
}: CityNeighborhoodStepProps) {
  const { cities, loading: loadingCities } = useCities();
  const { neighborhoods, loading: loadingNeighborhoods } = useNeighborhoods(cityId || null);

  return (
    <div className="space-y-5">
      {/* City select */}
      <div>
        <label className="block text-sm font-semibold text-foreground mb-2">
          Cidade
        </label>
        <div className="relative">
          <select
            value={cityId}
            onChange={(e) => {
              const selected = cities.find((c) => c.id === e.target.value);
              if (selected) onCityChange(selected.id, selected.name);
            }}
            className="w-full appearance-none px-4 py-3.5 pr-10 rounded-xl border-2 border-quiz-border bg-card text-foreground font-medium text-sm focus:outline-none focus:border-quiz-selected transition-colors cursor-pointer"
          >
            <option value="">Selecione a cidade…</option>
            {loadingCities ? (
              <option disabled>Carregando…</option>
            ) : (
              cities.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))
            )}
          </select>
          <ChevronDown
            size={18}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
          />
        </div>
      </div>

      {/* Neighborhood select (only shows after city is selected) */}
      {cityId && (
        <div>
          <label className="block text-sm font-semibold text-foreground mb-2">
            Bairro
          </label>
          <div className="relative">
            <select
              value={neighborhoodId}
              onChange={(e) => {
                const selected = neighborhoods.find((n) => n.id === e.target.value);
                if (selected) onNeighborhoodChange(selected.id, selected.name);
              }}
              className="w-full appearance-none px-4 py-3.5 pr-10 rounded-xl border-2 border-quiz-border bg-card text-foreground font-medium text-sm focus:outline-none focus:border-quiz-selected transition-colors cursor-pointer"
            >
              <option value="">Selecione o bairro…</option>
              {loadingNeighborhoods ? (
                <option disabled>Carregando…</option>
              ) : (
                neighborhoods.map((n) => (
                  <option key={n.id} value={n.id}>
                    {n.name}
                  </option>
                ))
              )}
            </select>
            <ChevronDown
              size={18}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
            />
          </div>
        </div>
      )}

      {/* Address field (only shows after neighborhood is selected) */}
      {neighborhoodId && (
        <div>
          <label className="block text-sm font-semibold text-foreground mb-2">
            Endereço, número e ponto de referência
          </label>
          <input
            type="text"
            value={endereco}
            onChange={(e) => {
              if (e.target.value.length <= 100) {
                onEnderecoChange(e.target.value);
              }
            }}
            placeholder="Ex: Rua das Flores, 123 — próximo ao mercado"
            className="w-full px-4 py-3.5 rounded-xl border-2 border-quiz-border bg-card text-foreground placeholder:text-muted-foreground font-medium text-sm focus:outline-none focus:border-quiz-selected transition-colors"
            maxLength={100}
          />
          <p className="text-xs text-muted-foreground mt-1.5 text-right">
            {endereco.length}/100
          </p>
        </div>
      )}
    </div>
  );
}
