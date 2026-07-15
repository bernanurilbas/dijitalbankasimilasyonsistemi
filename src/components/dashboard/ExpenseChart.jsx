import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import ChartCard from '../cards/ChartCard';

const ExpenseChart = () => {
  const { charts } = useSelector((state) => state.dashboard);
  const [hoveredIdx, setHoveredIdx] = useState(null);

  const data = charts?.expense || [1800, 2100, 1950, 2400, 3100, 3200];
  const labels = charts?.months || ['Oca', 'Şub', 'Mar', 'Nis', 'May', 'Haz'];
  const maxVal = Math.max(...data) * 1.1;

  // Chart SVG sizes
  const width = 360;
  const height = 150;
  const paddingLeft = 40;
  const paddingRight = 15;
  const paddingTop = 15;
  const paddingBottom = 20;

  const chartWidth = width - paddingLeft - paddingRight;
  const chartHeight = height - paddingTop - paddingBottom;
  const barWidth = chartWidth / data.length - 12;

  return (
    <ChartCard title="Aylık Harcamalar" subtitle="Son 6 aya ait harcama analizi">
      <div className="relative w-full flex justify-center">
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto">
          <defs>
            <linearGradient id="expenseGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#ef4444" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#ef4444" stopOpacity="0.05" />
            </linearGradient>
            <linearGradient id="expenseGlow" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#ef4444" stopOpacity="0.75" />
              <stop offset="100%" stopColor="#ef4444" stopOpacity="0.1" />
            </linearGradient>
          </defs>

          {/* Grid lines */}
          {[0, 0.25, 0.5, 0.75, 1].map((ratio, idx) => {
            const y = paddingTop + chartHeight * ratio;
            const val = Math.round(maxVal * (1 - ratio));
            return (
              <g key={idx}>
                <line 
                  x1={paddingLeft} 
                  y1={y} 
                  x2={width - paddingRight} 
                  y2={y} 
                  stroke="rgba(255, 255, 255, 0.05)" 
                  strokeWidth="1" 
                  strokeDasharray="4 4" 
                />
                <text 
                  x={paddingLeft - 8} 
                  y={y + 3} 
                  fill="#64748b" 
                  fontSize="8" 
                  textAnchor="end" 
                  fontWeight="600"
                >
                  {val}
                </text>
              </g>
            );
          })}

          {/* Bars */}
          {data.map((val, idx) => {
            const x = paddingLeft + (chartWidth / data.length) * idx + 6;
            const barHeight = (val / maxVal) * chartHeight;
            const y = height - paddingBottom - barHeight;
            const isHovered = hoveredIdx === idx;

            return (
              <g 
                key={idx}
                onMouseEnter={() => setHoveredIdx(idx)}
                onMouseLeave={() => setHoveredIdx(null)}
                className="cursor-pointer"
              >
                {/* Invisible larger hover trigger area */}
                <rect
                  x={x - 4}
                  y={paddingTop}
                  width={barWidth + 8}
                  height={chartHeight}
                  fill="transparent"
                />
                
                {/* Visual Bar */}
                <rect
                  x={x}
                  y={y}
                  width={barWidth}
                  height={barHeight}
                  rx="4"
                  fill={isHovered ? 'url(#expenseGlow)' : 'url(#expenseGrad)'}
                  stroke="#ef4444"
                  strokeWidth={isHovered ? 1.5 : 1}
                  strokeOpacity={isHovered ? 0.8 : 0.4}
                  className="transition-all duration-300"
                />

                {/* X labels */}
                <text
                  x={x + barWidth / 2}
                  y={height - 4}
                  fill={isHovered ? '#f8fafc' : '#94a3b8'}
                  fontSize="9"
                  fontWeight="600"
                  textAnchor="middle"
                >
                  {labels[idx]}
                </text>

                {/* Active Tooltip Value */}
                {isHovered && (
                  <g>
                    <rect
                      x={x + barWidth / 2 - 28}
                      y={y - 22}
                      width="56"
                      height="16"
                      rx="4"
                      fill="#0d121f"
                      stroke="rgba(255,255,255,0.1)"
                      strokeWidth="1"
                    />
                    <text
                      x={x + barWidth / 2}
                      y={y - 11}
                      fill="#f8fafc"
                      fontSize="8"
                      fontWeight="bold"
                      textAnchor="middle"
                    >
                      {val} ₺
                    </text>
                  </g>
                )}
              </g>
            );
          })}
        </svg>
      </div>
    </ChartCard>
  );
};

export default ExpenseChart;
