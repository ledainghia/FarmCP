export type FilterDTO = {
  TaskName?: string;
  Status?: string;
  TaskTypeId?: string;
  CageId?: string;
  AssignedToUserId?: string;
  DueDateFrom?: string;
  DueDateTo?: string;
  PriorityNum?: number;
  Session?: number;
  PageNumber?: number;
  PageSize?: number;
};
