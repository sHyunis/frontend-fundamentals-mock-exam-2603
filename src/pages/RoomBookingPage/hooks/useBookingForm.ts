import { useMemo } from 'react';
import { useForm, useWatch, UseFormReturn } from 'react-hook-form';
import { useSearchParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ROUTES } from '../../routes.constants';
import { useToast } from 'shared/components/Toast';
import { isValidTimeRange } from '../utils/time';
import { parseSearchParams } from '../utils/searchParams';
import { useCreateReservation } from './useCreateReservation';
import type { BookingFormData } from '../types';

export interface UseBookingFormReturn {
  form: UseFormReturn<BookingFormData>;
  values: BookingFormData;
  filterErrorMessage: string | null;
  submitErrorMessage: string | null;
  isSubmitDisabled: boolean;
  isPendingBooking: boolean;
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

  const { setValue, setError, clearErrors, control } = form;

  const values = useWatch({ control }) as BookingFormData;

  const filterErrorMessage = useMemo(() => {
    if (values.start === '' || values.end === '') {
      return '시작 시간과 종료 시간을 선택해주세요.';
    }
    if (!isValidTimeRange(values.start, values.end)) {
      return '종료 시간은 시작 시간보다 늦어야 합니다.';
    }
    if (values.attendees < 1) {
      return '참석 인원을 1명 이상 입력해주세요.';
    }
    return null;
  }, [values.start, values.end, values.attendees]);

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
    if (!values.roomId) {
      setSubmitError('회의실을 선택해주세요.');
      return;
    }
    if (!values.start || !values.end) {
      setSubmitError('시작 시간과 종료 시간을 선택해주세요.');
      return;
    }

    try {
      const result = await createMutation.mutateAsync({
        roomId: values.roomId,
        date: values.date,
        start: values.start,
        end: values.end,
        attendees: values.attendees,
        equipment: values.equipment,
      });

      if ('ok' in result && result.ok) {
        toast.success('예약이 완료되었습니다!');
        navigate(ROUTES.HOME);
        return;
      }

      const errResult = result as { message?: string };
      setSubmitError(errResult.message ?? '예약에 실패했습니다.');
    } catch (err: unknown) {
      const serverMessage = axios.isAxiosError(err)
        ? (err.response?.data as { message?: string } | undefined)?.message ?? '예약에 실패했습니다.'
        : '예약에 실패했습니다.';
      setSubmitError(serverMessage);
    }
  };

  return {
    form,
    values,
    filterErrorMessage,
    submitErrorMessage: submitError,
    isSubmitDisabled,
    isPendingBooking: createMutation.isPending,
    handleRoomSelect,
    handleSubmit,
  };
}
