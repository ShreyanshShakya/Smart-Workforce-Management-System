import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

const DashboardLayout = () => {
    const location = useLocation();
    
    const getPageTitle = () => {
        switch (location.pathname) {
            case '/dashboard': return 'Dashboard Overview';
            case '/tasks': return 'All Tasks Management';
            case '/my-tasks': return 'My Assigned Tasks';
            case '/users': return 'Team Directory';
            default: return 'Workforce Management';
        }
    };

    return (
        <div className="h-screen w-screen bg-slate-950 text-slate-300 overflow-hidden flex font-sans antialiased selection:bg-indigo-500/30 selection:text-indigo-200">
            {/* Sidebar (Fixed on left) */}
            <Sidebar />

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
                
                {/* Background decorative elements */}
                <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none -z-10">
                    <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-indigo-900/20 blur-[120px]"></div>
                    <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-cyan-900/10 blur-[120px]"></div>
                </div>

                {/* Top Navbar */}
                <Navbar title={getPageTitle()} />

                {/* Scrollable Page Content */}
                <main className="flex-1 overflow-y-auto p-6 md:p-8 scroll-smooth">
                    <div className="max-w-7xl mx-auto">
                        <Outlet />
                    </div>
                </main>
            </div>
        </div>
    );
};

export default DashboardLayout;
