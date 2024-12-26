export type DataProps = {
  id: string;
  name: string;
  staffName: string;
  staffId: string;
  detail: string;
  expandedContent?: React.ReactNode;
  action: React.ReactNode;
  defaultCapacity?: number;
};
