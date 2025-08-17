import type { RoutableProps } from "preact-router";
import type { FunctionalComponent } from "preact";
import FaqCard from "../components/FaqCard";

const supportedTags: string[] = [
  "PvP",
  "Utility",
  "Theme",
  "Render",
  "Movement",
  "Building",
  "World",
  "Misc",
  "QoL",
  "Exploit",
  "Fun",
  "Automation",
];

function Tag({ tag }: { tag: string }) {
  return (
    <div class="px-2 text-center rounded bg-slate-950/50 border border-purple-300/20 min-w-2/12 block">
      {tag}
    </div>
  );
}

const About: FunctionalComponent<RoutableProps> = () => {
  return (
    <main class="flex flex-col gap-5 items-center px-5 flex-grow">
      <section class="w-3/5">
        <h2 class="font-medium text-4xl pb-2">About</h2>
        <article class="flex flex-col gap-2">
          <h3 class="text-xl">What Is It</h3>
          <article class="text-slate-400 flex flex-col gap-2">
            <p>
              Meteor Addon List is a collection of addons for the Meteor Client,
              automatically scraped from GitHub. It’s designed to make
              discovering, and downloading addons as seamless as possible.
            </p>
          </article>
          <h3 class="text-xl">Why This Site Exists</h3>
          <article class="text-slate-400 flex flex-col gap-2">
            <p>
              This project was heavily inspired by AntiCope. While it was a
              great resource, it lacked advanced filtering, search
              functionality, and regular updates. Meteor Addon List is built to
              fix those issues.
            </p>
          </article>
          <h3 class="text-xl">Key Features</h3>
          <ul class="pl-5 list-disc text-slate-400">
            <li>Search: Quickly find addons or authors by name.</li>
            <li>
              Filtering: Sort and filter by Minecraft version, GitHub stars,
              downloads, features, and more.
            </li>
            <li>
              Frequent Updates: The list is updated daily to keep up with new
              and changing addons.
            </li>
          </ul>
          <h3 class="text-xl">How Addons Are Scraped</h3>
          <article class="text-slate-400 flex flex-col gap-2">
            <p>
              All addons on Meteor Addon List are automatically gathered from
              GitHub using the{" "}
              <a
                href="https://github.com/cqb13/meteor-addon-scanner"
                target="_blank"
                class="text-purple-300 font-medium cursor-pointer hover:text-purple-400 transition-all ease-in-out duration-300"
              >
                Meteor Addon Scanner
              </a>
              . It searches for projects that use Meteor-specific files or code
              and also looks for forks of the official addon template.
            </p>
          </article>
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
              <p class="px-1 bg-slate-950/50 rounded inline font-medium outline outline-purple-300/20">
                meteor-addon-list.json
              </p>{" "}
              in the root directory of your addon, and add the fields you wish
              to overide.
            </p>
            <section className="ml-5 p-5 bg-slate-950 border border-purple-300/20 rounded">
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
            <article class="pl-5 flex flex-col gap-2">
              <h4 class="text-purple-300 text-lg">Supported Tags</h4>
              <div class="flex flex-wrap gap-2 items-center justify-center">
                {supportedTags.map((t) => (
                  <Tag tag={t} />
                ))}
              </div>
            </article>
          </article>
        </article>
      </section>
      <section class="w-3/5">
        <h2 class="font-medium text-4xl pb-2">FAQ</h2>
        <article class="flex flex-col gap-2">
          <FaqCard
            question="Is this site official?"
            answer="No. Meteor Addon List is an independent project and is not affiliated with, sponsored by, or officially endorsed by the Meteor Client team."
          />
          <FaqCard
            question="Are all addons safe to use?"
            answer="Verified addons go through a review process to ensure they’re functional and free of harmful features. Unverified addons are collected automatically and might not be safe."
          />
          <FaqCard
            question="Why is my addon not listed?"
            answer="Your repository might not be on GitHub, match the search criteria, or it may be private. Make sure it is on GitHub, is public, and includes the necessary files."
          />
          <FaqCard
            question="Why are my addons features missing?"
            answer="Features are detected by looking at the addons entrypoint file where all the modules are added. If you are adding modules outside of that file, or are using a custom function to add modules, they will not be detected."
          />
        </article>
      </section>
    </main>
  );
};

export default About;
