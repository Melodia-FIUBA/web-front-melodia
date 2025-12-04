"use client";

import {
  Box,
  Heading,
  Text,
  Button,
  VStack,
  HStack,
  Table,
  Spinner,
  Input,
  Badge,
} from "@chakra-ui/react";
import { useCallback, useEffect, useState, ChangeEvent } from "react";
import { blockItemRegionallyById, unblockItemRegionallyById, getActiveBlocks, blockItemGloballyById, unblockItemGloballyById } from "@/lib/catalog/blockItem";
import { ReasonCodes, countryNamesES } from "@/components/catalog/utils";
import { ActiveBlock, ActiveBlockDisplay } from "@/types/regionalBlocks";
import { toaster } from "@/components/ui/toaster";
import { UnblockRegionalDialog } from "@/components/catalog/UnblockRegionalDialog";
import { BlockItemDialog } from "@/components/catalog/BlockItemDialog";
import { FaGlobe, FaLock, FaLockOpen } from "react-icons/fa";
import { getItemById } from "@/lib/catalog/summaryDetails";

interface BlockingPolicyTabProps {
  id: string;
  type: string;
  onLoaded?: () => void;
}

export function BlockingPolicyTab({ id, type, onLoaded }: BlockingPolicyTabProps) {
  const [loading, setLoading] = useState(true);
  const [activeBlocks, setActiveBlocks] = useState<ActiveBlockDisplay[]>([]);
  const [selectedRegions, setSelectedRegions] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedReasonCode, setSelectedReasonCode] = useState<ReasonCodes | "">("");
  const [isBlockingInProgress, setIsBlockingInProgress] = useState(false);
  const [isUnblockingInProgress, setIsUnblockingInProgress] = useState(false);
  
  const [unblockDialogOpen, setUnblockDialogOpen] = useState(false);
  const [currentUnblockBlock, setCurrentUnblockBlock] = useState<ActiveBlockDisplay | null>(null);
  
  const [globalBlockDialogOpen, setGlobalBlockDialogOpen] = useState(false);
  const [itemStatus, setItemStatus] = useState<string>("");
  const [itemTitle, setItemTitle] = useState<string>("");

  const fetchItemStatus = useCallback(async () => {
    try {
      const item = await getItemById(id, type);
      if (item) {
        setItemTitle(item.title || "");
      }
    } catch (error) {
      console.error("Error fetching item status:", error);
    }
  }, [id, type]);

  const fetchActiveBlocks = useCallback(async () => {
    setLoading(true);
    try {
      const blocks = await getActiveBlocks(id, type);
      
      // Verificar si hay un bloqueo global activo
      const hasGlobalBlock = blocks.some((block: ActiveBlock) => 
        block.regions.includes("GLOBAL")
      );
      setItemStatus(hasGlobalBlock ? "blocked_by_admin" : "");
      
      // Filtrar bloqueos con región GLOBAL (son bloqueos globales, no regionales)
      const regionalBlocks = blocks.filter((block: ActiveBlock) => !block.regions.includes("GLOBAL"));
      
      const displayBlocks: ActiveBlockDisplay[] = regionalBlocks.map((block: ActiveBlock) => {
        const regionNames = block.regions
          .map((code) => countryNamesES[code.toLowerCase()] || code)
          .join(", ");
        
        // Convert UTC to UTC-3 (Argentina timezone)
        const utcDate = new Date(block.created_at);
        const utcMinus3 = new Date(utcDate.getTime() - 3 * 60 * 60 * 1000);
        
        return {
          id: block.id,
          regions: block.regions,
          regionNames,
          reason_code: block.reason_code,
          created_at: utcMinus3.toLocaleString("es-AR", { 
            timeZone: "America/Argentina/Buenos_Aires",
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
          }),
        };
      });
      setActiveBlocks(displayBlocks);
    } catch (error) {
      console.error("Error fetching active blocks:", error);
    } finally {
      setLoading(false);
    }
  }, [id, type]);

  useEffect(() => {
    const init = async () => {
      try {
        await Promise.all([fetchActiveBlocks(), fetchItemStatus()]);
      } catch (err) {
        console.error("Error initializing BlockingPolicyTab:", err);
      } finally {
        onLoaded?.();
      }
    };
    void init();
  }, [fetchActiveBlocks, fetchItemStatus, onLoaded]);

  const availableRegions = Object.entries(countryNamesES)
    .map(([code, name]) => ({
      code: code.toUpperCase(),
      name,
    }))
    .filter(
      (region) =>
        region.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        region.code.toLowerCase().includes(searchQuery.toLowerCase())
    );

  const toggleRegion = (code: string) => {
    setSelectedRegions((prev) =>
      prev.includes(code) ? prev.filter((c) => c !== code) : [...prev, code]
    );
  };

  const handleBlockRegional = async () => {
    if (selectedRegions.length === 0 || !selectedReasonCode) return;

    setIsBlockingInProgress(true);
    try {
      const result = await blockItemRegionallyById(
        id,
        type,
        selectedReasonCode,
        selectedRegions
      );

      if (result !== null) {
        toaster.create({
          title: "Bloqueo regional realizado",
          description: `Se ha bloqueado el contenido en ${selectedRegions.length} región(es)`,
          type: "success",
          duration: 3000,
        });
        setSelectedRegions([]);
        setSelectedReasonCode("");
        await fetchActiveBlocks();
      } else {
        toaster.create({
          title: "Error al realizar bloqueo",
          description: "No se pudo realizar el bloqueo regional. Inténtalo de nuevo.",
          type: "error",
          duration: 3000,
        });
      }
    } catch (error) {
      console.error("Error blocking regionally:", error);
      toaster.create({
        title: "Error al realizar bloqueo",
        description: "Ocurrió un error inesperado. Inténtalo de nuevo.",
        type: "error",
        duration: 3000,
      });
    } finally {
      setIsBlockingInProgress(false);
    }
  };

  const handleOpenUnblockDialog = (block: ActiveBlockDisplay) => {
    setCurrentUnblockBlock(block);
    setUnblockDialogOpen(true);
  };

  const handleConfirmUnblock = async () => {
    if (!currentUnblockBlock) return;

    setIsUnblockingInProgress(true);
    try {
      const result = await unblockItemRegionallyById(
        id,
        type,
        currentUnblockBlock.regions
      );

      if (result !== null) {
        toaster.create({
          title: "Desbloqueo regional realizado",
          description: `Se ha desbloqueado el contenido en las regiones: ${currentUnblockBlock.regionNames}`,
          type: "success",
          duration: 3000,
        });
        setUnblockDialogOpen(false);
        setCurrentUnblockBlock(null);
        await fetchActiveBlocks();
      } else {
        toaster.create({
          title: "Error al realizar desbloqueo",
          description: "No se pudo realizar el desbloqueo regional. Inténtalo de nuevo.",
          type: "error",
          duration: 3000,
        });
      }
    } catch (error) {
      console.error("Error unblocking regionally:", error);
      toaster.create({
        title: "Error al realizar desbloqueo",
        description: "Ocurrió un error inesperado. Inténtalo de nuevo.",
        type: "error",
        duration: 3000,
      });
    } finally {
      setIsUnblockingInProgress(false);
    }
  };

  const handleToggleGlobalBlock = async (reasonCode?: string) => {
    const isBlocked = itemStatus === "blocked_by_admin";
    
    try {
      const result = isBlocked
        ? await unblockItemGloballyById(id, type)
        : await blockItemGloballyById(id, type, reasonCode || "unspecified");

      if (result !== null) {
        toaster.create({
          title: isBlocked ? "Elemento desbloqueado globalmente" : "Elemento bloqueado globalmente",
          description: `El contenido ha sido ${isBlocked ? "desbloqueado" : "bloqueado"} globalmente`,
          type: "success",
          duration: 3000,
        });
        setGlobalBlockDialogOpen(false);
        await fetchActiveBlocks();
      } else {
        toaster.create({
          title: "Error al actualizar elemento",
          description: `No se pudo ${isBlocked ? "desbloquear" : "bloquear"} el contenido. Inténtalo de nuevo.`,
          type: "error",
          duration: 3000,
        });
        setGlobalBlockDialogOpen(false);
      }
    } catch (error) {
      console.error("Error toggling global block:", error);
      toaster.create({
        title: "Error al actualizar elemento",
        description: "Ocurrió un error inesperado. Inténtalo de nuevo.",
        type: "error",
        duration: 3000,
      });
      setGlobalBlockDialogOpen(false);
    }
  };

  const isGloballyBlocked = itemStatus === "blocked_by_admin";

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

  return (
    <>
      {/* Sección de Bloqueo Global */}
      <Box p={6} borderRadius="md" mb={8} border="1px solid" borderColor="gray.700">
        <Heading size="md" mb={4}>
          <HStack>
            <FaGlobe />
            <Text>Bloqueo Global</Text>
          </HStack>
        </Heading>
        <Text fontSize="sm" color="gray.400" mb={4}>
          El bloqueo global afecta a todas las regiones del mundo.
        </Text>
        <Button
          colorScheme={isGloballyBlocked ? "green" : "red"}
          onClick={() => setGlobalBlockDialogOpen(true)}
        >
          {isGloballyBlocked ? (
            <>
              <FaLockOpen style={{ marginRight: 8 }} />
              Desbloquear Globalmente
            </>
          ) : (
            <>
              <FaLock style={{ marginRight: 8 }} />
              Bloquear Globalmente
            </>
          )}
        </Button>
      </Box>

      {/* Sección de Bloqueo Regional */}
      <Box p={6} borderRadius="md" mb={8} border="1px solid" borderColor="gray.700">
        <Heading size="md" mb={4}>
          Bloqueo Regional
        </Heading>

        <VStack align="stretch" gap={4}>
          <Box>
            <Text fontSize="sm" fontWeight={500} mb={2}>
              Seleccionar Regiones
            </Text>
            <Input
              placeholder="Buscar región..."
              value={searchQuery}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setSearchQuery(e.target.value)
              }
              mb={3}
            />
            <Box
              maxH="200px"
              overflowY="auto"
              border="1px solid"
              borderColor="gray.200"
              borderRadius="md"
              p={3}
            >
              {availableRegions.map((region) => (
                <HStack key={region.code} mb={2}>
                  <input
                    type="checkbox"
                    checked={selectedRegions.includes(region.code)}
                    onChange={() => toggleRegion(region.code)}
                    style={{ cursor: "pointer" }}
                  />
                  <Text fontSize="sm">
                    {region.name} ({region.code})
                  </Text>
                </HStack>
              ))}
            </Box>
            {selectedRegions.length > 0 && (
              <Box mt={3}>
                <Text fontSize="sm" fontWeight={500} mb={2}>
                  Regiones seleccionadas ({selectedRegions.length}):
                </Text>
                <HStack wrap="wrap" gap={2}>
                  {selectedRegions.map((code) => (
                    <Badge key={code} colorScheme="blue">
                      {code}
                    </Badge>
                  ))}
                </HStack>
              </Box>
            )}
          </Box>

          <Box>
            <Text fontSize="sm" fontWeight={500} mb={2}>
              Motivo del bloqueo <Text as="span" color="red.500">*</Text>
            </Text>
            <select
              value={selectedReasonCode}
              onChange={(e: ChangeEvent<HTMLSelectElement>) =>
                setSelectedReasonCode(e.target.value as ReasonCodes | "")
              }
              style={{
                width: "100%",
                padding: "8px 10px",
                borderRadius: 8,
                border: "1px solid #CBD5E0",
              }}
            >
              <option value="">-- Seleccione un motivo --</option>
              {Object.entries(ReasonCodes).map(([key, value]) => (
                <option key={key} value={key}>
                  {value}
                </option>
              ))}
            </select>
          </Box>

          <Button
            colorScheme="red"
            onClick={handleBlockRegional}
            disabled={selectedRegions.length === 0 || !selectedReasonCode || isBlockingInProgress}
            loading={isBlockingInProgress}
            alignSelf="flex-start"
          >
            Realizar Bloqueo Regional
          </Button>
        </VStack>
      </Box>

      {/* Sección de Bloqueos Activos */}
      <Box p={6} borderRadius="md" border="1px solid" borderColor="gray.700">
        <Heading size="md" mb={4}>
          Bloqueos Regionales Activos
        </Heading>

        {loading ? (
          <Box textAlign="center" py={8}>
            <Spinner />
            <Text mt={2} color="gray.600">
              Cargando bloqueos regionales activos…
            </Text>
          </Box>
        ) : activeBlocks.length === 0 ? (
          <Text color="gray.600">No hay bloqueos regionales activos para este contenido.</Text>
        ) : (
          <Box overflowX="auto">
            <Table.Root variant="outline" size="sm">
              <Table.Header>
                <Table.Row>
                  <Table.ColumnHeader>ID</Table.ColumnHeader>
                  <Table.ColumnHeader>Regiones</Table.ColumnHeader>
                  <Table.ColumnHeader>Motivo</Table.ColumnHeader>
                  <Table.ColumnHeader>Fecha de Creación</Table.ColumnHeader>
                  <Table.ColumnHeader>Acciones</Table.ColumnHeader>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {activeBlocks.map((block) => (
                  <Table.Row key={block.id}>
                    <Table.Cell>{block.id}</Table.Cell>
                    <Table.Cell>{block.regionNames}</Table.Cell>
                    <Table.Cell>{getReasonLabel(block.reason_code)}</Table.Cell>
                    <Table.Cell>{block.created_at}</Table.Cell>
                    <Table.Cell>
                      <Button
                        size="sm"
                        colorScheme="green"
                        variant="outline"
                        onClick={() => handleOpenUnblockDialog(block)}
                        disabled={isUnblockingInProgress}
                      >
                        Desbloquear
                      </Button>
                    </Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table.Root>
          </Box>
        )}
      </Box>

      <UnblockRegionalDialog
        isOpen={unblockDialogOpen}
        onClose={() => {
          setUnblockDialogOpen(false);
          setCurrentUnblockBlock(null);
        }}
        onConfirm={handleConfirmUnblock}
        regionNames={currentUnblockBlock?.regionNames || ""}
      />

      <BlockItemDialog
        isOpen={globalBlockDialogOpen}
        onClose={() => setGlobalBlockDialogOpen(false)}
        onConfirm={handleToggleGlobalBlock}
        itemTitle={itemTitle || `Contenido #${id}`}
        isBlocked={isGloballyBlocked}
      />
    </>
  );
}
