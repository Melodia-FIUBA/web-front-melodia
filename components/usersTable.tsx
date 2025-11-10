"use client";

import { Box, Text, Spinner, Table } from "@chakra-ui/react";
import { useState } from "react";
import { UserDetails } from "@/lib/users/getUsers";
import LoadBackgroundElement from "./ui/loadElements";
import { RowActions } from "./usersTableRowActions";

interface UsersTableProps {
  users: UserDetails[];
  loading: boolean;
  onActionComplete?: () => void;
}

export function UsersTable({
  users,
  loading,
  onActionComplete,
}: UsersTableProps) {
  const [openEditId, setOpenEditId] = useState<string | null>(null);

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
              <Table.ColumnHeader minW="180px">
                Nombre de usuario
              </Table.ColumnHeader>
              <Table.ColumnHeader minW="200px">
                Correo electrónico
              </Table.ColumnHeader>
              <Table.ColumnHeader minW="120px">Rol</Table.ColumnHeader>
              <Table.ColumnHeader minW="120px">Estado</Table.ColumnHeader>
              <Table.ColumnHeader minW="300px" textAlign="center" fontWeight="bold">
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
                  <RowActions
                    user={user}
                    openEditId={openEditId}
                    setOpenEditId={setOpenEditId}
                    onActionComplete={onActionComplete}
                  />
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table.Root>
      </Box>
    </Box>
  );
}
