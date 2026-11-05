const currency = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' })

export const formatMoney = (value: number) => currency.format(value)

// Sum money safely: work in whole cents to avoid float errors like 0.1 + 0.2
export const sumMoney = (values: number[]) =>
  values.reduce((cents, v) => cents + Math.round(v * 100), 0) / 100