"use client";

import {
  Box,
  Heading,
  Text,
  Button,
  VStack,
  HStack,
  Input,
  Badge,
} from "@chakra-ui/react";
import { useCallback, useEffect, useState, ChangeEvent } from "react";
import { getPolicyById, editPolicyById } from "@/lib/catalog/editItem";
import { countryNamesES } from "@/components/catalog/utils";
import { toaster } from "@/components/ui/toaster";

interface AvailabilityPolicyTabProps {
  id: string;
  type: string;
  onLoaded?: () => void;
}

export function AvailabilityPolicyTab({ id, type, onLoaded }: AvailabilityPolicyTabProps) {
  // Territory Policy states
  const [artistBlockedRegions, setArtistBlockedRegions] = useState<string[]>([]);
  const [selectedArtistBlockedRegions, setSelectedArtistBlockedRegions] = useState<string[]>([]);
  const [searchQueryTerritory, setSearchQueryTerritory] = useState("");
  const [isEditingTerritoryPolicy, setIsEditingTerritoryPolicy] = useState(false);

  // Validity Policy states
  const [publishedAt, setPublishedAt] = useState<string>("");
  const [selectedPublishedAt, setSelectedPublishedAt] = useState<string>("");
  const [isEditingValidityPolicy, setIsEditingValidityPolicy] = useState(false);
  const [isPastPublishingDate, setIsPastPublishingDate] = useState(false);

  const fetchPolicyData = useCallback(async () => {
    try {
      const policy = await getPolicyById(id, type);
      if (policy) {
        // Normalize blocked regions to uppercase for proper comparison
        const blockedRegions = (policy.artist_blocked_regions || []).map((code: string) => code.toUpperCase());
        setArtistBlockedRegions(blockedRegions);
        setSelectedArtistBlockedRegions(blockedRegions);

        const publishDate = policy.publishedAt || "";
        // Only set dates if they are valid
        if (publishDate && publishDate !== "Invalid Date") {
          try {
            const publishDateObj = new Date(publishDate);
            // Check if date is valid
            if (!isNaN(publishDateObj.getTime())) {
              // Store the original ISO 8601 format
              setPublishedAt(publishDate);
              // Convert to YYYY-MM-DD for the date input
              const year = publishDateObj.getFullYear();
              const month = String(publishDateObj.getMonth() + 1).padStart(2, "0");
              const day = String(publishDateObj.getDate()).padStart(2, "0");
              setSelectedPublishedAt(`${year}-${month}-${day}`);
              
              // Check if publishing date is in the past
              const today = new Date();
              today.setHours(0, 0, 0, 0);
              setIsPastPublishingDate(publishDateObj < today);
            }
          } catch (dateError) {
            console.error("Error parsing date:", dateError);
          }
        }
      }
    } catch (error) {
      console.error("Error fetching policy data:", error);
    }
  }, [id, type]);

  useEffect(() => {
    const init = async () => {
      try {
        await fetchPolicyData();
      } catch (err) {
        console.error("Error initializing AvailabilityPolicyTab:", err);
      } finally {
        onLoaded?.();
      }
    };
    void init();
  }, [fetchPolicyData, onLoaded]);

  // Handler for Territory Policy
  const handleEditTerritoryPolicy = async () => {
    setIsEditingTerritoryPolicy(true);
    try {
      const result = await editPolicyById(
        id,
        type,
        selectedArtistBlockedRegions,
        undefined
      );

      if (result !== null) {
        toaster.create({
          title: "Política de territorio actualizada",
          description: "Las regiones bloqueadas por el artista se han actualizado correctamente",
          type: "success",
          duration: 3000,
        });
        setArtistBlockedRegions(selectedArtistBlockedRegions);
        await fetchPolicyData();
      } else {
        toaster.create({
          title: "Error al actualizar política",
          description: "No se pudo actualizar la política de territorio. Vuelva a intentarlo más tarde.",
          type: "error",
          duration: 3000,
        });
      }
    } catch (error) {
      console.error("Error editing territory policy:", error);
      toaster.create({
        title: "Error al actualizar política",
        description: "Ocurrió un error inesperado. Vuelva a intentarlo más tarde.",
        type: "error",
        duration: 3000,
      });
    } finally {
      setIsEditingTerritoryPolicy(false);
    }
  };

  // Handler for Validity Policy
  const handleEditValidityPolicy = async () => {
    setIsEditingValidityPolicy(true);
    try {
      // Convert date from input format (YYYY-MM-DD) to ISO 8601 format (YYYY-MM-DDTHH:mm:ss)
      const dateWithTime = `${selectedPublishedAt}T00:00:00`;
      
      const result = await editPolicyById(
        id,
        type,
        undefined,
        dateWithTime
      );

      if (result !== null) {
        toaster.create({
          title: "Política de vigencia actualizada",
          description: "La fecha de publicación se ha actualizado correctamente",
          type: "success",
          duration: 3000,
        });
        setPublishedAt(dateWithTime);
        await fetchPolicyData();
      } else {
        toaster.create({
          title: "Error al actualizar política",
          description: "No se pudo actualizar la política de vigencia. Vuelva a intentarlo más tarde.",
          type: "error",
          duration: 3000,
        });
      }
    } catch (error) {
      console.error("Error editing validity policy:", error);
      toaster.create({
        title: "Error al actualizar política",
        description: "Ocurrió un error inesperado. Vuelva a intentarlo más tarde.",
        type: "error",
        duration: 3000,
      });
    } finally {
      setIsEditingValidityPolicy(false);
    }
  };

  // Helper functions
  const toggleTerritoryRegion = (code: string) => {
    setSelectedArtistBlockedRegions((prev) =>
      prev.includes(code) ? prev.filter((c) => c !== code) : [...prev, code]
    );
  };

  const availableRegionsTerritory = Object.entries(countryNamesES)
    .map(([code, name]) => ({
      code: code.toUpperCase(),
      name,
    }))
    .filter(
      (region) =>
        region.name.toLowerCase().includes(searchQueryTerritory.toLowerCase()) ||
        region.code.toLowerCase().includes(searchQueryTerritory.toLowerCase())
    );

  const isTerritoryPolicyChanged = 
    JSON.stringify([...artistBlockedRegions].sort()) !== 
    JSON.stringify([...selectedArtistBlockedRegions].sort());

  const isValidityPolicyChanged = () => {
    if (selectedPublishedAt === "") return false;
    // Convert selected date to ISO format for comparison
    const selectedDateISO = `${selectedPublishedAt}T00:00:00`;
    return publishedAt !== selectedDateISO;
  };

  const isSelectedDateBeforeToday = () => {
    if (selectedPublishedAt === "") return false;
    const selectedDate = new Date(selectedPublishedAt);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    selectedDate.setHours(0, 0, 0, 0);
    return selectedDate < today;
  };

  const getTodayDateString = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  return (
    <>
      {/* 1. Política de Territorio */}
      <Box mb={8} p={6} borderRadius="md" bg="gray.50" _dark={{ bg: "gray.800" }} border="1px solid" borderColor="gray.700">
        <Heading size="md" mb={4}>
          Política de Territorio
        </Heading>
        <Text fontSize="sm" color="gray.600" mb={4} _dark={{ color: "gray.400" }}>
          Define las regiones bloqueadas por el artista. Estas restricciones se aplican independientemente de otros bloqueos.
        </Text>

        <VStack align="stretch" gap={4}>
          <Box>
            <Text fontSize="sm" fontWeight={500} mb={2}>
              Seleccionar Regiones Bloqueadas por el Artista
            </Text>
            <Input
              placeholder="Buscar región..."
              value={searchQueryTerritory}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setSearchQueryTerritory(e.target.value)
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
              bg="white"
              _dark={{ bg: "gray.900" }}
            >
              {availableRegionsTerritory.map((region) => (
                <HStack key={region.code} mb={2}>
                  <input
                    type="checkbox"
                    checked={selectedArtistBlockedRegions.includes(region.code)}
                    onChange={() => toggleTerritoryRegion(region.code)}
                    style={{ cursor: "pointer" }}
                  />
                  <Text fontSize="sm">
                    {region.name} ({region.code})
                  </Text>
                </HStack>
              ))}
            </Box>
            {selectedArtistBlockedRegions.length > 0 && (
              <Box mt={3}>
                <Text fontSize="sm" fontWeight={500} mb={2}>
                  Regiones bloqueadas seleccionadas ({selectedArtistBlockedRegions.length}):
                </Text>
                <HStack wrap="wrap" gap={2}>
                  {selectedArtistBlockedRegions.map((code) => (
                    <Badge key={code} colorScheme="red">
                      {code}
                    </Badge>
                  ))}
                </HStack>
              </Box>
            )}
          </Box>

          <Button
            colorScheme="blue"
            onClick={handleEditTerritoryPolicy}
            disabled={!isTerritoryPolicyChanged || isEditingTerritoryPolicy}
            loading={isEditingTerritoryPolicy}
            alignSelf="flex-start"
          >
            Editar Política de Territorio
          </Button>
        </VStack>
      </Box>

      {/* 2. Política de Vigencia */}
      <Box p={6} borderRadius="md" bg="gray.50" _dark={{ bg: "gray.800" }} border="1px solid" borderColor="gray.700">
        <Heading size="md" mb={4}>
          Política de Vigencia
        </Heading>
        <Text fontSize="sm" color="gray.600" mb={4} _dark={{ color: "gray.400" }}>
          Define la fecha de publicación del contenido. Solo se puede modificar si la fecha aún no ha pasado.
        </Text>

        {isPastPublishingDate ? (
          <Box
            p={4}
            bg="yellow.50"
            borderRadius="md"
            border="1px solid"
            borderColor="yellow.200"
            _dark={{ bg: "yellow.900", borderColor: "yellow.700" }}
          >
            <HStack>
              <Text fontSize="sm" fontWeight="medium" color="yellow.800" _dark={{ color: "yellow.200" }}>
                ⚠️ La fecha de publicación ya ha pasado y no puede ser modificada.
              </Text>
            </HStack>
            <Text fontSize="sm" color="gray.600" mt={2} _dark={{ color: "gray.400" }}>
              Fecha actual: {publishedAt && !isNaN(new Date(publishedAt).getTime()) ? new Date(publishedAt).toLocaleDateString("es-AR") : "No definida"}
            </Text>
          </Box>
        ) : (
          <VStack align="stretch" gap={4}>
            <Box>
              <Text fontSize="sm" fontWeight={500} mb={2}>
                Fecha de Publicación
              </Text>
              <Input
                type="date"
                value={selectedPublishedAt}
                min={getTodayDateString()}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  setSelectedPublishedAt(e.target.value)
                }
                disabled={isPastPublishingDate}
              />
              {publishedAt && !isNaN(new Date(publishedAt).getTime()) && (
                <Text fontSize="xs" color="gray.500" mt={2} _dark={{ color: "gray.400" }}>
                  Fecha actual: {new Date(publishedAt).toLocaleDateString("es-AR")}
                </Text>
              )}
            </Box>

            <Button
              colorScheme="blue"
              onClick={handleEditValidityPolicy}
              disabled={!isValidityPolicyChanged() || isEditingValidityPolicy || isPastPublishingDate || isSelectedDateBeforeToday()}
              loading={isEditingValidityPolicy}
              alignSelf="flex-start"
            >
              Editar Vigencia
            </Button>
          </VStack>
        )}
      </Box>
    </>
  );
}
