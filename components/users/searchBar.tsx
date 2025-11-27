"use client";
import {
  Box,
  Input,
  Button,
  HStack,
  IconButton,
  Stack,
  Text,
  Badge,
  NativeSelectRoot,
  NativeSelectField,
  Collapsible,
} from "@chakra-ui/react";
import { FiSearch, FiFilter, FiX } from "react-icons/fi";


interface SearchBarProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  showFilters: boolean;
  setShowFilters: (show: boolean) => void;
  activeFiltersCount: number;
  handleClearFilters: () => void;
  selectedType: string;
  setSelectedType: (type: string) => void;
  selectedStatus: string;
  setSelectedStatus: (status: string) => void;
  // New published date range (YYYY-MM-DD)
  publishedFrom: string;
  setPublishedFrom: (date: string) => void;
  publishedTo: string;
  setPublishedTo: (date: string) => void;
  // Order by field
  orderBy: string;
  setOrderBy: (order: string) => void;
  // whether the date range is valid (parent verifies)
  isDateRangeValid: boolean;
  // called when user applies the filters (parent will build API payload and send)
  onApply: () => void;
}

// helper to add days to a YYYY-MM-DD string and return YYYY-MM-DD
const addDaysStr = (dateStr: string, days: number) => {
  if (!dateStr) return "";
  const d = new Date(dateStr + "T00:00:00");
  d.setDate(d.getDate() + days);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
};

function TypeFilter({
  selectedType,
  setSelectedType,
}: {
  selectedType: string;
  setSelectedType: (v: string) => void;
}) {
  return (
    <Box flex={1}>
      <Text mb={2} fontSize="sm" fontWeight="medium">
        Tipo de contenido
      </Text>
      <NativeSelectRoot>
        <NativeSelectField
          placeholder="Todos los tipos"
          value={selectedType}
          onChange={(e) => setSelectedType(e.target.value)}
        >
          <option value="song">Canción</option>
          <option value="collection">Colección</option>
          <option value="playlist">Playlist</option>
        </NativeSelectField>
      </NativeSelectRoot>
    </Box>
  );
}

function DateRangeFilter({
  publishedFrom,
  setPublishedFrom,
  publishedTo,
  setPublishedTo,
}: {
  publishedFrom: string;
  setPublishedFrom: (v: string) => void;
  publishedTo: string;
  setPublishedTo: (v: string) => void;
}) {
  const publishedToMin = publishedFrom ? addDaysStr(publishedFrom, 1) : undefined;
  const publishedFromMax = publishedTo ? addDaysStr(publishedTo, -1) : undefined;

  return (
    <Box flex={1}>
      <Text mb={2} fontSize="sm" fontWeight="medium">
        Rango de fecha de publicación
      </Text>
      <HStack>
        <Input
          type="date"
          value={publishedFrom}
          max={publishedFromMax}
          onChange={(e) => setPublishedFrom(e.target.value)}
          aria-label="Fecha desde"
          placeholder="Desde"
        />
        <Input
          type="date"
          value={publishedTo}
          min={publishedToMin}
          onChange={(e) => setPublishedTo(e.target.value)}
          aria-label="Fecha hasta"
          placeholder="Hasta"
        />
      </HStack>
    </Box>
  );
}

function StatusFilter({
  selectedStatus,
  setSelectedStatus,
}: {
  selectedStatus: string;
  setSelectedStatus: (v: string) => void;
}) {
  return (
    <Box flex={1}>
      <Text mb={2} fontSize="sm" fontWeight="medium">
        Estado
      </Text>
      <NativeSelectRoot>
        <NativeSelectField
          placeholder="Todos los estados"
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
        >
          <option value="programmed">Programado</option>
          <option value="published">Publicado</option>
          <option value="region_unavailable">No-disponible-región</option>
          <option value="blocked_admin">Bloqueado-admin</option>
        </NativeSelectField>
      </NativeSelectRoot>
    </Box>
  );
}

function OrderByFilter({
  orderBy,
  setOrderBy,
}: {
  orderBy: string;
  setOrderBy: (v: string) => void;
}) {
  return (
    <Box flex={1}>
      <Text mb={2} fontSize="sm" fontWeight="medium">
        Ordenar por
      </Text>
      <NativeSelectRoot>
        <NativeSelectField
          placeholder="Ninguno"
          value={orderBy}
          onChange={(e) => setOrderBy(e.target.value)}
        >
          <option value="date">Fecha Descendente</option>
        </NativeSelectField>
      </NativeSelectRoot>
    </Box>
  );
}

export function SearchBar({
  searchQuery,
  setSearchQuery,
  showFilters,
  setShowFilters,
  activeFiltersCount,
  handleClearFilters,
  selectedType,
  setSelectedType,
  selectedStatus,
  setSelectedStatus,
  publishedFrom,
  setPublishedFrom,
  publishedTo,
  setPublishedTo,
  orderBy,
  setOrderBy,
  isDateRangeValid,
  onApply,
}: SearchBarProps) {
  return (
    <Box>
      <HStack gap={3}>
        <Box flex={1} position="relative">
          <Input
            placeholder="Buscar en el catálogo..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                // trigger the same apply/search action
                if (isDateRangeValid) onApply();
              }
            }}
            size="lg"
            pr="3rem"
          />
          <Box
            position="absolute"
            right={3}
            top="50%"
            transform="translateY(-50%)"
            pointerEvents="none"
          >
            <FiSearch size={20} />
          </Box>
        </Box>

        <Button
          size="lg"
          onClick={() => {
            if (isDateRangeValid) onApply();
          }}
          colorScheme="green"
          disabled={!isDateRangeValid}
        >
          <HStack gap={2}>
            <FiSearch />
            <Text>Buscar</Text>
          </HStack>
        </Button>

        <Button
          onClick={() => setShowFilters(!showFilters)}
          colorScheme={showFilters ? "blue" : "gray"}
          size="lg"
          position="relative"
        >
          <HStack gap={2}>
            <FiFilter />
            <Text>Filtros</Text>
          </HStack>
          {activeFiltersCount > 0 && (
            <Badge
              position="absolute"
              top="-1"
              right="-1"
              colorScheme="red"
              borderRadius="full"
              fontSize="xs"
              px={2}
            >
              {activeFiltersCount}
            </Badge>
          )}
        </Button>
      </HStack>

      {/* Filters Section */}
      <Collapsible.Root open={showFilters}>
        <Collapsible.Content>
          <Box
            mt={4}
            p={6}
            borderWidth={1}
            borderRadius="lg"
            bg="gray.50"
            _dark={{ bg: "gray.800" }}
          >
            <HStack justify="space-between" mb={4}>
              <Text fontWeight="bold" fontSize="lg">
                Filtros de búsqueda
              </Text>
              <HStack gap={2}>
                {activeFiltersCount > 0 && (
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={handleClearFilters}
                  >
                    <HStack gap={2}>
                      <FiX />
                      <Text>Limpiar todo</Text>
                    </HStack>
                  </Button>
                )}
                <Button
                  size="sm"
                  colorScheme="blue"
                  onClick={onApply}
                  disabled={!isDateRangeValid}
                >
                  Aplicar
                </Button>
                <IconButton
                  aria-label="Cerrar filtros"
                  size="sm"
                  variant="ghost"
                  onClick={() => setShowFilters(false)}
                >
                  <FiX />
                </IconButton>
              </HStack>
            </HStack>

            <Stack direction={{ base: "column", md: "row" }} gap={4}>
              <TypeFilter selectedType={selectedType} setSelectedType={setSelectedType} />
              <DateRangeFilter
                publishedFrom={publishedFrom}
                setPublishedFrom={setPublishedFrom}
                publishedTo={publishedTo}
                setPublishedTo={setPublishedTo}
              />
              <StatusFilter selectedStatus={selectedStatus} setSelectedStatus={setSelectedStatus} />
              <OrderByFilter orderBy={orderBy} setOrderBy={setOrderBy} />
            </Stack>
          </Box>
        </Collapsible.Content>
      </Collapsible.Root>
    </Box>
  );
}