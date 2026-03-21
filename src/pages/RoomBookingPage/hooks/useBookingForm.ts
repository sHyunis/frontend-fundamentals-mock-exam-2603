import { useForm, useWatch, UseFormReturn } from 'react-hook-form';
import { useSearchParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ROUTES } from '../../routes.constants';
import { useToast } from 'shared/components/Toast';
import { parseSearchParams } from '../utils/searchParams';
import { useCreateReservation } from './useCreateReservation';
import { useFilterErrors } from './useFilterErrors';
import type { BookingFormData } from '../types';

export interface UseBookingFormReturn {
  form: UseFormReturn<BookingFormData>;
  filterErrorMessage: string | null;
  submitErrorMessage: string | null;
  isSubmitDisabled: boolean;
  isPendingBooking: boolean;
  selectedRoomId: string | null;
  handleRoomSelect: (roomId: string) => void;
  handleSubmit: () => Promise<void>;
}

export function useBookingForm(): UseBookingFormReturn {
  const [searchParams] = useSearchParams();

  const navigate = useNavigate();
  const toast = useToast();

  const createMutation = useCreateReservation();

  const form = useForm<BookingFormData>({
    defaultValues: {
      ...parseSearchParams(searchParams),
      roomId: null,
    },
    mode: 'onChange',
  });

  const { setValue, setError, clearErrors, control, getValues } = form;

  const start = useWatch({ control, name: 'start' });
  const end = useWatch({ control, name: 'end' });
  const roomId = useWatch({ control, name: 'roomId' });

  const filterErrors = useFilterErrors({ control });
  const hasEmptyTime = start === '' || end === '';

  const filterErrorMessage =
    filterErrors.time ?? filterErrors.attendees ?? (hasEmptyTime ? '시작 시간과 종료 시간을 선택해주세요.' : null);

  const isSubmitDisabled = filterErrorMessage != null;

  const submitError = form.formState.errors.root?.message ?? null;

  const handleRoomSelect = (roomId: string) => {
    setValue('roomId', roomId);
    clearErrors('root');
  };

  const setSubmitError = (message: string) => {
    setError('root', { message });
    setValue('roomId', null);
  };

  const handleSubmit = async () => {
    const current = getValues();

    if (!current.roomId) {
      setSubmitError('회의실을 선택해주세요.');
      return;
    }
    if (!current.start || !current.end) {
      setSubmitError('시작 시간과 종료 시간을 선택해주세요.');
      return;
    }

    try {
      const result = await createMutation.mutateAsync({
        roomId: current.roomId,
        date: current.date,
        start: current.start,
        end: current.end,
        attendees: current.attendees,
        equipment: current.equipment,
      });

      if (result.ok) {
        toast.success('예약이 완료되었습니다!');
        navigate(ROUTES.HOME);
        return;
      }

      setSubmitError(result.message ?? '예약에 실패했습니다.');
    } catch (err: unknown) {
      const serverMessage = axios.isAxiosError(err)
        ? (err.response?.data as { message?: string } | undefined)?.message ?? '예약에 실패했습니다.'
        : '예약에 실패했습니다.';
      setSubmitError(serverMessage);
    }
  };

  return {
    form,
    filterErrorMessage,
    submitErrorMessage: submitError,
    isSubmitDisabled,
    isPendingBooking: createMutation.isPending,
    selectedRoomId: roomId,
    handleRoomSelect,
    handleSubmit,
  };
}
