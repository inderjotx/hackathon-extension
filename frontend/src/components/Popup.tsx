import { useSession } from "@/lib/auth";
import "../index.css";
import { SignInButton } from "./sign-in-button";
const Popup = () => {
  const { data: session } = useSession();
  const isLoggedIn = session !== null;

  return (
    <div className="py-8 p-4 flex bg-accent items-center justify-center flex-col gap-6 font-wotfard">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold font-cartograph text-center text-primary">
          Quiz *
        </h1>
        <p className="text-center">Never forget what you've learned!</p>
      </div>

      <div>{isLoggedIn ? "Logged In" : <SignInButton />}</div>
    </div>
  );
};

export default Popup;
