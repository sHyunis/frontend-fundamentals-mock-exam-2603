import { css } from '@emotion/react';
import { Suspense } from 'react';
import { useFormContext, useWatch, Controller } from 'react-hook-form';
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
import { useSearchParamsSync } from '../hooks/useSearchParamsSync';
import { useFilterErrors } from '../hooks/useFilterErrors';
import type { BookingFormData } from '../types';

export function BookingFilterSection() {
  const { register, control, setValue, clearErrors } = useFormContext<BookingFormData>();
  const values = useWatch({ control }) as BookingFormData;
  const syncSearchParams = useSearchParamsSync();
  const filterErrors = useFilterErrors();

  const handleFieldChange = () => {
    setValue('roomId', null);
    clearErrors('root');
  };

  const handleControllerChange = <K extends keyof BookingFormData>(key: K, value: BookingFormData[K]) => {
    setValue(key, value as never);
    handleFieldChange();
    syncSearchParams({ ...values, [key]: value });
  };

  return (
    <section css={sectionStyle}>
      <Text typography="t5" fontWeight="bold" color={colors.grey900}>
        예약 조건
      </Text>
      <Spacing size={16} />

      <DatePicker
        label="날짜"
        {...register('date', {
          onChange: (e) => {
            handleFieldChange();
            syncSearchParams({ ...values, date: e.target.value });
          },
        })}
        min={dayjs().format('YYYY-MM-DD')}
      />
      <Spacing size={14} />

      <div css={rowStyle}>
        <Controller
          control={control}
          name="start"
          render={({ field }) => (
            <TimeSelect
              label="시작 시간"
              options={START_TIME_OPTIONS}
              value={field.value}
              onChange={(e) => {
                field.onChange(e.target.value);
                handleFieldChange();
                syncSearchParams({ ...values, start: e.target.value });
              }}
            />
          )}
        />
        <Controller
          control={control}
          name="end"
          render={({ field }) => (
            <TimeSelect
              label="종료 시간"
              options={END_TIME_OPTIONS}
              value={field.value}
              onChange={(e) => {
                field.onChange(e.target.value);
                handleFieldChange();
                syncSearchParams({ ...values, end: e.target.value });
              }}
            />
          )}
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
          {...register('attendees', {
            valueAsNumber: true,
            onChange: (e) => {
              handleFieldChange();
              syncSearchParams({ ...values, attendees: Number(e.target.value) });
            },
          })}
        />
        <ErrorBoundary fallback={<FloorSelectField.Error />}>
          <Suspense fallback={<FloorSelectField.Loading />}>
            <FloorSelectField onFilterChange={handleControllerChange} />
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

      <Controller
        control={control}
        name="equipment"
        render={({ field }) => (
          <EquipmentSelector
            label="필요 장비"
            value={field.value}
            onChange={(value) => handleControllerChange('equipment', value)}
          />
        )}
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
