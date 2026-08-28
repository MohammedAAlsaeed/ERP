import type { Metadata } from "next";
import { Cairo } from "next/font/google";

import { Shell } from "@/components/layout/shell";

import { Providers } from "./providers";
import "./globals.css";

const cairo = Cairo({
  variable: "--font-cairo",
  subsets: ["arabic", "latin"],
});

export const metadata: Metadata = {
  title: "نظام إدارة الموارد | ERP",
  description: "نظام بسيط لإدارة العملاء والمخزون والفواتير والموظفين",
};

/* Runs synchronously while the HTML is parsed, so a saved theme is applied
   before the first paint instead of flashing the OS default. */
const themeScript = `
try {
  var saved = localStorage.getItem("erp-theme");
  if (saved === "dark" || saved === "light") {
    document.documentElement.dataset.theme = saved;
  }
} catch (error) {}
`;

const localeScript = `
try {
  var cookieValue = document.cookie
    .split("; ")
    .find(function (pair) { return pair.startsWith("erp-locale="); });
  var locale = cookieValue ? cookieValue.split("=")[1] : null;
  if (locale !== "en" && locale !== "ar") {
    locale = navigator.language && navigator.language.toLowerCase().startsWith("en") ? "en" : "ar";
  }
  if (locale === "en") {
    document.documentElement.lang = "en";
    document.documentElement.dir = "ltr";
  } else {
    document.documentElement.lang = "ar";
    document.documentElement.dir = "rtl";
  }
} catch (error) {}
`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="ar"
      dir="rtl"
      className={`${cairo.variable} h-full`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        <script dangerouslySetInnerHTML={{ __html: localeScript }} />
      </head>
      <body className="min-h-full font-sans antialiased">
        <Providers>
          <Shell>{children}</Shell>
        </Providers>
      </body>
    </html>
  );
}
