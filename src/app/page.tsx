import Image from 'next/image';
import Link from 'next/link';
import { Header } from '@/app/components/header';
import { Footer } from '@/app/components/footer';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { BookText, PenSquare, Sparkles } from 'lucide-react';

export default function Home() {

  const features = [
    {
      icon: <BookText className="h-8 w-8 text-primary" />,
      title: 'AI-Powered Summaries',
      description: 'Effortlessly condense long articles, reports, and documents into concise, easy-to-digest summaries. Save time and grasp key insights in seconds.',
    },
    {
      icon: <PenSquare className="h-8 w-8 text-primary" />,
      title: 'Versatile Content Rewriting',
      description: 'Rewrite your text in various tones—professional, casual, creative, and more. Perfect for adapting your message to any audience or platform.',
    },
    {
      icon: <Sparkles className="h-8 w-8 text-primary" />,
      title: 'Instant Keyword Extraction',
      description: 'Automatically identify and extract the most important keywords and topics from your content. Ideal for SEO, research, and content tagging.',
    },
  ];

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <section className="container py-12 md:py-24 lg:py-32">
          <div className="flex flex-col justify-center space-y-4 text-center">
              <h1 className="font-headline text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl">
                Your Smart Thinking Buddy
              </h1>
              <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                MindMate helps you summarize, rewrite, and understand content faster than ever. Unlock your productivity potential with the power of AI.
              </p>
              <div className="flex justify-center gap-4">
                <Button asChild size="lg">
                  <Link href="/dashboard/editor">Get Started Free</Link>
                </Button>
              </div>
            </div>
        </section>

        <section id="features" className="w-full bg-secondary py-12 md:py-24 lg:py-32">
          <div className="container space-y-12">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-background px-3 py-1 text-sm">Key Features</div>
                <h2 className="font-headline text-3xl font-bold tracking-tighter sm:text-5xl">
                  Boost Your Brainpower
                </h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  MindMate is packed with powerful AI tools to streamline your workflow and enhance your understanding.
                </p>
              </div>
            </div>
            <div className="mx-auto grid items-start gap-8 sm:max-w-4xl sm:grid-cols-2 md:gap-12 lg:max-w-5xl lg:grid-cols-3">
              {features.map((feature, index) => (
                <Card key={index} className="h-full transition-shadow hover:shadow-lg">
                  <CardHeader>
                    {feature.icon}
                    <CardTitle className="font-headline pt-4">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription>{feature.description}</CardDescription>
                  </CardContent>
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
