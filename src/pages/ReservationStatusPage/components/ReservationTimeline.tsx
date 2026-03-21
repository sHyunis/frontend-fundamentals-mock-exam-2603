import { css } from '@emotion/react';
import { useState } from 'react';
import { useSuspenseQuery } from '@tanstack/react-query';
import { Text } from '_tosslib/components';
import { colors } from '_tosslib/constants/colors';
import { Tooltip } from 'shared/components/Tooltip';
import { HOUR_LABELS, TOTAL_MINUTES, timeToTimelineMinutes, calculateBlockPosition } from '../utils/time';
import { getEquipmentLabels } from 'shared/utils/equipment';
import { getRoomsQueryOptions } from 'shared/queries/getRoomsQueryOptions';
import { getReservationsQueryOptions } from 'shared/queries/getReservationsQueryOptions';

interface ReservationTimelineProps {
  selectedDate: string;
}

export function ReservationTimeline({ selectedDate }: ReservationTimelineProps) {
  const { data: rooms } = useSuspenseQuery(getRoomsQueryOptions());
  const { data: reservations } = useSuspenseQuery(getReservationsQueryOptions(selectedDate));
  const [activeReservationId, setActiveReservationId] = useState<string | null>(null);

  const getReservationsForRoom = (roomId: string) => {
    return reservations.filter(reservation => {
      return reservation.roomId === roomId;
    });
  };

  const handleBlockClick = (reservationId: string) => {
    if (activeReservationId === reservationId) {
      setActiveReservationId(null);
    } else {
      setActiveReservationId(reservationId);
    }
  };

  const handleTooltipClose = () => {
    setActiveReservationId(null);
  };

  return (
    <div css={containerStyle}>
      <div css={headerStyle}>
        <div css={roomColumnStyle} />
        <div css={timelineHeaderStyle}>
          {HOUR_LABELS.map(time => {
            const leftPercent = (timeToTimelineMinutes(time) / TOTAL_MINUTES) * 100;
            return (
              <Text
                key={time}
                typography="t7"
                fontWeight="regular"
                color={colors.grey400}
                css={hourLabelStyle}
                style={{ left: `${leftPercent}%` }}
              >
                {time.slice(0, 2)}
              </Text>
            );
          })}
        </div>
      </div>

      {rooms.map((room, index) => {
        const roomReservations = getReservationsForRoom(room.id);
        return (
          <div key={room.id} css={rowStyle(index > 0)}>
            <div css={roomColumnStyle}>
              <Text
                typography="t7"
                fontWeight="medium"
                color={colors.grey700}
                ellipsisAfterLines={1}
                css={roomNameStyle}
              >
                {room.name}
              </Text>
            </div>
            <div css={timelineAreaStyle}>
              {roomReservations.map(reservation => {
                const { left, width } = calculateBlockPosition(reservation.start, reservation.end);
                const isActive = activeReservationId === reservation.id;
                return (
                  <div key={reservation.id} css={blockPositionStyle} style={{ left: `${left}%`, width: `${width}%` }}>
                    <Tooltip
                      isShowTooltip={isActive}
                      onClose={handleTooltipClose}
                      position="bottom"
                      content={
                        <div css={tooltipContentStyle}>
                          <div>
                            {reservation.start} ~ {reservation.end}
                          </div>
                          <div>{reservation.attendees}명</div>
                          {reservation.equipment.length > 0 && <div>{getEquipmentLabels(reservation.equipment)}</div>}
                        </div>
                      }
                    >
                      <div
                        role="button"
                        aria-label={`${room.name} ${reservation.start}-${reservation.end} 예약 상세`}
                        onClick={() => {
                          handleBlockClick(reservation.id);
                        }}
                        css={blockStyle(isActive)}
                      />
                    </Tooltip>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}

const containerStyle = css`
  background: ${colors.grey50};
  border-radius: 14px;
  padding: 16px;
`;

const headerStyle = css`
  display: flex;
  align-items: flex-end;
  margin-bottom: 8px;
`;

const roomColumnStyle = css`
  width: 80px;
  flex-shrink: 0;
  padding-right: 8px;
`;

const timelineHeaderStyle = css`
  flex: 1;
  position: relative;
  height: 18px;
`;

const rowStyle = (hasMargin: boolean) => css`
  display: flex;
  align-items: center;
  height: 32px;
  ${hasMargin && 'margin-top: 4px;'}
`;

const timelineAreaStyle = css`
  flex: 1;
  height: 24px;
  background: ${colors.white};
  border-radius: 6px;
  position: relative;
  overflow: visible;
`;

const blockStyle = (isActive: boolean) => css`
  width: 100%;
  height: 100%;
  background: ${colors.blue400};
  border-radius: 4px;
  opacity: ${isActive ? 1 : 0.75};
  cursor: pointer;
  transition: opacity 0.15s;
  &:hover {
    opacity: 1;
  }
`;

const hourLabelStyle = css`
  position: absolute;
  transform: translateX(-50%);
  font-size: 10px;
  letter-spacing: -0.3px;
`;

const roomNameStyle = css`
  font-size: 12px;
`;

const blockPositionStyle = css`
  position: absolute;
  height: 100%;
`;

const tooltipContentStyle = css`
  font-size: 12px;
  line-height: 1.6;
  color: ${colors.white};
`;

const loadingContentStyle = css`
  padding: 24px;
  text-align: center;
`;

ReservationTimeline.Loading = function ReservationTimelineLoading() {
  return (
    <div css={containerStyle}>
      <div css={loadingContentStyle}>
        <Text typography="t7" color={colors.grey400}>
          불러오는 중...
        </Text>
      </div>
    </div>
  );
};
