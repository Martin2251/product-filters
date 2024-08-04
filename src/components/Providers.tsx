"use client"

import { QueryClientProvider,QueryClient } from "@tanstack/react-query"
import { PropsWithChildren } from "react"

// create client to make it cached

const client  =  new QueryClient()

const Providers = ({children}:PropsWithChildren<{}>) => {
    // providers provide context to it all
    return <QueryClientProvider client={client}>{children}</QueryClientProvider>

}
export default Providers