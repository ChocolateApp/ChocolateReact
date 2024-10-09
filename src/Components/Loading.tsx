import React from 'react';

interface LoadingProps extends React.HTMLAttributes<HTMLElement> { }

const Loading: React.FC<LoadingProps> = (props) => {
    return (
        <section {...props}>
            <div className='flex justify-center items-center h-full'>
                <img src="loader.gif" alt="Loading..." className="w-1/4" />
            </div>
        </section>
    );
};

export default Loading;