import { Box, Text, Stack, Table, Spinner } from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { auditItemById } from "@/lib/catalog/auditDetails";

export interface AuditEvent {
  event_type: 'updated' | 'blocked' | 'unblocked' | 'published';
  event_label: string;
  changed_by_user_id: string;
  timestamp: string;
  reason: string;
  block_id: string;
  changes_display: string;
}
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

  // Solo las canciones y colecciones tienen auditoría
  if (type !== 'song' && type !== 'collection') {
    return (
      <Box background="gray.900" p={4} borderRadius="md" minH="70vh">
        <Text color="gray.500">
          La auditoría solo está disponible para canciones y colecciones.
        </Text>
      </Box>
    );
  }

  if (!events || events.length === 0) {
    return (
      <Box background="gray.900" p={4} borderRadius="md" minH="70vh">
        <Text color="gray.500">
          No hay eventos de auditoría para este elemento.
        </Text>
      </Box>
    );
  }

  return (
    <Box background="gray.900" p={4} borderRadius="md" minH="70vh">
      <Stack gap={4}>
        <Text fontSize="lg" fontWeight={600}>
          Historial de cambios
        </Text>
        
        <Table.Root variant="outline" size="sm">
          <Table.Header>
            <Table.Row>
              <Table.ColumnHeader>Evento</Table.ColumnHeader>
              <Table.ColumnHeader>Usuario</Table.ColumnHeader>
              <Table.ColumnHeader>Fecha y hora</Table.ColumnHeader>
              <Table.ColumnHeader>Motivo</Table.ColumnHeader>
              <Table.ColumnHeader>Cambios</Table.ColumnHeader>
              <Table.ColumnHeader>Block ID</Table.ColumnHeader>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {events.map((event, index) => (
              <Table.Row key={`${event.timestamp}-${index}`}>
                <Table.Cell>{event.event_label}</Table.Cell>
                <Table.Cell>{event.changed_by_user_id}</Table.Cell>
                <Table.Cell>{event.timestamp}</Table.Cell>
                <Table.Cell>{event.reason}</Table.Cell>
                <Table.Cell>
                  <Text fontSize="sm" whiteSpace="pre-line">{event.changes_display}</Text>
                </Table.Cell>
                <Table.Cell>{event.block_id}</Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table.Root>
      </Stack>
    </Box>
  );
}
