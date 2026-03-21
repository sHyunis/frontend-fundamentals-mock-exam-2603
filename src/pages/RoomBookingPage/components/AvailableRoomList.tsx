import { css } from '@emotion/react';
import { useMemo } from 'react';
import { useSuspenseQuery } from '@tanstack/react-query';
import { Text, ListRow, Spacing } from '_tosslib/components';
import { colors } from '_tosslib/constants/colors';
import { getAvailableRoomsQueryOptions } from '../hooks/getAvailableRoomsQueryOptions';
import type { BookingFormData, Room, Reservation } from '../types';
import {
  filterByCapacity,
  filterByEquipment,
  filterByFloor,
  filterByTimeAvailability,
} from '../utils/filter';
import { getEquipmentLabels } from '../utils/equipment';

interface AvailableRoomListProps {
  filter: BookingFormData;
  selectedRoomId: string | null;
  onSelectRoom: (roomId: string) => void;
}

export function AvailableRoomList({
  filter,
  selectedRoomId,
  onSelectRoom,
}: AvailableRoomListProps) {
  const filters = useMemo(
    () => [
      (room: Room) => filterByCapacity(room, filter.attendees),
      (room: Room) => filterByEquipment(room, filter.equipment),
      (room: Room) => filterByFloor(room, filter.preferredFloor),
    ],
    [filter.attendees, filter.equipment, filter.preferredFloor]
  );

  const timeFilter = useMemo(
    () => (room: Room, reservations: Reservation[]) =>
      filterByTimeAvailability(room, reservations, {
        date: filter.date,
        start: filter.start,
        end: filter.end,
      }),
    [filter.date, filter.start, filter.end]
  );

  const { data: availableRooms } = useSuspenseQuery(
    getAvailableRoomsQueryOptions({
      date: filter.date,
      filters,
      timeFilter,
    })
  );

  if (availableRooms.length === 0) {
    return (
      <div css={emptyStyle}>
        <Text typography="t6" color={colors.grey500}>
          {'조건에 맞는 회의실이 없습니다.'}
        </Text>
      </div>
    );
  }

  return (
    <>
      <div css={headerStyle}>
        <Text typography="t5" fontWeight="bold" color={colors.grey900}>
          예약 가능 회의실
        </Text>
        <Text typography="t7" fontWeight="medium" color={colors.grey500}>
          {availableRooms.length}개
        </Text>
      </div>
      <Spacing size={16} />
      <div css={listStyle}>
        {availableRooms.map((room) => {
          const isSelected = selectedRoomId === room.id;
          return (
            <div
              key={room.id}
              onClick={() => {
                onSelectRoom(room.id);
              }}
              role="button"
              aria-pressed={isSelected}
              aria-label={room.name}
              css={itemStyle(isSelected)}
            >
              <ListRow
                contents={
                  <ListRow.Text2Rows
                    top={room.name}
                    topProps={{ typography: 't6', fontWeight: 'bold', color: colors.grey900 }}
                    bottom={`${room.floor}층 · ${room.capacity}명 · ${getEquipmentLabels(room.equipment)}`}
                    bottomProps={{ typography: 't7', color: colors.grey600 }}
                  />
                }
                right={
                  isSelected ? (
                    <Text typography="t7" fontWeight="bold" color={colors.blue500}>
                      선택됨
                    </Text>
                  ) : undefined
                }
              />
            </div>
          );
        })}
      </div>
    </>
  );
}

AvailableRoomList.Loading = function AvailableRoomListLoading() {
  return (
    <div css={emptyStyle}>
      <Text typography="t6" color={colors.grey500}>
        불러오는 중...
      </Text>
    </div>
  );
};

const headerStyle = css`
  display: flex;
  align-items: baseline;
  gap: 6px;
`;

const emptyStyle = css`
  padding: 40px 0;
  text-align: center;
  background: ${colors.grey50};
  border-radius: 14px;
`;

const listStyle = css`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const itemStyle = (isSelected: boolean) => css`
  cursor: pointer;
  padding: 14px 16px;
  border-radius: 14px;
  border: 2px solid ${isSelected ? colors.blue500 : colors.grey200};
  background: ${isSelected ? colors.blue50 : colors.white};
  transition: all 0.15s;
  &:hover {
    border-color: ${isSelected ? colors.blue500 : colors.grey300};
  }
`;
