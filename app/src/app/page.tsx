import { Login } from "@/components/pages/home/login";
import Image from "next/image";

export default function Home() {
  return (
    <main className="w-screen grid-cols-2 h-screen lg:grid ">
      <div className="bg-secondary-light rounded-r-3xl my-4  hidden px-4 lg:px-8 lg:grid place-items-center">
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

          <p className="mt-4 text-lg text-center max-w-xl">
            Onde a disciplina encontra o valor. <br /> Gerencie seus ativos com
            a visão de longo prazo da AUVP.
          </p>
        </div>
      </div>

      <div className="grid bg-white h-screen lg:h-auto px-4 lg:px-8 place-items-center">
        <div className="flex flex-col w-full items-center">
          <div className="bg-secondary-light lg:hidden aspect-square mb-6 grid place-items-center rounded-full p-4">
            <Image
              src="/logo.svg"
              alt="Next.js logo"
              width={50}
              height={20}
              priority
            />
          </div>

          <h1 className="text-zinc-800 text-center text-2xl font-medium">
            Bem vindo(a) ao Diagrama do Cerrado
          </h1>

          <p className="text-zinc-500 mt-2">
            Utilize seu usuário e senha para acessar.
          </p>

          <Login />
        </div>
      </div>
    </main>
  );
}
