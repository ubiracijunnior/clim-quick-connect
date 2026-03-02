
-- Create cities table
CREATE TABLE public.cities (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.cities ENABLE ROW LEVEL SECURITY;

-- Everyone can read cities
CREATE POLICY "Cities are publicly readable"
  ON public.cities FOR SELECT
  USING (true);

-- Create neighborhoods table
CREATE TABLE public.neighborhoods (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  city_id UUID NOT NULL REFERENCES public.cities(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(city_id, name)
);

ALTER TABLE public.neighborhoods ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Neighborhoods are publicly readable"
  ON public.neighborhoods FOR SELECT
  USING (true);

-- Create visit_fees table
CREATE TABLE public.visit_fees (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  neighborhood_id UUID NOT NULL REFERENCES public.neighborhoods(id) ON DELETE CASCADE UNIQUE,
  fee_value NUMERIC(10,2) NOT NULL DEFAULT 0,
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_by UUID REFERENCES auth.users(id)
);

ALTER TABLE public.visit_fees ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Visit fees are publicly readable"
  ON public.visit_fees FOR SELECT
  USING (true);

-- Create role enum and user_roles table for admin access
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

CREATE TABLE public.user_roles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role app_role NOT NULL,
  UNIQUE(user_id, role)
);

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Users can read their own roles
CREATE POLICY "Users can read own roles"
  ON public.user_roles FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Security definer function to check roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- Admin policies for neighborhoods
CREATE POLICY "Admins can insert neighborhoods"
  ON public.neighborhoods FOR INSERT
  TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update neighborhoods"
  ON public.neighborhoods FOR UPDATE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- Admin policies for visit_fees
CREATE POLICY "Admins can insert visit fees"
  ON public.visit_fees FOR INSERT
  TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update visit fees"
  ON public.visit_fees FOR UPDATE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete visit fees"
  ON public.visit_fees FOR DELETE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- Seed cities
INSERT INTO public.cities (name) VALUES
  ('Salvador'),
  ('Camaçari'),
  ('Dias D''Ávila'),
  ('Candeias'),
  ('Mata de São João'),
  ('Vera Cruz'),
  ('Itaparica'),
  ('Lauro de Freitas'),
  ('Salinas das Margaridas');

-- Seed neighborhoods for Salvador
INSERT INTO public.neighborhoods (city_id, name)
SELECT c.id, n.name
FROM public.cities c,
LATERAL (VALUES
  ('Pituba'), ('Barra'), ('Ondina'), ('Rio Vermelho'), ('Itapuã'),
  ('Brotas'), ('Cabula'), ('Imbuí'), ('Paralela'), ('Piatã'),
  ('Stella Maris'), ('Patamares'), ('Boca do Rio'), ('Costa Azul'),
  ('Graça'), ('Canela'), ('Campo Grande'), ('Liberdade'),
  ('São Marcos'), ('Cajazeiras'), ('Pau da Lima'), ('Pernambués'),
  ('Sussuarana'), ('Narandiba'), ('Mussurunga'), ('Fazenda Grande'),
  ('Periperi'), ('Paripe'), ('Plataforma'), ('Subúrbio Ferroviário'),
  ('Centro Histórico'), ('Comércio'), ('Dois de Julho'), ('Nazaré'),
  ('Barris'), ('Federação'), ('Engenho Velho de Brotas'),
  ('Outros (a confirmar)')
) AS n(name)
WHERE c.name = 'Salvador';

-- Seed neighborhoods for Lauro de Freitas
INSERT INTO public.neighborhoods (city_id, name)
SELECT c.id, n.name
FROM public.cities c,
LATERAL (VALUES
  ('Vilas do Atlântico'), ('Ipitanga'), ('Portão'), ('Centro'),
  ('Itinga'), ('Caixa D''Água'), ('Vida Nova'), ('Buraquinho'),
  ('Outros (a confirmar)')
) AS n(name)
WHERE c.name = 'Lauro de Freitas';

-- Seed neighborhoods for Camaçari
INSERT INTO public.neighborhoods (city_id, name)
SELECT c.id, n.name
FROM public.cities c,
LATERAL (VALUES
  ('Centro'), ('Abrantes'), ('Jauá'), ('Guarajuba'), ('Monte Gordo'),
  ('Outros (a confirmar)')
) AS n(name)
WHERE c.name = 'Camaçari';

-- Seed neighborhoods for other cities (placeholder)
INSERT INTO public.neighborhoods (city_id, name)
SELECT c.id, 'Outros (a confirmar)'
FROM public.cities c
WHERE c.name IN ('Dias D''Ávila', 'Candeias', 'Mata de São João', 'Vera Cruz', 'Itaparica', 'Salinas das Margaridas');

-- Create visit_fees entries for all neighborhoods (default 0)
INSERT INTO public.visit_fees (neighborhood_id, fee_value)
SELECT id, 0 FROM public.neighborhoods;

-- Auto-update updated_at on visit_fees
CREATE OR REPLACE FUNCTION public.update_visit_fees_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_visit_fees_timestamp
  BEFORE UPDATE ON public.visit_fees
  FOR EACH ROW
  EXECUTE FUNCTION public.update_visit_fees_updated_at();
