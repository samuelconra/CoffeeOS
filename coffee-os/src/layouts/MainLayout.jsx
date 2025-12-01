import { Outlet } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';

function MainLayout () {
    return (
        <main>
            <Navbar />
            <section>
                <Outlet />
            </section>
        </main>
    )
}

export default MainLayout;