import { css } from '@emotion/react';
import { type ReactNode, useRef, useCallback } from 'react';
import { Text } from '_tosslib/components';
import { colors } from '_tosslib/constants/colors';
import { useOutsideClick } from 'shared/hooks/useOutsideClick';

interface TooltipProps {
  children: ReactNode;
  content: ReactNode;
  isShowTooltip: boolean;
  position?: 'top' | 'bottom' | 'left' | 'right';
  onClose?: () => void;
}

export function Tooltip({
  children,
  content,
  isShowTooltip,
  position = 'top',
  onClose,
}: TooltipProps) {
  const tooltipRef = useRef<HTMLDivElement>(null);

  const handleClose = useCallback(() => {
    onClose?.();
  }, [onClose]);

  useOutsideClick(tooltipRef, handleClose);

  return (
    <div css={wrapperStyle}>
      {children}
      {isShowTooltip && (
        <div ref={tooltipRef} role="tooltip" css={tooltipStyle(position)}>
          {typeof content === 'string' ? (
            <Text typography="t7" color={colors.white}>
              {content}
            </Text>
          ) : (
            content
          )}
        </div>
      )}
    </div>
  );
}

const wrapperStyle = css`
  position: relative;
  display: block;
  width: 100%;
  height: 100%;
`;

const tooltipStyle = (position: 'top' | 'bottom' | 'left' | 'right') => css`
  position: absolute;
  background: ${colors.grey800};
  padding: 8px 12px;
  border-radius: 8px;
  white-space: nowrap;
  z-index: 100;

  ${position === 'top' &&
  css`
    bottom: 100%;
    left: 50%;
    transform: translateX(-50%);
    margin-bottom: 8px;
  `}

  ${position === 'bottom' &&
  css`
    top: 100%;
    left: 50%;
    transform: translateX(-50%);
    margin-top: 8px;
  `}

  ${position === 'left' &&
  css`
    right: 100%;
    top: 50%;
    transform: translateY(-50%);
    margin-right: 8px;
  `}

  ${position === 'right' &&
  css`
    left: 100%;
    top: 50%;
    transform: translateY(-50%);
    margin-left: 8px;
  `}
`;
