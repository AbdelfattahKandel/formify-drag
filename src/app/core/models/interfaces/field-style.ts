export interface FieldStyle {
  cssClass?: string;
  columns?: number;
  width?: string;
  minWidth?: string;
  maxWidth?: string;
  margin?: string;
  padding?: string;
  textAlign?: 'left' | 'right' | 'center' | 'justify' | 'start' | 'end';
  labelPosition?: 'top' | 'left' | 'right' | 'floating' | 'hidden';
  helperText?: string;
  requiredMark?: boolean;
  backgroundColor?: string;
  border?: string;
  borderRadius?: string;
  boxShadow?: string;
}
