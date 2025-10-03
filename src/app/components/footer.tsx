import { Logo } from './logo';

export function Footer() {
  return (
    <footer className="border-t">
      <div className="container flex flex-col items-center justify-between gap-4 py-8 text-center sm:flex-row sm:text-left">
        <div className="flex flex-col gap-2">
            <Logo />
            <p className="text-sm text-muted-foreground">© {new Date().getFullYear()} MindMate. All rights reserved.</p>
        </div>
        <div className="text-sm text-muted-foreground">
            <p>Contact Us:</p>
            <p>Email: contact@mindmate.app</p>
            <p>Phone: +1 (555) 123-4567</p>
        </div>
      </div>
    </footer>
  );
}
