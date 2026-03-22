import { css } from '@emotion/react';
import { Suspense } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { Top, Spacing, Border, Button, Text } from '_tosslib/components';
import { colors } from '_tosslib/constants/colors';
import { ROUTES } from '../routes.constants';
import { ErrorBoundary } from 'shared/components/ErrorBoundary';
import { BookingFilterSection } from './components/BookingFilterSection';
import { AvailableRoomList } from './components/AvailableRoomList';
import { useBookingForm } from './hooks/useBookingForm';

export function RoomBookingPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const {
    filterErrorMessage,
    submitErrorMessage,
    isSubmitDisabled,
    isPendingBooking,
    selectedRoomId,
    handleRoomSelect,
    handleFilterChange,
    handleSubmit,
  } = useBookingForm();

  return (
    <div css={pageStyle}>
      <div css={backButtonContainerStyle}>
        <button
          type="button"
          onClick={() => {
            navigate(ROUTES.HOME);
          }}
          aria-label="뒤로가기"
          css={backButtonStyle}
        >
          ← 예약 현황으로
        </button>
      </div>
      <Top.Top03 css={headerStyle}>예약하기</Top.Top03>

      {submitErrorMessage && (
        <div css={errorContainerStyle}>
          <Spacing size={12} />
          <div css={errorBoxStyle}>
            <Text typography="t7" fontWeight="medium" color={colors.red500}>
              {submitErrorMessage}
            </Text>
          </div>
        </div>
      )}

      <Spacing size={24} />

      <BookingFilterSection onFilterChange={handleFilterChange} />

      <Spacing size={24} />
      <Border size={8} />
      <Spacing size={24} />

      <section css={sectionStyle}>
        {filterErrorMessage ? (
          <div css={emptyStyle}>
            <Text typography="t6" color={colors.grey500}>
              {'예약 조건을 먼저 선택해 주세요.'}
            </Text>
          </div>
        ) : (
          <ErrorBoundary onReset={() => queryClient.resetQueries({ queryKey: ['availableRooms'] })}>
            <Suspense fallback={<AvailableRoomList.Loading />}>
              <AvailableRoomList selectedRoomId={selectedRoomId} onSelectRoom={handleRoomSelect} />
            </Suspense>
          </ErrorBoundary>
        )}

        <Spacing size={16} />

        <Button display="full" onClick={handleSubmit} disabled={isSubmitDisabled || isPendingBooking}>
          {isPendingBooking ? '예약 중...' : '확정'}
        </Button>
      </section>

      <Spacing size={24} />
    </div>
  );
}

const pageStyle = css`
  background: ${colors.white};
  padding-bottom: 40px;
`;

const backButtonContainerStyle = css`
  padding: 12px 24px 0;
`;

const backButtonStyle = css`
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;
  font-size: 14px;
  color: ${colors.grey600};
  &:hover {
    color: ${colors.grey900};
  }
`;

const headerStyle = css`
  padding-left: 24px;
  padding-right: 24px;
`;

const sectionStyle = css`
  padding: 0 24px;
`;

const errorContainerStyle = css`
  padding: 0 24px;
`;

const errorBoxStyle = css`
  padding: 10px 14px;
  border-radius: 10px;
  background: ${colors.red50};
  display: flex;
  align-items: center;
  gap: 8px;
`;

const emptyStyle = css`
  padding: 40px 0;
  text-align: center;
  background: ${colors.grey50};
  border-radius: 14px;
`;
