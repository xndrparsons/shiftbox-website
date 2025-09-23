import { supabaseServer } from "@/lib/supabase/server"

export const revalidate = 30

export default async function Page() {
  const supabase = await supabaseServer()
  if (!supabase) {
    return <pre>Supabase env missing</pre>
  }

  const { data, error } = await supabase.rpc("list_public_sales", {
    p_make: "Rover",
    p_model: null,
    p_fuel: "PETROL",
    p_trans: null,
    p_min_price: null,
    p_max_price: null,
    p_limit: 10,
    p_offset: 0,
  })

  if (error) {
    return <pre style={{color: "tomato"}}>{JSON.stringify(error, null, 2)}</pre>
  }
  return <pre>{JSON.stringify(data, null, 2)}</pre>
}
