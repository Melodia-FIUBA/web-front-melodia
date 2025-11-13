import { Box, Text, Stack, Heading, Spinner } from "@chakra-ui/react";
import { CatalogDetails } from "@/lib/catalog/searchCatalog";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getItemById } from "@/lib/catalog/summaryDetails";
import LoadBackgroundElement from "../ui/loadElements";

interface CatalogSummaryTabProps {
    id: string;
    type: string;
    /** If the parent already fetched the item, pass it here to avoid a second API call */
    initialItem?: CatalogDetails | null;
}

export function CatalogSummaryTab({ id, type, initialItem }: CatalogSummaryTabProps) {
  const useParentItem = initialItem !== undefined;
  const [item, setItem] = useState<CatalogDetails | null>(null);
  const [loading, setLoading] = useState<boolean>(!useParentItem);
  const router = useRouter();

  const mapTypeToRoute = (type: string) => {
    if (type === "song") return "song";
    if (type === "collection" || type === "album" || type === "ep" || type === "single") return "collection";
    if (type === "playlist") return "playlist";
    return type;
  };

  const openDetail = (itemId: string, itemType: string) => {
    const routeType = mapTypeToRoute(itemType);
    router.push(`/admin/catalog/${routeType}/${itemId}`);
  };

  useEffect(() => {
    if (useParentItem) return; // parent provided the item — don't fetch

    let mounted = true;
    const fetchItem = async () => {
      setLoading(true);
      const fetchedItem = await getItemById(id, type);
      if (!mounted) return;
      setItem(fetchedItem);
      setLoading(false);
    };

    void fetchItem();

    return () => {
      mounted = false;
    };
  }, [id, type, useParentItem]);

  const displayedItem = useParentItem ? initialItem : item;

  if (loading) {
    return (
      <Box background="gray.900" p={4} borderRadius="md" minH="70vh" textAlign="center">
        <Spinner />
        <Text mt={2} color="gray.600">
          Cargando detalles…
        </Text>
        <LoadBackgroundElement size="catalog_summary"></LoadBackgroundElement>
      </Box>
    );
  }

  if (!displayedItem) {
    return (
      <Box p={6}>
        <Heading size="lg">Item no encontrado</Heading>
        <Text mt={2} color="gray.600">
          No se encontró el ítem con id {id}.
        </Text>
      </Box>
    );
  }

  // Helper function to format duration in MM:SS
  const formatDuration = (seconds?: number | null) => {
    if (!seconds) return "-";
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Render content based on item type
  const renderSongDetails = () => (
    <Stack gap={4}>
      <Box>
        <Text fontWeight={600}>Título</Text>
        <Text>{displayedItem.title}</Text>
      </Box>
      <Box>
        <Text fontWeight={600}>Artistas</Text>
        <Text>{Array.isArray(displayedItem.artists) && displayedItem.artists.length > 0 ? displayedItem.artists.join(', ') : '-'}</Text>
      </Box>
      <Box>
        <Text fontWeight={600}>Colección</Text>
        {displayedItem.collection?.id ? (
          <Text
            as="span"
            cursor="pointer"
            _hover={{ textDecoration: "underline" }}
            onClick={() => openDetail(displayedItem.collection!.id, 'collection')}
          >
            {displayedItem.collection?.title ?? displayedItem.collection?.id}
          </Text>
        ) : (
          <Text>-</Text>
        )}
      </Box>
      <Box>
        <Text fontWeight={600}>Posición en la colección</Text>
        <Text>{displayedItem.trackNumber ?? "-"}</Text>
      </Box>
      <Box>
        <Text fontWeight={600}>Duración</Text>
        <Text>{formatDuration(displayedItem.duration)}</Text>
      </Box>
      <Box>
        <Text fontWeight={600}>Video</Text>
        <Text>{displayedItem.video ? "Sí" : "No"}</Text>
      </Box>
    </Stack>
  );

  const renderCollectionDetails = () => {
    const isPlaylist = displayedItem.type === 'playlist';
    
    return (
      <Stack gap={4}>
        <Box>
          <Text fontWeight={600}>Título</Text>
          <Text>{displayedItem.title}</Text>
        </Box>
        <Box>
          <Text fontWeight={600}>Tipo</Text>
          <Text>{displayedItem.typeLabel ?? (isPlaylist ? "Playlist" : "Colección")}</Text>
        </Box>
        {displayedItem.year && (
          <Box>
            <Text fontWeight={600}>Año</Text>
            <Text>{displayedItem.year}</Text>
          </Box>
        )}
        {displayedItem.owner && (
          <Box>
            <Text fontWeight={600}>{isPlaylist ? "Owner" : "Artista"}</Text>
            <Text>{displayedItem.owner}</Text>
          </Box>
        )}
        <Box>
          <Text fontWeight={600}>Video</Text>
          <Text>{displayedItem.video ? "Sí" : "No"}</Text>
        </Box>
        {displayedItem.songs && displayedItem.songs.length > 0 && (
          <Box>
            <Text fontWeight={600} mb={2}>Lista de canciones</Text>
            <Box background="gray.800" p={3} borderRadius="md">
              <Stack gap={2}>
                {displayedItem.songs.map((song, idx) => (
                  <Box key={song.id || idx} display="flex" justifyContent="space-between" alignItems="center">
                    <Text>
                      <Text as="span" fontWeight={600} mr={2}>
                        {song.position ?? idx + 1}.
                      </Text>
                      {song.title ?? song.id}
                    </Text>
                    <Text color="gray.400">{formatDuration(song.duration)}</Text>
                  </Box>
                ))}
              </Stack>
            </Box>
          </Box>
        )}
      </Stack>
    );
  };

  return (
    <Box background="gray.900" p={4} borderRadius="md" minH="70vh">
      {displayedItem.type === 'song' ? renderSongDetails() : renderCollectionDetails()}
    </Box>
  );
}
