import { useMemo } from 'react';
import { isValidTimeRange } from '../utils/time';

export interface FilterErrors {
  time: string | null;
  attendees: string | null;
}

interface UseFilterErrorsParams {
  start: string;
  end: string;
  attendees: number;
}

export function useFilterErrors({ start, end, attendees }: UseFilterErrorsParams): FilterErrors {
  const hasTimeInputs = start !== '' && end !== '';

  return useMemo((): FilterErrors => {
    const timeError =
      hasTimeInputs && !isValidTimeRange(start, end) ? '종료 시간은 시작 시간보다 늦어야 합니다.' : null;

    const attendeesError = attendees < 1 ? '참석 인원은 1명 이상이어야 합니다.' : null;

    return {
      time: timeError,
      attendees: attendeesError,
    };
  }, [hasTimeInputs, start, end, attendees]);
}
