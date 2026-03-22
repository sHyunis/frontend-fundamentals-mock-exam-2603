import { css } from '@emotion/react';
import { Suspense } from 'react';
import dayjs from 'dayjs';
import { Text, Spacing } from '_tosslib/components';
import { colors } from '_tosslib/constants/colors';
import { ErrorBoundary } from 'shared/components/ErrorBoundary';
import { DatePicker } from '../../components/DatePicker';
import { TimeSelect } from '../../components/TimeSelect';
import { AttendeesInput } from '../../components/AttendeesInput';
import { EquipmentSelector } from './EquipmentSelector';
import { FloorSelectField } from './FloorSelectField';
import { START_TIME_OPTIONS, END_TIME_OPTIONS } from '../utils/time';
import { useBookingParams } from '../hooks/useBookingParams';
import { useUpdateBookingParam } from '../hooks/useUpdateBookingParam';
import { useFilterErrors } from '../hooks/useFilterErrors';

interface BookingFilterSectionProps {
  onFilterChange: () => void;
}

export function BookingFilterSection({ onFilterChange }: BookingFilterSectionProps) {
  const params = useBookingParams();
  const updateParam = useUpdateBookingParam();
  const filterErrors = useFilterErrors({ start: params.start, end: params.end, attendees: params.attendees });

  const handleChange = (partial: Partial<typeof params>) => {
    updateParam(partial);
    onFilterChange();
  };

  return (
    <section css={sectionStyle}>
      <Text typography="t5" fontWeight="bold" color={colors.grey900}>
        예약 조건
      </Text>
      <Spacing size={16} />

      <DatePicker
        label="날짜"
        value={params.date}
        onChange={e => handleChange({ date: e.target.value })}
        min={dayjs().format('YYYY-MM-DD')}
      />
      <Spacing size={14} />

      <div css={rowStyle}>
        <TimeSelect
          label="시작 시간"
          options={START_TIME_OPTIONS}
          value={params.start}
          onChange={e => handleChange({ start: e.target.value })}
        />
        <TimeSelect
          label="종료 시간"
          options={END_TIME_OPTIONS}
          value={params.end}
          onChange={e => handleChange({ end: e.target.value })}
        />
      </div>

      {filterErrors.time && (
        <>
          <Spacing size={6} />
          <Text typography="t7" color={colors.red500} role="alert">
            {filterErrors.time}
          </Text>
        </>
      )}
      <Spacing size={14} />

      <div css={rowStyle}>
        <AttendeesInput
          label="참석 인원"
          value={params.attendees}
          onChange={e => handleChange({ attendees: Number(e.target.value) || 1 })}
        />
        <ErrorBoundary fallback={<FloorSelectField.Error />}>
          <Suspense fallback={<FloorSelectField.Loading />}>
            <FloorSelectField
              value={params.preferredFloor}
              onChange={value => handleChange({ preferredFloor: value })}
            />
          </Suspense>
        </ErrorBoundary>
      </div>

      {filterErrors.attendees && (
        <>
          <Spacing size={6} />
          <Text typography="t7" color={colors.red500} role="alert">
            {filterErrors.attendees}
          </Text>
        </>
      )}
      <Spacing size={14} />

      <EquipmentSelector
        label="필요 장비"
        value={params.equipment}
        onChange={value => handleChange({ equipment: value })}
      />
    </section>
  );
}

const sectionStyle = css`
  padding: 0 24px;
`;

const rowStyle = css`
  display: flex;
  gap: 12px;
`;
