const usdFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0
})

const toNumber = (value: number | string) => {
  const parsed = typeof value === 'string' ? Number(value) : value
  return Number.isFinite(parsed) ? parsed : 0
}

export const formatCurrency = (value: number | string) => usdFormatter.format(toNumber(value))

export const formatDelta = (value: number | string) => {
  const numeric = toNumber(value)
  const formatted = formatCurrency(Math.abs(numeric))
  return numeric < 0 ? `-${formatted}` : formatted
}
