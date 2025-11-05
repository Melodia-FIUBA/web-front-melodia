
import { Provider } from "@/components/ui/provider"
import { Toaster } from "@/components/ui/toaster"

export default function RootLayout(props: { children: React.ReactNode }) {
  const { children } = props
  return (
    <html suppressHydrationWarning>
      <body>
        <Provider forcedTheme="dark" defaultTheme="dark">
          {children}
          <Toaster /> {/* <-- mover dentro del Provider para tener contexto */}
        </Provider>
      </body>
    </html>
  )
}