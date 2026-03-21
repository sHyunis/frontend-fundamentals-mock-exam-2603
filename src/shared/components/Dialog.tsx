import { css } from '@emotion/react';
import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { Text, Spacing, Button } from '_tosslib/components';
import { colors } from '_tosslib/constants/colors';

interface DialogOptions {
  title?: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onSuccess?: () => void;
  onCancel?: () => void;
}

interface DialogState extends Omit<DialogOptions, 'onSuccess' | 'onCancel'> {
  isOpen: boolean;
  onSuccess: (() => void) | null;
  onCancel: (() => void) | null;
}

interface DialogContextValue {
  open: (options: DialogOptions) => void;
}

const DialogContext = createContext<DialogContextValue | null>(null);

export function useDialog() {
  const context = useContext(DialogContext);
  if (!context) {
    throw new Error('useDialog must be used within DialogProvider');
  }
  return context;
}

interface DialogProviderProps {
  children: ReactNode;
}

export function DialogProvider({ children }: DialogProviderProps) {
  const [state, setState] = useState<DialogState>({
    isOpen: false,
    message: '',
    onSuccess: null,
    onCancel: null,
  });

  const open = useCallback((options: DialogOptions): void => {
    setState({
      isOpen: true,
      title: options.title,
      message: options.message,
      confirmText: options.confirmText,
      cancelText: options.cancelText,
      onSuccess: options.onSuccess ?? null,
      onCancel: options.onCancel ?? null,
    });
  }, []);

  const handleConfirm = () => {
    state.onSuccess?.();
    setState((prev) => ({ ...prev, isOpen: false, onSuccess: null, onCancel: null }));
  };

  const handleCancel = () => {
    state.onCancel?.();
    setState((prev) => ({ ...prev, isOpen: false, onSuccess: null, onCancel: null }));
  };

  return (
    <DialogContext.Provider value={{ open }}>
      {children}
      {state.isOpen &&
        createPortal(
          <div css={overlayStyle} onClick={handleCancel}>
            <div css={dialogStyle} onClick={(e) => e.stopPropagation()}>
              {state.title && (
                <>
                  <Text typography="t5" fontWeight="bold" color={colors.grey900}>
                    {state.title}
                  </Text>
                  <Spacing size={8} />
                </>
              )}
              <Text typography="t6" color={colors.grey700}>
                {state.message}
              </Text>
              <Spacing size={24} />
              <div css={buttonGroupStyle}>
                <div css={buttonWrapperStyle}>
                  <Button
                    display="full"
                    type="dark"
                    style="weak"
                    onClick={handleCancel}
                  >
                    {state.cancelText ?? '취소'}
                  </Button>
                </div>
                <div css={buttonWrapperStyle}>
                  <Button
                    display="full"
                    type="primary"
                    onClick={handleConfirm}
                  >
                    {state.confirmText ?? '확인'}
                  </Button>
                </div>
              </div>
            </div>
          </div>,
          document.body
        )}
    </DialogContext.Provider>
  );
}

const overlayStyle = css`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const dialogStyle = css`
  background: ${colors.white};
  border-radius: 16px;
  padding: 24px;
  min-width: 280px;
  max-width: 320px;
`;

const buttonGroupStyle = css`
  display: flex;
  gap: 8px;
`;

const buttonWrapperStyle = css`
  flex: 1;
`;
