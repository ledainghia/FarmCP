export type UserDTO = {
  userId: string;
  fullName: string;
  email: string;
  phoneNumber: string;
};

export type TaskTypeDTO = {
  taskTypeId: string;
  taskTypeName: string;
};

export type TaskDTO = {
  id: string;
  cageId: string;
  cageName: string;
  taskName: string;
  description: string;
  priorityNum: number;
  dueDate: Date;
  status: string;
  session: number;
  completedAt: string | null;
  createdAt: string;
  assignedToUser: UserDTO;
  taskType: TaskTypeDTO;
  statusLogs: any[];
};
