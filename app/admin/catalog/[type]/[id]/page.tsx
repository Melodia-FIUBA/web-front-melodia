import { Box, Heading, Text, Badge, Stack } from "@chakra-ui/react";
import { CatalogDetails } from "@/lib/catalog/searchCatalog";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { isAdminLoggedIn } from "@/lib/log/cookies";

type Props = {
  params: { type: string; id: string };
};

export default function CatalogDetailPage({ params }: Props) {
  const { id } = params;
  const router = useRouter();

  useEffect(() => {
    if (!isAdminLoggedIn()) {
      router.push("/login");
    }
  }, [router]);

  if (!isAdminLoggedIn()) {
    return null;
  }

  // TODO:/api/catalog/${id}
  // For now we reuse the existing fetchCatalogResults helper (which returns mock data).
  // In production you'd call an endpoint like `/api/catalog/${id}`.
  //const res = await fetchCatalogResults({});
  //const item: CatalogDetails | undefined = res?.items.find((it) => it.id === id);
  const item: CatalogDetails | undefined = {
    id: "1",
    title: "Mocked Item",
    type: "song",
    mainArtist: "Artist Name",
    collection: { id: "collection-1", title: "Collection Title" },
    publishedAt: new Date().toISOString(),
    effectiveStatus: "published",
  };

  if (!item) {
    return (
      <Box p={6}>
        <Heading size="lg">Item no encontrado</Heading>
        <Text mt={2} color="gray.600">
          No se encontró el ítem con id {id}.
        </Text>
      </Box>
    );
  }

  return (
    <Box p={6}>
      <Stack gap={4}>
        <Heading size="xl">{item.title}</Heading>
        <Box>
          <Text fontWeight={600}>Tipo</Text>
          <Text>{item.type}</Text>
        </Box>
        <Box>
          <Text fontWeight={600}>Artista</Text>
          <Text>{item.mainArtist ?? "-"}</Text>
        </Box>
        <Box>
          <Text fontWeight={600}>Colección</Text>
          <Text>{item.collection?.title ?? item.collection?.id ?? "-"}</Text>
        </Box>
        <Box>
          <Text fontWeight={600}>Publicado</Text>
          <Text>
            {item.publishedAt
              ? new Date(item.publishedAt).toLocaleDateString()
              : "-"}
          </Text>
        </Box>
        <Box>
          <Text fontWeight={600}>Estado</Text>
          <Badge
            colorScheme={
              item.effectiveStatus === "published"
                ? "green"
                : item.effectiveStatus === "scheduled"
                ? "yellow"
                : item.effectiveStatus === "blocked-admin"
                ? "red"
                : item.effectiveStatus === "not-available-region"
                ? "orange"
                : "gray"
            }
          >
            {item.effectiveStatus}
          </Badge>
        </Box>
      </Stack>
    </Box>
  );
}
