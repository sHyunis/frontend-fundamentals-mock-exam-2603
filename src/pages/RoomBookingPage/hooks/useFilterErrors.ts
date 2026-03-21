import { useMemo } from 'react';
import { useWatch, type Control } from 'react-hook-form';
import { isValidTimeRange } from '../utils/time';
import type { BookingFormData } from '../types';

export interface FilterErrors {
  time: string | null;
  attendees: string | null;
}

interface UseFilterErrorsOptions {
  control?: Control<BookingFormData>;
}

export function useFilterErrors(options?: UseFilterErrorsOptions): FilterErrors {
  const start = useWatch<BookingFormData, 'start'>({ name: 'start', control: options?.control });
  const end = useWatch<BookingFormData, 'end'>({ name: 'end', control: options?.control });
  const attendees = useWatch<BookingFormData, 'attendees'>({ name: 'attendees', control: options?.control });

  const hasTimeInputs = start !== '' && end !== '';

  return useMemo((): FilterErrors => {
    const timeError = hasTimeInputs && !isValidTimeRange(start, end)
      ? '종료 시간은 시작 시간보다 늦어야 합니다.'
      : null;

    const attendeesError = attendees < 1
      ? '참석 인원은 1명 이상이어야 합니다.'
      : null;

    return {
      time: timeError,
      attendees: attendeesError,
    };
  }, [hasTimeInputs, start, end, attendees]);
}
