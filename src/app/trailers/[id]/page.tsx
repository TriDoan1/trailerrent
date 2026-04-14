import { notFound } from "next/navigation";
import { getTrailerById, trailers } from "@/data/trailers";
import { TrailerDetailContent } from "./TrailerDetailContent";

export function generateStaticParams() {
  return trailers.map((trailer) => ({ id: trailer.id }));
}

export default async function TrailerDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const trailer = getTrailerById(id);

  if (!trailer) {
    notFound();
  }

  return <TrailerDetailContent trailer={trailer} />;
}
