import { useRef, useEffect, useState } from 'react';
import styles from './BubbleOverlay.module.css';

// colors for bubble boxes cycles through them by index
const BUBBLE_COLORS = [
  '#f5a623', '#4ecdc4', '#a78bfa', '#f87171',
  '#34d399', '#60a5fa', '#fb923c', '#e879f9',
];

export default function BubbleOverlay({
  bubbles,
  imageNaturalWidth,
  imageNaturalHeight,
  selectedId,
  onSelect,
}) {
  const containerRef = useRef(null);
  const [renderedSize, setRenderedSize] = useState({ w: 0, h: 0 });

  // Track the actual rendered pixel size of the image using ResizeObserver
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const observer = new ResizeObserver(entries => {
      for (const entry of entries) {
        setRenderedSize({
          w: entry.contentRect.width,
          h: entry.contentRect.height,
        });
      }
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Scale from original image coordinates to rendered size
  const scaleX = renderedSize.w / (imageNaturalWidth || 1);
  const scaleY = renderedSize.h / (imageNaturalHeight || 1);

  return (
    <div ref={containerRef} className={styles.overlayContainer}>
      {renderedSize.w > 0 && (
        <svg
          className={styles.svg}
          viewBox={`0 0 ${renderedSize.w} ${renderedSize.h}`}
          xmlns="http://www.w3.org/2000/svg"
        >
          {bubbles.map((bubble, i) => {
            const color = BUBBLE_COLORS[i % BUBBLE_COLORS.length];
            const isSelected = bubble.id === selectedId;
            const rx = bubble.x * scaleX;
            const ry = bubble.y * scaleY;
            const rw = bubble.width * scaleX;
            const rh = bubble.height * scaleY;

            return (
              <g
                key={bubble.id}
                onClick={() => onSelect(isSelected ? null : bubble.id)}
                style={{ cursor: 'pointer' }}
              >
                {/* Filled highlight */}
                <rect
                  x={rx} y={ry} width={rw} height={rh}
                  rx="4" ry="4"
                  fill={color}
                  fillOpacity={isSelected ? 0.22 : 0.10}
                  style={{ transition: 'fill-opacity 0.15s' }}
                />
                {/* Border */}
                <rect
                  x={rx} y={ry} width={rw} height={rh}
                  rx="4" ry="4"
                  fill="none"
                  stroke={color}
                  strokeWidth={isSelected ? 2 : 1.5}
                  strokeDasharray={isSelected ? 'none' : '5 3'}
                  style={{ transition: 'stroke-width 0.15s' }}
                />
                {/* Index label chip */}
                <rect
                  x={rx} y={ry - 18}
                  width={28} height={18}
                  rx="4" ry="4"
                  fill={color}
                  fillOpacity={isSelected ? 1 : 0.85}
                />
                <text
                  x={rx + 14} y={ry - 5}
                  textAnchor="middle"
                  fontSize="11"
                  fontWeight="600"
                  fontFamily="DM Sans, system-ui, sans-serif"
                  fill="#000"
                >
                  {i + 1}
                </text>
              </g>
            );
          })}
        </svg>
      )}
    </div>
  );
}