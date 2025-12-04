/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import {
  Box,
  Button,
  Field,
  Flex,
  Heading,
  Input,
  InputGroup,
  Stack,
} from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import { LuUser } from "react-icons/lu";
import { PasswordInput } from "@/components/ui/password-input";
import { useForm } from "react-hook-form";
import { toaster } from "@/components/ui/toaster";
import { FormValues, validateAdminLogin } from "@/lib/log/login";
import { Suspense } from "react";
import LoadBackgroundElement from "@/components/ui/loadElements";
import BackgroundImageBox from "@/components/ui/BackgroundImageBox";

export default function LoginPage() {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>();

  const onSubmit = handleSubmit((data) => {
    // wrapper que decide resolver o rechazar
    const promise = (async () => {
      const result = await validateAdminLogin(data);
      if (result.success) return result;
      throw new Error(result.toastMessage);
    })();

    // adjuntar el catch inmediatamente para evitar "Uncaught (in promise)"
    promise.catch(() => {});

    // pasar la promesa al toaster (ya tiene catch)
    toaster.promise(promise, {
      success: (result) => {
        setTimeout(() => router.push("/admin"), 400);
        return { description: result.toastMessage };
      },
      error: (err: any) => ({
        description: err?.message ?? "Error desconocido",
      }),
      loading: {},
    });
  });

  return (
    <Suspense fallback={<LoadBackgroundElement />}>
      <BackgroundImageBox
        minH="100vh"
        imageUrl="/melodia-background.png"
        bgSize="cover"
        bgPos="center"
        bgRepeat="no-repeat"
        fontFamily="sans"
      >
        <Box
          bg="blackAlpha.700"
          minH="100vh"
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <Box textAlign="center" color="white" px={6}>
            <Flex>
              <Heading
                mb={4}
                fontSize={{ base: "2xl", md: "4xl" }}
                fontWeight="bold"
              >
                Iniciar Sesión
              </Heading>
            </Flex>
            <Flex direction="column" align="center" mt={4} gap={4}>
              <form onSubmit={onSubmit}>
                <Stack gap="4" align="flex-start" maxW="sm">
                  <Field.Root invalid={!!errors.email}>
                    <Field.Label>Email</Field.Label>
                    <InputGroup startElement={<LuUser />}>
                      <Input {...register("email")} placeholder="Email" />
                    </InputGroup>
                    <Field.ErrorText>
                      {errors.email?.message}
                    </Field.ErrorText>
                  </Field.Root>

                  <Field.Root invalid={!!errors.password}>
                    <Field.Label>Contraseña</Field.Label>
                    <PasswordInput {...register("password")} />
                    <Field.ErrorText>
                      {errors.password?.message}
                    </Field.ErrorText>
                  </Field.Root>

                  <Button type="submit">Iniciar Sesión</Button>
                </Stack>
              </form>
            </Flex>
          </Box>
        </Box>
      </BackgroundImageBox>
    </Suspense>
  );
}
