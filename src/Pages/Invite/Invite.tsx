import React, { useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { usePost } from '@/hooks/useFetch';

// Define the Zod schema for validation
const schema = z.object({
    username: z.string().min(4, "Username must be at least 4 characters long").max(20, "Username must be at most 20 characters long"),
    password: z.string()
        .min(8, "Password must be at least 8 characters long")
        .max(64, "Password must be at most 64 characters long")
        .refine((data) => /[A-Z]/.test(data), { message: "Password must contain at least one uppercase letter" })
        .refine((data) => /[a-z]/.test(data), { message: "Password must contain at least one lowercase letter" })
        .refine((data) => /[0-9]/.test(data), { message: "Password must contain at least one number" })
        .refine((data) => /[!@#$%^&*()_+[\]{};':"\\|,.<>/?`~\\-]/.test(data), { message: "Password must contain at least one special character" }),
    confirmPassword: z.string(),
    type: z.enum(["admin", "user"]),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ['confirmPassword'],
});

const SignUp: React.FC = () => {
    const { handleSubmit, register, formState: { errors }, getValues } = useForm<z.infer<typeof schema>>({
        resolver: zodResolver(schema),
    });
    const navigate = useNavigate();
    const { handleSubmit: handleSignUp, data: signUpData, pending: handleSubmitPending } = usePost();

    const onSubmit = async (values: z.infer<typeof schema>) => {
        //if there's ?code in the url, set the type to user else admin
        if (window.location.search.includes("code")) {
            values.type = "user";
        } else {
            values.type = "admin";
        }

        try {
            await handleSignUp({
                url: '/auth/signup',
                body: values,
            });
            toast.success("Registration successful");
            navigate('/sign-in');
        } catch (error: any) {
            toast.error("Error", { description: error.message });
        }
    };

    useEffect(() => {
        if (!signUpData) return;
        if (signUpData.code === 200) {
            toast.success("Sign up successful");
        } else {
            toast.error("Sign up failed");
        }
    }, [signUpData]);

    return (
        <section className="w-full max-w-md mx-auto mt-8">
            <h2 className="text-2xl font-bold mb-4">Sign Up</h2>
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
                <div>
                    <label htmlFor="username" className="block mb-1">Username</label>
                    <input
                        {...register("username")}
                        id="username"
                        type="text"
                        className="w-full p-2 border border-gray-300 rounded"
                    />
                    {errors.username && <p className="text-red-500 text-sm">{errors.username.message}</p>}
                </div>
                <div>
                    <label htmlFor="password" className="block mb-1">Password</label>
                    <input
                        {...register("password")}
                        id="password"
                        type="password"
                        className="w-full p-2 border border-gray-300 rounded"
                    />
                    {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
                </div>
                <div>
                    <label htmlFor="confirmPassword" className="block mb-1">Confirm Password</label>
                    <input
                        {...register("confirmPassword")}
                        id="confirmPassword"
                        type="password"
                        className="w-full p-2 border border-gray-300 rounded"
                    />
                    {errors.confirmPassword && <p className="text-red-500 text-sm">{errors.confirmPassword.message}</p>}
                </div>
                <button type="submit" className="w-full p-2 bg-blue-500 text-white rounded" disabled={handleSubmitPending}>
                    {handleSubmitPending ? "Signing Up..." : "Sign Up"}
                </button>
                <div className="mt-4 text-center">
                    <Link to="/sign-in" className="text-blue-500 underline">Already have an account? Sign In</Link>
                </div>
            </form>
        </section>
    );
};

export default SignUp;
