import "@/styles/globals.css";
import NextLink from "next/link";
import { Logo } from "@/components/icons";
import { Navbar } from "@/components/navbar";

export function LayoutLogoff({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navbar />
      <div className="container mx-auto max-w-7xl pt-16 px-6 flex-grow">
        {children}
      </div>
      <div className="w-full flex items-center justify-around py-3">
        <NextLink className="flex justify-start items-center gap-1" href="/">
          <Logo />
          <p className="font-bold text-content1-foreground">ABRACM</p>
        </NextLink>
        <div className="flex flex-col h-auto">
          <div>Av. Juscelino Kubitscheck, 500</div>
          <div>Bairro Jundiaí, Anápolis / GO</div>
          <div>Cep: 75110-390</div>
        </div>
      </div>
    </>
  );
}