import { db } from "@/db"
import { ProductFilterValidator } from "@/lib/validators/product-validator"
import { NextRequest } from "next/server"

class Filter {
    private filters:Map<string , string[]> = new Map()
    // 4 DIFFERENT METHODS
    hasFilters(){
        return this.filters.size > 0    
    }
    add(key:string, operator:string, value:string | number){
        const filter = this.filters.get(key) || []
        // color = white 
        filter.push(`${key} ${operator} ${typeof value === "number" ? value:`"${value}` }`)
        this.filters.set(key, filter)
    }
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