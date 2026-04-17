import { useNavigate } from "react-router-dom";
import LunarButton from "./LunarButton";

export default function LoginSignupCard() {
  const navigate = useNavigate();
  return (
    <div className=" bg-gray-700/10 rounded-2xl p-6 max-w-2xl text-center text-amber-100 animate-fadeIn md:text-xl lg:text-2xl font-serif">
      <h2> Get Started By signing up Free </h2>
      <LunarButton
        text={"Signup"}
        onclick={() => {
          navigate("/signup");
        }}
      />
      <h1 className="border-t-2 py-8 rounded-3xl">Already have an account?</h1>

      <LunarButton
        text={"Login"}
        onclick={() => {
          navigate("/login");
        }}
      />
    </div>
  );
}
