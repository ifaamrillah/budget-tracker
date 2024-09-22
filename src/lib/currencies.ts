export const Currencies = [
  {
    label: "$ Dollar",
    value: "USD",
    locale: "en-US",
  },
  {
    label: "Rp Rupiah",
    value: "IDR",
    locale: "id-ID",
  },
];

export type Currency = (typeof Currencies)[0];
