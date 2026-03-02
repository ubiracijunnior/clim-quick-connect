import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

interface City {
  id: string;
  name: string;
}

interface Neighborhood {
  id: string;
  name: string;
  city_id: string;
}

interface VisitFee {
  neighborhood_id: string;
  fee_value: number;
}

export function useCities() {
  const [cities, setCities] = useState<City[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from("cities")
      .select("id, name")
      .order("name")
      .then(({ data }) => {
        setCities((data as City[]) || []);
        setLoading(false);
      });
  }, []);

  return { cities, loading };
}

export function useNeighborhoods(cityId: string | null) {
  const [neighborhoods, setNeighborhoods] = useState<Neighborhood[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!cityId) {
      setNeighborhoods([]);
      return;
    }
    setLoading(true);
    supabase
      .from("neighborhoods")
      .select("id, name, city_id")
      .eq("city_id", cityId)
      .eq("active", true)
      .order("name")
      .then(({ data }) => {
        setNeighborhoods((data as Neighborhood[]) || []);
        setLoading(false);
      });
  }, [cityId]);

  return { neighborhoods, loading };
}

export async function fetchVisitFee(neighborhoodId: string): Promise<number> {
  const { data } = await supabase
    .from("visit_fees")
    .select("fee_value")
    .eq("neighborhood_id", neighborhoodId)
    .single();
  return (data as VisitFee | null)?.fee_value ?? 0;
}
