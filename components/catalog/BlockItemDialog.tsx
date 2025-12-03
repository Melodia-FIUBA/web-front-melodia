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
  // Allow empty selection initially (no option selected). Only a non-empty
  // value different from 'unspecified' will enable the block action.
  const [selectedReasonCode, setSelectedReasonCode] = useState<ReasonCodes | "">("");

  // The selection is reset on close; no need to set state synchronously on open.

  const handleClose = () => {
    setSelectedReasonCode("");
    onClose();
  };

  const handleConfirm = () => {
    if (!isBlocked) {
      // Prevent confirming if no valid reason selected
      if (!selectedReasonCode) return;
      onConfirm(selectedReasonCode as unknown as ReasonCodes);
    } else {
      onConfirm();
    }
    setSelectedReasonCode("");
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
              {isBlocked ? "Desbloquear elemento Globalmente" : "Bloquear elemento Globalmente"}
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
                    setSelectedReasonCode(e.target.value as ReasonCodes | "")
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
                  <option value="">-- Seleccione un motivo --</option>
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
              disabled={!isBlocked && !selectedReasonCode}
            >
              {isBlocked ? "Desbloquear" : "Bloquear"}
            </Button>
          </Box>
        </Box>
      </Box>
    </Portal>
  );
}
