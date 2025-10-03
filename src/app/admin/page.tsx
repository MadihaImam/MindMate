'use client';

import { useUser, useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo } from 'react';
import { collection } from 'firebase/firestore';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Users, MessageSquare } from 'lucide-react';
import type { Feedback, UserProfile } from '@/lib/data';

// IMPORTANT: Replace with your actual admin email
const ADMIN_EMAIL = 'admin@example.com';

export default function AdminPage() {
  const { user, isUserLoading } = useUser();
  const router = useRouter();
  const firestore = useFirestore();

  const usersCollection = useMemoFirebase(() => collection(firestore, 'users'), [firestore]);
  const feedbackCollection = useMemoFirebase(() => collection(firestore, 'feedback'), [firestore]);

  const { data: users, isLoading: isUsersLoading } = useCollection<UserProfile>(usersCollection);
  const { data: feedback, isLoading: isFeedbackLoading } = useCollection<Feedback>(feedbackCollection);
  
  const sortedFeedback = useMemo(() => {
    if (!feedback) return [];
    return [...feedback].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [feedback]);


  useEffect(() => {
    if (!isUserLoading && (!user || user.email !== ADMIN_EMAIL)) {
      router.replace('/dashboard');
    }
  }, [user, isUserLoading, router]);

  if (isUserLoading || !user || user.email !== ADMIN_EMAIL) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p>Loading & Verifying Access...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <h1 className="font-headline text-3xl font-bold">Admin Dashboard</h1>
      
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isUsersLoading ? (
                <Skeleton className="h-8 w-1/4" />
            ) : (
                <div className="text-2xl font-bold">{users?.length || 0}</div>
            )}
            <p className="text-xs text-muted-foreground">Total registered users in the system</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Feedback Entries</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
             {isFeedbackLoading ? (
                <Skeleton className="h-8 w-1/4" />
            ) : (
                <div className="text-2xl font-bold">{feedback?.length || 0}</div>
            )}
            <p className="text-xs text-muted-foreground">Total feedback submissions from users</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>User Feedback</CardTitle>
          <CardDescription>The latest feedback submitted by users.</CardDescription>
        </CardHeader>
        <CardContent>
            {isFeedbackLoading ? (
                <div className="space-y-4">
                    <Skeleton className="h-16 w-full" />
                    <Skeleton className="h-16 w-full" />
                    <Skeleton className="h-16 w-full" />
                </div>
            ) : sortedFeedback && sortedFeedback.length > 0 ? (
                 <ul className="space-y-4">
                    {sortedFeedback.map((item) => (
                        <li key={item.id} className="rounded-lg border p-4">
                            <p className="text-sm">{item.feedback}</p>
                            <div className="text-xs text-muted-foreground mt-2 flex justify-between">
                                <span>From: {item.email || 'Anonymous'}</span>
                                <span>{new Date(item.createdAt).toLocaleString()}</span>
                            </div>
                        </li>
                    ))}
                 </ul>
            ) : (
                <p className="text-sm text-muted-foreground text-center py-8">No feedback has been submitted yet.</p>
            )}
        </CardContent>
      </Card>
    </div>
  );
}
