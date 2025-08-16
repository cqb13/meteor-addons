import type { FunctionalComponent } from "preact";
import type { RoutableProps } from "preact-router";

const About: FunctionalComponent<RoutableProps> = () => {
  return (
    <main class="flex flex-col gap-2 items-center px-5 flex-grow">
      <section class="w-3/5">
        <h2 class="font-medium text-4xl pb-2">About</h2>
        <article>
          <h3 class="text-xl">How Addons Are Scrapped</h3>
          <p></p>
        </article>
      </section>
      <section class="w-3/5">
        <h2 class="font-medium text-4xl pb-2">Developer Info</h2>
        <article>
          <h3 class="text-xl">How to Verify Your Addon</h3>
          <article class="text-slate-400 flex flex-col gap-2">
            <p>
              To verify your addon you must join the discord server and create a
              post in the{" "}
              <a
                href="https://discord.gg/K7JUgp9dSc"
                target="_blank"
                class="text-purple-300 font-medium cursor-pointer hover:text-purple-400 transition-all ease-in-out duration-300"
              >
                verification requests
              </a>{" "}
              channel.
            </p>
            <article class="pl-5 flex flex-col gap-2">
              <h4 class="text-purple-300 text-lg">
                What Your Post Must Include
              </h4>
              <ul class="pl-5 list-disc">
                <li>A Github repository link</li>
                <li>A short description of what your addon does</li>
              </ul>
              <h4 class="text-purple-300 text-lg">
                What Will Prevent Verification
              </h4>
              <ul class="pl-5 list-disc">
                <li>Harmful features (e.g. backdoors, coordinate leaks)</li>
                <li>Obfuscated/unreadable code</li>
                <li>Broken or non-functional addons</li>
              </ul>
              <h4 class="text-purple-300 text-lg">
                Addons That Will Not Be Verified
              </h4>
              <ul class="pl-5 list-disc">
                <li>Forks that do not meaningfully expand on the original</li>
                <li>
                  Forks of actively maintained addons (commits within 6 months)
                </li>
                <li>
                  Addons that take code from other addons without properly
                  crediting original authors
                </li>
              </ul>
            </article>
            <p class="italic">
              It may take some time to verify your addon. You will be notified
              when a decision is made.
            </p>
            <p class="itlaic">
              Please only submit addons that you have created.
            </p>
          </article>
          <h3 class="text-xl">Custom Data</h3>
          <article class="text-slate-400 flex flex-col gap-2">
            <p>
              To fix or customize the data scrapped from your addon, you can
              manually add your own values.
            </p>
            <p>
              To do that, create the file{" "}
              <p class="px-1 bg-slate-950/50 rounded inline font-medium">
                meteor-addon-list.json
              </p>{" "}
              in the root directory of your addon, and add the fields you wish
              to overide.
            </p>
            <section className="ml-5 p-5 bg-slate-950 border border-purple-300 rounded">
              <pre className="font-mono text-purple-200 whitespace-pre">
                {JSON.stringify(
                  {
                    description: "A short description of your addon.",
                    tags: ["PvP", "Utility", "Theme", "..."],
                    supported_versions: ["1.21.7", "1.21.8"],
                    icon: "https://meteoraddons.com/icon.png",
                    discord: "https://discord.gg/XU7Y9G46KD",
                    homepage: "https://www.meteoraddons.com",
                  },
                  null,
                  2,
                )}
              </pre>
            </section>
            <h4 class="text-purple-300 text-lg">Supported Tags</h4>
            <div></div>
          </article>
        </article>
      </section>
      <section>
        <h2>FAQ</h2>
        <article></article>
      </section>
    </main>
  );
};

export default About;
