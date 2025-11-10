"use client";

import { Box, Text, Spinner, Table, Menu, IconButton, Portal } from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import { FiMoreVertical } from "react-icons/fi";
import { CatalogDetails } from "@/lib/catalog/searchCatalog";

// Componente de tabla de resultados - fácil de extraer a otro archivo
export function CatalogResultsTable({
  items,
  total,
  loading,
  searchQuery,
}: {
  items: CatalogDetails[];
  total: number | null;
  loading: boolean;
  searchQuery: string;
}) {
  const router = useRouter();

  const mapTypeToRoute = (type: string) => {
    // map backend types to the route segments you requested
    if (type === "song") return "cancion";
    if (type === "collection") return "coleccion";
    if (type === "playlist") return "playlist";
    return type;
  };

  const openDetail = (item: CatalogDetails) => {
    const routeType = mapTypeToRoute(item.type);
    router.push(`/admin/catalog/${routeType}/${item.id}`);
  };
  // Helper para resaltar coincidencias de búsqueda
  const highlightMatch = (text: string, query: string) => {
    if (!query.trim()) return text;

    const regex = new RegExp(`(${query.trim()})`, "gi");
    const parts = text.split(regex);

    return (
      <>
        {parts.map((part, i) =>
          regex.test(part) ? (
            <Box
              as="mark"
              key={i}
              bg="yellow.200"
              color="gray.900"
              fontWeight={600}
            >
              {part}
            </Box>
          ) : (
            part
          )
        )}
      </>
    );
  };

  if (loading) {
    return (
      <Box p={6} borderWidth={1} borderRadius="lg" textAlign="center" py={8}>
        <Spinner />
        <Text mt={2} color="gray.600">
          Cargando resultados…
        </Text>
      </Box>
    );
  }

  return (
    <Box borderWidth={1} borderRadius="lg" overflow="hidden">
      <Box p={4} borderBottomWidth={1}>
        <Text fontWeight={600} color="gray.700">
          Resultados ({total ?? 0})
        </Text>
      </Box>

      {items.length === 0 ? (
        <Box p={8} textAlign="center">
          <Text color="gray.500">No se encontraron resultados</Text>
        </Box>
      ) : (
        <Box overflowX="auto">
          <Table.Root size="sm" variant="line">
            <Table.Header>
              <Table.Row>
                <Table.ColumnHeader minW="200px">Título</Table.ColumnHeader>
                <Table.ColumnHeader minW="120px">Tipo</Table.ColumnHeader>
                <Table.ColumnHeader minW="150px">Artista</Table.ColumnHeader>
                <Table.ColumnHeader minW="150px">Colección</Table.ColumnHeader>
                <Table.ColumnHeader minW="120px">Publicado</Table.ColumnHeader>
                <Table.ColumnHeader minW="140px">Estado</Table.ColumnHeader>
                <Table.ColumnHeader minW="120px" textAlign="center">Acciones</Table.ColumnHeader>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {items.map((item) => (
                <Table.Row key={item.id}>
                  <Table.Cell fontWeight={500}>
                    {highlightMatch(item.title, searchQuery)}
                  </Table.Cell>
                  <Table.Cell>
                    {item.type === "song"
                      ? "Canción"
                      : item.type === "collection"
                      ? "Colección"
                      : item.type === "playlist"
                      ? "Playlist"
                      : item.type}
                  </Table.Cell>
                  <Table.Cell color="gray.700">
                    {item.mainArtist
                      ? highlightMatch(item.mainArtist, searchQuery)
                      : "-"}
                  </Table.Cell>
                  <Table.Cell>
                    {item.collection?.title
                      ? highlightMatch(item.collection.title, searchQuery)
                      : item.collection?.id ?? "-"}
                  </Table.Cell>
                  <Table.Cell>
                    {item.publishedAt
                      ? new Date(item.publishedAt).toLocaleDateString()
                      : "-"}
                  </Table.Cell>
                  <Table.Cell>
                    <Box
                      as="span"
                      px={2}
                      py={1}
                      borderRadius="md"
                      fontSize="xs"
                      fontWeight={500}
                      bg={
                        item.effectiveStatus === "published"
                          ? "green.100"
                          : item.effectiveStatus === "scheduled"
                          ? "yellow.100"
                          : item.effectiveStatus === "blocked-admin"
                          ? "red.100"
                          : item.effectiveStatus === "not-available-region"
                          ? "orange.100"
                          : "gray.100"
                      }
                      color={
                        item.effectiveStatus === "published"
                          ? "green.800"
                          : item.effectiveStatus === "scheduled"
                          ? "yellow.800"
                          : item.effectiveStatus === "blocked-admin"
                          ? "red.800"
                          : item.effectiveStatus === "not-available-region"
                          ? "orange.800"
                          : "gray.800"
                      }
                    >
                      {item.effectiveStatus === "scheduled"
                        ? "Programado"
                        : item.effectiveStatus === "published"
                        ? "Publicado"
                        : item.effectiveStatus === "not-available-region"
                        ? "No disponible"
                        : item.effectiveStatus === "blocked-admin"
                        ? "Bloqueado"
                        : item.effectiveStatus ?? "-"}
                    </Box>
                  </Table.Cell>
                  <Table.Cell textAlign="center">
                    <Menu.Root>
                      <Menu.Trigger asChild>
                        <IconButton
                          aria-label="Acciones"
                          size="sm"
                          variant="ghost"
                        >
                          <FiMoreVertical />
                        </IconButton>
                      </Menu.Trigger>
                      <Portal>
                        <Menu.Positioner>
                          <Menu.Content minW="180px">
                            <Menu.Item value="detalle" onClick={() => openDetail(item)}>
                              Abrir detalle
                            </Menu.Item>
                            <Menu.Item value="metadata" onClick={() => console.log("Editar metadatos", item.id)}>
                              Editar metadatos
                            </Menu.Item>
                            <Menu.Item value="availability" onClick={() => console.log("Editar disponibilidad", item.id)}>
                              Editar disponibilidad
                            </Menu.Item>
                            <Menu.Separator />
                            <Menu.Item value="toggleBlock" onClick={() => console.log("Toggle bloqueo", item.id)}>
                              {item.effectiveStatus === "blocked-admin" ? "Desbloquear" : "Bloquear"}
                            </Menu.Item>
                          </Menu.Content>
                        </Menu.Positioner>
                      </Portal>
                    </Menu.Root>
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table.Root>
        </Box>
      )}
    </Box>
  );
}
