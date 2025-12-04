import { Skeleton, Stack } from "@chakra-ui/react";

export default function LoadBackgroundElement({size = "full"}: {size?: string}) {
  let height: string, width: string;

  if (size === "menu") {
    height = "3xl";
    width = "full";
  }else if (size == "users_menu" ) {
    height = "xl";
    width = "full";
  }
  else if (size == "users_profile" || size == "catalog_summary" || size == "catalog_detail_menu" || size == "userpanel") {
    height = "2xl";
    width = "full";
  }else if (size == "catalog_search" || size == "content_metrics") {
    height = "lg";
    width = "full";
  }
  else{
    height = "4xl";
    width = "full";
  }

  return (
    <Stack padding={10}>
      <Skeleton height={height} width={width} />
    </Stack>
  );
}
