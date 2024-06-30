import { HeartIcon } from "@heroicons/react/24/outline";
import { SwitchTheme } from "~~/components/SwitchTheme";

/**
 * Site footer
 */
export const Footer = () => {
  return (
    <div className="mb-11 min-h-0 px-1 py-5 lg:mb-0">
      <div>
        <div className="pointer-events-none fixed bottom-0 left-0 z-10 flex w-full items-center justify-between p-4">
          <div></div> {/* Empty div for spacing, @todo remove */}
          <SwitchTheme className="pointer-events-auto" />
        </div>
      </div>
      <div className="w-full">
        <ul className="menu menu-horizontal w-full">
          <div className="flex w-full items-center justify-center gap-2 text-sm">
            <div className="text-center">
              <a
                href="https://github.com/BuidlGuidl/address-vision-port"
                target="_blank"
                rel="noreferrer"
                className="underline underline-offset-2"
              >
                Fork me
              </a>
            </div>
            <span>·</span>
            <div>
              <p className="m-0 text-center">
                Built with <HeartIcon className="inline-block h-4 w-4" /> at 🏰{" "}
                <a
                  href="https://buidlguidl.com/"
                  target="_blank"
                  rel="noreferrer"
                  className="underline underline-offset-2"
                >
                  BuidlGuidl
                </a>
              </p>
            </div>
          </div>
        </ul>
      </div>
    </div>
  );
};
