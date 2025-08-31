import { CometCard } from "@/components/ui/comet-card";

export default function CometCardDemo() {
  return (
    <CometCard>
      <div
        className="my-10 flex w-80 cursor-pointer flex-col items-stretch rounded-[16px] border-0 bg-[#1F2121] p-2 saturate-0 md:my-20 md:p-4"
        aria-label="View demo card"
        style={{
          transformStyle: "preserve-3d",
          transform: "none",
          opacity: 1,
        }}
      >
        <div className="mx-2 flex-1">
          <div className="relative mt-2 aspect-[3/4] w-full">
            <div
              className="absolute inset-0 h-full w-full rounded-[16px] bg-gradient-to-br from-pink-400 to-pink-600 contrast-75 flex items-center justify-center text-white font-bold text-xl"
              style={{
                boxShadow: "rgba(0, 0, 0, 0.05) 0px 5px 6px 0px",
                opacity: 1,
              }}
            >
              Demo Card
            </div>
          </div>
        </div>
        <div className="mt-2 flex flex-shrink-0 items-center justify-between p-4 font-mono text-white">
          <div className="text-xs">Comet Card Demo</div>
          <div className="text-xs text-gray-300 opacity-50">#DEMO</div>
        </div>
      </div>
    </CometCard>
  );
}
