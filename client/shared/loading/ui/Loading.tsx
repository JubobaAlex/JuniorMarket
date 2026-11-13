import '../style/Loading.css';

export default function Loading({
  size = 48,
  color = '#c2410c',
  thickness = 5,
  centered = false,
  overlay = false,
}) {
  const spinner = (
    <svg
      width={size}
      height={size}
      viewBox="0 0 50 50"
      className="svg-loading"
      role="progressbar"
      aria-valuetext="Loading"
    >
      <circle
        className="svg-loading__circle"
        cx="25"
        cy="25"
        r="20"
        fill="none"
        stroke={color}
        strokeWidth={thickness}
        strokeLinecap="round"
      />
    </svg>
  );

  if (!centered && !overlay) return spinner;

  return (
    <div className={`svg-loading__wrap ${overlay ? 'svg-loading__wrap--overlay' : ''}`}>
      {spinner}
    </div>
  );
}