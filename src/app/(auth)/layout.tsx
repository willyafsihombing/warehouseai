import { Warehouse } from "lucide-react"

interface AuthLayoutProps {
  children: React.ReactNode
}

// Server Component — murni layout statis, tidak ada interaktivitas.
export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="flex min-h-screen">
      {/* Sisi kiri — branding, disembunyikan di mobile */}
      <div className="relative hidden w-1/2 overflow-hidden bg-gradient-to-br from-blue-600 to-blue-800 md:flex">
        {/* Grid pattern dekoratif, subtle */}
        <div
          className="absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage:
              "linear-gradient(to right, white 1px, transparent 1px), linear-gradient(to bottom, white 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />

        {/* Glow lembut di pojok, biar tidak flat */}
        <div className="absolute -right-24 -top-24 h-96 w-96 rounded-full bg-blue-400/20 blur-3xl" />
        <div className="absolute -bottom-24 -left-24 h-96 w-96 rounded-full bg-blue-900/30 blur-3xl" />

        {/* Konten utama, center */}
        <div className="relative z-10 flex w-full flex-col items-center justify-center px-12 text-center">
          <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-white/10 backdrop-blur-sm">
            <Warehouse className="h-9 w-9 text-white" />
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-white">
            Warehouse AI
          </h1>
          <p className="mt-3 max-w-sm text-base text-blue-100">
            Kelola gudang lebih cerdas dengan AI
          </p>
        </div>
      </div>

      {/* Sisi kanan — form, selalu tampil */}
      <div className="flex w-full items-center justify-center bg-white px-6 py-12 md:w-1/2">
        <div className="w-full max-w-sm">{children}</div>
      </div>
    </div>
  )
}