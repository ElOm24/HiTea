import { Timeline } from "flowbite-react";

function AboutUsPage() {
    return (
        <main className="main-background">
            <header>Our Story</header>
            <div className="container flex flex-col flex-grow items-center mx-auto mb-2">
                <Timeline className="w-2/4 pt-4">
                    <Timeline.Item className="!text-[#362314]">
                        <Timeline.Point />
                        <Timeline.Content>
                            <Timeline.Time className="!text-[#362314]">March 2022</Timeline.Time>
                            <Timeline.Title className="!text-[#362314]" >We opened!</Timeline.Title>
                            <Timeline.Body className="!text-[#362314]">
                                HiTea officially opened its doors, bringing handcrafted bubble tea and warm smiles to the community. From day one, our mission has been simple: serve delicious drinks made with love, fresh ingredients, and a touch of creativity.
                            </Timeline.Body>
                        </Timeline.Content>
                    </Timeline.Item>

                    <Timeline.Item>
                        <Timeline.Point />
                        <Timeline.Content>
                            <Timeline.Time className="!text-[#362314]">April 2022</Timeline.Time>
                            <Timeline.Title className="!text-[#362314]">A story of improvements</Timeline.Title>
                            <Timeline.Body className="!text-[#362314]">
                                After listening to our amazing customers, we enhanced our recipes and revamped our cozy interior to create an even better experience. New seasonal flavors were introduced, and every detail—from toppings to tea leaves—was refined with care.
                            </Timeline.Body>
                        </Timeline.Content>
                    </Timeline.Item>

                    <Timeline.Item>
                        <Timeline.Point />
                        <Timeline.Content>
                            <Timeline.Time className="!text-[#362314]">April 2025</Timeline.Time>
                            <Timeline.Title className="!text-[#362314]">More branches, more tea!</Timeline.Title>
                            <Timeline.Body className="!text-[#362314]">
                                Thanks to your support, HiTea has grown! We've proudly opened new locations to spread the joy of bubble tea even further—now more people can sip, relax, and enjoy the HiTea experience in their own neighborhoods.
                            </Timeline.Body>
                        </Timeline.Content>
                    </Timeline.Item>
                </Timeline>
            </div>

            <div className="mt-6 pt-6 mb-4 ml-5 bg-[#e4d4c8] shadow-md rounded-lg w-3/6 px-6 py-8 text-[#362314]">
                <header className="text-center">Our Values</header>
                <p className="text-center">
                    At HiTea, our values shape every cup we serve and every smile we share. Since our opening in March 2022, we've been driven by a passion for quality, creativity, and community.
                </p>

                <div className="space-y-4">
                    <div>
                        <h3 className="text-lg font-semibold">✨ Freshness First</h3>
                        <p>
                            We believe that great drinks start with great ingredients. That’s why we use only the freshest tea leaves, fruits, and toppings—brewed, mixed, and served with care.
                        </p>
                    </div>

                    <div>
                        <h3 className="text-lg font-semibold">💛 Made with Love</h3>
                        <p>
                            From our first store to every new location, every drink is handcrafted with heart. We’re not just serving tea—we’re sharing a little joy in every cup.
                        </p>
                    </div>

                    <div>
                        <h3 className="text-lg font-semibold">🎨 Creative Sips</h3>
                        <p>
                            We love experimenting with bold flavors and fun combinations. Seasonal specials and unique recipes keep things exciting and let customers explore something new every time.
                        </p>
                    </div>

                    <div>
                        <h3 className="text-lg font-semibold">🫶 Listening & Growing</h3>
                        <p>
                            Your feedback matters. It’s helped us improve, grow, and create spaces that feel like home. From cozy interiors to our evolving menu, we’re always striving to be better for you.
                        </p>
                    </div>

                    <div>
                        <h3 className="text-lg font-semibold">🌍 Community Connection</h3>
                        <p>
                            HiTea is more than just tea—it's a place to connect. Whether you're catching up with friends, studying, or simply unwinding, we're here to offer comfort and a welcoming environment.
                        </p>
                    </div>
                </div>
            </div>
        </main >
    );
}

export default AboutUsPage;