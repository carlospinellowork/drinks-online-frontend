import type { Metadata } from "next";
import { Plus_Jakarta_Sans, JetBrains_Mono } from "next/font/google";
import { getRestaurantConfig } from "@/lib/db";
import { CartProvider } from "@/context/CartContext";
import "./globals.css";

const sansFont = Plus_Jakarta_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
});

const monoFont = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
});

export async function generateMetadata(): Promise<Metadata> {
  const config = await getRestaurantConfig();
  return {
    title: config.name,
    description: config.description,
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const config = await getRestaurantConfig();

  // Injeta as cores da marca de forma dinâmica nas variáveis CSS do Tailwind / Shadcn
  const themeStyles = `
    :root {
      --primary: ${config.theme.primary};
      --primary-foreground: #ffffff;
      --secondary: ${config.theme.secondary};
      --secondary-foreground: #ffffff;
      --background: ${config.theme.background};
      --foreground: ${config.theme.foreground};
      --card: ${config.theme.background};
      --card-foreground: ${config.theme.foreground};
      --popover: ${config.theme.background};
      --popover-foreground: ${config.theme.foreground};
      --border: rgba(0, 0, 0, 0.08);
      --input: rgba(0, 0, 0, 0.08);
      --radius: ${config.theme.borderRadius || '0.5rem'};
    }
    
    .dark {
      --background: #09090b;
      --foreground: #fafafa;
      --card: #18181b;
      --card-foreground: #fafafa;
      --popover: #18181b;
      --popover-foreground: #fafafa;
      --primary: ${config.theme.primary};
      --primary-foreground: #ffffff;
      --secondary: ${config.theme.secondary};
      --secondary-foreground: #ffffff;
      --border: rgba(255, 255, 255, 0.1);
      --input: rgba(255, 255, 255, 0.1);
    }
  `;

  return (
    <html lang="pt-BR" suppressHydrationWarning className={`${sansFont.variable} ${monoFont.variable}`}>
      <head>
        <style dangerouslySetInnerHTML={{ __html: themeStyles }} />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var theme = localStorage.getItem('theme');
                  if (theme === 'dark' || (!theme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                    document.documentElement.classList.add('dark');
                  } else {
                    document.documentElement.classList.remove('dark');
                  }
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body className="min-h-screen bg-background text-foreground antialiased font-sans flex flex-col">
        <CartProvider>
          {children}
        </CartProvider>
      </body>
    </html>
  );
}
