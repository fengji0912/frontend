import { faCookieBite } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { cookies } from 'next/headers';
import Link from 'next/link';

import CookieAcceptButton from '@/app/(layout)/CookieNotification/CookieAcceptButton/CookieAcceptButton';
import ROUTES from '@/constants/routes';

export default function CookieNotification() {
  const cookieStore = cookies();
  const isCookieWarningDismissed = cookieStore.get('isCookieWarningDismissed');

  return !isCookieWarningDismissed ? (
    <div
      className="w-72 box-white rounded-3xl shadow-box p-6 fixed bottom-4 right-4"
      style={{ cursor: 'auto' }}
    >
      <div className="flex justify-center -mt-10 mb-3">
        <FontAwesomeIcon icon={faCookieBite} size="4x" color="#865700" />
      </div>
      <span className="w-full block leading-normal text-md mb-3">
        We use cookies to provide a better user experience.
      </span>
      <div className="flex items-center justify-between">
        <Link href={ROUTES.DATA_PROTECTION} className="text-xs  mr-1 ">
          Data Protection
        </Link>
        <CookieAcceptButton />
      </div>
    </div>
  ) : null;
}
