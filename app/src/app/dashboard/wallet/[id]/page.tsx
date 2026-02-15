export default async function WalletPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return <div>WalletPage {id}</div>;
}
