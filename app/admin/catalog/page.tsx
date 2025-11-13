"use client";

import { useState, useEffect } from "react";
import { Box, VStack, Heading, HStack, Button, Text } from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import { SearchBar } from "@/components/searchBar";
import {
  validateDateRange,
  CatalogDetails,
} from "@/lib/catalog/searchCatalog";
import { CatalogResultsTable } from "@/components/catalog/CatalogResultsTable";
import { isAdminLoggedIn } from "@/lib/log/cookies";
import { handleSearchFilters } from "./utils";

export default function CatalogPage() {
  const [searchQuery, setSearchQuery] = useState("");
  // appliedQuery stores the last query that was "applied" by clicking Buscar/Aplicar
  // highlighting should follow this value so it doesn't update on every keystroke
  const [appliedQuery, setAppliedQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [selectedType, setSelectedType] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [publishedFrom, setPublishedFrom] = useState("");
  const [publishedTo, setPublishedTo] = useState("");

  const handleClearFilters = () => {
    setSelectedType("");
    setSelectedStatus("");
    setPublishedFrom("");
    setPublishedTo("");
    setSearchQuery("");
    setAppliedQuery("");
  };

  const activeFiltersCount = [
    selectedType,
    selectedStatus,
    publishedFrom,
    publishedTo,
  ].filter((filter) => filter !== "").length;

  const router = useRouter();
  const [initFromUrl, setInitFromUrl] = useState(false);

  // Results / network state
  const [items, setItems] = useState<CatalogDetails[]>([]);
  const [total, setTotal] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [, setError] = useState<string | null>(null);

  // Pagination state
  const [offset, setOffset] = useState(0);
  const CATALOG_LIST_LIMIT = 10;

  
  useEffect(() => {
    if (!isAdminLoggedIn()) {
      router.push("/login");
    }
  }, [router]);

  // Read initial filter/search state from URL on mount
  useEffect(() => {
    if (!isAdminLoggedIn()) {
      return;
    }
    try {
      const params = new URLSearchParams(window.location.search);
      const searchParam = params.get("q") ?? "";
      const type = params.get("type") ?? "";
      const status = params.get("status") ?? "";
      const from = params.get("publishedFrom") ?? "";
      const to = params.get("publishedTo") ?? "";

      const hasAny = searchParam || type || status || from || to;
      if (hasAny) {
        // schedule updates to avoid synchronous setState calls inside effect
        setTimeout(() => {
          if (searchParam) setSearchQuery(searchParam);
          if (searchParam) setAppliedQuery(searchParam);
          if (type) setSelectedType(type);
          if (status) setSelectedStatus(status);
          if (from) setPublishedFrom(from);
          if (to) setPublishedTo(to);
          // mark initialization complete after restoring state from URL
          setInitFromUrl(true);
        }, 0);
      } else {
        // no params to load, still mark initialized so URL-sync effect can run
        setTimeout(() => setInitFromUrl(true), 0);
      }
    } catch {
      // ignore (e.g., SSR or malformed URL)
    }
  }, []);

  // Push changes to URL when filters/search change
  useEffect(() => {
    if (!isAdminLoggedIn()) {
      return;
    }
    
    if (!initFromUrl) return; // avoid overwriting URL before initial params have been applied
    const params = new URLSearchParams();
    if (searchQuery) params.set("q", searchQuery);
    if (selectedType) params.set("type", selectedType);
    if (selectedStatus) params.set("status", selectedStatus);
    if (publishedFrom) params.set("publishedFrom", publishedFrom);
    if (publishedTo) params.set("publishedTo", publishedTo);

    const queryString = params.toString();
    const newUrl = queryString
      ? `${window.location.pathname}?${queryString}`
      : window.location.pathname;
    const current = window.location.pathname + window.location.search;
    if (newUrl !== current) {
      // use replace to avoid adding history entries on every change
      router.replace(newUrl);
    }
  }, [
    searchQuery,
    selectedType,
    selectedStatus,
    publishedFrom,
    publishedTo,
    router,
    initFromUrl,
  ]);

  return (
    <Box p={6}>
      <VStack gap={6} align="stretch">
        <Heading size="xl">Catálogo</Heading>

        {/* Search Bar */}
        <SearchBar
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          showFilters={showFilters}
          setShowFilters={setShowFilters}
          activeFiltersCount={activeFiltersCount}
          handleClearFilters={handleClearFilters}
          selectedType={selectedType}
          setSelectedType={setSelectedType}
          selectedStatus={selectedStatus}
          setSelectedStatus={setSelectedStatus}
          publishedFrom={publishedFrom}
          setPublishedFrom={setPublishedFrom}
          publishedTo={publishedTo}
          setPublishedTo={setPublishedTo}
          isDateRangeValid={validateDateRange(publishedFrom, publishedTo)}
          onApply={() => {
            // mark the current search query as applied so highlighting updates only on apply
            setAppliedQuery(searchQuery);
            setOffset(0); // Reset offset when applying new filters
            handleSearchFilters(
              { 
                searchQuery, 
                selectedType, 
                selectedStatus, 
                publishedFrom, 
                publishedTo,
                limit: String(CATALOG_LIST_LIMIT),
                offset: '0'
              },
              { setItems, setTotal, setLoading, setError }
            );
          }}
        />

        {/* Results Section */}
        <CatalogResultsTable
          items={items}
          loading={loading}
          // highlight using the last-applied query instead of live typing
          searchQuery={appliedQuery}
        />

        {/* Paginado */}
        <Box>
          <HStack justify="center" gap={4} mt={2}>
            <Button
              onClick={() => {
                const newOffset = Math.max(0, offset - CATALOG_LIST_LIMIT);
                setOffset(newOffset);
                handleSearchFilters(
                  { 
                    searchQuery, 
                    selectedType, 
                    selectedStatus, 
                    publishedFrom, 
                    publishedTo,
                    limit: String(CATALOG_LIST_LIMIT),
                    offset: String(newOffset)
                  },
                  { setItems, setTotal, setLoading, setError }
                );
              }}
              disabled={offset === 0 || loading}
              variant="outline"
            >
              Anterior
            </Button>

              {/* / {total ?? 1} */}
            <Text fontSize="sm" color="gray.600">
              Página {Math.floor(offset / CATALOG_LIST_LIMIT) + 1} 
            </Text>

            <Button
              onClick={() => {
                const newOffset = offset + CATALOG_LIST_LIMIT;
                setOffset(newOffset);
                handleSearchFilters(
                  { 
                    searchQuery, 
                    selectedType, 
                    selectedStatus, 
                    publishedFrom, 
                    publishedTo,
                    limit: String(CATALOG_LIST_LIMIT),
                    offset: String(newOffset)
                  },
                  { setItems, setTotal, setLoading, setError }
                );
              }}
              disabled={loading || items.length < CATALOG_LIST_LIMIT}
              variant="outline"
            >
              Siguiente
            </Button>
          </HStack>
        </Box>
      </VStack>
    </Box>
  );
}
