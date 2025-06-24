import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    // Check if the request is for the chat route
    if (request.nextUrl.pathname.startsWith('/chat')) {
        // Look for the token in the cookies
        const token = request.cookies.get('token')?.value;

        // If no token is found, redirect to login
        if (!token) {
            // Redirect to login page
            return NextResponse.redirect(new URL('/', request.url));
        }
    }

    // Continue with the request if token exists or if it's not the chat route
    return NextResponse.next();
}

// Configure which routes the middleware should run on
export const config = {
    matcher: ['/chat/:path*'],
};