import {
  SET_CURRENCY, CURRENCY_TYPES,
} from '../constants/index';

export const setCurrency = (currencyCode) => ({
  type: SET_CURRENCY,
  currency: CURRENCY_TYPES[currencyCode],
});
