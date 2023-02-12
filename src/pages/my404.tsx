import Footer from "src/components/Footer";
import Navbar from "src/components/Navbar";
import Robot from "src/img/404.svg";

const foOhFos = [
  "Not all who wander are lost, but you appear to be lost.",
  "Oh no, this door goes to nowhere!",
  "Hi. I think you're lost. There's nothing here, except me.",
  "You've reached the end of the world! Go back, go back.",
];

export default function my404() {
  return (
    <div className="w-screen h-screen flex flex-col">
      <Navbar />

      <div className="text-xs md:text-base flex-1 w-full m-auto flex flex-row justify-center items-center py-2">
        <div className="w-1/3" style={{ maxWidth: "15rem" }}>
          <h1 className="text-5xl md:text-6xl">404</h1>
          <p>{foOhFos[Math.floor(Math.random() * foOhFos.length)]}</p>
        </div>
        <img
          src={Robot}
          className="ml-4 w-1/3"
          style={{ maxWidth: "15rem" }}
          referrerPolicy="no-referrer"
        />
      </div>

      <Footer />
    </div>
  );
}
