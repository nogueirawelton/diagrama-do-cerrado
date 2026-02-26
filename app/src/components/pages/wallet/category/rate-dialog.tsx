"use client";

import { Category } from "@/@types/Category";
import { WalletPosition } from "@/@types/Wallet";
import { useWallet } from "@/hooks/api/use-wallet";
import { api } from "@/lib/api";
import { getQuestions } from "@/utils/get-questions";
import { Dialog, Switch } from "radix-ui";
import { useState, useTransition } from "react";
import { PiCircleNotch, PiX } from "react-icons/pi";
import { toast } from "react-toastify";

type RateDialogProps = {
  walletNumber: string;
  position: WalletPosition;
  category: Category;
};

export function RateDialog({
  position,
  walletNumber,
  category,
}: RateDialogProps) {
  const [pending, startTransition] = useTransition();
  const { mutate } = useWallet(walletNumber);

  const questions = getQuestions(category.id);
  const [rate, setRate] = useState(0);

  function handleSaveRate() {
    startTransition(async () => {
      try {
        await api.patch(`/wallets/positions/${position.id}`, {
          rate,
        });

        await mutate();

        toast.success("Nota salva com sucesso!");
      } catch (error) {
        toast.error("Erro ao salvar nota!");
      }
    });
  }

  return (
    <Dialog.Root>
      <Dialog.Trigger className="bg-secondary-light font-medium size-10 mx-auto grid place-items-center rounded-md text-white">
        {position.rate}
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Overlay className="fixed z-50 inset-0 bg-black/40" />

        <Dialog.Content className="bg-white w-full max-w-2xl data-[state=open]:animate-fade-in data-[state=closed]:animate-fade-out rounded-md p-4 lg:p-8 fixed top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 z-50">
          <Dialog.Title className="text-2xl font-medium text-zinc-800">
            Nota do Ativo
          </Dialog.Title>

          <Dialog.Close className="absolute top-4 right-4 cursor-pointer">
            <PiX />
          </Dialog.Close>

          <p className="text-zinc-500 mt-2">
            {questions
              ? "Responda devidamente as seguintes perguntas para que possamos calcular a nota deste ativo."
              : "Insira a nota do ativo com base em sua experiência como investidor."}
          </p>

          <div className="max-h-[400px] my-4 overflow-y-scroll">
            <div className=" pr-4 flex flex-col gap-8 ">
              {questions?.categories.map((category) => (
                <div key={category.name}>
                  <div className="bg-zinc-100/75 rounded-md border-zinc-200 p-4">
                    <h3 className="text-lg font-medium text-zinc-800">
                      {category.name}
                    </h3>
                    <p className="text-zinc-500 mt-2 text-sm">
                      {category.description}
                    </p>
                  </div>
                  <ul className="mt-4 px-4">
                    {category.questions.map((question) => (
                      <li
                        key={question}
                        className="flex text-sm justify-between gap-12 py-4 border-zinc-200 border-b items-center"
                      >
                        {question}
                        <Switch.Root
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setRate((prev) => prev + 1);
                            } else {
                              setRate((prev) => prev - 1);
                            }
                          }}
                          className="relative shrink-0 h-[25px] w-[42px] border bordering-secondary-light cursor-default rounded-full outline-none data-[state=checked]:bg-secondary-light"
                          id="airplane-mode"
                        >
                          <Switch.Thumb className="block size-[21px] bg-secondary-light translate-x-0.5 rounded-full data-[state=checked]:bg-white transition-transform duration-100 will-change-transform data-[state=checked]:translate-x-[19px]" />
                        </Switch.Root>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-between items-center gap-4">
            {questions ? (
              <div className="text-lg text-zinc-500">
                {rate} /{" "}
                {questions?.categories.reduce(
                  (acc, category) => acc + category.questions.length,
                  0,
                )}
              </div>
            ) : (
              <input
                type="number"
                value={rate}
                onChange={(e) => setRate(Number(e.target.value))}
                max={15}
                min={0}
                className="h-10 mt-4 border-zinc-400 border text-secondary-light rounded-md px-4 font-medium text-sm"
              />
            )}
            <button
              disabled={pending}
              onClick={handleSaveRate}
              className="h-10 mt-4 min-w-[106px] grid place-items-center bg-secondary-light text-white rounded-md px-4 font-medium text-sm"
            >
              {pending ? (
                <PiCircleNotch className="animate-spin size-6" />
              ) : (
                "Salvar Nota"
              )}
            </button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
