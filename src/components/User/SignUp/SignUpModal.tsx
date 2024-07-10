'use client';

import {
  Button,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from '@nextui-org/react';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { useFormState } from 'react-dom';

import Alert from '@/components/Alert/Alert';
import ButtonFormSubmit from '@/components/ButtonFormSubmit/ButtonFormSubmit';
import { Link } from '@/components/Navigation/Navigation';
import Checkbox from '@/components/NextUi/Checkbox/Checkbox';
import Input from '@/components/NextUi/Input/Input';
import { LinkButton } from '@/components/NextUi/LinkButton/LinkButton';
import Modal from '@/components/NextUi/Modal/Modal';
import { signUp } from '@/components/User/actions/actions';
import ROUTES from '@/constants/routes';

export default function SignUpModal({
  onOpenChange,
  handleSignInClick,
}: {
  onOpenChange: () => void;
  handleSignInClick: () => void;
}) {
  const t = useTranslations();
  const [hasAcceptedTerms, setHasAcceptedTerms] = useState(false);
  const [hasAcceptedPrivacyStatement, setHasAcceptedPrivacyStatement] =
    useState(false);
  const [state, formAction] = useFormState(signUp, {
    error: '',
    data: {},
    success: false,
  });

  return (
    <Modal isOpen onOpenChange={onOpenChange}>
      <ModalContent>
        <ModalHeader>{t('sad_tense_wasp_rise')}</ModalHeader>
        <form action={formAction}>
          <ModalBody>
            {state?.error && <Alert color="danger">{state.error}</Alert>}
            {state?.success ? (
              <Alert color="success">
                {t('strong_antsy_pelican_lead')}{' '}
                <Button
                  color="primary"
                  className="ms-2"
                  onPress={handleSignInClick}
                >
                  {t('ago_knotty_anteater_kick')}
                </Button>
              </Alert>
            ) : (
              <>
                <Input
                  label={t('blue_helpful_blackbird_favor')}
                  type="text"
                  name="name"
                  isRequired
                  isInvalid={!!state?.data?.name}
                  errorMessage={state?.data?.name?.message}
                />
                <Input
                  label={t('brief_bad_puffin_fear')}
                  type="email"
                  name="email"
                  isRequired
                  isInvalid={!!state?.data?.email}
                  errorMessage={state?.data?.email?.message}
                />
                <Input
                  label={t('cute_fresh_pigeon_gasp')}
                  type="password"
                  name="password"
                  isRequired
                  isInvalid={!!state?.data?.password}
                  errorMessage={state?.data?.password?.message}
                />
                <Checkbox
                  size="sm"
                  isRequired
                  isSelected={hasAcceptedTerms}
                  onChange={(v) => setHasAcceptedTerms(v.target.checked)}
                >
                  {t.rich('empty_weird_cheetah_greet', {
                    link: (chunks) => (
                      <Link href={ROUTES.TERMS_OF_USE} target="_blank">
                        {chunks}
                      </Link>
                    ),
                  })}
                </Checkbox>
                <Checkbox
                  size="sm"
                  isRequired
                  isSelected={hasAcceptedPrivacyStatement}
                  onChange={(v) =>
                    setHasAcceptedPrivacyStatement(v.target.checked)
                  }
                >
                  {t.rich('green_only_pug_hope', {
                    linkDataProtection: (chunks) => (
                      <Link href={ROUTES.DATA_PROTECTION} target="_blank">
                        {chunks}
                      </Link>
                    ),
                    linkInfoSheet: (chunks) => (
                      <Link
                        href="infosheet-data-protection.pdf"
                        target="_blank"
                      >
                        {chunks}
                      </Link>
                    ),
                  })}
                </Checkbox>
              </>
            )}
          </ModalBody>
          {!state?.success && (
            <ModalFooter className="flex justify-between ">
              <span className="flex items-center">
                {t('bright_alive_insect_emerge')}
                <LinkButton
                  variant="link"
                  onPress={handleSignInClick}
                  className="ms-2"
                  size="md"
                >
                  {t('mad_north_mongoose_care')}
                </LinkButton>
              </span>
              <ButtonFormSubmit
                color="primary"
                type="submit"
                isDisabled={!hasAcceptedTerms || !hasAcceptedPrivacyStatement}
              >
                {t('minor_simple_dolphin_sew')}
              </ButtonFormSubmit>
            </ModalFooter>
          )}
        </form>
      </ModalContent>
    </Modal>
  );
}
