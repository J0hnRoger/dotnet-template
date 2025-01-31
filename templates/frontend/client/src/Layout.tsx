import React from 'react';
import { Link } from 'react-router-dom';
import { cn } from '@common/utils';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {

    const handleLogout = () => {
        console.log("logout");
    }

    return (
        <>
            <header className={cn("text-xl bg-primary text-brown-100 border-b-brown-100 border-solid border-b-2")}>
                <div className={""} >
                    /* HEADER */
                </div>
                <nav>
                    <ul className={""}>
                        <li><Link to="/">Home</Link></li>
                        <li><Link to="/map">Details</Link></li>
                    </ul>
                </nav>
                <div className={""}>
                    <a href="/" onClick={handleLogout}>Logout</a>
                </div>
            </header>
            <main className={""}>
                {children}
            </main >
            <footer className='absolute right-0 bottom-10 pr-2 overflow-hidden'>
                /* FOOTER */
            </footer>
        </>
    );
};

export default Layout;
