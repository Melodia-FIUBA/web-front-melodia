import { Box, Text } from "@chakra-ui/react";
import WorldMap from "react-svg-worldmap";
import { AvailabilityDetails } from "@/lib/catalog/availabilityDetails";
import { countryNamesES } from "./utils";

interface WorldAvailabilityMapProps {
  availability: AvailabilityDetails;
}

export function WorldAvailabilityMap({ availability }: WorldAvailabilityMapProps) {
  // Helper function to get status label
  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'published':
        return 'Publicado';
      case 'unpublished':
        return 'Programado';
      case 'not-available-region':
        return 'No disponible en región';
      case 'blocked-admin':
        return 'Bloqueado por admin';
      default:
        return status;
    }
  };

  // Prepare data for the world map
  const mapData = availability.regions.map((region) => ({
    country: region.code.toLowerCase(),
    value: 1, // dummy value for display
  }));

  // Map status to colors for the world map
  const getMapColor = (countryCode: string) => {
    const region = availability.regions.find(
      (r) => r.code.toLowerCase() === countryCode.toLowerCase()
    );
    
    if (!region) return '#6b7280'; // gray for countries not in the list
    
    switch (region.status) {
      case 'published':
        return '#10b981'; // green
      case 'unpublished':
        return '#fbbf24'; // yellow
      case 'not-available-region':
        return '#ef4444'; // red
      case 'blocked-admin':
        return '#7c2d12'; // bordó/dark red
      default:
        return '#6b7280'; // gray
    }
  };

  return (
    <Box>
      <Text fontWeight={600} mb={3}>Disponibilidad por Región</Text>
      <Box background="gray.800" p={4} borderRadius="md">
        <Box 
          background="black" 
          borderRadius="md" 
          p={2}
          mx="auto"
          width="100%"
          maxW="1212px"
          height="auto"
          css={{
            '& svg': {
              background: 'black',
              display: 'inherit',
            }
          }}
        >
          <WorldMap
            color="#10b981"
            value-suffix=""
            size="xxl"
            data={mapData}
            styleFunction={(context) => ({
              fill: getMapColor(context.countryCode),
              stroke: '#1f2937',
              strokeWidth: 1,
              strokeOpacity: 0.5,
              cursor: 'pointer',
            })}
            tooltipTextFunction={(context) => {
              const region = availability.regions.find(
                (r) => r.code.toLowerCase() === context.countryCode?.toLowerCase()
              );
              
              const countryName = countryNamesES[context.countryCode?.toLowerCase() || ''] || context.countryName;
              
              if (!region) {
                return `${countryName}: Sin información`;
              }
              
              return `${countryName}: ${getStatusLabel(region.status)}`;
            }}
          />
        </Box>
        
        {/* Leyenda */}
        <Box mt={4} display="flex" flexWrap="wrap" gap={4} justifyContent="center">
          <Box display="flex" alignItems="center" gap={2}>
            <Box w={4} h={4} bg="#10b981" borderRadius="sm" />
            <Text fontSize="sm">Publicado</Text>
          </Box>
          <Box display="flex" alignItems="center" gap={2}>
            <Box w={4} h={4} bg="#fbbf24" borderRadius="sm" />
            <Text fontSize="sm">Programado</Text>
          </Box>
          <Box display="flex" alignItems="center" gap={2}>
            <Box w={4} h={4} bg="#ef4444" borderRadius="sm" />
            <Text fontSize="sm">No disponible en región</Text>
          </Box>
          <Box display="flex" alignItems="center" gap={2}>
            <Box w={4} h={4} bg="#7c2d12" borderRadius="sm" />
            <Text fontSize="sm">Bloqueado por admin</Text>
          </Box>
          <Box display="flex" alignItems="center" gap={2}>
            <Box w={4} h={4} bg="#6b7280" borderRadius="sm" />
            <Text fontSize="sm">Sin información</Text>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
