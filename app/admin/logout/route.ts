import { NextResponse } from 'next/server'
import { SESSION_COOKIE } from '@/lib/admin-session'
export async function GET(req:Request){const res=NextResponse.redirect(new URL('/admin/login',req.url));res.cookies.set(SESSION_COOKIE,'',{path:'/',expires:new Date(0)});res.cookies.set('hq_tenant_id','',{path:'/',expires:new Date(0)});return res}
