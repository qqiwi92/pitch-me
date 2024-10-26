import { createClient } from '@/components/utils/supabase/server'
import { redirect } from 'next/navigation'
import ClientPage from './clientPage'


export default async function PrivatePage() {
  const supabase = await createClient()

  const { data, error } = await supabase.auth.getUser()
  if (error || !data?.user) {
    redirect('/login')
  }

  return (
    <div>
      <ClientPage user={data.user}/>
    </div>
  )
}