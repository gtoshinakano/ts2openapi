import HeaderNav from "@/components/HeaderNav";
import "./globals.css";

export const metadata = {
  title: "JS/JSON/TS Types to Open API object properties",
  description:
    "Generate Open API object properties from TS Objects / JSON or Typescript Interface/Type",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="flex flex-col h-screen w-screen bg-zinc-800">
        <HeaderNav />
        {children}
      </body>
    </html>
  );
}
