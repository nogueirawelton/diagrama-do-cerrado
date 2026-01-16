import Image from "next/image";

export default function Home() {
  return (
    <main className="w-screen grid-cols-2 h-screen grid ">
      <div className=" bg-secondary-light   grid place-items-center  ">
        <div className="flex items-center text-white flex-col gap-2">
          <Image
            src="/logo.svg"
            alt="Next.js logo"
            width={100}
            height={20}
            priority
          />

          <strong className="uppercase text-3xl text-center">
            Diagrama do <br /> cerrado
          </strong>

          <p className="text-center">
            Onde a disciplina encontra o valor. erencie seus ativos com a visão
            de longo prazo da AUVP.
          </p>
        </div>
      </div>
    </main>
  );
}
