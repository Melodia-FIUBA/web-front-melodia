"use client";

import NewUsersByRegionGraph from "@/components/metrics/new_users_by_region";
import LoadBackgroundElement from "@/components/ui/loadElements";
import { isAdminLoggedIn } from "@/lib/log/cookies";
import { Box, Flex, Heading, NativeSelect, Button, Spinner, Text } from "@chakra-ui/react";
import { FaArrowLeft } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getNewUsersByRegionData } from "@/lib/metrics/users_metrics";

export default function UserPanelDetailsPage() {
  const router = useRouter();
  const [timeframe, setTimeframe] = useState<"diario" | "semanal" | "mensual">("mensual");
  const [regionalData, setRegionalData] = useState<Array<any>>([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);

  useEffect(() => {
    if (!isAdminLoggedIn()) {
      router.push("/login");
    }
  }, [router]);

  useEffect(() => {
    let isMounted = true;

    const loadMetrics = async () => {
      setLoading(true);
      setFetchError(null);

      try {
        const data = await getNewUsersByRegionData(timeframe);

        if (!isMounted) {
          return;
        }

        setRegionalData(data);
      } catch (error) {
        console.error("Error al cargar métricas de usuarios por región", error);
        if (isMounted) {
          setRegionalData([]);
          setFetchError("Error al cargar las métricas de usuarios por región");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadMetrics();

    return () => {
      isMounted = false;
    };
  }, [timeframe]);

  if (!isAdminLoggedIn()) {
    return null;
  }

  if (loading) {
    return (
      <Box p={6} borderRadius="lg" textAlign="center" py={8}>
        <Spinner />
        <Text mt={2} color="gray.300">
          Cargando métricas de vista detallada...
        </Text>
        <LoadBackgroundElement size="userpanel" />
      </Box>
    );
  }

  if (fetchError) {
    return (
      <Box
        minH="90vh"
        p={8}
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        <Text color="red.400" fontSize="xl">
          {fetchError}
        </Text>
      </Box>
    );
  }

  return (
    <Box minH="90vh" p={8}>
      <Flex direction="column" gap={6}>
        <Flex justify="space-between" align="center">
          <Heading size="2xl" color="white">
            Vista Detallada del Panel de Usuarios
          </Heading>

          <Flex align="center" gap={4}>
            <NativeSelect.Root size="md" width="200px">
              <NativeSelect.Field 
                value={timeframe}
                onChange={(e) => setTimeframe(e.target.value as "diario" | "semanal" | "mensual")}
              >
                <option value="diario">Diario</option>
                <option value="semanal">Semanal</option>
                <option value="mensual">Mensual</option>
              </NativeSelect.Field>
              <NativeSelect.Indicator />
            </NativeSelect.Root>

            <Button
              variant="outline"
              onClick={() => router.push("/admin/userpanel")}
            >
              <FaArrowLeft />
              <Box as="span" ml={2}>
                Volver
              </Box>
            </Button>
          </Flex>
        </Flex>

        <NewUsersByRegionGraph timeframe={timeframe} data={regionalData} />
      </Flex>
    </Box>
  );
}
