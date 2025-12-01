"use client";

import ActiveUsersGraph from "@/components/metrics/active_users";
import NewUsersGraph from "@/components/metrics/new_users";
import UserRetentionGraph from "@/components/metrics/user_retention";
import { isAdminLoggedIn } from "@/lib/log/cookies";
import { Box, Flex, Heading, Text, NativeSelect, Button } from "@chakra-ui/react";
import { FaFileExcel } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getActiveUsersData, getNewUsersData, getUserRetentionData } from "@/lib/metrics/users_metrics";
import { exportToExcel } from "@/lib/utils/exportToExcel";

export default function PanelUsuarioPage() {
  const router = useRouter();
  const [timeframe, setTimeframe] = useState<"diario" | "semanal" | "mensual">("mensual");

  useEffect(() => {
    if (!isAdminLoggedIn()) {
      router.push("/login");
    }
  }, [router]);

  const handleExportToExcel = () => {
    const activeUsersData = getActiveUsersData(timeframe);
    const newUsersData = getNewUsersData(timeframe);
    const retentionData = getUserRetentionData(timeframe);

    exportToExcel(
      [
        { sheetName: "Usuarios Activos", data: activeUsersData },
        { sheetName: "Nuevos Registros", data: newUsersData },
        { sheetName: "Retención", data: retentionData },
      ],
      `metricas-usuarios-${timeframe}`
    );
  };

  if (!isAdminLoggedIn()) {
    return null;
  }

  return (
    <Box minH="90vh" p={8}>
      <Flex direction="column" gap={6}>
        <Flex justify="space-between" align="center">
          <Heading size="2xl" color="white">
            Panel Usuario
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

        <ActiveUsersGraph timeframe={timeframe} />
        <NewUsersGraph timeframe={timeframe} />
        <UserRetentionGraph timeframe={timeframe} />

        <Flex justify="flex-end" mt={4}>
          <Button onClick={handleExportToExcel} colorScheme="green" size="lg">
            <FaFileExcel style={{ marginRight: '8px' }} />
            Exportar a Excel
          </Button>
        </Flex>
      </Flex>
    </Box>
  );
}
