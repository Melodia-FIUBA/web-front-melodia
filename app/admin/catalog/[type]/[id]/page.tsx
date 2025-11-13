"use client";

import { Box, Heading, Text, Tabs, Spinner } from "@chakra-ui/react";
import { CatalogDetails } from "@/lib/catalog/searchCatalog";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { isAdminLoggedIn } from "@/lib/log/cookies";
import { CatalogSummaryTab } from "@/components/catalog/CatalogSummaryTab";
import { CatalogAvailabilityTab } from "@/components/catalog/CatalogAvailabilityTab";
import { CatalogAppearancesTab } from "@/components/catalog/CatalogAppearancesTab";
import { CatalogAuditTab } from "@/components/catalog/CatalogAuditTab";
import { fetchItemById } from "@/lib/catalog/summaryDetails";


export default function CatalogDetailPage() {
  const router = useRouter();

  const params = useParams();
  const id = params.id as string;
  const type = params.type as string;

  const [item, setItem] = useState<CatalogDetails | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAdminLoggedIn()) {
      router.push("/login");
    }
  }, [router]);

  useEffect(() => {
    if (!isAdminLoggedIn()) {
      return;
    }

    const fetchItem = async () => {
      setLoading(true);
      const fetchedItem = await fetchItemById(id, type);
      setItem(fetchedItem);
      setLoading(false);
    };

    void fetchItem();
  }, [id, type]);

  if (!isAdminLoggedIn()) {
    return null;
  }

  if (loading) {
    return (
      <Box p={6} textAlign="center" py={8}>
        <Spinner />
        <Text mt={2} color="gray.600">
          Cargando detalles del catálogo…
        </Text>
      </Box>
    );
  }

  if (!item) {
    return (
      <Box p={6}>
        <Heading size="lg">Item no encontrado</Heading>
        <Text mt={2} color="gray.600">
          No se encontró el ítem con id {id}.
        </Text>
      </Box>
    );
  }

  return (
    <Box p={6}>
      <Heading size="xl" mb={6}>{item.title}</Heading>
      <Text fontSize="lg" color="gray.600" mb={4}>
        {type.charAt(0).toUpperCase() + type.slice(1)}
      </Text>
      
      <Tabs.Root defaultValue="summary" variant="enclosed">
        <Tabs.List>
          <Tabs.Trigger value="summary">Resumen</Tabs.Trigger>
          <Tabs.Trigger value="availability">Disponibilidad</Tabs.Trigger>
          <Tabs.Trigger value="appearances">Apariciones</Tabs.Trigger>
          <Tabs.Trigger value="audit">Auditoría</Tabs.Trigger>
        </Tabs.List>

        <Tabs.Content value="summary" p={4}>
          <CatalogSummaryTab id={id} type={type} initialItem={item} />
        </Tabs.Content>

        <Tabs.Content value="availability" p={4}>
          <CatalogAvailabilityTab id={id} type={type} />
        </Tabs.Content>

        <Tabs.Content value="appearances" p={4}>
          <CatalogAppearancesTab id={id} type={type} />
        </Tabs.Content>

        <Tabs.Content value="audit" p={4}>
          <CatalogAuditTab id={id} type={type} />
        </Tabs.Content>
      </Tabs.Root>
    </Box>
  );
}
