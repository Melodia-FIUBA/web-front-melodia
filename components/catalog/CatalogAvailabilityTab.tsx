import { Box, Text, Stack, Heading, Spinner, Badge } from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { getAvailabilityById, AvailabilityDetails } from "@/lib/catalog/availabilityDetails";
import { WorldAvailabilityMap } from "./WorldAvailabilityMap";

interface CatalogAvailabilityTabProps {
  id: string;
  type: string;
}

export function CatalogAvailabilityTab({ id, type }: CatalogAvailabilityTabProps) {
  const [availability, setAvailability] = useState<AvailabilityDetails | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    let mounted = true;
    const fetchAvailability = async () => {
      setLoading(true);
      const fetchedAvailability = await getAvailabilityById(id, type);
      if (!mounted) return;
      setAvailability(fetchedAvailability);
      setLoading(false);
    };

    void fetchAvailability();

    return () => {
      mounted = false;
    };
  }, [id, type]);

  if (loading) {
    return (
      <Box background="gray.900" p={4} borderRadius="md" minH="70vh" textAlign="center">
        <Spinner />
        <Text mt={2} color="gray.600">
          Cargando disponibilidad…
        </Text>
      </Box>
    );
  }

  if (!availability) {
    return (
      <Box background="gray.900" p={4} borderRadius="md" minH="70vh">
        <Heading size="lg">Disponibilidad no encontrada</Heading>
        <Text mt={2} color="gray.600">
          No se encontró información de disponibilidad para el ítem {id}.
        </Text>
      </Box>
    );
  }

  // Helper function to get status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published':
        return 'green';
      case 'scheduled':
        return 'blue';
      case 'region_restricted':
        return 'orange';
      case 'blocked_by_admin':
        return 'red';
      default:
        return 'gray';
    }
  };

  // Helper function to get status label
  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'published':
        return 'Publicado';
      case 'scheduled':
        return 'Programado';
      case 'region_restricted':
        return 'No disponible en región';
      case 'blocked_by_admin':
        return 'Bloqueado por admin';
      default:
        return status;
    }
  };

  // Helper function to format date
  const formatDate = (dateString: string | null | undefined) => {
    if (!dateString) return null;
    const date = new Date(dateString);
    return date.toLocaleString('es-AR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <Box background="gray.900" p={4} borderRadius="md" minH="70vh">
      <Stack gap={6}>
        {/* Estado efectivo */}
        <Box>
          <Text fontWeight={600} mb={2}>Estado Efectivo</Text>
          <Badge colorPalette={getStatusColor(availability.effectiveStatus)} fontSize="md" px={3} py={1}>
            {getStatusLabel(availability.effectiveStatus)}
          </Badge>
          {availability.effectiveStatus === 'scheduled' && availability.scheduledAt && (
            <Text mt={2} color="gray.400">
              Fecha programada: {formatDate(availability.scheduledAt)}
            </Text>
          )}
        </Box>

        {/* Mapa Mundial de Disponibilidad - Solo para contenido que no sea playlist */}
        {type !== 'playlist' && <WorldAvailabilityMap availability={availability} />}
      </Stack>
    </Box>
  );
}
