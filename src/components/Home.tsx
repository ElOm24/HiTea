import { Carousel } from "flowbite-react";

function Home() {
  return (
    <main className="main-background">
      <header>Welcome to HiTea!</header>
      <h1 className="pt-5 pb-4">Current special offers:</h1>
      <div className="w-[60%] mx-auto h-80">
        <Carousel>
          <img src="../assets/offer1.png" alt="offer1" />
          <img src="../assets/offer2.png" alt="offer2" />
          <img src="../assets/offer3.png" alt="offer3" />
          <img src="../assets/offer4.png" alt="offer4" />
          <img src="../assets/offer5.png" alt="offer5" />
        </Carousel>
      </div>
    </ main>
  );
}

export default Home;
