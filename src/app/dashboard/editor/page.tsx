'use client';

import React, { useState, useActionState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { useFormStatus } from 'react-dom';
import { runAiAction } from '@/app/actions';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { Sparkles, Bot, Copy, Save, Crown } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Input } from '@/components/ui/input';
import { useFirestore, useUser, useDoc, useMemoFirebase } from '@/firebase';
import { addDocumentNonBlocking } from '@/firebase/non-blocking-updates';
import { collection, doc } from 'firebase/firestore';
import type { UserProfile } from '@/lib/data';
import Link from 'next/link';

const initialState = {
  success: false,
  data: '',
  error: '',
  mode: 'summarize' as AiMode,
};

type AiMode = 'summarize' | 'rewrite' | 'extract' | 'humanize' | 'generate';

const proTones = ['witty', 'persuasive'];

function EditorPageContent() {
  const searchParams = useSearchParams();
  const [state, formAction] = useActionState(runAiAction, initialState);
  const { toast } = useToast();
  const firestore = useFirestore();
  const { user } = useUser();

  const userDocRef = useMemoFirebase(() => {
    if (!user) return null;
    return doc(firestore, "users", user.uid);
  }, [firestore, user]);
  const { data: userProfile } = useDoc<UserProfile>(userDocRef);
  
  const isPro = userProfile?.plan === 'professional';

  const initialMode = searchParams.get('type') as AiMode | null;
  const initialContent = searchParams.get('content') || '';
  
  const [aiMode, setAiMode] = useState<AiMode>(initialMode || 'summarize');
  const [tone, setTone] = useState('professional');
  const [inputText, setInputText] = useState('');
  const [prompt, setPrompt] = useState('');

  useEffect(() => {
    if (initialContent) {
      setInputText(initialContent);
    }
  }, [initialContent]);

  useEffect(() => {
    if (initialMode) {
      setAiMode(initialMode);
    }
  }, [initialMode]);

  const handleSave = () => {
    if (!user || !state.data) {
        toast({
            variant: "destructive",
            title: "Error saving",
            description: "You must be logged in and have generated content to save.",
        });
        return;
    }
    
    const itemsCollection = collection(firestore, 'users', user.uid, 'items');
    
    let title = "New Item";
    if (state.mode === 'generate' && prompt) {
        title = prompt.length > 30 ? prompt.substring(0, 27) + '...' : prompt;
    } else if (inputText) {
        title = inputText.length > 30 ? inputText.substring(0, 27) + '...' : inputText;
    }

    addDocumentNonBlocking(itemsCollection, {
        userId: user.uid,
        type: state.mode,
        title: title,
        content: state.data,
        createdAt: new Date().toISOString(),
        favorite: false,
    });

    toast({
        title: "Saved!",
        description: "Your content has been saved to your dashboard.",
    });
  }

  return (
    <form action={formAction}>
      <input type="hidden" name="mode" value={aiMode} />
      {aiMode === 'rewrite' && <input type="hidden" name="tone" value={tone} />}
      <div className="grid gap-8 lg:grid-cols-2">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="font-headline">Your Content</CardTitle>
            <CardDescription>Enter the text you want to process with AI.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {aiMode === 'generate' ? (
                 <div className="grid w-full gap-1.5 animate-in fade-in">
                    <Label htmlFor="prompt-input">Prompt</Label>
                    <Input
                        id="prompt-input"
                        name="prompt"
                        placeholder="e.g., A blog post about the benefits of remote work"
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        required
                    />
                </div>
            ) : (
                <div className="grid w-full gap-1.5">
                <Label htmlFor="text-input">Text</Label>
                <Textarea
                    id="text-input"
                    name="text"
                    placeholder="Paste your article, email, or any other text here..."
                    className="min-h-[300px] resize-y"
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    required
                />
                </div>
            )}
            <Tabs value={aiMode} onValueChange={(value) => setAiMode(value as AiMode)}>
              <TabsList className="grid w-full grid-cols-5">
                <TabsTrigger value="generate">Generate</TabsTrigger>
                <TabsTrigger value="summarize">Summarize</TabsTrigger>
                <TabsTrigger value="rewrite">Rewrite</TabsTrigger>
                <TabsTrigger value="extract">Extract</TabsTrigger>
                <TabsTrigger value="humanize">Humanize</TabsTrigger>
              </TabsList>
            </Tabs>
            {aiMode === 'rewrite' && (
              <div className="space-y-2 animate-in fade-in">
                <Label>Tone</Label>
                <Select name="tone-select" value={tone} onValueChange={setTone}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a tone" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="professional">Professional</SelectItem>
                    <SelectItem value="casual">Casual</SelectItem>
                    <SelectItem value="formal">Formal</SelectItem>
                    <SelectItem value="witty" disabled={!isPro}>
                        <div className="flex items-center justify-between w-full">
                            <span>Witty</span>
                            {!isPro && <Crown className="h-4 w-4 text-yellow-500" />}
                        </div>
                    </SelectItem>
                    <SelectItem value="persuasive" disabled={!isPro}>
                       <div className="flex items-center justify-between w-full">
                            <span>Persuasive</span>
                            {!isPro && <Crown className="h-4 w-4 text-yellow-500" />}
                        </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
                 {!isPro && (
                  <p className="text-xs text-muted-foreground">
                    Upgrade to <Link href="/pricing" className="underline font-medium text-primary">Professional</Link> to unlock all tones.
                  </p>
                )}
              </div>
            )}
          </CardContent>
          <CardFooter>
            <SubmitButton />
          </CardFooter>
        </Card>

        <Card className="flex flex-col lg:col-span-1">
          <CardHeader>
            <CardTitle className="font-headline flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Bot className="h-6 w-6" />
                AI Output
              </div>
              {state.data && (
                <div className='flex items-center gap-1'>
                    {user && <Button variant="ghost" size="icon" onClick={handleSave}>
                        <Save className="h-4 w-4" />
                    </Button>}
                    <CopyButton textToCopy={state.data} />
                </div>
              )}
            </CardTitle>
            <CardDescription>The generated content will appear here.</CardDescription>
          </CardHeader>
          <CardContent className="flex-1">
            <ResultDisplay result={state.data} error={state.error} />
          </CardContent>
        </Card>
      </div>
    </form>
  );
}

export default function EditorPage() {
  return (
    <React.Suspense fallback={<div>Loading...</div>}>
      <EditorPageContent />
    </React.Suspense>
  );
}

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full">
      {pending ? (
        'Generating...'
      ) : (
        <>
          <Sparkles className="mr-2 h-4 w-4" />
          Generate
        </>
      )}
    </Button>
  );
}

function ResultDisplay({ result, error }: { result?: string; error?: string }) {
  const { pending } = useFormStatus();

  if (pending) {
    return (
      <div className="space-y-3">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-4 w-4/5" />
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  if (result) {
    return (
      <div className="prose prose-sm dark:prose-invert max-w-none whitespace-pre-wrap rounded-md border bg-secondary/50 p-4">
        {result}
      </div>
    );
  }
  
  return (
    <div className="flex h-full items-center justify-center rounded-md border border-dashed bg-secondary/30">
        <p className="text-muted-foreground">Your AI-generated content will appear here.</p>
    </div>
  );
}

function CopyButton({ textToCopy }: { textToCopy: string }) {
    const { toast } = useToast();
    const handleCopy = () => {
        navigator.clipboard.writeText(textToCopy);
        toast({
            title: "Copied to clipboard!",
            description: "The AI output has been copied.",
        });
    }

    return (
        <Button variant="ghost" size="icon" onClick={handleCopy}>
            <Copy className="h-4 w-4" />
        </Button>
    )
}
