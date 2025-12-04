import { lazy } from "react";


//Testing component that simulates a slow loading component
export const FakeSlow = lazy(() =>
  new Promise<any>((resolve) =>
    setTimeout(
      () => resolve({ default: () => <div style={{padding:20}}></div> }),
      3000 // <- demora 3 segundos para forzar el fallback
    )
  )
);
