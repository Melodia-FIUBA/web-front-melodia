import { Box, Text, Portal, Button, VStack } from "@chakra-ui/react";
import { useState, ChangeEvent } from "react";
import { ReasonCodes } from "./utils";

interface BlockItemDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (reasonCode?: ReasonCodes) => void;
  itemTitle: string;
  isBlocked: boolean;
}

export function BlockItemDialog({
  isOpen,
  onClose,
  onConfirm,
  itemTitle,
  isBlocked,
}: BlockItemDialogProps) {
  const [selectedReasonCode, setSelectedReasonCode] = useState<ReasonCodes>(ReasonCodes.unspecified);

  const handleClose = () => {
    setSelectedReasonCode(ReasonCodes.unspecified);
    onClose();
  };

  const handleConfirm = () => {
    if (!isBlocked) {
      onConfirm(selectedReasonCode);
    } else {
      onConfirm();
    }
    setSelectedReasonCode(ReasonCodes.unspecified);
  };

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
        onClick={handleClose}
      >
        <Box
          bg="white"
          color="black"
          borderRadius="md"
          p={6}
          minW="400px"
          onClick={(e) => e.stopPropagation()}
        >
          <VStack align="stretch" gap={4}>
            <Text fontWeight={600} fontSize="xl">
              {isBlocked ? "Desbloquear elemento" : "Bloquear elemento"}
            </Text>
            <Text>
              ¿Estás seguro de que deseas {isBlocked ? "desbloquear" : "bloquear"}{" "}
              <strong>{itemTitle}</strong>?
            </Text>
            
            {!isBlocked && (
              <Box>
                <Text fontSize="sm" fontWeight={500} mb={2}>
                  Motivo del bloqueo <Text as="span" color="red.500">*</Text>
                </Text>
                <select
                  value={selectedReasonCode}
                  onChange={(e: ChangeEvent<HTMLSelectElement>) =>
                    setSelectedReasonCode(e.target.value as ReasonCodes)
                  }
                  style={{
                    width: "100%",
                    padding: "8px 10px",
                    borderRadius: 8,
                    background: "white",
                    color: "black",
                    border: "1px solid #CBD5E0",
                  }}
                >
                  {Object.entries(ReasonCodes).map(([key, value]) => (
                    <option key={key} value={key}>
                      {value}
                    </option>
                  ))}
                </select>
              </Box>
            )}
          </VStack>
          
          <Box mt={6} textAlign="right">
            <Button variant="outline" color="gray" mr={3} onClick={handleClose}>
              Cancelar
            </Button>
            <Button
              color={isBlocked ? "green" : "red"}
              variant="outline"
              onClick={handleConfirm}
            >
              {isBlocked ? "Desbloquear" : "Bloquear"}
            </Button>
          </Box>
        </Box>
      </Box>
    </Portal>
  );
}
