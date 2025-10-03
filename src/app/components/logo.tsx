import Link from 'next/link';
import { BrainCircuit } from 'lucide-react';
import { cn } from '@/lib/utils';

export function Logo({ className, asLink = true }: { className?: string, asLink?: boolean }) {
  const content = (
    <>
      <BrainCircuit className="h-6 w-6" />
      <span>MindMate</span>
    </>
  );

  if (asLink) {
    return (
      <Link href="/" className={cn("flex items-center gap-2 text-xl font-bold font-headline text-primary", className)}>
        {content}
      </Link>
    );
  }

  return (
    <div className={cn("flex items-center gap-2 text-xl font-bold font-headline text-primary", className)}>
      {content}
    </div>
  );
}