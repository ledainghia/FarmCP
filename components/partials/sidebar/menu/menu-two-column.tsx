'use client';

import React from 'react';
import { Ellipsis, LogOut } from 'lucide-react';

import { cn } from '@/lib/utils';
import { getMenuList, type Group, type Menu, type Submenu } from '@/lib/menus';

import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
} from '@/components/ui/tooltip';
import { useConfig } from '@/hooks/use-config';
import MenuLabel from '../common/menu-label';

import MenuItem from '../common/menu-item';
import { CollapseMenuButton } from '../common/collapse-menu-button';
import MenuWidget from '../common/menu-widget';
import SearchBar from '@/components/partials/sidebar/common/search-bar';
import TeamSwitcher from '../common/farm-switcher';
import IconNav from './icon-nav';
import SidebarNav from './sideabr-nav';
import { useTranslations } from 'next-intl';
import { usePathname } from 'next/navigation';

export function MenuTwoColumn() {
  // translate
  const t = useTranslations('Menu');
  const pathname = usePathname() || '';
  const menuList = getMenuList(pathname);

  return (
    <>
      <IconNav menuList={menuList} />
      <SidebarNav menuList={menuList} />
    </>
  );
}
