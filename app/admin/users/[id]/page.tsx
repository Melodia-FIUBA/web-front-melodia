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
  Breadcrumb,
} from "@chakra-ui/react";
import { useParams } from "next/navigation";
import { FiHome, FiUsers, FiLock, FiUnlock } from "react-icons/fi";
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

interface UserProfile {
  id: string;
  username: string;
  email: string;
  role: string;
  status: "active" | "blocked";
  registeredAt: string;
  lastConnection: string;
}

export default function UserDetailPage() {
  const params = useParams();
  const userId = params.id as string;

  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [blockDialogOpen, setBlockDialogOpen] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true);
      // TODO: Reemplazar con llamada real a /api/users/${userId}
      await new Promise((resolve) => setTimeout(resolve, 500));

      const mockUser: UserProfile = {
        id: userId,
        username: "juan.perez",
        email: "juan.perez@example.com",
        role: "admin",
        status: "active",
        registeredAt: "2024-01-15T10:30:00Z",
        lastConnection: "2025-11-08T14:22:00Z",
      };

      setUser(mockUser);
      setLoading(false);
    };

    void fetchUser();
  }, [userId]);

  const handleToggleBlock = () => {
    if (!user) return;

    // TODO: Implementar llamada a API
    console.log(user.status === "blocked" ? "Desbloquear:" : "Bloquear:", user.id);
    
    const newStatus = user.status === "blocked" ? "active" : "blocked";
    setUser({ ...user, status: newStatus });

    toaster.create({
      title: newStatus === "blocked" ? "Usuario bloqueado" : "Usuario desbloqueado",
      description: `${user.username} ha sido ${newStatus === "blocked" ? "bloqueado" : "desbloqueado"}`,
      type: "success",
      duration: 3000,
    });
    
    setBlockDialogOpen(false);
  };

  if (loading) {
    return (
      <Box p={6}>
        <Text>Cargando perfil...</Text>
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
        {/* Breadcrumb */}
        <Breadcrumb.Root fontSize="sm" color="gray.600">
          <Breadcrumb.List>
            <Breadcrumb.Item>
              <Breadcrumb.Link href="/admin">
                <FiHome style={{ display: "inline", marginRight: "4px" }} />
                Administración
              </Breadcrumb.Link>
            </Breadcrumb.Item>
            <Breadcrumb.Item>
              <Breadcrumb.Link href="/admin/users">
                <FiUsers style={{ display: "inline", marginRight: "4px" }} />
                Usuarios
              </Breadcrumb.Link>
            </Breadcrumb.Item>
            <Breadcrumb.Item>
              <Breadcrumb.CurrentLink>{user.username}</Breadcrumb.CurrentLink>
            </Breadcrumb.Item>
          </Breadcrumb.List>
        </Breadcrumb.Root>

        {/* Header con nombre y estado */}
        <Box>
          <Stack direction="row" justify="space-between" align="center" flexWrap="wrap">
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
        <DialogRoot open={blockDialogOpen} onOpenChange={(e) => setBlockDialogOpen(e.open)}>
          <Portal>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>
                  {isBlocked ? "Desbloquear usuario" : "Bloquear usuario"}
                </DialogTitle>
              </DialogHeader>
              <DialogBody>
                <Text>
                  ¿Estás seguro de que deseas {isBlocked ? "desbloquear" : "bloquear"} a{" "}
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
