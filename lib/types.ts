export interface PaletteColor {
  name: string;
  hex: string;
  role?: string;
}

export interface Palette {
  name: string;
  subtitle: string;
  colors: PaletteColor[];
  comment: string;
  tags?: string[];
}
