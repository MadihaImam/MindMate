'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from '@/components/ui/sidebar';
import { Home, Settings, BotMessageSquare, Shield, History } from 'lucide-react';
import { useUser } from '@/firebase';

// IMPORTANT: Replace with your actual admin email
const ADMIN_EMAIL = 'admin@example.com';

export function DashboardNav() {
  const pathname = usePathname();
  const { user } = useUser();

  const items = [
    { href: '/dashboard', label: 'Dashboard', icon: <Home /> },
    { href: '/dashboard/editor', label: 'Editor', icon: <BotMessageSquare /> },
    { href: '/dashboard/history', label: 'History', icon: <History /> },
    { href: '/dashboard/settings', label: 'Settings', icon: <Settings /> },
  ];

  if (user?.email === ADMIN_EMAIL) {
    items.push({ href: '/admin', label: 'Admin', icon: <Shield /> });
  }

  return (
    <SidebarMenu>
      {items.map((item) => (
        <SidebarMenuItem key={item.href}>
          <SidebarMenuButton 
            asChild 
            isActive={item.href === '/dashboard' ? pathname === item.href : pathname.startsWith(item.href)}
            tooltip={item.label}>
            <Link href={item.href}>
              {item.icon}
              {item.label}
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
      ))}
    </SidebarMenu>
  );
}
