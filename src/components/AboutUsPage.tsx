import { Timeline } from "flowbite-react";

function AboutUsPage() {
    return (
        <main className="main-background">
            <header>Our Story</header>
            <div className="container flex flex-col flex-grow items-center mx-auto">
                <Timeline className="w-2/4 h-80 sm:h-74 xl:h-90 2xl:h-106 pt-4">
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
        </main >
    );
}

export default AboutUsPage;