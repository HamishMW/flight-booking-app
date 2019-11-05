export function formatMoney(value) {
  return new Intl.NumberFormat('en-AU', {
    style: 'currency',
    currency: 'AUD',
    maximumSignificantDigits: 3
  }).format(value);
}
