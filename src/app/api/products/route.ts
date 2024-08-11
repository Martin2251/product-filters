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
    addRaw(key:string, rawFilter:string){
        this.filters.set(key, [rawFilter])
    }

    get(){
        const parts: string[] =[]
        this.filters.forEach((filter) =>{
            const groupedValues = filter.join(` OR `)
            parts.push(`(${groupedValues})`)
        })
        return parts.join(` AND `)
    }
}

export const POST = async (req:NextRequest) =>{

    const body =  await req.json()

    const {color,price,size,sort} = ProductFilterValidator.parse(body.filter)

    const filter = new Filter()

    color.forEach((color) => filter.add("color", "=", color))
    size.forEach((size) => filter.add("size", "=", size))
    filter.addRaw("price", `price >= ${price[0]} AND price <= ${price[1]}`)

    // database expects format of color="white" OR color="beige" AND size="L"
    const products = await db.query({
        topK:12,
        vector:[0,0,0],
        includeMetadata:true,
        filter:filter.hasFilters() ? filter.get() : undefined
    })

    return new Response(JSON.stringify(products))
}