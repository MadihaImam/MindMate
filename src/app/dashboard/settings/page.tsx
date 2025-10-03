'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { useUser, useFirestore } from '@/firebase';
import { doc } from 'firebase/firestore';
import { updateProfile } from 'firebase/auth';
import { updateDocumentNonBlocking } from '@/firebase/non-blocking-updates';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';


const profileSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
});


export default function SettingsPage() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const { toast } = useToast();
  const { user } = useUser();
  const firestore = useFirestore();

  const form = useForm<z.infer<typeof profileSchema>>({
    resolver: zodResolver(profileSchema),
    values: {
      name: user?.displayName || '',
    },
  });

  useEffect(() => {
    const isDark = document.documentElement.classList.contains('dark');
    setIsDarkMode(isDark);
  }, []);

  const handleThemeChange = (checked: boolean) => {
    setIsDarkMode(checked);
    if (checked) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };
  
  async function onSubmit(values: z.infer<typeof profileSchema>) {
    if (!user) {
        toast({ variant: "destructive", title: "Error", description: "You must be logged in." });
        return;
    }
    try {
        await updateProfile(user, { displayName: values.name });
        const userDocRef = doc(firestore, 'users', user.uid);
        updateDocumentNonBlocking(userDocRef, { name: values.name });

        toast({
            title: "Changes Saved",
            description: "Your profile information has been updated."
        });
    } catch (error) {
        console.error("Error updating profile: ", error);
        toast({
            variant: "destructive",
            title: "Error",
            description: "Failed to update profile."
        });
    }
  }

  return (
    <div className="space-y-8 max-w-2xl">
      <h1 className="font-headline text-3xl font-bold">Settings</h1>
      
      <Card>
        <CardHeader>
          <CardTitle className="font-headline">Profile</CardTitle>
          <CardDescription>Update your personal information.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                 <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" value={user?.email || ''} disabled />
                </div>
              <Button type="submit">Save Changes</Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="font-headline">Appearance</CardTitle>
          <CardDescription>Customize the look and feel of the app.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between rounded-lg border p-4">
            <div>
              <Label htmlFor="dark-mode" className="text-base">Dark Mode</Label>
              <p className="text-sm text-muted-foreground">Enable dark theme for the application.</p>
            </div>
            <Switch id="dark-mode" checked={isDarkMode} onCheckedChange={handleThemeChange} aria-label="Toggle dark mode" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
