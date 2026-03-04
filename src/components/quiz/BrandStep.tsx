import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { QuizInput } from "./QuizInput";

const BRANDS = [
  "Samsung",
  "LG",
  "Springer Midea",
  "Gree",
  "Daikin",
  "Fujitsu",
  "Hitachi",
  "Carrier",
  "Consul",
  "Electrolux",
  "Philco",
  "Elgin",
  "Agratto",
  "Comfee",
  "TCL",
  "Outra",
];

interface BrandStepProps {
  value: string;
  onChange: (val: string) => void;
}

export function BrandStep({ value, onChange }: BrandStepProps) {
  const isOther = value !== "" && !BRANDS.slice(0, -1).includes(value);
  const [showCustom, setShowCustom] = useState(isOther && value !== "Outra");

  const selectedValue = showCustom ? "Outra" : value;

  const handleSelect = (brand: string) => {
    if (brand === "Outra") {
      setShowCustom(true);
      onChange("");
    } else {
      setShowCustom(false);
      onChange(brand);
    }
  };

  return (
    <div className="flex flex-col gap-3">
      <Select value={selectedValue} onValueChange={handleSelect}>
        <SelectTrigger className="w-full h-12 rounded-xl border-2 border-quiz-border bg-card text-foreground text-base">
          <SelectValue placeholder="Selecione a marca…" />
        </SelectTrigger>
        <SelectContent className="max-h-64">
          {BRANDS.map((brand) => (
            <SelectItem key={brand} value={brand} className="text-base py-2">
              {brand}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {showCustom && (
        <div className="mt-1">
          <QuizInput
            value={value}
            onChange={onChange}
            placeholder="Digite a marca…"
            maxLength={20}
            minLength={2}
          />
        </div>
      )}
    </div>
  );
}
