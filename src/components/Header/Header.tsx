'use client';

import { faLightbulb, faMoon } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  Button,
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  NavbarMenu,
  NavbarMenuItem,
  NavbarMenuToggle,
} from '@nextui-org/react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { useTheme } from 'next-themes';
import { useState } from 'react';

import logo from '@/assets/images/logo.svg';
import User from '@/components/Header/User/User';
import { Link, usePathname } from '@/components/Navigation/Navigation';
import useAuth from '@/components/User/hooks/useAuth';
import SignIn from '@/components/User/SignIn/SignIn';
import ROUTES from '@/constants/routes';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();
  const { isAuthenticated } = useAuth();
  const { resolvedTheme, setTheme } = useTheme();
  const t = useTranslations();

  const MENU_ITEMS = [
    {
      label: t('sound_quiet_bobcat_support'),
      href: ROUTES.SEARCH,
    },
    {
      label: t('teary_low_angelfish_kiss'),
      href: ROUTES.MY_LIBRARY,
    },
  ];

  return (
    <Navbar
      maxWidth="2xl"
      onMenuOpenChange={setIsMenuOpen}
      isMenuOpen={isMenuOpen}
      className="bg-[#dbe3e8bd] dark:bg-secondary-950 backdrop-blur"
      id="header"
    >
      <NavbarContent className="flex md:gap-10" justify="start">
        <NavbarMenuToggle
          aria-label={
            isMenuOpen
              ? t('awake_equal_bumblebee_drop')
              : t('tasty_sound_bee_cry')
          }
          className="md:hidden"
        />
        <NavbarItem className="shrink-0">
          <NavbarBrand className="me-5">
            <Link href={ROUTES.HOME} className="relative">
              <Image src={logo} alt={t('gaudy_dirty_racoon_ask')} width={130} />
              <div className="bg-secondary-200 leading-3 text-secondary-900 dark:text-foreground rounded-full font-semibold text-xs py-[1px] px-2 absolute bottom-[-3px] right-0">
                {
                  // eslint-disable-next-line react/jsx-no-literals
                }
                Ask
              </div>
            </Link>
          </NavbarBrand>
        </NavbarItem>
        {MENU_ITEMS.map(({ label, href }) => (
          <NavbarItem
            className="hidden md:block"
            key={label}
            isActive={pathname.startsWith(href)}
          >
            <Link href={href} className="text-inherit">
              {label}
            </Link>
          </NavbarItem>
        ))}
      </NavbarContent>
      <NavbarContent justify="end">
        <Button
          isIconOnly
          color="secondary"
          variant="flat"
          onPress={() => setTheme(resolvedTheme === 'light' ? 'dark' : 'light')}
          aria-label={t('whole_broad_marmot_surge')}
        >
          <FontAwesomeIcon
            icon={resolvedTheme === 'light' ? faMoon : faLightbulb}
            size="lg"
          />
        </Button>
        {/* <LanguageSelector /> */}
        <NavbarItem>{isAuthenticated ? <User /> : <SignIn />}</NavbarItem>
      </NavbarContent>
      <NavbarMenu>
        {MENU_ITEMS.map(({ label, href }) => (
          <NavbarMenuItem key={label} isActive={pathname.startsWith(href)}>
            <Link href={href} onClick={() => setIsMenuOpen(false)}>
              {label}
            </Link>
          </NavbarMenuItem>
        ))}
      </NavbarMenu>
    </Navbar>
  );
}
