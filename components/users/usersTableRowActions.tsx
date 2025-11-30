import { Box, Text, IconButton, Portal, Button, Stack } from "@chakra-ui/react";
// removed Popover import in favor of a small inline Chakra Box popup
import { FiEdit2, FiLock, FiUnlock, FiTrash2, FiEye } from "react-icons/fi";
import { useState, useRef, useEffect } from "react";
import type { ChangeEvent } from "react";
import { useRouter } from "next/navigation";
import { toaster } from "@/components/ui/toaster";
// Portal already imported at top
import { UserDetails } from "@/lib/users/getUsers";
import { editUserById } from "@/lib/users/editUsers";
import { deleteUserById } from "@/lib/users/deleteUsers";
import { blockUserById, unblockUserById } from "@/lib/users/blockUsers";
import { BlockUserDialog } from "@/components/users/blockUserDialog";

export function RowActions({
  user,
  openEditId,
  setOpenEditId,
  onActionComplete,
}: {
  user: UserDetails;
  openEditId: string | null;
  setOpenEditId: (id: string | null) => void;
  onActionComplete?: () => void;
}) {
  const router = useRouter();
  const editRoleOpen = openEditId === String(user.id);
  const [blockOpen, setBlockOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState(user.role);
  const btnRef = useRef<HTMLButtonElement | null>(null);
  const popupRef = useRef<HTMLDivElement | null>(null);
  const [popupPos, setPopupPos] = useState<{
    top: number;
    left: number;
  } | null>(null);

  useEffect(() => {
    if (!editRoleOpen) return;

    const onMouseDown = (e: MouseEvent) => {
      const target = e.target as Node;
      if (
        popupRef.current &&
        !popupRef.current.contains(target) &&
        btnRef.current &&
        !btnRef.current.contains(target)
      ) {
        setOpenEditId(null);
      }
    };

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpenEditId(null);
    };

    document.addEventListener("mousedown", onMouseDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onMouseDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [editRoleOpen, setOpenEditId]);

  const isBlocked = user.status === "blocked";

  // Use neutral, non-white background and subdued border/text colors
  // Use a slightly darker neutral background so the popup doesn't look like plain white
  const popupBg = "black";
  const popupBorder = "gray.200";
  const popupText = "white";

  const handleViewDetails = () => {
    router.push(`/admin/users/${user.id}`);
  };

  const handleEditRole = async () => {
    const editedUser = await editUserById(user.id, selectedRole);
    if (editedUser !== null) {
      toaster.create({
        title: "Rol actualizado",
        description: `El rol de ${editedUser?.username} ha sido actualizado a ${editedUser?.role}`,
        type: "success",
        duration: 3000,
      });
      setOpenEditId(null);
      // Notificar al padre para recargar la tabla
      onActionComplete?.();
    } else {
      toaster.create({
        title: "Error al actualizar rol",
        description: `No se pudo actualizar el rol de ${user.username}. Inténtalo de nuevo más tarde.`,
        type: "error",
        duration: 3000,
      });
    }
  };

  const handleToggleBlock = async () => {
    const result = isBlocked 
      ? await unblockUserById(user.id) 
      : await blockUserById(user.id);

    if (result !== null) {
      toaster.create({
        title: isBlocked ? "Usuario desbloqueado" : "Usuario bloqueado",
        description: `${user.username} ha sido ${
          isBlocked ? "desbloqueado" : "bloqueado"
        }`,
        type: "success",
        duration: 3000,
      });
      setBlockOpen(false);
      // Notificar al padre para recargar la tabla
      onActionComplete?.();
    } else {
      toaster.create({
        title: "Error al actualizar usuario",
        description: `No se pudo ${isBlocked ? "desbloquear" : "bloquear"} a ${user.username}. Inténtalo de nuevo más tarde.`,
        type: "error",
        duration: 3000,
      });
      setBlockOpen(false);
    }
  };

  const handleDelete = async () => {
    const success = await deleteUserById(String(user.id));
    if (success) {
      toaster.create({
        title: "Usuario eliminado",
        description: `${user.username} ha sido eliminado del sistema`,
        type: "success",
        duration: 3000,
      });
      setDeleteOpen(false);
      // Notificar al padre para recargar la tabla
      onActionComplete?.();
    } else {
      toaster.create({
        title: "Error al eliminar usuario",
        description: `No se pudo eliminar a ${user.username}. Inténtalo de nuevo más tarde.`,
        type: "error",
        duration: 3000,
      });
      setDeleteOpen(false);
    }
  };

  return (
    <Stack direction="row" gap={2} justify="center">
      {/* Ver detalles */}
      <IconButton
        aria-label="Ver detalles"
        size="sm"
        variant="ghost"
        colorScheme="blue"
        onClick={handleViewDetails}
      >
        <FiEye />
      </IconButton>

      {/* Editar rol */}
      <Box>
        <IconButton
          ref={(el: HTMLButtonElement | null) => {
            btnRef.current = el;
          }}
          aria-label="Editar rol"
          size="sm"
          variant="ghost"
          colorScheme="blue"
          onClick={() => {
            if (btnRef.current) {
              const rect = btnRef.current.getBoundingClientRect();
              const popupWidth = 240;
              const left = rect.right - popupWidth + window.scrollX;
              const top = rect.bottom + 8 + window.scrollY;
              setPopupPos({ top, left });
            }
            setOpenEditId(String(user.id));
          }}
        >
          <FiEdit2 />
        </IconButton>
        {editRoleOpen && popupPos && (
          <Portal>
            <Box
              position="absolute"
              top={`${popupPos.top}px`}
              left={`${popupPos.left}px`}
              ref={popupRef}
              bg={popupBg}
              borderWidth={1}
              borderColor={popupBorder}
              borderRadius="md"
              boxShadow="sm"
              zIndex={9999}
              p={4}
              minW="240px"
              color={popupText}
            >
              <Text fontWeight={500} mb={2}>
                Usuario: {user.username}
              </Text>
              <Text fontSize="sm" color="gray.600" mb={3}>
                Selecciona el nuevo rol para este usuario
              </Text>
              <select
                value={selectedRole}
                onChange={(e: ChangeEvent<HTMLSelectElement>) =>
                  setSelectedRole(e.target.value)
                }
                style={{
                  width: "100%",
                  padding: "8px 10px",
                  borderRadius: 8,
                  background: "white",
                  color: "black",
                  border: `1px solid var(--chakra-colors-${popupBorder})`,
                }}
              >
                <option value="listener">Listener</option>
                <option value="artist">Artist</option>
                <option value="admin">Admin</option>
              </select>
              <Box mt={4} textAlign="right">
                <Button
                  variant="outline"
                  mr={2}
                  onClick={() => setOpenEditId(null)}
                >
                  Cancelar
                </Button>
                <Button variant="outline" mr={2} onClick={handleEditRole}>
                  Confirmar
                </Button>
              </Box>
            </Box>
          </Portal>
        )}
      </Box>

      {/* Bloquear/Desbloquear (icon button + dialog reutilizable) */}
      <IconButton
        aria-label={isBlocked ? "Desbloquear" : "Bloquear"}
        size="sm"
        variant="ghost"
        colorScheme={isBlocked ? "green" : "orange"}
        onClick={() => setBlockOpen(true)}
      >
        {isBlocked ? <FiUnlock /> : <FiLock />}
      </IconButton>
      <BlockUserDialog
        isOpen={blockOpen}
        onClose={() => setBlockOpen(false)}
        onConfirm={handleToggleBlock}
        username={user.username}
        isBlocked={isBlocked}
      />

      {/* Eliminar */}
      <IconButton
        aria-label="Eliminar"
        size="sm"
        variant="ghost"
        colorScheme="red"
        onClick={() => setDeleteOpen(true)}
      >
        <FiTrash2 />
      </IconButton>
      {deleteOpen && (
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
            onClick={() => setDeleteOpen(false)}
          >
            <Box
              bg="white"
              color="black"
              borderRadius="md"
              p={4}
              minW="320px"
              onClick={(e) => e.stopPropagation()}
            >
              <Text fontWeight={600} fontSize="lg">
                Eliminar usuario
              </Text>
              <Text mt={3}>
                ¿Estás seguro de que deseas eliminar a{" "}
                <strong>{user.username}</strong>? Esta acción no se puede
                deshacer.
              </Text>
              <Box mt={4} textAlign="right">
                <Button
                  variant="outline"
                  color="green"
                  mr={2}
                  onClick={() => setDeleteOpen(false)}
                >
                  Cancelar
                </Button>
                <Button
                  variant="outline"
                  color="red"
                  mr={2}
                  onClick={handleDelete}
                >
                  Eliminar
                </Button>
              </Box>
            </Box>
          </Box>
        </Portal>
      )}
    </Stack>
  );
}
