// RootLayout.tsx
import ClientLayout from "@/components/ClientLayout";
import { Inter } from 'next/font/google';
import "./globals.css";

// Optimize font loading with Next.js
const inter = Inter({ 
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  display: 'swap',
  variable: '--font-inter',
  preload: true,
});

export const metadata = {
  title: "Flyola - Premium Aviation Services | Book Flights & Private Charters",
  description: "Book premium flights, private charters & helicopter rides with Flyola. Safe, comfortable air travel across India. Instant booking available.",
  keywords: "flights, aviation, private charter, helicopter, joy rides, air travel, premium flights",
  icons: {
    icon: "/pp.svg",
    apple: "/logoo-04.png",
  },
  manifest: "/manifest.json",
  openGraph: {
    title: "Flyola - Premium Aviation Services",
    description: "Book premium flights and aviation services with Flyola",
    type: "website",
    locale: "en_US",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#3b82f6",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={inter.variable}>
      <head>
        {/* Performance optimizations - Font now loaded via Next.js optimization */}
        <link rel="dns-prefetch" href={process.env.NEXT_PUBLIC_API_URL || "https://api.jetserveaviation.com "} />
        <link rel="prefetch" href={`${process.env.NEXT_PUBLIC_API_URL || "https://api.jetserveaviation.com "}/airport`} />
        <link rel="preload" href="/pp.svg" as="image" />
        <link rel="preload" href="/logoo-04.png" as="image" />
        <link rel="preload" href="/1.png" as="image" />
        <link rel="preload" href="/2.png" as="image" />
        <link rel="preload" href="/flight.png" as="image" />
        <link rel="modulepreload" href="/_next/static/chunks/main.js" />
        <link rel="modulepreload" href="/_next/static/chunks/pages/_app.js" />

        <link rel="manifest" href="/manifest.json" />
        
        {/* Service Worker Registration - Updated to avoid CORS issues */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', async () => {
                  try {
                    // Unregister any existing service workers first
                    const registrations = await navigator.serviceWorker.getRegistrations();
                    for (let registration of registrations) {
                      await registration.unregister();
                    }
                    
                    // Clear all caches
                    const cacheNames = await caches.keys();
                    await Promise.all(
                      cacheNames.map(cacheName => caches.delete(cacheName))
                    );
                    
                    // Register the new service worker
                    await navigator.serviceWorker.register('/sw.js');
                    console.log('Service worker registered successfully');
                  } catch (error) {
                    console.log('Service worker registration failed:', error);
                  }
                });
              }
            `,
          }}
        />
        {/* Meta Pixel Code */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              !function(f,b,e,v,n,t,s)
              {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
              n.callMethod.apply(n,arguments):n.queue.push(arguments)};
              if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
              n.queue=[];t=b.createElement(e);t.async=!0;
              t.src=v;s=b.getElementsByTagName(e)[0];
              s.parentNode.insertBefore(t,s)}(window, document,'script',
              'https://connect.facebook.net/en_US/fbevents.js');
              fbq('init', '1404984887200481');
              fbq('track', 'PageView');
            `,
          }}
        />
        {/* Google Tag Manager */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
              new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
              j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
              'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
              })(window,document,'script','dataLayer','GTM-P6HPLDHD');
            `,
          }}
        />
      </head>
      <body className="bg-gray-100">
        {/* Google Tag Manager (noscript) */}
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-P6HPLDHD"
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          ></iframe>
        </noscript>
        {/* Meta Pixel (noscript) */}
        <noscript>
          <img
            height="1"
            width="1"
            style={{ display: "none" }}
            src="https://www.facebook.com/tr?id=1404984887200481&ev=PageView&noscript=1"
          />
        </noscript>
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
