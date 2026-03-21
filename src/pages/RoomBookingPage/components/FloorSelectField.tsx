import { css } from '@emotion/react';
import { useMemo } from 'react';
import { useWatch } from 'react-hook-form';
import { useSuspenseQuery } from '@tanstack/react-query';
import { Text, Spacing } from '_tosslib/components';
import { colors } from '_tosslib/constants/colors';
import { FloorSelect } from '../../components/FloorSelect';
import { getRoomsQueryOptions } from '../hooks/getRoomsQueryOptions';
import type { BookingFormData, Room } from '../types';

interface FloorSelectFieldProps {
  onFilterChange: <K extends keyof BookingFormData>(key: K, value: BookingFormData[K]) => void;
}

export function FloorSelectField({ onFilterChange }: FloorSelectFieldProps) {
  const preferredFloor = useWatch<BookingFormData, 'preferredFloor'>({ name: 'preferredFloor' });
  const { data: rooms } = useSuspenseQuery(getRoomsQueryOptions());

  const floors = useMemo(() => {
    const floorSet = new Set(rooms.map((r: Room) => r.floor));
    return Array.from(floorSet).sort((a, b) => a - b);
  }, [rooms]);

  return (
    <FloorSelect
      label="선호 층"
      value={preferredFloor}
      floors={floors}
      onChange={(value) => {
        onFilterChange('preferredFloor', value);
      }}
    />
  );
}

FloorSelectField.Loading = function FloorSelectFieldLoading() {
  return (
    <div css={skeletonFieldStyle}>
      <Text as="label" typography="t7" fontWeight="medium" color={colors.grey600}>
        선호 층
      </Text>
      <Spacing size={6} />
      <div css={skeletonInputStyle} />
    </div>
  );
};

FloorSelectField.Error = function FloorSelectFieldError() {
  return (
    <div css={errorFieldStyle}>
      <Text as="label" typography="t7" fontWeight="medium" color={colors.grey600}>
        선호 층
      </Text>
      <Spacing size={6} />
      <div css={errorInputStyle}>
        <Text typography="t7" color={colors.red500}>
          층 정보를 불러올 수 없습니다
        </Text>
      </div>
    </div>
  );
}

const skeletonFieldStyle = css`
  display: flex;
  flex-direction: column;
  flex: 1;
`;

const skeletonInputStyle = css`
  height: 48px;
  background: ${colors.grey100};
  border-radius: 12px;
  animation: pulse 1.5s ease-in-out infinite;
  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.5; }
  }
`;

const errorFieldStyle = css`
  display: flex;
  flex-direction: column;
  flex: 1;
`;

const errorInputStyle = css`
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${colors.grey50};
  border: 1px solid ${colors.red200};
  border-radius: 12px;
`;
