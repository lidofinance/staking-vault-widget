import React, { useId } from 'react';
import styled from 'styled-components';

const GaugeContainer = styled.div`
  svg {
    transition: all 0.5s ease;
  }
`;

const PointerWrapper = styled.g`
  transition: transform 0.5s ease;
`;

const ValueText = styled.text`
  font-size: ${({ theme }) => theme.fontSizesMap.sm}px;
  font-weight: 700;
  line-height: 24px;
  dominant-baseline: middle;
  text-anchor: middle;
`;

interface VaultImpactDashboardProps {
  percentage?: number;
}

const calculatePointerPosition = (
  percentage: number,
): { x: number; y: number; angle: number } => {
  const maxAngle = 135;
  const minAngle = -135;
  const clamped = Math.max(0, Math.min(percentage, 150));
  const angle = (clamped / 100) * (maxAngle - minAngle) + minAngle;

  const pivotX = 61.5;
  const pivotY = 33.5;
  const radius = 51.5;
  const radians = angle * (Math.PI / 180);

  return {
    x: pivotX + radius * Math.cos(radians),
    y: pivotY + radius * Math.sin(radians),
    angle: angle,
  };
};

const getZoneColor = (percentage: number): string => {
  if (percentage >= 100) return '#53BA95';
  if (percentage >= 92) return '#EC8600';
  if (percentage >= 80) return '#E14D4D';
  return '#990000';
};

export const VaultImpactDashboard = ({
  percentage = 100,
}: VaultImpactDashboardProps) => {
  const mask1 = useId();
  const mask2 = useId();
  const mask3 = useId();
  const mask4 = useId();

  const { x, y, angle } = calculatePointerPosition(percentage);

  return (
    <GaugeContainer>
      <svg width="123" height="67" viewBox="0 0 123 67" fill="none">
        {/* Green Zone */}
        <mask id={mask1} fill="white">
          <path d="M119.271 60.9091C120.953 60.9091 122.324 59.5447 122.24 57.8649C121.892 50.9062 120.352 44.0511 117.68 37.6002C115.008 31.1493 111.249 25.213 106.575 20.0463C105.447 18.799 103.512 18.804 102.323 19.9933L98.0193 24.2969C96.83 25.4862 96.838 27.4084 97.9507 28.6697C101.503 32.6959 104.37 37.2869 106.43 42.2602C108.49 47.2334 109.709 52.507 110.044 57.8656C110.149 59.5443 111.503 60.9091 113.185 60.9091H119.271Z" />
        </mask>
        <path
          d="M119.271 60.9091C120.953 60.9091 122.324 59.5447 122.24 57.8649C121.892 50.9062 120.352 44.0511 117.68 37.6002C115.008 31.1493 111.249 25.213 106.575 20.0463C105.447 18.799 103.512 18.804 102.323 19.9933L98.0193 24.2969C96.83 25.4862 96.838 27.4084 97.9507 28.6697C101.503 32.6959 104.37 37.2869 106.43 42.2602C108.49 47.2334 109.709 52.507 110.044 57.8656C110.149 59.5443 111.503 60.9091 113.185 60.9091H119.271Z"
          fill="#53BA95"
          stroke="white"
          strokeWidth="4.56818"
          mask={`url(#${mask1})`}
        />

        {/* Orange Zone */}
        <mask id={mask2} fill="white">
          <path d="M102.323 19.9933C103.512 18.804 103.517 16.8694 102.27 15.741C91.8501 6.31364 78.4855 0.777821 64.4514 0.0760515C62.7716 -0.00794943 61.4071 1.3635 61.4071 3.04545V9.11604C61.4071 10.798 62.7723 12.1516 64.451 12.2565C75.2584 12.9322 85.5375 17.19 93.6573 24.3542C94.9186 25.467 96.841 25.4752 98.0304 24.2859L102.323 19.9933Z" />
        </mask>
        <path
          d="M102.323 19.9933C103.512 18.804 103.517 16.8694 102.27 15.741C91.8501 6.31364 78.4855 0.777821 64.4514 0.0760515C62.7716 -0.00794943 61.4071 1.3635 61.4071 3.04545V9.11604C61.4071 10.798 62.7723 12.1516 64.451 12.2565C75.2584 12.9322 85.5375 17.19 93.6573 24.3542C94.9186 25.467 96.841 25.4752 98.0304 24.2859L102.323 19.9933Z"
          fill="#EC8600"
          stroke="white"
          strokeWidth="4.56818"
          mask={`url(#${mask2})`}
        />

        {/* Pink Zone */}
        <mask id={mask3} fill="white">
          <path d="M61.4071 3.04545C61.4071 1.3635 60.0427 -0.00794953 58.3629 0.0760513C44.3288 0.77782 30.9641 6.31364 20.5443 15.741C19.2971 16.8694 19.3021 18.804 20.4914 19.9933L24.7978 24.2997C25.9871 25.489 27.9096 25.4808 29.1708 24.3681C37.2869 17.2075 47.561 12.9518 58.3633 12.2762C60.042 12.1712 61.4071 10.8176 61.4071 9.13563V3.04545Z" />
        </mask>
        <path
          d="M61.4071 3.04545C61.4071 1.3635 60.0427 -0.00794953 58.3629 0.0760513C44.3288 0.77782 30.9641 6.31364 20.5443 15.741C19.2971 16.8694 19.3021 18.804 20.4914 19.9933L24.7978 24.2997C25.9871 25.489 27.9096 25.4808 29.1708 24.3681C37.2869 17.2075 47.561 12.9518 58.3633 12.2762C60.042 12.1712 61.4071 10.8176 61.4071 9.13563V3.04545Z"
          fill="#E14D4D"
          stroke="white"
          strokeWidth="4.56818"
          mask={`url(#${mask3})`}
        />

        {/* Red Zone */}
        <mask id={mask4} fill="white">
          <path d="M20.4914 19.9933C19.302 18.804 17.3675 18.799 16.239 20.0463C6.81169 30.4661 1.27587 43.8307 0.574099 57.8648C0.490098 59.5447 1.86154 60.9091 3.5435 60.9091H9.60663C11.2886 60.9091 12.6422 59.5439 12.7471 57.8652C13.4228 47.0558 17.6814 36.7748 24.847 28.6536C25.9598 27.3924 25.968 25.4699 24.7786 24.2806L20.4914 19.9933Z" />
        </mask>
        <path
          d="M20.4914 19.9933C19.302 18.804 17.3675 18.799 16.239 20.0463C6.81169 30.4661 1.27587 43.8307 0.574099 57.8648C0.490098 59.5447 1.86154 60.9091 3.5435 60.9091H9.60663C11.2886 60.9091 12.6422 59.5439 12.7471 57.8652C13.4228 47.0558 17.6814 36.7748 24.847 28.6536C25.9598 27.3924 25.968 25.4699 24.7786 24.2806L20.4914 19.9933Z"
          fill="#990000"
          stroke="white"
          strokeWidth="4.56818"
          mask={`url(#${mask4})`}
        />

        {/* Pointer */}
        {/*TODO: fix position*/}
        <PointerWrapper transform={`rotate(${angle} 61.5 33.5)`}>
          <circle
            cx="61.5"
            cy="33.5"
            r="6.85"
            fill={getZoneColor(percentage)}
            stroke="white"
            strokeWidth="1.5"
            transform={`translate(${x - 61.5} ${y - 33.5})`}
          />
        </PointerWrapper>

        {/* Value Display */}
        <ValueText
          x="50%"
          y="70%"
          fontSize="12"
          fill={getZoneColor(percentage)}
        >
          {`${Math.round(percentage)}%`}
        </ValueText>
      </svg>
    </GaugeContainer>
  );
};
