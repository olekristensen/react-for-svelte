interface IconProps {
  size?: number;
  className?: string;
  style?: React.CSSProperties;
}

export function IconCheck({ size = 14, ...props }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <polyline points="2.5 7.5 5.5 10.5 11.5 4" />
    </svg>
  );
}

export function IconClose({ size = 14, ...props }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" {...props}>
      <line x1="3" y1="3" x2="11" y2="11" />
      <line x1="11" y1="3" x2="3" y2="11" />
    </svg>
  );
}

export function IconExpand({ size = 14, ...props }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <polyline points="9 1 13 1 13 5" />
      <polyline points="5 13 1 13 1 9" />
    </svg>
  );
}

export function IconCollapse({ size = 14, ...props }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <polyline points="13 5 9 5 9 1" />
      <polyline points="1 9 5 9 5 13" />
    </svg>
  );
}

export function IconMenu({ size = 16, ...props }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" {...props}>
      <line x1="2" y1="4" x2="14" y2="4" />
      <line x1="2" y1="8" x2="14" y2="8" />
      <line x1="2" y1="12" x2="14" y2="12" />
    </svg>
  );
}

export function IconArrowLeft({ size = 16, ...props }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <line x1="13" y1="8" x2="3" y2="8" />
      <polyline points="7 4 3 8 7 12" />
    </svg>
  );
}

export function IconSun({ size = 16, ...props }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" {...props}>
      <circle cx="8" cy="8" r="3" />
      <line x1="8" y1="1.5" x2="8" y2="3" />
      <line x1="8" y1="13" x2="8" y2="14.5" />
      <line x1="1.5" y1="8" x2="3" y2="8" />
      <line x1="13" y1="8" x2="14.5" y2="8" />
      <line x1="3.4" y1="3.4" x2="4.5" y2="4.5" />
      <line x1="11.5" y1="11.5" x2="12.6" y2="12.6" />
      <line x1="3.4" y1="12.6" x2="4.5" y2="11.5" />
      <line x1="11.5" y1="4.5" x2="12.6" y2="3.4" />
    </svg>
  );
}

export function IconMoon({ size = 16, ...props }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M13.5 8.5a5.5 5.5 0 1 1-6-6 4.5 4.5 0 0 0 6 6z" />
    </svg>
  );
}

export function IconSystem({ size = 16, ...props }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.3" {...props}>
      <circle cx="8" cy="8" r="5.5" />
      <path d="M8 2.5v11" stroke="none" fill="currentColor" opacity="0.4" />
      <path d="M8 2.5 A5.5 5.5 0 0 1 8 13.5 Z" fill="currentColor" opacity="0.4" />
    </svg>
  );
}
