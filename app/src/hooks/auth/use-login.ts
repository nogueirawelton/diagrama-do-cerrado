import { getErrorMessage } from "@/lib/api";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { toast } from "react-toastify";

interface AuthData {
  username: string;
  password: string;
}

export function useLogin() {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const performLogin = async ({ username, password }: AuthData) => {
    startTransition(async () => {
      try {
        const auth = await signIn("credentials", {
          username,
          password,
          redirect: false,
        });

        if (auth?.error) {
          throw new Error("Credenciais Inválidas");
        }

        router.push("/dashboard/wallet");
      } catch (err) {
        toast.error(getErrorMessage(err));
        console.log(err);
      }
    });
  };

  return { login: performLogin, pending: isPending };
}
