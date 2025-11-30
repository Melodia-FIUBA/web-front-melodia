"use client";

import ActiveUsersGraph from "@/components/metrics/active-users";
import { isAdminLoggedIn } from "@/lib/log/cookies";
import { Box, Flex, Heading, Text } from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function PanelUsuarioPage() {
  const router = useRouter();

  useEffect(() => {
    if (!isAdminLoggedIn()) {
      router.push("/login");
    }
  }, [router]);

  if (!isAdminLoggedIn()) {
    return null;
  }

  return (
    <Box minH="90vh" p={8}>
      <Flex direction="column" gap={6}>
        <Heading size="2xl" color="white">
          Panel Usuario
        </Heading>

        <Text color="gray.300" fontSize="lg">
          Bienvenido al panel de usuario
        </Text>

        <ActiveUsersGraph />
      </Flex>
    </Box>
  );
}
