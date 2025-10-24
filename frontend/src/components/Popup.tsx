// import { useSession } from "@/lib/auth";
// import "../index.css";
// import { SignInButton } from "./sign-in-button";
// import { Difficulty } from "../types";
// import { UpdateConfiguration } from "./update-configuration";
// import type { SessionUser } from "../types";

const Popup = () => {
  // const { data: session } = useSession() as unknown as SessionUser;
  // const isLoggedIn = session !== null;

  return (
    <div
      id="study-buddy-mcq-popup"
      className="pb-8 p-4 w-[300px]  flex bg-accent items-center justify-center flex-col gap-6 font-wotfard"
    >
      <div className="space-y-2">
        <h1 className="text-3xl font-bold font-cartograph text-center text-primary">
          Quiz *
        </h1>
        <p className="text-center">Never forget what you've learned!</p>
      </div>

      {/* <div>
        {isLoggedIn ? (
          <UpdateConfiguration
            initialNumberOfQuestions={session?.user?.numberOfQuestions}
            initialDifficulty={session?.user?.difficulty as Difficulty}
          />
        ) : (
          <SignInButton />
        )}
      </div> */}
    </div>
  );
};

export default Popup;
