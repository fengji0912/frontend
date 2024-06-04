'use client';

import {
  faArrowRightFromBracket,
  faUser,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  Avatar,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  useDisclosure,
} from '@nextui-org/react';
import { useTransition } from 'react';
import useSWR, { useSWRConfig } from 'swr';

import { useRouter } from '@/components/Navigation/Navigation';
import Dropdown from '@/components/NextUi/Dropdown/Dropdown';
import AccountSettingsModal from '@/components/User/AccountSettings/AccountSettingsModal';
import { getUserData, signOut } from '@/components/User/actions/actions';
import ChangePasswordModal from '@/components/User/ChangePassword/ChangePasswordModal';

export default function User() {
  const router = useRouter();
  const [isLoading, startTransition] = useTransition();
  const { mutate } = useSWRConfig();

  const {
    isOpen: isOpenAccountSettingsModal,
    onOpen: onOpenAccountSettingsModal,
    onClose: onCloseAccountSettingsModal,
    onOpenChange: onOpenChangeAccountSettingsModal,
  } = useDisclosure();

  const {
    isOpen: isOpenChangePasswordModal,
    onOpen: onOpenChangePasswordModal,
    onOpenChange: onOpenChangeChangePasswordModal,
  } = useDisclosure();

  const { data: user } = useSWR('getUserData', getUserData);

  const handleSignOutClick = () => {
    startTransition(() => {
      signOut();
      router.refresh();
      mutate('getUserData', null);
      mutate('checkIfAuthenticated', false);
    });
  };

  const handleChangePasswordClick = () => {
    onCloseAccountSettingsModal();
    onOpenChangePasswordModal();
  };

  return user ? (
    <div>
      <Dropdown placement="bottom-end" isDisabled={isLoading}>
        <DropdownTrigger>
          <Avatar
            as="button"
            src={`https://gravatar.com/avatar/${user.emailHash}?d=retro&r=g&s=100`}
          />
        </DropdownTrigger>
        <DropdownMenu aria-label="Static Actions">
          <DropdownItem
            onPress={onOpenAccountSettingsModal}
            startContent={
              <FontAwesomeIcon icon={faUser} className="text-secondary" />
            }
          >
            Account settings
          </DropdownItem>
          <DropdownItem onPress={handleSignOutClick}>
            <FontAwesomeIcon
              icon={faArrowRightFromBracket}
              className="text-secondary me-2"
            />
            Sign out
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>
      {isOpenAccountSettingsModal && (
        <AccountSettingsModal
          onOpenChange={onOpenChangeAccountSettingsModal}
          handleChangePasswordClick={handleChangePasswordClick}
        />
      )}
      {isOpenChangePasswordModal && (
        <ChangePasswordModal onOpenChange={onOpenChangeChangePasswordModal} />
      )}
    </div>
  ) : null;
}
