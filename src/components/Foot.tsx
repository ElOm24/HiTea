import { Footer } from "flowbite-react";
import { BsFacebook, BsGithub, BsInstagram } from "react-icons/bs";

function Foot() {
    return (
        <Footer container className="bg-[#523a28] rounded-none rounded-t">
            <div className="w-full">
                <div className="w-full flex items-center justify-between text-[#e4d4c8]">
                    <p className="text-[#e4d4c8] text-sm">© 2022 HiTea</p>
                    <div className="flex space-x-6 sm:justify-center">
                        <Footer.Icon href="https://www.facebook.com/elina.omurkulova.73" icon={BsFacebook} className="text-[#e4d4c8] hover:text-[#a47551]" />
                        <Footer.Icon href="https://www.instagram.com/eliomt_/" icon={BsInstagram} className="text-[#e4d4c8] hover:text-[#a47551]" />
                        <Footer.Icon href="https://github.com/ElOm24" icon={BsGithub} className="text-[#e4d4c8] hover:text-[#a47551]" />
                    </div>
                </div>
            </div>
        </Footer>
    );
}

export default Foot;