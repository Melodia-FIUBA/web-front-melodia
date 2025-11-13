import { Box, Text, Stack, Heading, Spinner, Table } from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { fetchAppearancesById, AppearancesData } from "@/lib/catalog/appearancesDetails";

interface CatalogAppearancesTabProps {
  id: string;
  type: string;
}

export function CatalogAppearancesTab({ id, type }: CatalogAppearancesTabProps) {
  const [data, setData] = useState<AppearancesData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
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
    let mounted = true;
    const fetchData = async () => {
      setLoading(true);
      const fetchedData = await fetchAppearancesById(id, type);
      if (!mounted) return;
      setData(fetchedData);
      setLoading(false);
    };

    void fetchData();

    return () => {
      mounted = false;
    };
  }, [id, type]);

  if (loading) {
    return (
      <Box background="gray.900" p={4} borderRadius="md" minH="70vh" textAlign="center">
        <Spinner />
        <Text mt={2} color="gray.600">
          Cargando apariciones…
        </Text>
      </Box>
    );
  }

  // Playlist type doesn't have appearances
  if (type === 'playlist') {
    return (
      <Box background="gray.900" p={4} borderRadius="md" minH="70vh">
        <Text color="gray.500">No disponible para playlist</Text>
      </Box>
    );
  }

  if (!data || (!data.collections && !data.playlists)) {
    return (
      <Box background="gray.900" p={4} borderRadius="md" minH="70vh">
        <Text color="gray.500">No se encontraron apariciones para este ítem</Text>
      </Box>
    );
  }

  const getTypeLabel = (typeValue: string): string => {
    const labels: Record<string, string> = {
      'album': 'Álbum',
      'ep': 'EP',
      'single': 'Single',
      'playlist': 'Playlist',
    };
    return labels[typeValue] || typeValue;
  };

  // Render for Song type: show collections that include this song
  const renderSongCollections = () => {
    if (!data.collections || data.collections.length === 0) {
      return (
        <Text color="gray.500">Esta canción no aparece en ninguna colección</Text>
      );
    }

    return (
      <Stack gap={4}>
        <Heading size="md">Colecciones que incluyen esta canción</Heading>
        <Box overflowX="auto">
          <Table.Root variant="outline" size="sm">
            <Table.Header>
              <Table.Row>
                <Table.ColumnHeader>Tipo</Table.ColumnHeader>
                <Table.ColumnHeader>Título</Table.ColumnHeader>
                <Table.ColumnHeader>Posición</Table.ColumnHeader>
                <Table.ColumnHeader>Owner</Table.ColumnHeader>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {data.collections.map((collection) => (
                <Table.Row key={collection.id}>
                  <Table.Cell>{getTypeLabel(collection.type)}</Table.Cell>
                  <Table.Cell>
                    <Text
                      as="span"
                      cursor="pointer"
                      _hover={{ textDecoration: "underline" }}
                      onClick={() => openDetail(collection.id, collection.type)}
                    >
                      {collection.title}
                    </Text>
                  </Table.Cell>
                  <Table.Cell>{collection.position ?? '-'}</Table.Cell>
                  <Table.Cell>
                    {collection.type === 'playlist' ? (collection.owner || '-') : '-'}
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table.Root>
        </Box>
      </Stack>
    );
  };

  // Render for Collection type: show playlists containing songs from this collection
  const renderCollectionPlaylists = () => {
    if (!data.playlists || data.playlists.length === 0) {
      return (
        <Text color="gray.500">No hay playlists que contengan canciones de esta colección</Text>
      );
    }

    return (
      <Stack gap={4}>
        <Heading size="md">Playlists que contienen canciones de esta colección</Heading>
        <Box overflowX="auto">
          <Table.Root variant="outline" size="sm">
            <Table.Header>
              <Table.Row>
                <Table.ColumnHeader>Título</Table.ColumnHeader>
                <Table.ColumnHeader>Owner</Table.ColumnHeader>
                <Table.ColumnHeader>Cantidad incluida</Table.ColumnHeader>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {data.playlists.map((playlist) => (
                <Table.Row key={playlist.id}>
                  <Table.Cell>
                    <Text
                      as="span"
                      color="blue.600"
                      cursor="pointer"
                      _hover={{ textDecoration: "underline" }}
                      onClick={() => openDetail(playlist.id, 'playlist')}
                    >
                      {playlist.title}
                    </Text>
                  </Table.Cell>
                  <Table.Cell>{playlist.owner || '-'}</Table.Cell>
                  <Table.Cell>
                    {playlist.includedCount} de {playlist.totalSongs}
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table.Root>
        </Box>
      </Stack>
    );
  };

  return (
    <Box background="gray.900" p={4} borderRadius="md" minH="70vh">
      {type === 'song' ? renderSongCollections() : renderCollectionPlaylists()}
    </Box>
  );
}
