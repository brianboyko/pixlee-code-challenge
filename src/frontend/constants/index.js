//actions
export const HYDRATE = 'HYDRATE';

//languages
export const SET_LANGUAGE = "SET_LANGUAGE";
export const SET_PROCESSING = "SET_PROCESSING";
export const SET_CURRENCY = "SET_CURRENCY";
export const CURRENCY_TYPES = {
  USD: {
    name: "U.S. Dollars",
    abbr: "USD",
    symbol: "$",
    amounts: [1000, 2500, 5000, 10000, 25000, 50000, 100000, 250000, 500000]
  }
};

export const READY = "READY";
export const PROCESSING = "PROCESSING";
export const SUCCESS = "SUCCESS";
export const FAIL = "FAIL";
