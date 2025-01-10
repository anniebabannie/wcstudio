import { PrismaClient } from '@prisma/client';
import { redirect, render } from 'vike/abort';
import { PageContextServer } from 'vike/types';

export async function guard(pageContext: PageContextServer) {
  console.log(pageContext)
  if (!pageContext.user) {
    throw redirect('/')
  }
}