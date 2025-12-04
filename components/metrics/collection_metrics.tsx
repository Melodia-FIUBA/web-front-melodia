"use client";

import { useEffect, useState, ReactElement } from "react";
import {
  Card,
  SimpleGrid,
  Stat,
  Box,
  Text,
  Flex,
  Icon,
  Heading,
  Spinner,
} from "@chakra-ui/react";
import { FaPlay, FaHeart, FaShare } from "react-icons/fa";
import { getCollectionMetricsData } from "@/lib/metrics/catalog_metrics";
import LoadBackgroundElement from "../ui/loadElements";

interface CollectionMetricsProps {
  collectionId: string;
}

type CollectionMetricsData = Awaited<
  ReturnType<typeof getCollectionMetricsData>
>;

interface KPICardProps {
  label: string;
  icon: ReactElement;
  value: number;
}

function KPICard({ label, icon, value }: KPICardProps) {
  return (
    <Card.Root bg="gray.800" borderColor="gray.700" p={6}>
      <Card.Body>
        <Stat.Root>
          <Flex align="center" gap={2} mb={2}>
            <Icon fontSize="lg" color="purple.400">
              {icon}
            </Icon>
            <Stat.Label color="gray.400" fontSize="sm">
              {label}
            </Stat.Label>
          </Flex>
          <Stat.ValueText color="white" fontSize="3xl" fontWeight="bold">
            {value.toLocaleString("es-ES")}
          </Stat.ValueText>
        </Stat.Root>
      </Card.Body>
    </Card.Root>
  );
}

export default function CollectionMetrics({
  collectionId,
}: CollectionMetricsProps) {
  const [kpiData, setKpiData] = useState<CollectionMetricsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const fetchMetrics = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const data = await getCollectionMetricsData(collectionId);
        if (!isMounted) return;
        setKpiData(data);
      } catch (err) {
        if (!isMounted) return;
        console.error("Collection metrics error:", err);
        setError("No pudimos cargar las métricas de la colección.");
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    void fetchMetrics();

    return () => {
      isMounted = false;
    };
  }, [collectionId]);

  if (isLoading) {
    return (
      <Box p={6} textAlign="center" py={8}>
        <Spinner />
        <Text mt={2} color="gray.600">
          Cargando métricas de la colección
        </Text>
        <LoadBackgroundElement size="content_metrics"></LoadBackgroundElement>
      </Box>
    );
  }

  if (error) {
    return (
      <Box bg="gray.800" borderRadius="md" p={6}>
        <Text color="red.300" fontWeight="medium">
          {error}
        </Text>
      </Box>
    );
  }

  if (!kpiData) {
    return null;
  }

  return (
    <Box>
      <Heading size="lg" mb={4} color="white">
        Métricas del Álbum
      </Heading>

      <SimpleGrid columns={{ base: 1, md: 3 }} gap={6} mb={8}>
        <KPICard
          label="Reproducciones Totales"
          icon={<FaPlay />}
          value={kpiData.totalPlays}
        />
        <KPICard
          label="Me Gusta del Álbum"
          icon={<FaHeart />}
          value={kpiData.likes}
        />
        <KPICard
          label="Veces Compartido"
          icon={<FaShare />}
          value={kpiData.shares}
        />
      </SimpleGrid>

      <Text fontSize="xs" color="gray.500" mt={4}>
        Última actualización: {kpiData.lastUpdate}
      </Text>
    </Box>
  );
}
