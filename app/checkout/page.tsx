"use client";
import StripeSubs from "@/components/stripeSubs";
import { Card, CardHeader, CardFooter, Button, Image } from "@nextui-org/react";

export default function Checkout() {
  return (
    <div className="flex justify-center gap-4">
      <Card isFooterBlurred className="w-full h-[300px] col-span-12 sm:col-span-7">
        <CardHeader className="absolute z-10 top-1 flex-col items-start bg-black/50 backdrop-blur-lg">
          <p className="text-tiny text-white/60 uppercase font-bold">Novo por aqui? </p>
          <h4 className="text-white/90 font-medium text-xl">Faça parte da ABRACM</h4>
        </CardHeader>
        <Image
          removeWrapper
          alt="Relaxing app background"
          className="z-0 w-full h-full object-cover"
          src="/covertemplate.jpeg"
        />
        <CardFooter className="absolute bg-black/40 bottom-0 z-10 border-t-1 border-default-600 dark:border-default-100">
          <div className="flex flex-grow gap-2 items-center">
            <Image
              alt="Avatar Setes"
              className="rounded-full w-10 h-11 bg-black"
              src="/Avatar1.svg"
            />
            <div className="flex flex-col">
              <p className="text-tiny text-white/60">Mensalidade para Sedes</p>
              <p className="text-tiny text-white/60">ABRACM</p>
            </div>
          </div>
          <StripeSubs
            priceId="price_1QPBWrCVsXqD1drtpDmC82BE"
            price="R$ 600,00"
          />
        </CardFooter>
      </Card>
      <div className="w-full max-w-md">
        <Card isFooterBlurred className="w-full h-[300px] col-span-12 sm:col-span-7">
          <CardHeader className="absolute z-10 top-1 flex-col items-start bg-black/50 backdrop-blur-lg">
            <p className="text-tiny text-white/60 uppercase font-bold">Já faz parte? </p>
            <h4 className="text-white/90 font-medium text-xl">Integre uma filial</h4>
          </CardHeader>
          <Image
            removeWrapper
            alt="Relaxing app background"
            className="z-0 w-full h-full object-cover"
            src="/covertemplate.jpeg"
          />
          <CardFooter className="absolute bg-black/40 bottom-0 z-10 border-t-1 border-default-600 dark:border-default-100">
            <div className="flex flex-grow gap-2 items-center">
              <Image
                alt="Avatar Filiais"
                className="rounded-full w-10 h-11 bg-black"
                src="/Avatar2.svg"
              />
              <div className="flex flex-col">
                <p className="text-tiny text-white/60">Mensalidade para filiais</p>
                <p className="text-tiny text-white/60">ABRACM</p>
              </div>
            </div>
            <StripeSubs
              priceId="price_1QPQACCVsXqD1drtWzRn0B9Y"
              price="R$ 60,00"
            />
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
