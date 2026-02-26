import { WalletContent } from "@/components/pages/wallet";

export default async function WalletPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return <WalletContent id={id} />;
}
