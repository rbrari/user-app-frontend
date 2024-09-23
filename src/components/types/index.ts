export enum InputType {
  TEXT = 'text',
  EMAIL = 'email',
  DATE = 'date',
  SELECT = 'select'
}

export enum TableAction {
  EDIT = 'edit',
  DELETE = 'delete'
}

export interface TableColumn {
  key: string;
  label: string;
  renderFunction?: (value: any) => string;
}

export type TableRow = Record<string, unknown> & { id: string };
