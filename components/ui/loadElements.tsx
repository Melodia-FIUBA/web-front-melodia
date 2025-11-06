import { Skeleton, Stack } from "@chakra-ui/react";

export default function LoadBackgroundElement({size = "full"}: {size?: string}) {
  let height: string, width: string;

  if (size === "menu") {
    height = "3xl";
    width = "full";
  }else{ //full
    height = "4xl";
    width = "full";
  }

  return (
    <Stack padding={10}>
      <Skeleton height={height} width={width} />
    </Stack>
  );
}
