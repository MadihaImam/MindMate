'use client';

import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarInset,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import { Logo } from '@/app/components/logo';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { DashboardNav } from './dashboard-nav';
import Link from 'next/link';
import { useAuth, useUser, useFirestore, useDoc, useMemoFirebase } from '@/firebase';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { doc } from 'firebase/firestore';
import type { UserProfile } from '@/lib/data';
import { Badge } from '@/components/ui/badge';
import { initiateAnonymousSignIn } from '@/firebase/non-blocking-login';
import { setDocumentNonBlocking } from '@/firebase/non-blocking-updates';
import { LifeBuoy, Shield } from 'lucide-react';

// IMPORTANT: Replace with your actual admin email
const ADMIN_EMAIL = 'admin@example.com';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const auth = useAuth();
  const firestore = useFirestore();
  const { user, isUserLoading } = useUser();
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    // Only sign in anonymously if we're done loading and there is no user.
    // This prevents a loop where we sign out and immediately sign back in anonymously.
    if (isClient && !isUserLoading && !user) {
        initiateAnonymousSignIn(auth).then(userCredential => {
            if (userCredential.user) {
                const userDocRef = doc(firestore, 'users', userCredential.user.uid);
                setDocumentNonBlocking(userDocRef, {
                    createdAt: new Date().toISOString(),
                    plan: 'free',
                }, { merge: true });
            }
        }).catch(error => {
            console.error("Anonymous sign-in failed:", error);
        });
    }
  }, [isClient, isUserLoading, user, auth, firestore]);


  if (isUserLoading || !isClient) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  // If there's no user and we're done loading, it means anonymous sign-in might have failed
  // or is in progress. We show loading to prevent flashing content.
  if (!user) {
      return (
          <div className="flex min-h-screen items-center justify-center">
              <p>Loading user session...</p>
          </div>
      );
  }

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
          <Logo asLink={false} />
        </SidebarHeader>
        <SidebarContent>
          <DashboardNav />
        </SidebarContent>
      </Sidebar>
      <SidebarInset>
        <header className="sticky top-0 z-40 flex h-14 items-center justify-between border-b bg-background px-4 lg:px-6">
          <SidebarTrigger className="md:hidden" />
          <div className="ml-auto">
            <UserNav />
          </div>
        </header>
        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}

function UserNav() {
  const auth = useAuth();
  const { user } = useUser();
  const firestore = useFirestore();
  const router = useRouter();

  const userDocRef = useMemoFirebase(() => {
      if (!user) return null;
      return doc(firestore, 'users', user.uid);
  }, [firestore, user]);

  const { data: userProfile } = useDoc<UserProfile>(userDocRef);

  const handleLogout = async () => {
    await auth.signOut();
    router.push('/login');
  };
  
  if (user?.isAnonymous) {
      return (
         <nav className="flex items-center space-x-2">
            <Button variant="ghost" asChild>
              <Link href="/login">Login</Link>
            </Button>
            <Button asChild>
              <Link href="/signup">Sign Up</Link>
            </Button>
          </nav>
      )
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <Avatar className="h-8 w-8">
            <AvatarImage src={user?.photoURL || "https://picsum.photos/seed/user-avatar/100/100"} alt="User" data-ai-hint="person face"/>
            <AvatarFallback>{user?.email?.[0].toUpperCase() || 'U'}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{user?.displayName || 'MindMate User'}</p>
            <p className="text-xs leading-none text-muted-foreground">
              {user?.email || 'user@example.com'}
            </p>
          </div>
        </DropdownMenuLabel>
        {userProfile?.plan && (
            <>
                <DropdownMenuSeparator />
                 <DropdownMenuItem disabled>
                    <div className='flex justify-between w-full items-center'>
                        <span>Plan</span>
                        <Badge variant={userProfile.plan === 'professional' ? 'default' : 'secondary'} className='capitalize'>{userProfile.plan}</Badge>
                    </div>
                </DropdownMenuItem>
            </>
        )}
        <DropdownMenuSeparator />
        {user?.email === ADMIN_EMAIL && (
            <DropdownMenuItem asChild>
                <Link href="/admin"><Shield className="mr-2 h-4 w-4" />Admin Panel</Link>
            </DropdownMenuItem>
        )}
        <DropdownMenuItem asChild>
            <Link href="/dashboard/settings">Settings</Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
           <Link href="/dashboard">
                <LifeBuoy className="mr-2 h-4 w-4" />
                Help & Feedback
            </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout}>
            Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
