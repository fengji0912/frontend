import { Metadata } from 'next';
import { unstable_setRequestLocale } from 'next-intl/server';

import TranslationMissingAlert from '@/components/TranslationMissingAlert/TranslationMissingAlert';

export const metadata: Metadata = {
  title: 'Contact us',
};

export default function Contact({
  params: { locale },
}: {
  params: { locale: string };
}) {
  unstable_setRequestLocale(locale);
  return (
    <div>
      <div className="container-box [&>p]:mb-3">
        <TranslationMissingAlert />

        <h1>Contact</h1>

        <p>
          For further information about the project please contact{' '}
          <a href="mailto:info@orkg.org">info@orkg.org</a>.
        </p>
        <p>
          You can get involved with the project in several ways, see{' '}
          <a
            href="https://www.orkg.org/orkg/about/21/Get_involved"
            target="_blank"
          >
            here
          </a>
          .
        </p>
        <p>You can find us at the following address:</p>
        <p>
          German National Library of Science and Technology (TIB)
          <br />
          Welfengarten 1 B&nbsp;
          <br />
          30167 Hannover
          <br />
          Germany
        </p>
        <p>
          For further information on how to reach us, please see{' '}
          <a
            href="https://www.tib.eu/en/tib/contact-information-and-contact-persons"
            target="_blank"
          >
            TIB contact information
          </a>
          .
        </p>
      </div>
    </div>
  );
}
