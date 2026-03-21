import { css } from '@emotion/react';
import { Suspense, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';
import { Top, Spacing, Border, Button, Text } from '_tosslib/components';
import { colors } from '_tosslib/constants/colors';
import { ErrorBoundary } from 'shared/components/ErrorBoundary';
import { ROUTES } from '../routes.constants';
import { DatePicker } from '../components/DatePicker';
import { ReservationTimeline } from './components/ReservationTimeline';
import { MyReservationList } from './components/MyReservationList';

export function ReservationStatusPage() {
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState(dayjs().format('YYYY-MM-DD'));

  return (
    <div css={pageStyle}>
      <Top.Top03 css={headerStyle}>회의실 예약</Top.Top03>

      <Spacing size={24} />

      <section css={sectionStyle}>
        <Text typography="t5" fontWeight="bold" color={colors.grey900}>
          날짜 선택
        </Text>

        <Spacing size={16} />

        <DatePicker
          label="날짜"
          defaultValue={selectedDate}
          min={dayjs().format('YYYY-MM-DD')}
          onChange={e => {
            const value = e.target.value;
            if (value && /^\d{4}-\d{2}-\d{2}$/.test(value)) {
              setSelectedDate(value);
            }
          }}
        />
      </section>

      <Spacing size={24} />
      <Border size={8} />
      <Spacing size={24} />

      <section css={sectionStyle}>
        <Text typography="t5" fontWeight="bold" color={colors.grey900}>
          예약 현황
        </Text>

        <Spacing size={16} />

        <ErrorBoundary message="예약 현황을 불러오는데 실패했습니다.">
          <Suspense fallback={<ReservationTimeline.Loading />}>
            <ReservationTimeline selectedDate={selectedDate} />
          </Suspense>
        </ErrorBoundary>
      </section>

      <Spacing size={24} />
      <Border size={8} />
      <Spacing size={24} />

      <section css={sectionStyle}>
        <ErrorBoundary message="내 예약 목록을 불러오는데 실패했습니다.">
          <Suspense fallback={<MyReservationList.Loading />}>
            <MyReservationList />
          </Suspense>
        </ErrorBoundary>
      </section>

      <Spacing size={24} />
      <Border size={8} />
      <Spacing size={24} />

      <div css={sectionStyle}>
        <Button
          display="full"
          onClick={() => {
            navigate(ROUTES.BOOKING);
          }}
        >
          예약하기
        </Button>
      </div>
      <Spacing size={24} />
    </div>
  );
}

const pageStyle = css`
  background: ${colors.white};
  padding-bottom: 40px;
`;

const headerStyle = css`
  padding-left: 24px;
  padding-right: 24px;
`;

const sectionStyle = css`
  padding: 0 24px;
`;
