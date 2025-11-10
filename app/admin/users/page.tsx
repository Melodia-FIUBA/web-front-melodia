"use client";

import { useState, useEffect } from "react";
import { Box, VStack, Heading, HStack, Button, Text } from "@chakra-ui/react";
import { UsersTable } from "@/components/usersTable";
import { getUsersList, UserDetails } from "@/lib/users/getUsers";
import { isAdminLoggedIn } from "@/lib/log/cookies";
import { useRouter } from "next/navigation";

export default function UsersPage() {
  const [users, setUsers] = useState<UserDetails[]>([]);
  const [total, setTotal] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  const [offset, setOffset] = useState(0);
  const PAGE_SIZE = 10;

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

    const fetchUsers = async () => {
      setLoading(true);

      const [users, total]: [UserDetails[], number] = await getUsersList(offset);

      setUsers(users);
      setTotal(total);
      setLoading(false);
    };

    void fetchUsers();
  }, [offset]);

  return (
    <Box p={6}>
      <VStack align="stretch" gap={6}>
        <Heading size="xl">Gestión de usuarios</Heading>
        <UsersTable users={users} total={total} loading={loading} />
        {/* Paginado */}
        <Box>
          <HStack justify="center" gap={4} mt={2}>
            <Button
              onClick={() => setOffset((prev) => Math.max(0, prev - PAGE_SIZE))}
              disabled={offset === 0 || loading}
              variant="outline"
            >
              Anterior
            </Button>

            <Text fontSize="sm" color="gray.600">
              Página {Math.floor(offset / PAGE_SIZE) + 1} / {(total ?? 0)}
            </Text>

            <Button
              onClick={() => setOffset((prev) => prev + PAGE_SIZE)}
              disabled={loading || users.length < PAGE_SIZE}
              variant="outline"
            >
              Siguiente
            </Button>
          </HStack>
        </Box>
      </VStack>
    </Box>
  );
}