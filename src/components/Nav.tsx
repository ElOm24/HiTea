import { Avatar, Dropdown, Navbar } from "flowbite-react";
import { useLocation } from "react-router-dom";
import { useUserAuth } from "../context/userAuthContext";
import { useNavigate } from "react-router-dom";

function Nav() {
    const { user, logOut } = useUserAuth();
    const curr_location = useLocation();
    const navigate = useNavigate();

    const isActive = (pathname: string) => curr_location.pathname === pathname;

    const handleSignOut = async () => {
        try {
            await logOut();
            navigate("/login");
        } catch (err) {
            console.error("Error signing out", err);
        }
    };

    return (
        <Navbar fluid className="bg-[#523a28] rounded-b">
            <Navbar.Brand>
                <img
                    src="../assets/logo.svg"
                    className="h-7 sm:h-10"
                    alt="HiTea logo"
                />
                <span className="font-semibold text-[#e4d4c8] mt-[5px]">
                    HiTea
                </span>

            </Navbar.Brand>

            <div className="flex md:order-2">
                <Dropdown
                    arrowIcon={false}
                    inline
                    label={
                        <Avatar
                            alt="User settings"
                            img="./user2.png"
                            rounded
                        />
                    }
                >
                    {user && (
                        <>
                            <Dropdown.Header>
                                <span className="block truncate text-sm font-medium">
                                    {user.email}
                                </span>
                                <span className="block text-sm">
                                    {user.displayName || "User"}
                                </span>
                            </Dropdown.Header>
                            <Dropdown.Item onClick={() => navigate("/user-page")}>
                                <span>
                                    Profile
                                </span>
                            </Dropdown.Item>
                            <Dropdown.Divider />
                        </>
                    )}
                    <Dropdown.Item
                        onClick={() => {
                            user ? handleSignOut() : navigate("/login");
                        }}
                    >
                        <span>
                            {user ? "Sign out" : "Login"}
                        </span>
                    </Dropdown.Item>
                </Dropdown>
                <Navbar.Toggle className="text-[#e4d4c8] focus:outline-none focus:ring-0 hover:bg-transparent hover:text-[#d0b49f] transition ml-1" />
            </div>

            <Navbar.Collapse className="my-navbar-links">
                <Navbar.Link href="/home"
                    className={`text-[#e4d4c8] hover:text-[#a47551] ${isActive("/home") ? "text-[#a47551] font-normal" : "font-normal"}`}
                >
                    Home
                </Navbar.Link>
                <Navbar.Link href="/about-us"
                    className={`text-[#e4d4c8] hover:text-[#a47551] ${isActive("/about-us") ? "text-[#a47551] font-normal" : "font-normal"}`}
                >
                    About Us
                </Navbar.Link>
                <Navbar.Link href="/menu"
                    className={`text-[#e4d4c8] hover:text-[#a47551] ${isActive("/menu") ? "text-[#a47551] font-normal" : "font-normal"}`}
                >
                    Menu
                </Navbar.Link>
                <Navbar.Link href="/contact"
                    className={`text-[#e4d4c8] hover:text-[#a47551] ${isActive("/contact") ? "text-[#a47551] font-normal" : "font-normal"}`}
                >
                    Contact
                </Navbar.Link>
            </Navbar.Collapse>
        </Navbar>
    );
}

export default Nav;