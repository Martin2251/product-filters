import {z} from "zod"

export const AVAILABLE_SIZES=["S", "M", "L"] as const

export const ProductFilterValidator = z.object({
    size:z.array(z.enum(AVAILABLE_SIZES))

})