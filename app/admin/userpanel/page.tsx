"use client";

import ActiveUsersGraph from "@/components/metrics/active_users";
import NewUsersGraph from "@/components/metrics/new_users";
import LoadBackgroundElement from "@/components/ui/loadElements";
import { isAdminLoggedIn } from "@/lib/log/cookies";
import { Box, Flex, Heading, NativeSelect, Button, Spinner, Text } from "@chakra-ui/react";
import { FaFileExcel } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getActiveUsersData, getNewUsersData } from "@/lib/metrics/users_metrics";
import { exportToExcel } from "@/lib/utils/exportToExcel";

export default function PanelUsuarioPage() {
  const router = useRouter();
  const [timeframe, setTimeframe] = useState<"diario" | "semanal" | "mensual">("mensual");
  const [isExporting, setIsExporting] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [activeUsersData, setActiveUsersData] = useState<Array<any>>([]);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [newUsersData, setNewUsersData] = useState<Array<any>>([]);
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
        const [activeData, newData] = await Promise.all([
          getActiveUsersData(timeframe),
          getNewUsersData(timeframe),
        ]);

        if (!isMounted) {
          return;
        }

        setActiveUsersData(activeData);
        setNewUsersData(newData);
      } catch (error) {
        console.error("Error al cargar métricas de usuarios", error);
        if (isMounted) {
          setActiveUsersData([]);
          setNewUsersData([]);
          setFetchError("Error al cargar las métricas de usuarios");
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

  const handleExportToExcel = async () => {
    try {
      setIsExporting(true);

      exportToExcel(
        [
          { sheetName: "Usuarios Activos", data: activeUsersData },
          { sheetName: "Nuevos Registros", data: newUsersData },
        ],
        `metricas-usuarios-${timeframe}`
      );
    } catch (error) {
      console.error("Error al exportar métricas de usuarios", error);
    } finally {
      setIsExporting(false);
    }
  };

  if (!isAdminLoggedIn()) {
    return null;
  }

  if (loading) {
    return (
      <Box p={6} borderRadius="lg" textAlign="center" py={8}>
        <Spinner />
        <Text mt={2} color="gray.300">
          Cargando métricas de usuarios...
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
            Panel de métricas de Usuarios
          </Heading>

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
        </Flex>

        <ActiveUsersGraph timeframe={timeframe} data={activeUsersData} />
        <NewUsersGraph timeframe={timeframe} data={newUsersData} />

        <Flex justify="flex-end" mt={4}>
          <Button onClick={handleExportToExcel} colorScheme="green" size="lg" loading={isExporting}>
            <FaFileExcel style={{ marginRight: '8px' }} />
            Exportar a Excel
          </Button>
        </Flex>
      </Flex>
    </Box>
  );
}
