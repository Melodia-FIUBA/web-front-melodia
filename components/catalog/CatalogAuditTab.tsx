import { Box, Text, Stack, Table, Spinner } from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { auditItemById } from "@/lib/catalog/auditDetails";

export interface AuditEvent {
  id: number;
  created_at: string;
  created_by_admin_id: string;
  deactivated_at: string | null;
  deactivated_by_admin_id: string | null;
  reason_code: string;
  regions: string[];
  is_active: boolean;
  target_id: number;
  target_type: string;
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

  const getEventLabel = (regions: string[]) => {
    if (regions.includes('GLOBAL')) {
      return 'Bloqueado';
    }
    return 'No disponible en región';
  };

  const getReasonLabel = (reasonCode: string) => {
    const reasons: Record<string, string> = {
      'copyright_violation': 'Violación de derechos de autor',
      'explicit_content': 'Contenido explícito',
      'legal_request': 'Solicitud legal',
      'terms_violation': 'Violación de términos',
      'legacy_migration': 'Migración de sistema anterior',
      'unspecified': 'No especificado',
    };
    return reasons[reasonCode] || reasonCode;
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
              <Table.ColumnHeader>Evento</Table.ColumnHeader>
              <Table.ColumnHeader>Usuario</Table.ColumnHeader>
              <Table.ColumnHeader>Fecha y hora de creación</Table.ColumnHeader>
              <Table.ColumnHeader>Motivo</Table.ColumnHeader>
              <Table.ColumnHeader>Regiones de Vigencia</Table.ColumnHeader>
              <Table.ColumnHeader>Fecha y hora de desactivación</Table.ColumnHeader>
              <Table.ColumnHeader>Usuario desactivador</Table.ColumnHeader>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {events.map((event) => (
              <Table.Row key={event.id}>
                <Table.Cell>{getEventLabel(event.regions)}</Table.Cell>
                <Table.Cell>{event.created_by_admin_id}</Table.Cell>
                <Table.Cell>{formatTimestamp(event.created_at)}</Table.Cell>
                <Table.Cell>{getReasonLabel(event.reason_code)}</Table.Cell>
                <Table.Cell>{event.regions.join(', ')}</Table.Cell>
                <Table.Cell>{event.deactivated_at ? formatTimestamp(event.deactivated_at) : 'N/A (BLOQUEO ACTIVO)'}</Table.Cell>
                <Table.Cell>{event.deactivated_by_admin_id || 'N/A (BLOQUEO ACTIVO)'}</Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table.Root>
      </Stack>
    </Box>
  );
}
