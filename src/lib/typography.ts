export const typography = {
  heading: {
    h1: "text-3xl font-bold tracking-tight text-foreground",
    h2: "text-2xl font-bold tracking-tight text-foreground",
    h3: "text-lg font-semibold tracking-tight text-foreground",
  },
  body: {
    default: "text-base text-foreground",
    sm: "text-sm text-foreground",
    muted: "text-sm text-muted-foreground",
  },
  label: {
    default: "text-sm font-medium text-foreground",
    sm: "text-xs font-medium text-foreground",
  },
} as const

export type TextVariant = {
  [K in keyof typeof typography]: keyof (typeof typography)[K]
}[keyof typeof typography]

export type TypographyCategory = keyof typeof typography

export type TypographyPath = {
  [K in keyof typeof typography]: `${K}.${keyof (typeof typography)[K] & string}`
}[keyof typeof typography]