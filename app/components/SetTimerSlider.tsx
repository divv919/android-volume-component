"use client";
import { animate } from "motion";
import {
  AnimatePresence,
  motion,
  useMotionTemplate,
  useMotionValue,
  useMotionValueEvent,
  useSpring,
  useTransform,
} from "motion/react";
import { useEffect, useRef, useState } from "react";
import { cn } from "../lib/util";
export default function SetTimerSlider({
  isMute,
  setIsMute,
}: {
  isMute: boolean;
  setIsMute: (val: boolean) => void;
}) {
  const [isClicked, setIsClicked] = useState(false);
  const progress = useMotionValue(0);
  const snapPoints = [0, 25, 50, 75, 100];
  const [progressNum, setProgressNum] = useState(0);
  const [toolTipPoint, setToolTipPoint] = useState(0);
  const [toolTip, setToolTip] = useState<
    "30 minutes" | null | "1 hour" | "2 hours" | "8 hours"
  >(null);
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const x = useTransform(progress, (v) => `-${v}%`);

  const reset = () => {
    progress.set(100);
  };

  useEffect(() => {
    reset();
  }, [isMute]);

  useEffect(() => {
    if (!isMute && !isClicked && progressNum > 0) {
      setIsMute(true);
    }
  }, [isClicked]);

  useMotionValueEvent(progress, "change", (val) => {
    setProgressNum(val);
    const afterSnap = snapPoints.reduce((prev, curr) => {
      return Math.abs(curr - val) < Math.abs(prev - val) ? curr : prev;
    });
    setToolTipPoint(afterSnap);
    const tooltipMap: Record<
      number,
      "30 minutes" | "1 hour" | "2 hours" | "8 hours" | null
    > = {
      0: "8 hours",
      25: "2 hours",
      50: "1 hour",
      75: "30 minutes",
      100: null,
    };
    setToolTip(tooltipMap[afterSnap] ?? null);
  });

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const handleMouseMove = (e: MouseEvent) => {
      if (isClicked) {
        const element = document.getElementById("scrollbar");
        const left = element?.getBoundingClientRect().left ?? 0.1;
        const width = element?.getBoundingClientRect().width ?? 0.1;
        const currentProgress = 100 - ((e.clientX - left) / width) * 100;
        const clamped = Math.min(100, Math.max(0, currentProgress));
        progress.set(clamped);
      }
    };
    const handleMouseUp = () => {
      if (isClicked) {
        setIsClicked(false);
        const value = progress.get();
        const afterSnap = snapPoints.reduce((prev, curr) => {
          return Math.abs(curr - value) < Math.abs(prev - value) ? curr : prev;
        });

        // progress.set(afterSnap);
        animate(progress, afterSnap, {
          type: "spring",
          stiffness: 300,
          damping: 26,
        });
      }
    };
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isClicked]);

  const toolTipX = useMotionValue(0);

  useEffect(() => {
    if (toolTipPoint < 100) {
      toolTipX.set(100 - toolTipPoint); // percentage
    }
  }, [toolTipPoint]);

  const formatTime = (secs: number) => {
    const h = Math.floor(secs / 3600);
    const m = Math.floor((secs % 3600) / 60);
    const s = secs % 60;

    const formatted = `${h}:${String(m).padStart(2, "0")}:${String(s).padStart(
      2,
      "0"
    )}`;
    const digits = formatted.split("");
    return digits;
  };
  useEffect(() => {
    if (isClicked) return; // Do NOT start timer while dragging
    if (toolTipPoint === 100) return; // No timer for last point

    // Clear old timer
    if (intervalRef.current) clearInterval(intervalRef.current);

    // Set new time from map
    const newTime = timeMap[toolTipPoint];
    setTimeLeft(newTime);

    // Start ticking
    intervalRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(intervalRef.current!);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [toolTipPoint, isClicked]);
  const timeMap: Record<number, number> = {
    0: 8 * 60 * 60, // 8 hours
    25: 2 * 60 * 60, // 2 hours
    50: 1 * 60 * 60, // 1 hour
    75: 30 * 60, // 30 minutes
    100: 0,
  };

  const smoothX = useSpring(toolTipX, {
    stiffness: 300,
    damping: 26,
  });
  const stringVal = useMotionTemplate`${smoothX}%`;
  useEffect(() => {
    console.log({ toolTipPoint });
  }, [toolTipPoint]);
  return (
    <div className={cn("bg-transparent relative w-full h-full")}>
      <AnimatePresence>
        {isClicked && toolTipPoint < 100 && (
          <motion.div
            style={{ left: stringVal }}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 6 }}
            className="absolute translate-x-[-50%] -top-3 -translate-y-full mt-2   flex  flex-col   items-center  z-20"
          >
            <div className="text-nowrap bg-neutral-700 backdrop-blur-xl  text-neutral-100  text-[8px]  font-light  tracking-tight  px-2  py-1  rounded-md  shadow-md ">
              {toolTip}
            </div>

            {/* Small triangle */}
            <div className=" w-0  h-0  border-l-4  border-r-4  border-t-8  border-l-transparent  border-r-transparent   border-t-neutral-700" />
          </motion.div>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {!isClicked && toolTipPoint < 100 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              width: `${100 - toolTipPoint > 25 ? 100 - toolTipPoint : 75}%`,
            }}
            className={cn(
              "absolute h-full    flex justify-center tracking-tight font-medium text-sm items-center   pointer-events-none z-10 text-neutral-600/80",

              100 - toolTipPoint <= 25 && " right-1 text-neutral-50 "
            )}
          >
            <div className="select-none flex gap-0 text-[10px]   font-semibold font-sans">
              {formatTime(timeLeft).map((d, i) =>
                d === ":" ? (
                  <div key={i} className="w-[0.5em] flex justify-center">
                    :
                  </div>
                ) : (
                  <DigitScroll value={d} key={i} />
                )
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <motion.div
        id="scrollbar"
        onMouseDown={(e) => {
          e.preventDefault();
          setIsClicked(true);
          console.log("clicked");
        }}
        className="bg-neutral-400/19 backdrop-blur-3xl w-full h-full overflow-hidden rounded-2xl relative "
      >
        <AnimatePresence>
          {progressNum < 100 ? (
            isClicked && (
              <motion.div
                key="snaps"
                initial={{
                  opacity: 0,
                  filter: "blur(2px)",
                }}
                exit={{
                  opacity: 0,
                  filter: "blur(2px)",
                }}
                animate={{
                  opacity: 1,
                  filter: "blur(0px)",
                }}
                className="absolute w-full h-full flex items-center justify-center gap-[24%] "
              >
                <div className="h-2 w-[2px] bg-neutral-300/40 rounded-full"></div>
                <div className="h-2 w-[2px] bg-neutral-300/40 rounded-full"></div>
                <div className="h-2 w-[1.5px] bg-neutral-300/40 rounded-full"></div>
              </motion.div>
            )
          ) : (
            <motion.div
              key="text-for-slide"
              initial={{
                opacity: 0,
                filter: "blur(2px)",
              }}
              exit={{
                opacity: 0,
                filter: "blur(2px)",
              }}
              animate={{
                opacity: 1,
                filter: "blur(0px)",
              }}
              className="absolute z-10 w-full h-full justify-center  tracking-tight text-neutral-50 font-medium items-center flex "
            >
              <div className=" text-[10px] select-none">Slide to set timer</div>
            </motion.div>
          )}
        </AnimatePresence>
        <motion.div
          className="absolute w-full h-full bg-neutral-50"
          style={{
            x,
          }}
        ></motion.div>
      </motion.div>
    </div>
  );
}
const DigitScroll = ({ value }: { value: string }) => {
  const [prev, setPrev] = useState(value);

  useEffect(() => {
    if (value !== prev) {
      setPrev(value);
    }
  }, [value]);

  return (
    <div className="relative overflow-hidden h-[1.2em]  w-[0.6em] flex justify-center">
      <AnimatePresence initial={false}>
        <motion.div
          key={value}
          initial={{ y: value > prev ? 20 : -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: value > prev ? -20 : 20, opacity: 0 }}
          transition={{ duration: 0.22, ease: "easeOut" }}
          className="absolute "
        >
          {value}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};
