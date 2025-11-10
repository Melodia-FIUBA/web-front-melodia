"use client";

import { useState, useEffect } from "react";
import {
  Box,
  Heading,
  Text,
  Button,
  Stack,
  Card,
  Portal,
  Spinner,
} from "@chakra-ui/react";
import { useParams, useRouter } from "next/navigation";
import { FiLock, FiUnlock } from "react-icons/fi";
import { toaster } from "@/components/ui/toaster";
import {
  DialogActionTrigger,
  DialogBody,
  DialogCloseTrigger,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogRoot,
  DialogTitle,
} from "@chakra-ui/react";
import { isAdminLoggedIn } from "@/lib/log/cookies";
import LoadBackgroundElement from "@/components/ui/loadElements";
import { getUserById, UserProfile } from "@/lib/users/getUsers";

export default function UserDetailPage() {
  const params = useParams();
  const userId = params.id as string;

  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [blockDialogOpen, setBlockDialogOpen] = useState(false);

  const router = useRouter();

  useEffect(() => {
    if (!isAdminLoggedIn()) {
      router.push("/login");
    }
  }, [router]);

  useEffect(() => {
    if (!isAdminLoggedIn()) {
      return;
    }
    const fetchUser = async () => {
      setLoading(true);
      
      const user : UserProfile | null = await getUserById(userId);

      setUser(user);
      setLoading(false);
    };

    void fetchUser();
  }, [userId]);

  const handleToggleBlock = () => {
    if (!user) return;

    // TODO: Implementar llamada a API
    console.log(
      user.status === "blocked" ? "Desbloquear:" : "Bloquear:",
      user.id
    );

    const newStatus = user.status === "blocked" ? "active" : "blocked";
    setUser({ ...user, status: newStatus });

    toaster.create({
      title:
        newStatus === "blocked" ? "Usuario bloqueado" : "Usuario desbloqueado",
      description: `${user.username} ha sido ${
        newStatus === "blocked" ? "bloqueado" : "desbloqueado"
      }`,
      type: "success",
      duration: 3000,
    });

    setBlockDialogOpen(false);
  };

  if (loading) {
    return (
          <Box p={6} borderRadius="lg" textAlign="center" py={8}>
            <Spinner />
            <Text mt={2} color="gray.600">
              Cargando perfil…
            </Text>
            <LoadBackgroundElement size="users_profile"></LoadBackgroundElement>
          </Box>
        );
  }

  if (!user) {
    return (
      <Box p={6}>
        <Heading size="lg">Usuario no encontrado</Heading>
        <Text mt={2} color="gray.600">
          No se encontró el usuario con id {userId}.
        </Text>
      </Box>
    );
  }

  const isBlocked = user.status === "blocked";

  return (
    <Box p={6}>
      <Stack gap={6}>

        {/* Header con nombre y estado */}
        <Box>
          <Stack
            direction="row"
            justify="space-between"
            align="center"
            flexWrap="wrap"
          >
            <Box>
              <Heading size="2xl">{user.username}</Heading>
              <Box mt={2}>
                <Box
                  as="span"
                  px={3}
                  py={1}
                  borderRadius="md"
                  fontSize="sm"
                  fontWeight={500}
                  bg={isBlocked ? "red.100" : "green.100"}
                  color={isBlocked ? "red.800" : "green.800"}
                >
                  {isBlocked ? "Bloqueado" : "Activo"}
                </Box>
              </Box>
            </Box>
            <Button
              colorScheme={isBlocked ? "green" : "orange"}
              size="lg"
              onClick={() => setBlockDialogOpen(true)}
            >
              {isBlocked ? <FiUnlock /> : <FiLock />}
              <Box as="span" ml={2}>
                {isBlocked ? "Desbloquear usuario" : "Bloquear usuario"}
              </Box>
            </Button>
          </Stack>
        </Box>

        {/* Información básica */}
        <Card.Root>
          <Card.Header>
            <Heading size="lg">Información básica</Heading>
          </Card.Header>
          <Card.Body>
            <Stack gap={4}>
              <Box>
                <Text fontWeight={600} color="gray.600" fontSize="sm">
                  Nombre de usuario
                </Text>
                <Text fontSize="lg">{user.username}</Text>
              </Box>
              <Box>
                <Text fontWeight={600} color="gray.600" fontSize="sm">
                  Correo electrónico
                </Text>
                <Text fontSize="lg">{user.email}</Text>
              </Box>
              <Box>
                <Text fontWeight={600} color="gray.600" fontSize="sm">
                  Rol
                </Text>
                <Box
                  as="span"
                  px={2}
                  py={1}
                  borderRadius="md"
                  fontSize="sm"
                  fontWeight={500}
                  bg="blue.100"
                  color="blue.800"
                  display="inline-block"
                  mt={1}
                >
                  {user.role}
                </Box>
              </Box>
            </Stack>
          </Card.Body>
        </Card.Root>

        {/* Fechas clave */}
        <Card.Root>
          <Card.Header>
            <Heading size="lg">Fechas clave</Heading>
          </Card.Header>
          <Card.Body>
            <Stack gap={4}>
              <Box>
                <Text fontWeight={600} color="gray.600" fontSize="sm">
                  Fecha de registro
                </Text>
                <Text fontSize="lg">
                  {new Date(user.registeredAt).toLocaleDateString("es-ES", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </Text>
              </Box>
              <Box>
                <Text fontWeight={600} color="gray.600" fontSize="sm">
                  Última conexión
                </Text>
                <Text fontSize="lg">
                  {new Date(user.lastConnection).toLocaleDateString("es-ES", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </Text>
              </Box>
            </Stack>
          </Card.Body>
        </Card.Root>

        {/* Dialog de confirmación para bloquear/desbloquear */}
        <DialogRoot
          open={blockDialogOpen}
          onOpenChange={(e) => setBlockDialogOpen(e.open)}
        >
          <Portal>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>
                  {isBlocked ? "Desbloquear usuario" : "Bloquear usuario"}
                </DialogTitle>
              </DialogHeader>
              <DialogBody>
                <Text>
                  ¿Estás seguro de que deseas{" "}
                  {isBlocked ? "desbloquear" : "bloquear"} a{" "}
                  <strong>{user.username}</strong>?
                </Text>
              </DialogBody>
              <DialogFooter>
                <DialogActionTrigger asChild>
                  <Button variant="outline">Cancelar</Button>
                </DialogActionTrigger>
                <Button
                  colorScheme={isBlocked ? "green" : "orange"}
                  onClick={handleToggleBlock}
                >
                  {isBlocked ? "Desbloquear" : "Bloquear"}
                </Button>
              </DialogFooter>
              <DialogCloseTrigger />
            </DialogContent>
          </Portal>
        </DialogRoot>
      </Stack>
    </Box>
  );
}
