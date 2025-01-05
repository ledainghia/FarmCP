'use client';

import { Icon } from '@iconify/react/dist/iconify.js';
import { signOut } from 'next-auth/react';

export default function LogoutButton() {
    const handleSignOut = async () => {
        // Xóa token trong client-side
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');

        // Gọi API signOut
        await signOut({
            redirect: true,
            redirectTo: '/',
        });
    };

    return (
        <div>
            <button
                onClick={handleSignOut}
                className="w-full flex items-center gap-2"
            >
                <Icon icon="heroicons:power" className="w-4 h-4" />
                Log out
            </button>
        </div>
    );
}
