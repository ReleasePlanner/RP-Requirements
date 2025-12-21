'use server';

import { cookies } from 'next/headers';
import { AuthService } from './service';
import { redirect } from 'next/navigation';

export async function loginAction(formData: FormData) {
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    // 1. Call Real Service
    const { accessToken, user } = await AuthService.login(email, password);

    // 2. Set Cookie directly (Server Action)
    const cookieStore = await cookies();

    cookieStore.set('session', accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 60 * 60 * 24 * 7, // 1 week
        path: '/',
    });

    cookieStore.set('user_role', user.role, {
        httpOnly: false, // Readable by client for UI toggles
        secure: process.env.NODE_ENV === 'production',
        path: '/',
    });

    // 3. Redirect
    redirect('/portal/requirements');
}
