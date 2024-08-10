import { db } from "@/db"
import { ProductFilterValidator } from "@/lib/validators/product-validator"
import { NextRequest } from "next/server"

class Filter {
    private filters:Map<string , string[]> = new Map()
}

export const POST = async (req:NextRequest) =>{

    const body =  await req.json()

    const {color,price,size,sort} = ProductFilterValidator.parse(body.filter)

    // database expects format of color="white" OR color="beige" AND size="L"
    const products = await db.query({
        topK:12,
        vector:[0,0,0],
        includeMetadata:true,
    })

    return new Response(JSON.stringify(products))
}