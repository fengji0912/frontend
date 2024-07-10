/**
 * @remarks Types for next-intl, see {@link https://next-intl-docs.vercel.app/docs/workflows/typescript}
 */
import en from '@/../messages/en.json';

type Messages = typeof en;

declare global {
  // Use type safe message keys with `next-intl`
  interface IntlMessages extends Messages {}
}
