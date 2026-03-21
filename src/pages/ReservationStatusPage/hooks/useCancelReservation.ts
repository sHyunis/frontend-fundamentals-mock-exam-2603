import { useMutation, useQueryClient } from '@tanstack/react-query';
import { cancelReservation } from 'pages/remotes';

interface CancelReservationParams {
  id: string;
  date: string;
}

export function useCancelReservation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (params: CancelReservationParams) => cancelReservation(params.id),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['reservations', variables.date] });
      queryClient.invalidateQueries({ queryKey: ['myReservations'] });
    },
  });
}
