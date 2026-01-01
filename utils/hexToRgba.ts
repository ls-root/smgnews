export default function hexToRgba(hex: string, alpha: number = 100) {
  const cleanHex = hex.replace("#", "")
  const bigint = parseInt(cleanHex, 16)

  const r = (bigint >> 16) & 255
  const g = (bigint >> 8) & 255
  const b = bigint & 255

  return `rgba(${r},${g},${b},${alpha})`
}
