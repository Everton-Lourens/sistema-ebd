import { format } from '../../../../../utils/format'

export function CustomLabel({
  x,
  y,
  width,
  fill,
  value,
  formatToReal = false,
}: any) {
  return (
    <text
      style={{
        fontWeight: '700',
      }}
      x={x + width / 2}
      y={y}
      fontSize="15"
      fontFamily="Poppins"
      textAnchor="middle"
      dominantBaseline="middle"
      fill={fill}
    >
      {formatToReal ? format.formatToReal(value) : value}
    </text>
  )
}
