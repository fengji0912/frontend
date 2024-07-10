import { Metadata } from 'next';
import { unstable_setRequestLocale } from 'next-intl/server';

import TranslationMissingAlert from '@/components/TranslationMissingAlert/TranslationMissingAlert';

export const metadata: Metadata = {
  title: 'Imprint',
};

export default function Imprint({
  params: { locale },
}: {
  params: { locale: string };
}) {
  unstable_setRequestLocale(locale);
  return (
    <div>
      <div className="container-box [&>p]:mb-3">
        <TranslationMissingAlert />
        <h1>Imprint</h1>
        Imprint for this website – also serves as provider identification
        according to § 5 Telemediengesetz (TMG)
        <h2>Provider:</h2>
        <p>
          Technische Informationsbibliothek (TIB) Welfengarten 1 B, 30167
          Hannover Postfach 6080, 30060 Hannover
        </p>
        <h2>Authorised Representative:</h2>
        <p>Prof. Dr. Sören Auer (Director of TIB)</p>
        <p>
          Technische Informationsbibliothek (TIB) is a foundation of public law
          of the state of Lower Saxony.
        </p>
        <h2>Responsible Supervisory Authority:</h2>
        <p>Ministry for Science and Culture of Lower Saxony</p>
        <h2>Contact:</h2>
        <p>
          Customer service phone: +49 511 762-8989 <br />
          Central information desk phone: +49 511 762-2268
          <br />
          Fax: +49 511 762-4076
          <br />
          Email: [information@tib.eu](mailto:information@tib.eu)
        </p>
        <h2>VAT (sales tax) registration number:</h2>
        <p>DE 214931803</p>
        <h2>Editorial Office:</h2>
        <p>
          Dr. Sandra Niemeyer; email:
          [sandra.niemeyer@tib.eu](mailto:sandra.niemeyer@tib.eu)
        </p>
        <h2>Copyright:</h2>
        <p>
          The layout of this website is protected under copyright, as are the
          graphics and all other contents contained in the website.
        </p>
      </div>
    </div>
  );
}
