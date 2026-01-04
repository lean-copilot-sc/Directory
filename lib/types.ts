export interface Field {
  id: string;
  name: string;
  type: 'text' | 'textarea' | 'number' | 'choice-radio' | 'choice-checkbox' | 'choice-select' | 'date' | 'file' | 'address' | 'rich-text';
  options?: string[];
  navigable?: boolean;
  filterable?: boolean;
  sortable?: boolean;
  group?: string;
  page?: string; // Page name for multi-page forms
  notes?: string;
  required?: boolean;
  displayInListing?: boolean;
  dateConfig?: {
    includeTime?: boolean;
    defaultToToday?: boolean;
    format?: 'MM/DD/YYYY' | 'DD/MM/YYYY' | 'YYYY-MM-DD';
  };
}

export interface DirectoryRecord {
  id: string;
  ownerId: string;
  category: 'Premium' | 'Executive' | 'Boutique';
  // Core fields mandated by requirements
  name: string;
  address: string;
  image: string;
  // Dynamic fields keyed by FieldID
  data: Record<string, any>;
}

export type Role = 'Admin' | 'Owner' | 'User';

export interface SystemConfig {
  settingId: string;
  logo: string;
  heroImage: string; // New
  heroText: string;  // New
  primaryColor: string;
  accentColor: string;
  defaultLayout: 'Grid' | 'List';
  anonymousAccess: boolean; // New
}

export interface Schema {
  fields: Field[];
}
