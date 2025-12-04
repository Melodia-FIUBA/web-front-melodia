/* eslint-disable @typescript-eslint/no-unused-vars */
import { Box, Text, Portal, Button, Input } from "@chakra-ui/react";
import { useState } from "react";
import type { ChangeEvent } from "react";

interface EditMetadataDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (title: string, artists: string) => void;
  itemTitle: string;
  itemArtists: string;
}

export function EditMetadataDialog({
  isOpen,
  onClose,
  onConfirm,
  itemTitle,
  itemArtists,
}: EditMetadataDialogProps) {
  const [editedTitle, setEditedTitle] = useState(itemTitle);
  const [editedArtists, setEditedArtists] = useState(itemArtists);

  if (!isOpen) return null;

  const handleConfirm = () => {
    onConfirm(editedTitle, editedArtists);
  };

  const handleClose = () => {
    // Resetear valores al cerrar
    setEditedTitle(itemTitle);
    setEditedArtists(itemArtists);
    onClose();
  };

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
          minW="500px"
          maxW="600px"
          onClick={(e) => e.stopPropagation()}
        >
          <Text fontWeight={600} fontSize="xl" mb={4}>
            Editar metadatos
          </Text>

          <Box mb={4}>
            <Text fontSize="sm" fontWeight={500} mb={2}>
              Título
            </Text>
            <Input
              value={editedTitle}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setEditedTitle(e.target.value)
              }
              placeholder="Título del elemento"
              size="md"
            />
          </Box>

          <Box mt={6} textAlign="right">
            <Button variant="outline" color="gray" mr={3} onClick={onClose}>
              Cancelar
            </Button>
            <Button variant="outline" color="gray" onClick={handleConfirm}>
              Guardar cambios
            </Button>
          </Box>
        </Box>
      </Box>
    </Portal>
  );
}
