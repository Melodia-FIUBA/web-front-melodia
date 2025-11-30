import { Box, Text, Heading } from "@chakra-ui/react";

interface CatalogMetricsTabProps {
    id: string;
    type: string;
}

export function CatalogMetricsTab({ id, type }: CatalogMetricsTabProps) {
  return (
    <Box>
      <Heading size="lg" mb={4}>Métricas</Heading>
      
      {type === "playlist" ? (
        <Box>
          <Text fontSize="md" color="gray.600">
            Las métricas no están disponibles para playlists.
          </Text>
        </Box>
      ) : type === "song" ? (
        <Box>
          <Text fontSize="md" color="gray.700">
            Aquí se mostrarán las métricas para la canción con ID: {id}
          </Text>
          <Text fontSize="sm" color="gray.500" mt={2}>
            (Funcionalidad de métricas de canciones pendiente de implementar)
          </Text>
        </Box>
      ) : type === "collection" ? (
        <Box>
          <Text fontSize="md" color="gray.700">
            Aquí se mostrarán las métricas para la colección con ID: {id}
          </Text>
          <Text fontSize="sm" color="gray.500" mt={2}>
            (Funcionalidad de métricas de colecciones pendiente de implementar)
          </Text>
        </Box>
      ) : (
        <Box>
          <Text fontSize="md" color="gray.700">
            Aquí se mostrarán las métricas para el ítem con ID: {id}
          </Text>
          <Text fontSize="sm" color="gray.500" mt={2}>
            (Funcionalidad de métricas pendiente de implementar)
          </Text>
        </Box>
      )}
    </Box>
  );
}
