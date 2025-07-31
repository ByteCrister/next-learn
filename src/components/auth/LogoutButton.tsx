'use client';

import { signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';

const LogoutButton = () => {
    const router = useRouter();

    const HandleLogOut = async () => {
        try {
            const res = await signOut({
                redirect: false,
                callbackUrl: "/next-learn-user-auth", 
            });

            if (res?.url) {
                toast.success("Successfully logged out!");
                router.push(res.url); 
            } else {
                toast.error("Unexpected logout response.");
            }
        } catch (error) {
            console.error("Logout error:", error);
            toast.error("Something went wrong during logout.");
        }
    };

    return (
        <button
            onClick={HandleLogOut}
            className="btn-logout"
        >
            Log Out
        </button>
    );
};

export default LogoutButton;
