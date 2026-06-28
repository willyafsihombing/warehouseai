import { z } from 'zod'

export const productSchema = z.object({
  name: z
    .string()
    .trim()
    .superRefine((val, ctx) => {
      if (val.length === 0) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'Nama produk wajib diisi' })
      } else if (val.length < 2) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'Nama produk minimal 2 karakter' })
      } else if (val.length > 100) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'Nama produk maksimal 100 karakter' })
      }
    }),

  sku: z
    .string()
    .trim()
    .superRefine((val, ctx) => {
      if (val.length === 0) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'SKU wajib diisi' })
      } else if (val.length < 2) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'SKU minimal 2 karakter' })
      } else if (val.length > 50) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'SKU maksimal 50 karakter' })
      }
    })
    .transform((val) => val.toUpperCase()),

  category: z.string().optional(),

  unit: z.string().trim().optional().default('pcs'),

  description: z
    .string()
    .max(500, 'Deskripsi maksimal 500 karakter')
    .optional(),
})

export type ProductFormData = z.infer<typeof productSchema>