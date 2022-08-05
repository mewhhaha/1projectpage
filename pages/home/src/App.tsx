import clsx from "clsx";
import { useState } from "react";

function App() {
  const [count, setCount] = useState(0);

  return (
    <div className="relative h-screen w-screen">
      <article className="h-full bg-black">
        <div className="relative isolate bg-gradient-to-b from-gray-800 via-black to-black pt-20">
          <div className="color-black -z-1 absolute inset-0 bg-[url(./floating-cogs.svg)]" />
          <h1 className="z-1 pb-16 text-center font-sans text-7xl font-extrabold text-white sm:text-8xl md:text-9xl">
            1 Page
            <br />
            <span className="bg-gradient-to-r from-pink-300 via-pink-400 to-pink-200 bg-clip-text text-transparent">
              1 Project
            </span>
          </h1>
        </div>
        <div className="absolute top-2 right-2">
          <a href="https://github.com/mewhhaha/1projectpage">
            <div className="i-carbon:logo-github color-white h-10 w-10 shadow-xl" />
          </a>
        </div>

        <div className="flex w-full flex-col items-center">
          <Divider />

          <div className="w-full max-w-3xl px-16  font-extrabold text-gray-100">
            <h2 className="my-12 text-7xl">What are you doing?</h2>
            <p className="text-6xl">
              Every <Orange>page</Orange> will be its own little{" "}
              <Red>experiment</Red>. <br />
              Starting with <Green>this button.</Green>
            </p>

            <div className="mt-24 flex flex-col items-center rounded-md border-2 border-gray-600 py-10 px-4">
              <button
                type="button"
                className="inline-flex items-center rounded-md border border-transparent bg-green-600 px-6 py-3 text-base font-medium text-white shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 active:scale-95"
                onClick={() => setCount((p) => p + 1)}
              >
                <div
                  className="i-carbon:cafe -ml-1 mr-3 h-5 w-5"
                  aria-hidden="true"
                />
                Click me
              </button>
              <span className="flex flex-col items-center pt-2 text-3xl">
                <div
                  className={clsx(
                    "duration-800 transition-opacity",
                    count > 0 ? "opacity-100" : "opacity-0"
                  )}
                >
                  you {count}
                </div>
                <div
                  className={clsx(
                    "duration-600 transition-opacity",
                    count > 0 ? "opacity-100" : "opacity-0"
                  )}
                >
                  them {count}
                </div>
              </span>
            </div>
          </div>
        </div>
      </article>
    </div>
  );
}

type ColorProps = { children: React.ReactNode };

const Green = ({ children }: ColorProps) => {
  return <span className="color-green-500">{children}</span>;
};

const Red = ({ children }: ColorProps) => {
  return <span className="color-red-500">{children}</span>;
};

const Orange = ({ children }: ColorProps) => {
  return <span className="color-orange-500">{children}</span>;
};

const Divider = () => {
  return <span className="h-1 w-full bg-gray-900"></span>;
};

export default App;
