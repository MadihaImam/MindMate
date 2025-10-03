'use client';

import Link from 'next/link';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { SavedItem } from '@/lib/data';
import { Copy, Star, MoreVertical, Trash2, Send } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useToast } from '@/hooks/use-toast';
import { useState, useMemo } from 'react';
import { useCollection, useUser, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, doc, deleteDoc, updateDoc } from 'firebase/firestore';
import { addDocumentNonBlocking } from '@/firebase/non-blocking-updates';
import { Skeleton } from '@/components/ui/skeleton';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

export default function DashboardPage() {
  const { toast } = useToast();
  const { user } = useUser();
  const firestore = useFirestore();

  const itemsCollection = useMemoFirebase(() => {
    if (!user) return null;
    return collection(firestore, 'users', user.uid, 'items');
  }, [firestore, user]);

  const { data: items, isLoading } = useCollection<SavedItem>(itemsCollection);

  const handleToggleFavorite = (id: string, currentFavorite: boolean) => {
    if (!user) return;
    const itemRef = doc(firestore, 'users', user.uid, 'items', id);
    updateDoc(itemRef, { favorite: !currentFavorite });
    toast({
      title: !currentFavorite ? 'Added to Favorites' : 'Removed from Favorites',
    });
  };

  const handleDelete = (id: string, title: string) => {
    if (!user) return;
    const itemRef = doc(firestore, 'users', user.uid, 'items', id);
    deleteDoc(itemRef);
    toast({
      title: 'Deleted',
      description: `"${title}" has been deleted.`,
      variant: 'destructive',
    });
  };

  const recentItems = useMemo(() => {
    if (!items) return [];
    return [...items].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 4);
  }, [items]);
  
  const editorLink = (item: SavedItem) => `/dashboard/editor?title=${encodeURIComponent(item.title)}&content=${encodeURIComponent(item.content)}&type=${item.type}`;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-headline text-3xl font-bold">Dashboard</h1>
        <Button asChild>
          <Link href="/dashboard/editor">New Item</Link>
        </Button>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
            <Card>
                <CardHeader>
                    <CardTitle>Recent Items</CardTitle>
                    <CardDescription>Your most recently created content.</CardDescription>
                </CardHeader>
                <CardContent>
                    {isLoading ? (
                      <div className="grid gap-6 md:grid-cols-2">
                        {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-40 w-full" />)}
                      </div>
                    ) : recentItems.length > 0 ? (
                      <div className="grid gap-6 md:grid-cols-2">
                        {recentItems.map(item => (
                          <Card key={item.id} className="flex flex-col h-full transition-shadow hover:shadow-md">
                            <CardHeader>
                              <div className="flex items-start justify-between">
                                <Link href={editorLink(item)} className="space-y-2 group flex-grow mr-2">
                                  <Badge variant={item.type === 'summary' ? 'default' : item.type === 'rewrite' ? 'secondary' : 'outline'} className="capitalize">
                                    {item.type === 'keywords' ? 'extract' : item.type}
                                  </Badge>
                                  <CardTitle className="font-headline text-lg line-clamp-2 group-hover:text-primary transition-colors">
                                    {item.title}
                                  </CardTitle>
                                </Link>
                                <ItemActions item={item} onToggleFavorite={() => handleToggleFavorite(item.id, item.favorite)} onDelete={() => handleDelete(item.id, item.title)} />
                              </div>
                            </CardHeader>
                            <Link href={editorLink(item)} className="flex-grow group">
                              <CardContent>
                                <CardDescription className="line-clamp-2 group-hover:text-foreground transition-colors">
                                  {item.content}
                                </CardDescription>
                              </CardContent>
                            </Link>
                            <CardFooter className="text-xs text-muted-foreground mt-auto pt-4">
                              Created on {new Date(item.createdAt).toLocaleDateString()}
                            </CardFooter>
                          </Card>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-16 text-muted-foreground">
                        <p>No recent items. Create one in the editor!</p>
                      </div>
                    )}
                </CardContent>
                 {items && items.length > 4 && (
                    <CardFooter>
                        <Button variant="outline" className="w-full" asChild>
                            <Link href="/dashboard/history">View All Items</Link>
                        </Button>
                    </CardFooter>
                )}
            </Card>
        </div>

        <div className="lg:col-span-1">
          <FeedbackCard />
        </div>
      </div>
    </div>
  );
}


function ItemActions({
  item,
  onToggleFavorite,
  onDelete,
}: {
  item: SavedItem;
  onToggleFavorite: () => void;
  onDelete: () => void;
}) {
  const { toast } = useToast();

  const handleCopy = () => {
    navigator.clipboard.writeText(item.content);
    toast({
      title: 'Copied!',
      description: 'Content has been copied to your clipboard.',
    });
  };

  return (
    <div className="flex items-center gap-1 -mr-2 -mt-2 shrink-0">
      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onToggleFavorite} aria-label="Toggle Favorite">
        <Star className={`h-4 w-4 transition-colors ${item.favorite ? 'fill-accent text-accent' : 'text-muted-foreground'}`} />
      </Button>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="h-8 w-8" aria-label="More options">
            <MoreVertical className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={handleCopy}>
            <Copy className="mr-2 h-4 w-4" />
            Copy
          </DropdownMenuItem>
          <DropdownMenuItem onClick={onDelete} className="text-destructive focus:text-destructive focus:bg-destructive/10">
            <Trash2 className="mr-2 h-4 w-4" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

function FeedbackCard() {
    const { toast } = useToast();
    const { user } = useUser();
    const firestore = useFirestore();
    const [feedback, setFeedback] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user || !feedback.trim()) {
            toast({
                variant: 'destructive',
                title: 'Error',
                description: 'You must be logged in and enter feedback to submit.',
            });
            return;
        }
        setIsSubmitting(true);
        const feedbackCollection = collection(firestore, 'feedback');
        
        try {
            await addDocumentNonBlocking(feedbackCollection, {
                userId: user.uid,
                email: user.email || 'anonymous',
                feedback: feedback,
                createdAt: new Date().toISOString(),
            });
            toast({
                title: 'Feedback Submitted!',
                description: 'Thank you for helping us improve MindMate.',
            });
            setFeedback('');
        } catch (error) {
            toast({
                variant: 'destructive',
                title: 'Submission Failed',
                description: 'Could not submit your feedback. Please try again.',
            });
        } finally {
            setIsSubmitting(false);
        }
    };
    
    return (
        <Card>
            <CardHeader>
                <CardTitle>Help & Feedback</CardTitle>
                <CardDescription>Have a suggestion or an issue? Let us know!</CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid w-full gap-1.5">
                        <Label htmlFor="feedback-input">Your Message</Label>
                        <Textarea
                            id="feedback-input"
                            placeholder="I would love a feature that..."
                            className="min-h-[120px]"
                            value={feedback}
                            onChange={(e) => setFeedback(e.target.value)}
                        />
                    </div>
                     <Button type="submit" className="w-full" disabled={isSubmitting}>
                        {isSubmitting ? 'Submitting...' : <> <Send className="mr-2 h-4 w-4" /> Submit Feedback </>}
                    </Button>
                </form>
            </CardContent>
        </Card>
    );
}