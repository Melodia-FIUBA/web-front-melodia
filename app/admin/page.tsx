"use client";

import LoadBackgroundElement from "@/components/ui/loadElements";
import { isAdminLoggedIn } from "@/lib/log/cookies";

import { Box, Flex, Heading, Text } from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import { Suspense, useEffect } from "react";

export default function AdminPage() {
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
    <Flex direction="column" gap={4}>
      <Suspense fallback={<LoadBackgroundElement size="menu" />}>
        <Box
          minH="90vh"
          bgImage="url('/melodia-admin-background.png')"
          bgSize="contain"
          bgPos="left center"
          bgRepeat="no-repeat"
          fontFamily="sans"
          backgroundColor={"black"}
        >
          <Flex
            h="100%"
            w="100%"
            align="right"
            pr={8}
            direction="column"
            textAlign="right"
            gap={2}
          >
            <Heading
              mb={4}
              fontSize={{ base: "4xl", md: "6xl" }}
              fontWeight="bold"
              mt="35vh"
              transform="translateY(-50%)"
            >
              Administración de Melodía
            </Heading>
            <Text fontSize={{ base: "md", md: "4xl" }}>
              Bienvenidos administradores de la comunidad!
            </Text>
            <Text fontSize={{ base: "md", md: "4xl" }}>
              Seleccione una opción en la barra superior
            </Text>
          </Flex>
        </Box>
      </Suspense>
    </Flex>
  );
}
