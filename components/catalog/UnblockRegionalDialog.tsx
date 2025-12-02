import { Box, Text, Portal, Button, VStack } from "@chakra-ui/react";

interface UnblockRegionalDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  regionNames: string;
}

export function UnblockRegionalDialog({
  isOpen,
  onClose,
  onConfirm,
  regionNames,
}: UnblockRegionalDialogProps) {
  if (!isOpen) return null;

  return (
    <Portal>
      <Box
        position="fixed"
        top="0"
        left="0"
        right="0"
        bottom="0"
        bg="blackAlpha.600"
        zIndex={9999}
        display="flex"
        alignItems="center"
        justifyContent="center"
        onClick={onClose}
      >
        <Box
          bg="gray.800"
          borderRadius="md"
          p={6}
          minW="400px"
          onClick={(e) => e.stopPropagation()}
        >
          <VStack align="stretch" gap={4}>
            <Text fontWeight={600} fontSize="xl">
              Desbloquear regiones
            </Text>
            <Text>
              ¿Estás seguro de que deseas desbloquear las siguientes regiones:{" "}
              <strong>{regionNames}</strong>?
            </Text>
          </VStack>
          
          <Box mt={6} textAlign="right">
            <Button variant="outline" color="gray" mr={3} onClick={onClose}>
              Cancelar
            </Button>
            <Button
              color="green"
              variant="outline"
              onClick={onConfirm}
            >
              Desbloquear
            </Button>
          </Box>
        </Box>
      </Box>
    </Portal>
  );
}
