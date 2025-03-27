export type Variant = {
  id: string | number;
  options: string[];
};

export type Product = {
  id: string | number;
  variants: Variant[];
  selected_or_first_available_variant: Variant;
};
