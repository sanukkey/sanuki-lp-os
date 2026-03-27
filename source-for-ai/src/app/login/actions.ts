'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'

export async function login(formData: FormData) {
  const supabase = await createClient()

  const email = formData.get('email') as string
  const password = formData.get('password') as string

  // Note: For mock purposes or if SUPABASE_URL isn't set yet, 
  // you might just redirect. We try to use the actual client here.
  if (process.env.NEXT_PUBLIC_SUPABASE_URL) {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      redirect('/login?message=Invalid login credentials')
    }
  }

  revalidatePath('/', 'layout')
  redirect('/dashboard')
}

export async function signup(formData: FormData) {
  const supabase = await createClient()
  const email = formData.get('email') as string
  const password = formData.get('password') as string

  if (process.env.NEXT_PUBLIC_SUPABASE_URL) {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`,
      },
    })

    if (error) {
      redirect('/login?message=Could not sign up user')
    }
  }

  revalidatePath('/', 'layout')
  redirect('/dashboard?message=Check email to continue sign in process')
}
