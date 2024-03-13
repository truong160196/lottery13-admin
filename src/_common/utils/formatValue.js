import numeral from "numeral";

numeral.localeData().delimiters.thousands = ",";

export function formatNumber(value = 0, format = "0,0") {
  if (value === null || value === undefined) return "0";
  return numeral(value).format(format);
}

export function formatCurrency(value = 0, symbol = "đ", format = "0,0") {
  if (value === null || value === undefined) return "0 đ";

  let currencySymbol = "đ";
  if (symbol) {
    currencySymbol = symbol;
  }

  return `${numeral(value).format(format)} ${currencySymbol}`;
}

export function formatMoney(number = 0, precision = 2) {
  const abbrev = ["", "ngàn", "triệu", "tỷ"];
  if (number === 0) return number;

  const tier = Math.floor(Math.log10(Math.abs(number)) / 3);

  const suffix = abbrev[tier];
  const scale = 10 ** (tier * 3);

  const scaled = number / scale;

  return `${scaled.toLocaleString(undefined, {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  })} ${suffix}`;
}
