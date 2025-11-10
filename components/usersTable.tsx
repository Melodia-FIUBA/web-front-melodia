"use client";

import {
  Box,
  Text,
  Spinner,
  Table,
  IconButton,
  Portal,
  Button,
  Stack,
} from "@chakra-ui/react";
import { FiEdit2, FiLock, FiUnlock, FiTrash2 } from "react-icons/fi";
import { useState } from "react";
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
  DialogTrigger,
} from "@chakra-ui/react";
import { NativeSelectField, NativeSelectRoot } from "@chakra-ui/react";
import { UserDetails } from "@/lib/users/getUsers";
import LoadBackgroundElement from "./ui/loadElements";


interface UsersTableProps {
  users: UserDetails[];
  loading: boolean;
}

export function UsersTable({ users, loading }: UsersTableProps) {
  

  if (loading) {
    return (
      <Box p={6} borderWidth={1} borderRadius="lg" textAlign="center" py={8}>
        <Spinner />
        <Text mt={2} color="gray.600">
          Cargando usuarios…
        </Text>
        <LoadBackgroundElement size="users_menu"></LoadBackgroundElement>
      </Box>
    );
  }

  if (users.length === 0) {
    return (
      <Box p={8} textAlign="center" borderWidth={1} borderRadius="lg">
        <Text fontSize="xl" color="gray.500" mb={2}>
          👥
        </Text>
        <Text color="gray.500">No hay usuarios disponibles.</Text>
      </Box>
    );
  }

  return (
    <Box borderWidth={1} borderRadius="lg" overflow="hidden">

      <Box overflowX="auto">
        <Table.Root size="sm" variant="line">
          <Table.Header>
            <Table.Row>
              <Table.ColumnHeader minW="180px">Nombre de usuario</Table.ColumnHeader>
              <Table.ColumnHeader minW="200px">Correo electrónico</Table.ColumnHeader>
              <Table.ColumnHeader minW="120px">Rol</Table.ColumnHeader>
              <Table.ColumnHeader minW="120px">Estado</Table.ColumnHeader>
              <Table.ColumnHeader minW="300px" textAlign="center">
                Acciones
              </Table.ColumnHeader>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {users.map((user) => (
              <Table.Row key={user.id}>
                <Table.Cell fontWeight={500}>{user.username}</Table.Cell>
                <Table.Cell color="gray.700">{user.email}</Table.Cell>
                <Table.Cell>
                  <Box
                    as="span"
                    px={2}
                    py={1}
                    borderRadius="md"
                    fontSize="xs"
                    fontWeight={500}
                    bg="blue.100"
                    color="blue.800"
                  >
                    {user.role}
                  </Box>
                </Table.Cell>
                <Table.Cell>
                  <Box
                    as="span"
                    px={2}
                    py={1}
                    borderRadius="md"
                    fontSize="xs"
                    fontWeight={500}
                    bg={user.status === "active" ? "green.100" : "red.100"}
                    color={user.status === "active" ? "green.800" : "red.800"}
                  >
                    {user.status === "active" ? "Activo" : "Bloqueado"}
                  </Box>
                </Table.Cell>
                <Table.Cell textAlign="center">
                  <RowActions user={user} />
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table.Root>
      </Box>
    </Box>
  );
}

function RowActions({ user }: { user: UserDetails }) {
  const [editRoleOpen, setEditRoleOpen] = useState(false);
  const [blockOpen, setBlockOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState(user.role);

  const isBlocked = user.status === "blocked";

  const handleEditRole = () => {
    // TODO: Implementar llamada a API
    console.log("Editar rol:", user.id, "nuevo rol:", selectedRole);
    toaster.create({
      title: "Rol actualizado",
      description: `El rol de ${user.username} ha sido actualizado a ${selectedRole}`,
      type: "success",
      duration: 3000,
    });
    setEditRoleOpen(false);
  };

  const handleToggleBlock = () => {
    // TODO: Implementar llamada a API
    console.log(isBlocked ? "Desbloquear:" : "Bloquear:", user.id);
    toaster.create({
      title: isBlocked ? "Usuario desbloqueado" : "Usuario bloqueado",
      description: `${user.username} ha sido ${isBlocked ? "desbloqueado" : "bloqueado"}`,
      type: "success",
      duration: 3000,
    });
    setBlockOpen(false);
  };

  const handleDelete = () => {
    // TODO: Implementar llamada a API
    console.log("Eliminar:", user.id);
    toaster.create({
      title: "Usuario eliminado",
      description: `${user.username} ha sido eliminado del sistema`,
      type: "success",
      duration: 3000,
    });
    setDeleteOpen(false);
  };

  return (
    <Stack direction="row" gap={2} justify="center">
      {/* Editar rol */}
      <DialogRoot open={editRoleOpen} onOpenChange={(e) => setEditRoleOpen(e.open)}>
        <DialogTrigger asChild>
          <IconButton
            aria-label="Editar rol"
            size="sm"
            variant="ghost"
            colorScheme="blue"
            disabled={isBlocked}
          >
            <FiEdit2 />
          </IconButton>
        </DialogTrigger>
        <Portal>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Editar rol de usuario</DialogTitle>
            </DialogHeader>
            <DialogBody>
              <Stack gap={4}>
                <Box>
                  <Text fontWeight={500} mb={2}>
                    Usuario: {user.username}
                  </Text>
                  <Text fontSize="sm" color="gray.600" mb={4}>
                    Selecciona el nuevo rol para este usuario
                  </Text>
                </Box>
                <NativeSelectRoot>
                  <NativeSelectField
                    value={selectedRole}
                    onChange={(e) => setSelectedRole(e.target.value)}
                  >
                    <option value="user">Usuario</option>
                    <option value="admin">Administrador</option>
                    {/* solo roles válidos: user, admin */}
                  </NativeSelectField>
                </NativeSelectRoot>
              </Stack>
            </DialogBody>
            <DialogFooter>
              <DialogActionTrigger asChild>
                <Button variant="outline">Cancelar</Button>
              </DialogActionTrigger>
              <Button colorScheme="blue" onClick={handleEditRole}>
                Confirmar
              </Button>
            </DialogFooter>
            <DialogCloseTrigger />
          </DialogContent>
        </Portal>
      </DialogRoot>

      {/* Bloquear/Desbloquear */}
      <DialogRoot open={blockOpen} onOpenChange={(e) => setBlockOpen(e.open)}>
        <DialogTrigger asChild>
          <IconButton
            aria-label={isBlocked ? "Desbloquear" : "Bloquear"}
            size="sm"
            variant="ghost"
            colorScheme={isBlocked ? "green" : "orange"}
          >
            {isBlocked ? <FiUnlock /> : <FiLock />}
          </IconButton>
        </DialogTrigger>
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

      {/* Eliminar */}
      <DialogRoot open={deleteOpen} onOpenChange={(e) => setDeleteOpen(e.open)}>
        <DialogTrigger asChild>
          <IconButton
            aria-label="Eliminar"
            size="sm"
            variant="ghost"
            colorScheme="red"
            disabled={isBlocked}
          >
            <FiTrash2 />
          </IconButton>
        </DialogTrigger>
        <Portal>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Eliminar usuario</DialogTitle>
            </DialogHeader>
            <DialogBody>
              <Text>
                ¿Estás seguro de que deseas eliminar a <strong>{user.username}</strong>? Esta
                acción no se puede deshacer.
              </Text>
            </DialogBody>
            <DialogFooter>
              <DialogActionTrigger asChild>
                <Button variant="outline">Cancelar</Button>
              </DialogActionTrigger>
              <Button colorScheme="red" onClick={handleDelete}>
                Eliminar
              </Button>
            </DialogFooter>
            <DialogCloseTrigger />
          </DialogContent>
        </Portal>
      </DialogRoot>
    </Stack>
  );
}
