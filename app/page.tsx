'use client'

import { Box, Button, Heading, Text } from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import { Suspense } from "react";

export default function Home() {
  const router = useRouter();

  return (
    <Suspense>
    <Box
      minH="100vh"
      bgImage="url('/melodia-background.png')"
      bgSize="cover"
      bgPos={"center"}
      bgRepeat="no-repeat"
      fontFamily="sans"
    >
      <Box bg="blackAlpha.700" minH="100vh" display="flex" alignItems="center" justifyContent="center">
      <Box textAlign="center" color="white" px={6}>
        <Heading mb={4} fontSize={{ base: '2xl', md: '4xl' }} fontWeight="bold">
        Backoffice de Melodía
        </Heading>
        <Text fontSize={{ base: 'md', md: 'xl' }}>¿Formás parte de nuestra comunidad de Administradores?</Text>
        <Button as="a" onClick={() => { router.push('/login') }} mt={4} colorScheme="teal" size="lg">Iniciar sesión</Button>
      </Box>
      </Box>
    </Box>
    </Suspense>
  );
}
