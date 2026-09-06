import { createServerClient } from '@supabase/ssr';
import { NextResponse,type NextRequest } from 'next/server';

const protectedPrefixes=['/app-v2','/decision-center','/crop-health','/farm-intelligence','/offers','/notifications','/settings','/orders','/buyer','/portals','/admin'];
const roleForPrefix=(pathname:string)=>pathname.startsWith('/admin')?'admin':pathname.startsWith('/buyer')?'buyer':pathname.startsWith('/portals')?'fpo':undefined;

export async function middleware(request:NextRequest){
 let response=NextResponse.next({request});
 const {pathname}=request.nextUrl;
 if(!protectedPrefixes.some(prefix=>pathname===prefix||pathname.startsWith(`${prefix}/`))) return response;
 const supabase=createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL!,process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY||process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,{cookies:{getAll(){return request.cookies.getAll()},setAll(cookies){cookies.forEach(({name,value,options})=>request.cookies.set(name,value));response=NextResponse.next({request});cookies.forEach(({name,value,options})=>response.cookies.set(name,value,options));}}});
 const {data:{user}}=await supabase.auth.getUser();
 if(!user){const url=request.nextUrl.clone();url.pathname='/signin';url.searchParams.set('next',pathname);return NextResponse.redirect(url)}
 const required=roleForPrefix(pathname);
 if(required){const {data:profile}=await supabase.from('profiles').select('farm_role').eq('id',user.id).maybeSingle();const role=(profile?.farm_role||'').toLowerCase();if(required==='admin'&&role!=='admin')return NextResponse.redirect(new URL('/unauthorized',request.url));if(required==='buyer'&&role!=='buyer')return NextResponse.redirect(new URL('/unauthorized',request.url));if(required==='fpo'&&!['fpo','farmer'].includes(role))return NextResponse.redirect(new URL('/unauthorized',request.url));}
 return response;
}

export const config={matcher:['/app-v2/:path*','/decision-center/:path*','/crop-health/:path*','/farm-intelligence/:path*','/offers/:path*','/notifications/:path*','/settings/:path*','/orders/:path*','/buyer/:path*','/portals/:path*','/admin/:path*']};
