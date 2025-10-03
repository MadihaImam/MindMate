'use client';

import { CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Header } from '@/app/components/header';
import { Footer } from '@/app/components/footer';
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import Link from 'next/link';
import { Separator } from '@/components/ui/separator';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';

function GooglePayIcon(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg
        width="48"
        height="24"
        viewBox="0 0 48 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        {...props}
        >
        <path
            d="M19.4311 9.6109H22.9511V11.2309H19.4311V9.6109Z"
            fill="#5F6368"
        />
        <path
            d="M14.9392 10.9634C14.9392 10.2234 14.9992 9.5534 15.1192 8.9534H13.1192V10.2834H11.8392V6.6834H15.1392C15.0692 6.1334 15.0392 5.5734 15.0392 5.0034C15.0392 4.1434 15.1692 3.2934 15.4292 2.5034C17.2992 4.6734 18.5292 7.2034 18.7892 10.0034H15.1192C15.0092 10.3134 14.9392 10.6334 14.9392 10.9634Z"
            fill="#EA4335"
        />
        <path
            d="M18.7891 10.0031H15.1191C15.0091 10.3131 14.9391 10.6331 14.9391 10.9631C14.9391 11.3031 15.0091 11.6231 15.1191 11.9331H18.7891C18.5291 14.7331 17.2991 17.2631 15.4291 19.4331C15.1691 18.6431 15.0391 17.7931 15.0391 16.9331C15.0391 16.3631 15.0691 15.8031 15.1391 15.2531H11.8391V11.6531H13.1191V13.0031H15.1191C14.9991 12.3831 14.9391 11.7231 14.9391 10.9631"
            fill="#FBBC04"
        />
        <path
            d="M10.1582 12.8367C8.18821 12.8367 6.58821 14.4367 6.58821 16.4067C6.58821 18.3767 8.18821 19.9767 10.1582 19.9767C11.1682 19.9767 12.0682 19.5567 12.7282 18.8667L11.5382 17.6767C11.1582 18.0467 10.6882 18.2767 10.1582 18.2767C9.11821 18.2767 8.28821 17.4467 8.28821 16.4067C8.28821 15.3667 9.11821 14.5367 10.1582 14.5367C10.6882 14.5367 11.1582 14.7667 11.5382 15.1367L12.7282 13.9467C12.0682 13.2567 11.1682 12.8367 10.1582 12.8367Z"
            fill="#5F6368"
        />
        <path
            d="M2.5 12.9867V20H4.19V12.9867H2.5Z"
            fill="#5F6368"
        />
        <path
            d="M26.2374 12.9867V20H27.9274V14.6467L29.9374 20H31.6374L29.6274 14.4367C30.6874 14.1567 31.3374 13.1667 31.3374 11.9667C31.3374 10.3667 30.1374 9.4367 28.5174 9.4367H26.2374V12.9867ZM27.9274 11.0867H28.6074C29.2574 11.0867 29.6474 11.4167 29.6474 11.9667C29.6474 12.5167 29.2574 12.8467 28.6074 12.8467H27.9274V11.0867Z"
            fill="#5F6368"
        />
        <path
            d="M37.3753 12.8367C36.0053 12.8367 34.9153 13.9167 34.9153 15.2467V20H33.2253V13.0167H34.7853V13.9067C35.2553 13.2167 36.1753 12.8367 37.0453 12.8367C37.1653 12.8367 37.2853 12.8467 37.3753 12.8567V14.6067C37.2153 14.5667 37.0353 14.5467 36.8453 14.5467C35.9153 14.5467 35.2253 15.1767 35.1553 16.0367H35.1653V20H36.8553V16.3367C36.8553 15.5467 37.4053 15.0267 38.1653 15.0267C38.3853 15.0267 38.5853 15.0667 38.7653 15.1467V13.1567C38.3553 12.9467 37.8653 12.8367 37.3753 12.8367Z"
            fill="#5F6368"
        />
        <path
            d="M44.9789 12.8367C43.6089 12.8367 42.5189 13.9167 42.5189 15.2467V20H40.8289V13.0167H42.3889V13.9067C42.8589 13.2167 43.7789 12.8367 44.6489 12.8367C44.7689 12.8367 44.8889 12.8467 44.9789 12.8567V14.6067C44.8189 14.5667 44.6389 14.5467 44.4489 14.5467C43.5189 14.5467 42.8289 15.1767 42.7589 16.0367H42.7689V20H44.4589V16.3367C44.4589 15.5467 45.0089 15.0267 45.7689 15.0267C45.9889 15.0267 46.1889 15.0667 46.3689 15.1467V13.1567C45.9589 12.9467 45.4689 12.8367 44.9789 12.8367Z"
            fill="#5F6368"
        />
        <path
            d="M15.4291 2.50341C14.0391 2.50341 12.7291 2.88341 11.5391 3.56341L12.7391 4.75341C13.5491 4.29341 14.4691 4.02341 15.4291 4.02341C18.5991 4.02341 21.3691 5.95341 22.5891 8.84341H18.9191C18.6691 7.89341 18.2391 6.99341 17.6591 6.18341L18.8491 4.99341C20.0191 6.18341 20.9391 7.60341 21.5191 9.17341H23.0191C22.9591 8.95341 22.8991 8.73341 22.8291 8.51341C21.6491 5.09341 18.8091 2.50341 15.4291 2.50341Z"
            fill="#4285F4"
        />
        <path
            d="M11.5391 18.3634L12.7391 17.1734C13.5491 17.6334 14.4691 17.9034 15.4291 17.9034C18.5991 17.9034 21.3691 15.9734 22.5891 13.0834H18.9191C18.6691 14.0334 18.2391 14.9334 17.6591 15.7434L18.8491 16.9334C20.0191 15.7434 20.9391 14.3234 21.5191 12.7534H23.0191C22.9591 12.9734 22.8991 13.1934 22.8291 13.4134C21.6491 16.8334 18.8091 19.4234 15.4291 19.4234C14.0391 19.4234 12.7291 19.0434 11.5391 18.3634Z"
            fill="#34A853"
        />
        </svg>
    )
}

function VisaIcon(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg
        width="48"
        height="24"
        viewBox="0 0 48 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        {...props}
        >
        <path
            d="M24.83 17.51h2.54l-3.32-10.45h-2.5l-3.3 10.45h2.54l.56-1.93h2.41l.57 1.93Zm-1.29-3.27l.95-3.33.95 3.33h-1.9Z"
            fill="#142688"
        />
        <path
            d="M32.06 7.06h-2.1l-1.25 10.45h2.41l1.24-10.45Zm5.63 2.82c0-.52-.15-.9-.5-1.12s-.9-.33-1.63-.33c-1.15 0-2.02.4-2.58 1.18l1.45 1.09c.27-.4.6-.62 1.01-.62.37 0 .63.13.78.4.15.26.23.63.23 1.12v.19c-1.03.48-1.84.87-2.42 1.17-.98.48-1.47 1.17-1.47 2.08 0 .9.51 1.58 1.53 1.98.54.21 1.17.32 1.9.32.93 0 1.7-.27 2.3-.82.6-.54.9-1.3.9-2.28v-.54h-2.28v.66c0 .48-.21.72-.64.72-.37 0-.63-.15-.78-.45s-.23-.7-.23-1.18v-.4c1.13-.52 2-1 2.68-1.45.8-.55 1.2-1.32 1.2-2.31ZM43.43 12.3c.66-1.1 1.9-1.78 3.69-1.78.33 0 .66.02.97.07l.21-1.98c-.4-.08-.77-.12-1.1-.12-1.43 0-2.55.5-3.36 1.5V8.6h-2.2v8.91h2.2v-5.21Z"
            fill="#142688"
        />
        <path
            d="M15.4 7.06 12.63 15.1l-.25-1.1c-.6-2.5-2.28-4.14-4.52-4.99l2.76 8.5h2.52l3.82-10.45h-2.56Z"
            fill="#142688"
        />
        </svg>
    );
}

function MasterCardIcon(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg
        width="48"
        height="24"
        viewBox="0 0 48 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        {...props}
        >
        <circle cx="24" cy="12" r="11" fill="#FF5F00" />
        <circle cx="36" cy="12" r="11" fill="#EB001B" />
        <path
            d="M30 12a6 6 0 0 1-6 6 6 6 0 0 1-6-6 6 6 0 0 1 6-6 6 6 0 0 1 6 6Z"
            fill="#F79E1B"
        />
        </svg>
    )
}

export default function PricingPage() {
  const { toast } = useToast();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubscribe = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/subscribe', {
        method: 'POST',
      });
      
      const data = await response.json();

      if (response.ok) {
        toast({
          title: "Redirecting to checkout...",
          description: "Please wait while we prepare your secure payment page.",
        });
        router.push(data.url);
      } else {
        throw new Error(data.error || 'Failed to start subscription process.');
      }
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Subscription Error',
        description: error.message || 'Could not connect to the payment gateway. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const tiers = [
    {
      name: 'Free',
      price: '$0',
      priceSuffix: 'Forever',
      description: 'For individuals who want to experience the core power of MindMate.',
      features: [
        'Unlimited AI Summaries & Rewrites',
        'Save results to your dashboard',
        'Standard processing speed',
        'Basic export (copy/paste)',
      ],
      cta: 'Start for Free',
      ctaAs: Link,
      ctaHref: '/signup',
      variant: 'secondary',
    },
    {
      name: 'Professional',
      price: '$5',
      priceSuffix: '/ month',
      description: 'For power users who need more speed, convenience, and control.',
      features: [
        'Everything in Free, plus:',
        'Faster, priority processing',
        'Advanced AI tools & modes',
        'Export to PDF, DOCX, and Markdown',
        'Cloud sync across devices',
      ],
      cta: 'Go Pro',
      onClick: handleSubscribe,
      variant: 'default',
    },
    {
      name: 'Enterprise',
      price: 'Contact Us',
      priceSuffix: '',
      description: 'For businesses and teams that need advanced collaboration and security.',
      features: [
        'All Pro features',
        'Team management & billing',
        'Usage analytics',
        'Dedicated support & consultation',
      ],
      cta: 'Contact Sales',
      ctaAs: 'a',
      ctaHref: 'mailto:sales@mindmate.app',
      variant: 'outline',
    },
  ];

  const pricingImage = PlaceHolderImages.find((p) => p.id === 'pricing-hero');

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <section className="container py-12 md:py-24 lg:py-32">
          <div className="grid gap-12 md:grid-cols-2 md:gap-16">
            <div className="flex flex-col justify-center space-y-4">
              <h1 className="font-headline text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl">
                Find the Plan That's Right for You
              </h1>
              <p className="max-w-[600px] text-muted-foreground md:text-xl">
                Start for free and scale up as you grow. All plans come with our core AI-powered features to boost your productivity.
              </p>
            </div>
            {pricingImage && (
              <div className="relative aspect-video overflow-hidden rounded-xl shadow-lg">
                <Image
                  src={pricingImage.imageUrl}
                  alt={pricingImage.description}
                  data-ai-hint={pricingImage.imageHint}
                  fill
                  className="object-cover"
                />
              </div>
            )}
          </div>
        </section>

        <section id="pricing-tiers" className="w-full bg-secondary py-12 md:py-24 lg:py-32">
          <div className="container">
            <div className="mx-auto grid max-w-5xl items-stretch gap-8 lg:grid-cols-3">
              {tiers.map((tier) => (
                <Card key={tier.name} className={`flex flex-col h-full ${tier.variant === 'default' ? 'border-primary shadow-lg' : ''}`}>
                  <CardHeader>
                    <CardTitle className="font-headline">{tier.name}</CardTitle>
                    <CardDescription>{tier.description}</CardDescription>
                    <div>
                      <span className="text-4xl font-bold">{tier.price}</span>
                      {tier.priceSuffix && <span className="text-muted-foreground"> {tier.priceSuffix}</span>}
                    </div>
                  </CardHeader>
                  <CardContent className="flex-1">
                    <ul className="space-y-3">
                      {tier.features.map((feature) => (
                        <li key={feature} className="flex items-start gap-2">
                          <CheckCircle2 className="h-5 w-5 flex-shrink-0 text-primary mt-1" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                  <CardFooter className="flex-col items-start gap-4">
                    <Button 
                      asChild={!!tier.ctaAs}
                      className="w-full"
                      variant={tier.variant as any}
                      onClick={tier.onClick}
                      disabled={tier.name === 'Professional' && isLoading}
                    >
                      {tier.ctaAs === 'a' ? (
                        <a href={tier.ctaHref}>{tier.cta}</a>
                      ) : tier.ctaAs === Link ? (
                        <Link href={tier.ctaHref!}>{tier.cta}</Link>
                      ) : (
                         <span>{isLoading ? 'Processing...' : tier.cta}</span>
                      )}
                    </Button>
                    {tier.name === 'Professional' && (
                        <div className="w-full space-y-2">
                            <Separator />
                            <p className="text-xs text-muted-foreground text-center">Payments accepted:</p>
                            <div className="flex items-center justify-center gap-2">
                                <VisaIcon className="h-6" />
                                <MasterCardIcon className="h-6" />
                                <GooglePayIcon className="h-8" />
                            </div>
                        </div>
                    )}
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
