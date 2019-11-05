export const formatDate = (date, locale, dateLocaleOptions) => new Date(date).toLocaleDateString(locale, dateLocaleOptions);

export const formatDateShort = date => formatDate(date, undefined, { month: 'short', day: 'numeric' });
