export interface ContainerStyle {
  cssClass?: string;
  columns?: number;
  gap?: string;
  dir?: 'ltr' | 'rtl';
  padding?: string;
  margin?: string;
  width?: string;
  height?: string;
  minWidth?: string;
  maxWidth?: string;
  minHeight?: string;
  maxHeight?: string;
  display?: 'block' | 'flex' | 'grid';
  justifyContent?: string;
  alignItems?: string;
  backgroundColor?: string;
  border?: string;
  borderRadius?: string;
  boxShadow?: string;
  overflow?: 'visible' | 'hidden' | 'scroll' | 'auto';
}
