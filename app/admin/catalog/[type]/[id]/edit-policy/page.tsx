"use client";

import {
  Box,
  Heading,
  Button,
  HStack,
  Tabs,
  Spinner,
  Text,
} from "@chakra-ui/react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { isAdminLoggedIn } from "@/lib/log/cookies";
import { FaArrowLeft } from "react-icons/fa";
import { BlockingPolicyTab } from "@/components/catalog/BlockingPolicyTab";
import { AvailabilityPolicyTab } from "@/components/catalog/AvailabilityPolicyTab";
import LoadBackgroundElement from "@/components/ui/loadElements";

export default function EditPolicyPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const type = params.type as string;

  useEffect(() => {
    if (!isAdminLoggedIn()) {
      router.push("/login");
    }
  }, [router]);
  const [blockingLoaded, setBlockingLoaded] = useState(false);

  const initialLoaded = blockingLoaded; // only wait for the default (blocking) tab to finish

  if (!isAdminLoggedIn()) {
    return null;
  }

  return (
    <Box p={6}>
      <HStack justify="space-between" mb={6}>
        <Heading size="lg">
          Gestión de Políticas de Contenido
        </Heading>
        <Button
          variant="outline"
          onClick={() => router.push(`/admin/catalog/${type}/${id}`)}
        >
          <FaArrowLeft />
          <Box as="span" ml={2}>
            Ir al detalle
          </Box>
        </Button>
      </HStack>
      {!initialLoaded && (
        <Box p={6} borderRadius="lg" textAlign="center" py={8} mb={6}>
          <Spinner />
          <Text mt={2} color="gray.600">
            Cargando políticas del contenido...
          </Text>
          <LoadBackgroundElement size="users_menu"></LoadBackgroundElement>
        </Box>
      )}
      

      <Box display={initialLoaded ? "block" : "none"}>
        <Tabs.Root defaultValue="blocking" variant="enclosed">
        <Tabs.List>
          <Tabs.Trigger value="blocking">Bloqueo y Desbloqueo con Alcance</Tabs.Trigger>
          <Tabs.Trigger value="availability">Disponibilidad por Región y Ventana</Tabs.Trigger>
        </Tabs.List>

        <Tabs.Content value="blocking" p={4}>
          <BlockingPolicyTab id={id} type={type} onLoaded={() => setBlockingLoaded(true)} />
        </Tabs.Content>

        <Tabs.Content value="availability" p={4}>
          <AvailabilityPolicyTab id={id} type={type} />
        </Tabs.Content>
        </Tabs.Root>
      </Box>
    </Box>
  );
}
