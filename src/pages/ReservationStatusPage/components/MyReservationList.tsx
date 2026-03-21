import { css } from '@emotion/react';
import { useState } from 'react';
import { useSuspenseQuery } from '@tanstack/react-query';
import { Text, ListRow, Button, Spacing } from '_tosslib/components';
import { colors } from '_tosslib/constants/colors';
import { useToast } from 'shared/components/Toast';
import { getRoomsQueryOptions } from '../hooks/getRoomsQueryOptions';
import { getMyReservationsQueryOptions } from '../hooks/getMyReservationsQueryOptions';
import { useCancelReservation } from '../hooks/useCancelReservation';
import { getEquipmentLabels } from 'pages/RoomBookingPage/utils/equipment';

export function MyReservationList() {
  const [cancelTargetId, setCancelTargetId] = useState<string | null>(null);

  const { data: myReservations } = useSuspenseQuery(getMyReservationsQueryOptions());
  const { data: rooms } = useSuspenseQuery(getRoomsQueryOptions());

  const cancelMutation = useCancelReservation();

  const toast = useToast();

  const getRoomName = (roomId: string) => {
    return rooms.find((room) => { return room.id === roomId; })?.name ?? roomId;
  };

  const handleCancelClick = (id: string) => {
    const confirmed = window.confirm('정말 취소하시겠습니까?');
    if (!confirmed) {
      return;
    }

    setCancelTargetId(id);
    cancelMutation.mutate(id, {
      onSuccess: () => {
        toast.success('예약이 취소되었습니다.');
        setCancelTargetId(null);
      },
      onError: () => {
        toast.error('취소에 실패했습니다.');
        setCancelTargetId(null);
      },
    });
  };

  if (myReservations.length === 0) {
    return (
      <div css={emptyStyle}>
        <Text typography="t6" color={colors.grey500}>
          예약 내역이 없습니다.
        </Text>
      </div>
    );
  }

  return (
    <>
      <div css={headerStyle}>
        <Text typography="t5" fontWeight="bold" color={colors.grey900}>
          내 예약
        </Text>
        <Text typography="t7" fontWeight="medium" color={colors.grey500}>
          {myReservations.length}건
        </Text>
      </div>
      <Spacing size={16} />
      <div css={listStyle}>
        {myReservations.map((res) => (
          <div key={res.id} css={itemStyle}>
            <ListRow
              contents={
                <ListRow.Text2Rows
                  top={getRoomName(res.roomId)}
                  topProps={{ typography: 't6', fontWeight: 'bold', color: colors.grey900 }}
                  bottom={`${res.date} ${res.start}~${res.end} · ${res.attendees}명 · ${getEquipmentLabels(res.equipment)}`}
                  bottomProps={{ typography: 't7', color: colors.grey600 }}
                />
              }
              right={
                <Button
                  type="danger"
                  style="weak"
                  size="small"
                  disabled={cancelMutation.isPending || cancelTargetId === res.id}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleCancelClick(res.id);
                  }}
                >
                  취소
                </Button>
              }
            />
          </div>
        ))}
      </div>
    </>
  );
}

MyReservationList.Loading = function MyReservationListLoading() {
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

const itemStyle = css`
  padding: 14px 16px;
  border-radius: 14px;
  background: ${colors.grey50};
  border: 1px solid ${colors.grey200};
`;
