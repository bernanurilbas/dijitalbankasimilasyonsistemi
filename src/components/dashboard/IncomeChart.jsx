import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import ChartCard from '../cards/ChartCard';

const IncomeChart = () => {
  const { charts } = useSelector((state) => state.dashboard);
  const [hoveredIdx, setHoveredIdx] = useState(null);

  const data = charts?.income || [4200, 5100, 4800, 6200, 7500, 8500];
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

  // Calculate coordinates
  const points = data.map((val, idx) => {
    const x = paddingLeft + (chartWidth / (data.length - 1)) * idx;
    const y = height - paddingBottom - (val / maxVal) * chartHeight;
    return { x, y, val };
  });

  // Generate line path
  const linePath = points.map((p, idx) => `${idx === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');

  // Generate area path
  const areaPath = `${linePath} L ${points[points.length - 1].x} ${height - paddingBottom} L ${points[0].x} ${height - paddingBottom} Z`;

  return (
    <ChartCard title="Gelir Akışı" subtitle="Son 6 aya ait gelir analizi">
      <div className="relative w-full flex justify-center">
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto">
          <defs>
            <linearGradient id="incomeGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#10b981" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#10b981" stopOpacity="0.0" />
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

          {/* Area under the line */}
          <path d={areaPath} fill="url(#incomeGrad)" />

          {/* Trend Line */}
          <path d={linePath} fill="none" stroke="#10b981" strokeWidth="2.5" />

          {/* Interactive dots */}
          {points.map((p, idx) => {
            const isHovered = hoveredIdx === idx;
            return (
              <g 
                key={idx}
                onMouseEnter={() => setHoveredIdx(idx)}
                onMouseLeave={() => setHoveredIdx(null)}
                className="cursor-pointer"
              >
                {/* Large transparent hover trigger circle */}
                <circle cx={p.x} cy={p.y} r="10" fill="transparent" />

                {/* Visible dot */}
                <circle 
                  cx={p.x} 
                  cy={p.y} 
                  r={isHovered ? 5.5 : 4} 
                  fill="#07090e" 
                  stroke="#10b981" 
                  strokeWidth={isHovered ? 3 : 2} 
                  className="transition-all duration-150"
                />

                {/* X labels */}
                <text
                  x={p.x}
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
                      x={p.x - 28}
                      y={p.y - 24}
                      width="56"
                      height="16"
                      rx="4"
                      fill="#0d121f"
                      stroke="rgba(255,255,255,0.1)"
                      strokeWidth="1"
                    />
                    <text
                      x={p.x}
                      y={p.y - 13}
                      fill="#f8fafc"
                      fontSize="8"
                      fontWeight="bold"
                      textAnchor="middle"
                    >
                      {p.val} ₺
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

export default IncomeChart;
