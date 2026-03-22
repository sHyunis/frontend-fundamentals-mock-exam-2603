import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ROUTES } from '../../routes.constants';
import { useToast } from 'shared/components/Toast';
import { useBookingParams } from './useBookingParams';
import { useFilterErrors } from './useFilterErrors';
import { useCreateReservation } from './useCreateReservation';

export interface UseBookingFormReturn {
  isFilterValid: boolean;
  errorMessage: string | null;
  isPendingBooking: boolean;
  selectedRoomId: string | null;
  handleRoomSelect: (roomId: string) => void;
  handleFilterChange: () => void;
  handleSubmit: () => Promise<void>;
}

export function useBookingForm(): UseBookingFormReturn {
  const navigate = useNavigate();
  const toast = useToast();
  const params = useBookingParams();
  const createMutation = useCreateReservation();

  const [selectedRoomId, setSelectedRoomId] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const filterErrors = useFilterErrors({ start: params.start, end: params.end, attendees: params.attendees });
  const hasEmptyTime = params.start === '' || params.end === '';
  const isFilterValid = filterErrors.time === null && filterErrors.attendees === null && !hasEmptyTime;

  const handleRoomSelect = useCallback((roomId: string) => {
    setSelectedRoomId(roomId);
    setErrorMessage(null);
  }, []);

  const handleFilterChange = useCallback(() => {
    setSelectedRoomId(null);
    setErrorMessage(null);
  }, []);

  const handleSubmit = async () => {
    if (!selectedRoomId) {
      setErrorMessage('회의실을 선택해주세요.');
      return;
    }
    if (!params.start || !params.end) {
      setErrorMessage('시작 시간과 종료 시간을 선택해주세요.');
      return;
    }

    try {
      const result = await createMutation.mutateAsync({
        roomId: selectedRoomId,
        date: params.date,
        start: params.start,
        end: params.end,
        attendees: params.attendees,
        equipment: params.equipment,
      });

      if (result.ok) {
        toast.success('예약이 완료되었습니다!');
        navigate(ROUTES.HOME);
        return;
      }

      setErrorMessage(result.message ?? '예약에 실패했습니다.');
      setSelectedRoomId(null);
    } catch (err: unknown) {
      const serverMessage = axios.isAxiosError(err)
        ? (err.response?.data as { message?: string } | undefined)?.message ?? '예약에 실패했습니다.'
        : '예약에 실패했습니다.';
      setErrorMessage(serverMessage);
      setSelectedRoomId(null);
    }
  };

  return {
    isFilterValid,
    errorMessage,
    isPendingBooking: createMutation.isPending,
    selectedRoomId,
    handleRoomSelect,
    handleFilterChange,
    handleSubmit,
  };
}
