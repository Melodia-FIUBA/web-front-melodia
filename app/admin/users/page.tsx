"use client";

import { useState, useEffect } from "react";
import { Box, VStack, Heading } from "@chakra-ui/react";
import { UsersTable, UserDetails } from "@/components/usersTable";

export default function UsersPage() {
  const [users, setUsers] = useState<UserDetails[]>([]);
  const [total, setTotal] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  // Simulación de carga de datos - reemplazar con llamada a API real
  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      // TODO: Reemplazar con llamada real a /api/users
      await new Promise((resolve) => setTimeout(resolve, 500));
      
      const mockUsers: UserDetails[] = [
        {
          id: "1",
          username: "juan.perez",
          email: "juan.perez@example.com",
          role: "admin",
          status: "active",
        },
        {
          id: "2",
          username: "maria.gomez",
          email: "maria.gomez@example.com",
          role: "user",
          status: "active",
        },
        {
          id: "3",
          username: "carlos.lopez",
          email: "carlos.lopez@example.com",
          role: "user",
          status: "blocked",
        },
        {
          id: "4",
          username: "ana.martinez",
          email: "ana.martinez@example.com",
          role: "user",
          status: "active",
        },
      ];

      setUsers(mockUsers);
      setTotal(mockUsers.length);
      setLoading(false);
    };

    void fetchUsers();
  }, []);

  return (
    <Box p={6}>
      <VStack align="stretch" gap={6}>
        <Heading size="xl">Gestión de usuarios</Heading>
        <UsersTable users={users} total={total} loading={loading} />
      </VStack>
    </Box>
  );
}