import { logout } from "@/actions/auth-action";
import { api } from "@/api";
import { Lazy } from "@/components/utils/lazy";
import { Skeleton } from "@/components/utils/skeleton";
import { useUser } from "@/hooks/swr/use-user";
import { useRouter } from "next/navigation";
import { Popover } from "radix-ui";
import { PiList } from "react-icons/pi";

export function Menu() {
  const router = useRouter();
  const { user, isLoading } = useUser();

  async function handleLogout() {
    await api.post("/auth/logout");
    await logout();

    router.push("/");
  }

  return (
    <Popover.Root>
      <Popover.Trigger className="text-white  flex items-center gap-3 px-2 h-11 border-white/30 border-1 rounded-md">
        <PiList className="size-7" />

        <Lazy
          pending={isLoading}
          fallback={<Skeleton className="size-7 rounded-full" />}
        >
          <span className="block size-7 text-xs uppercase grid place-items-center rounded-full bg-white/30">
            {user?.name
              ?.split(" ")
              .slice(0, 2)
              .map((word) => word[0])
              .join("")}
          </span>
        </Lazy>
      </Popover.Trigger>

      <Popover.Portal>
        <Popover.Content className="bg-white border border-zinc-300 min-w-[var(--radix-popover-trigger-width)]">
          <button onClick={handleLogout}>Sair</button>
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}
