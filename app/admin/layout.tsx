"use client";

import { logout } from "@/lib/log/logout";
import { Box, Flex, Link, Image, IconButton } from "@chakra-ui/react";
import { Suspense } from "react";
import { LuLogOut } from "react-icons/lu";


export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const headerHeight = "64px";

  return (
    <Box>
      <Box
        as="header"
        top="0"
        left="0"
        right="0"
        height={headerHeight}
        bg="gray.900"
        color="white"
        zIndex="banner"
        boxShadow="sm"
      >
        <Flex align="center" height="100%" px={4}>
          <Suspense>
            <Image src="/melodia-logo.png" alt="" boxSize="50px" />
          </Suspense>
          <Link fontWeight="bold" href="/admin" ml={4}>
            Melodía BackOffice
          </Link>
          <Flex gap={6} ml={6} align="center">
            <Link href="/admin/catalog">Catálogo</Link>
            <Link href="/admin/users">Usuarios</Link>
          </Flex>

          <IconButton ml="auto" onClick={() => logout()}>
            <LuLogOut />
          </IconButton>
        </Flex>
      </Box>
      <Box as="main" pt={headerHeight} bg="black" minH="100vh" px={6} py={4}>
        {children}
      </Box>
    </Box>
  );
}
