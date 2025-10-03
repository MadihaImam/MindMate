'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
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
import { Copy, Star, MoreVertical, Trash2, ArrowLeft } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useToast } from '@/hooks/use-toast';
import { useState, useMemo } from 'react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useCollection, useUser, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, doc, deleteDoc, updateDoc } from 'firebase/firestore';
import { Skeleton } from '@/components/ui/skeleton';

type FilterType = 'all' | 'generate' | 'summary' | 'rewrite' | 'extract' | 'humanize' | 'favorites';

export default function HistoryPage() {
  const { toast } = useToast();
  const { user } = useUser();
  const firestore = useFirestore();
  const [filter, setFilter] = useState<FilterType>('all');
  const router = useRouter();

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

  const sortedItems = useMemo(() => {
    if (!items) return [];
    return [...items].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [items]);

  const filteredItems = useMemo(() => {
    if (filter === 'all') return sortedItems;
    if (filter === 'favorites') return sortedItems.filter(item => item.favorite);
    const typeToFilter = filter === 'extract' ? 'keywords' : filter;
    return sortedItems.filter(
      item =>
        item.type === typeToFilter ||
        (item.type === 'keywords' && filter === 'extract')
    );
  }, [sortedItems, filter]);

  const editorLink = (item: SavedItem) =>
    `/dashboard/editor?title=${encodeURIComponent(item.title)}&content=${encodeURIComponent(item.content)}&type=${item.type}`;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="font-headline text-3xl font-bold">History</h1>
      </div>
      <p className="text-muted-foreground">
        View, manage, and filter all of your saved content.
      </p>

      <Tabs
        value={filter}
        onValueChange={value => setFilter(value as FilterType)}
      >
        <TabsList className="grid w-full grid-cols-3 sm:grid-cols-4 md:grid-cols-7 h-auto">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="generate">Generated</TabsTrigger>
          <TabsTrigger value="summary">Summaries</TabsTrigger>
          <TabsTrigger value="rewrite">Rewrites</TabsTrigger>
          <TabsTrigger value="extract">Extractions</TabsTrigger>
          <TabsTrigger value="humanize">Humanized</TabsTrigger>
          <TabsTrigger value="favorites">Favorites</TabsTrigger>
        </TabsList>
      </Tabs>
      
      {isLoading ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {[...Array(8)].map((_, i) => <Skeleton key={i} className="h-48 w-full" />)}
          </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredItems.map(item => (
            <Card
              key={item.id}
              className="flex flex-col h-full transition-shadow hover:shadow-md"
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <Link
                    href={editorLink(item)}
                    className="space-y-2 group flex-grow mr-2"
                  >
                    <Badge
                      variant={
                        item.type === 'summary'
                          ? 'default'
                          : item.type === 'rewrite'
                          ? 'secondary'
                          : 'outline'
                      }
                      className="capitalize"
                    >
                      {item.type === 'keywords' ? 'extract' : item.type}
                    </Badge>
                    <CardTitle className="font-headline text-lg line-clamp-2 group-hover:text-primary transition-colors">
                      {item.title}
                    </CardTitle>
                  </Link>
                  <ItemActions
                    item={item}
                    onToggleFavorite={() => handleToggleFavorite(item.id, item.favorite)}
                    onDelete={() => handleDelete(item.id, item.title)}
                  />
                </div>
              </CardHeader>
              <Link href={editorLink(item)} className="flex-grow group">
                <CardContent>
                  <CardDescription className="line-clamp-3 group-hover:text-foreground transition-colors">
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
      )}

      {!isLoading && filteredItems.length === 0 && (
        <div className="col-span-full text-center py-16 text-muted-foreground">
          <p>No items found for this filter. Create one in the editor!</p>
        </div>
      )}
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
      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8"
        onClick={onToggleFavorite}
        aria-label="Toggle Favorite"
      >
        <Star
          className={`h-4 w-4 transition-colors ${
            item.favorite ? 'fill-accent text-accent' : 'text-muted-foreground'
          }`}
        />
      </Button>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            aria-label="More options"
          >
            <MoreVertical className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={handleCopy}>
            <Copy className="mr-2 h-4 w-4" />
            Copy
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={onDelete}
            className="text-destructive focus:text-destructive focus:bg-destructive/10"
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
