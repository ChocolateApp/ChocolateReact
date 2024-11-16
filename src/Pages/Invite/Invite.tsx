import React, { useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { usePost } from '@/Hooks/useFetch';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';

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
    const form = useForm<z.infer<typeof schema>>({
        resolver: zodResolver(schema),
    });
    const navigate = useNavigate();
    const { handleSubmit: handleSignUp, data: signUpData, pending: handleSubmitPending } = usePost();

    const onSubmit = async (values: z.infer<typeof schema>) => {

        try {
            await handleSignUp({
                url: '/auth/signup',
                body: {
                    ...values,
                    code: window.location.search.includes("code"),
                },
            });
            toast.success("Registration successful");
            navigate('/sign-in');
        } catch (error: any) {
            toast.error(error.message);
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
        <section className="h-screen w-screen flex items-center justify-center">
            <Card className='w-1/4 py-2 px-4 pb-8'>
                <CardHeader>
                    <CardTitle>Sign Up</CardTitle>
                </CardHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-6">
                        <FormField control={form.control} name="username" render={({ field }) => (
                            <FormItem>
                                <FormLabel htmlFor="username">Username</FormLabel>
                                <FormControl>
                                    <Input {...field} placeholder='Username' autoComplete='given-name' />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />
                        <FormField control={form.control} name="password" render={({ field }) => (
                            <FormItem>
                                <FormLabel htmlFor="password">Password</FormLabel>
                                <FormControl>
                                    <Input {...field} type="password" placeholder='Password' autoComplete='new-password' />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />
                        <FormField control={form.control} name="confirmPassword" render={({ field }) => (
                            <FormItem>
                                <FormLabel htmlFor="confirmPassword">Confirm Password</FormLabel>
                                <FormControl>
                                    <Input {...field} type="password" placeholder='Confirm Password' autoComplete='new-password' />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />
                        <Button variant="default">
                            {handleSubmitPending ? "Signing up..." : "Sign Up"}
                        </Button>
                    </form>
                </Form>
            </Card>
        </section>
    );
};

export default SignUp;
