import Button from '@/Components/Button';
import React from 'react';

const NotFoundPage: React.FC = () => {
    return (
        <section className="flex justify-center items-center w-screen h-screen fixed top-0">
            <div className="text-center flex flex-col items-center gap-2">
                <h1 className='font-bold text-4xl'>404</h1>
                <h1 className='font-bold text-2xl'>Page Not Found</h1>
                <p>Sorry, the page you are looking for does not exist.</p>
                <p>If you were redirected here, the page is not implemented yet.</p>
                <Button state='primary' to='/' className='mt-4 w-fit'>Go Home</Button>
            </div>
        </section>
    );
};

export default NotFoundPage;