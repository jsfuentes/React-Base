import conf from "conf";
import HeartImg from "src/img/heart.png";
import Logo from "./Logo";

export default function Footer() {
  return (
    <footer className="bg-gray-200 w-full h-auto py-12">
      <div className="container mx-auto">
        <div className="flex justify-center sm:justify-start">
          <Logo />
        </div>
        <p className="flex justify-center sm:justify-start items-center mt-8 mb-4 text-gray-700">
          <span>Made with</span>{" "}
          <img className="inline w-4 h-auto mx-1" src={HeartImg} alt="Heart" />
          <span>on Earth</span>
        </p>
        <p className="text-sm text-gray-500 text-center sm:text-left">
          © 2022 {conf.get("PROJECT_NAME")} Inc.
        </p>
      </div>
    </footer>
  );
}
