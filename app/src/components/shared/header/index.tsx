import Image from "next/image";
import { Menu } from "./menu";

export function Header() {
  return (
    <header className="bg-secondary-dark">
      <div className="flex justify-between items-center h-16 mx-auto px-4 container">
        <div className="flex items-center text-white gap-4">
          <Image
            src="/logo.svg"
            alt="Logo"
            width={30}
            height={45}
            priority
          />

          <strong className="uppercase text-sm leading-tight">
            Diagrama do <br /> Cerrado
          </strong>
        </div>

        <Menu />
      </div>
    </header>
  );
}
