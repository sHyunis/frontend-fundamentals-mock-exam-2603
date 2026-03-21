import { Component, ReactNode } from 'react';
import { css } from '@emotion/react';
import { Text, Button, Spacing } from '_tosslib/components';
import { colors } from '_tosslib/constants/colors';

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  message?: string;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div css={containerStyle}>
          <Text typography="t5" fontWeight="bold" color={colors.grey900}>
            오류가 발생했습니다
          </Text>
          <Spacing size={8} />
          <Text typography="t7" color={colors.grey600}>
            {this.props.message ?? this.state.error?.message ?? '알 수 없는 오류가 발생했습니다.'}
          </Text>
          <Spacing size={24} />
          <Button size="small" onClick={this.handleReset}>
            다시 시도
          </Button>
        </div>
      );
    }

    return this.props.children;
  }
}

const containerStyle = css`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 24px;
  text-align: center;
  background: ${colors.grey50};
  border-radius: 14px;
  margin: 24px;
`;
