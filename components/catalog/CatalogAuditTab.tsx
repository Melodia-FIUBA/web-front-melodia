import { Box, Text, Stack, Table, Spinner } from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { auditItemById, AuditEvent } from "@/lib/catalog/auditDetails";

interface CatalogAuditTabProps {
  id: string;
  type: string;
}

export function CatalogAuditTab({ id, type }: CatalogAuditTabProps) {
  const [events, setEvents] = useState<AuditEvent[] | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    let mounted = true;
    const fetchAudit = async () => {
      setLoading(true);
      const auditEvents = await auditItemById(id, type);
      if (!mounted) return;
      setEvents(auditEvents);
      setLoading(false);
    };

    void fetchAudit();

    return () => {
      mounted = false;
    };
  }, [id, type]);

  if (loading) {
    return (
      <Box background="gray.900" p={4} borderRadius="md" minH="70vh" textAlign="center">
        <Spinner />
        <Text mt={2} color="gray.600">
          Cargando auditoría…
        </Text>
      </Box>
    );
  }

  // Solo las canciones tienen auditoría
  if (type !== 'song') {
    return (
      <Box background="gray.900" p={4} borderRadius="md" minH="70vh">
        <Text color="gray.500">
          La auditoría solo está disponible para canciones.
        </Text>
      </Box>
    );
  }

  if (!events || events.length === 0) {
    return (
      <Box background="gray.900" p={4} borderRadius="md" minH="70vh">
        <Text color="gray.500">
          No hay eventos de auditoría para esta canción.
        </Text>
      </Box>
    );
  }

  const getEventLabel = (event: AuditEvent['event']) => {
    switch (event) {
      case 'blocked':
        return 'Bloqueado';
      case 'unblocked':
        return 'Desbloqueado';
      case 'region-unavailable':
        return 'No disponible en región';
      case 'region-available':
        return 'Disponible en región';
      default:
        return event;
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleString('es-AR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  };

  return (
    <Box background="gray.900" p={4} borderRadius="md" minH="70vh">
      <Stack gap={4}>
        <Text fontSize="lg" fontWeight={600}>
          Historial de cambios
        </Text>
        
        <Table.Root variant="outline" size="sm">
          <Table.Header>
            <Table.Row>
              <Table.ColumnHeader>Usuario</Table.ColumnHeader>
              <Table.ColumnHeader>Fecha y hora</Table.ColumnHeader>
              <Table.ColumnHeader>Evento</Table.ColumnHeader>
              <Table.ColumnHeader>Alcance/Región</Table.ColumnHeader>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {events.map((event) => (
              <Table.Row key={event.id}>
                <Table.Cell>{event.user}</Table.Cell>
                <Table.Cell>{formatTimestamp(event.timestamp)}</Table.Cell>
                <Table.Cell>{getEventLabel(event.event)}</Table.Cell>
                <Table.Cell>{event.region || '-'}</Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table.Root>
      </Stack>
    </Box>
  );
}
