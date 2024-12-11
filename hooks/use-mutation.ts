import { staffApi } from '@/config/api';
import { useMutation } from '@tanstack/react-query';

export const useGetStaffPendingMutation = (cageId: string) =>
  useMutation({
    mutationFn: () => {
      return staffApi.getStaffWithCountTask(cageId);
    },
    onSuccess(data, variables, context) {
      console.log('Success:', data);
    },
  });
