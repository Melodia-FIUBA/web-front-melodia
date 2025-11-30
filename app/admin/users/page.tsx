"use client";

import { useState, useEffect } from "react";
import { Box, VStack, Heading, HStack, Button, Text } from "@chakra-ui/react";
import { UsersTable } from "@/components/users/usersTable";
import { getUsersList, UserDetails } from "@/lib/users/getUsers";
import { isAdminLoggedIn } from "@/lib/log/cookies";
import { useRouter } from "next/navigation";

export default function UsersPage() {
  const [users, setUsers] = useState<UserDetails[]>([]);
  const [total, setTotal] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [reloadKey, setReloadKey] = useState(0);

  const [offset, setOffset] = useState(0);
  const USERS_LIST_LIMIT = 12;

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

      const [users, total]: [UserDetails[], number] = await getUsersList(
        USERS_LIST_LIMIT,
        offset
      );

      setUsers(users);
      setTotal(total);
      setLoading(false);
    };

    void fetchUsers();
  }, [offset, reloadKey]);

  return (
    <Box p={6}>
      <VStack align="stretch" gap={6}>
        <Heading size="xl">Gestión de usuarios</Heading>
        <UsersTable
          users={users}
          loading={loading}
          onActionComplete={() => setReloadKey((k) => k + 1)}
        />
        {/* Paginado */}
        <Box>
          <HStack justify="center" gap={4} mt={2}>
            <Button
              onClick={() =>
                setOffset((prev) => Math.max(0, prev - USERS_LIST_LIMIT))
              }
              disabled={offset === 0 || loading}
              variant="outline"
            >
              Anterior
            </Button>

            <Text fontSize="sm" color="gray.600">
              Página {Math.floor(offset / USERS_LIST_LIMIT) + 1} / {total ?? 0}
            </Text>

            <Button
              onClick={() => setOffset((prev) => prev + USERS_LIST_LIMIT)}
              disabled={loading || users.length < USERS_LIST_LIMIT}
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
