import { Box, Text } from "@chakra-ui/react";
import WorldMap from "react-svg-worldmap";
import { AvailabilityDetails } from "@/lib/catalog/availabilityDetails";
import { countryNamesES } from "./utils";
import { getStatusLabel, getMapColor } from "@/lib/utils/effectiveStatus";

interface WorldAvailabilityMapProps {
  availability: AvailabilityDetails;
}

export function WorldAvailabilityMap({ availability }: WorldAvailabilityMapProps) {
  // Prepare data for the world map
  const mapData = availability.regions.map((region) => ({
    country: region.code.toLowerCase(),
    value: 1, // dummy value for display
  }));

  // Map status to colors for the world map - obtiene color para un código de país
  const getCountryMapColor = (countryCode: string) => {
    const region = availability.regions.find(
      (r) => r.code.toLowerCase() === countryCode.toLowerCase()
    );
    
    if (!region) return '#6b7280'; // gray for countries not in the list
    
    return getMapColor(region.status);
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
              fill: getCountryMapColor(context.countryCode),
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
            <Box w={4} h={4} bg={getMapColor('published')} borderRadius="sm" />
            <Text fontSize="sm">{getStatusLabel('published')}</Text>
          </Box>
          <Box display="flex" alignItems="center" gap={2}>
            <Box w={4} h={4} bg={getMapColor('scheduled')} borderRadius="sm" />
            <Text fontSize="sm">{getStatusLabel('scheduled')}</Text>
          </Box>
          <Box display="flex" alignItems="center" gap={2}>
            <Box w={4} h={4} bg={getMapColor('region_restricted')} borderRadius="sm" />
            <Text fontSize="sm">{getStatusLabel('region_restricted')}</Text>
          </Box>
          <Box display="flex" alignItems="center" gap={2}>
            <Box w={4} h={4} bg={getMapColor('blocked_by_admin')} borderRadius="sm" />
            <Text fontSize="sm">{getStatusLabel('blocked_by_admin')}</Text>
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
