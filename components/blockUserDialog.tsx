import { Box, Text, Portal, Button } from "@chakra-ui/react";

interface BlockUserDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  username: string;
  isBlocked: boolean;
}

export function BlockUserDialog({
  isOpen,
  onClose,
  onConfirm,
  username,
  isBlocked,
}: BlockUserDialogProps) {
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
          bg="white"
          color="black"
          borderRadius="md"
          p={6}
          minW="400px"
          onClick={(e) => e.stopPropagation()}
        >
          <Text fontWeight={600} fontSize="xl" mb={4}>
            {isBlocked ? "Desbloquear usuario" : "Bloquear usuario"}
          </Text>
          <Text>
            ¿Estás seguro de que deseas {isBlocked ? "desbloquear" : "bloquear"}{" "}
            a <strong>{username}</strong>?
          </Text>
          <Box mt={6} textAlign="right">
            <Button variant="outline" color="gray" mr={3} onClick={onClose}>
              Cancelar
            </Button>
            <Button
              color={isBlocked ? "green" : "red"}
              variant="outline"
              onClick={onConfirm}
            >
              {isBlocked ? "Desbloquear" : "Bloquear"}
            </Button>
          </Box>
        </Box>
      </Box>
    </Portal>
  );
}
