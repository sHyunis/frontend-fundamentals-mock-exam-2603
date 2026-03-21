import { Suspense } from 'react';
import { Route, Routes as ReactRouterRoutes, Navigate } from 'react-router-dom';
import { ErrorBoundary } from 'shared/components/ErrorBoundary';
import { ROUTES } from './routes.constants';
import { ReservationStatusPage } from './ReservationStatusPage';
import { RoomBookingPage } from './RoomBookingPage';

export const Routes = () => {
  return (
    <ErrorBoundary>
      <Suspense fallback={null}>
        <ReactRouterRoutes>
          <Route path={ROUTES.HOME} element={<ReservationStatusPage />} />
          <Route path={ROUTES.BOOKING} element={<RoomBookingPage />} />
          <Route path="*" element={<Navigate replace to={ROUTES.HOME} />} />
        </ReactRouterRoutes>
      </Suspense>
    </ErrorBoundary>
  );
};
