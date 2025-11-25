"use client";
import {
  AlarmClock,
  AlarmClockOff,
  Bell,
  BellOff,
  BellRing,
  Ellipsis,
  Moon,
  Volume1,
  Volume2,
  VolumeOff,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import { cn } from "../lib/util";
import SetTimerSlider from "./SetTimerSlider";

export default function TwentyFourOne() {
  const [volumeProgress, setVolumeProgress] = useState(50);
  const [bellProgress, setBellProgress] = useState(40);
  const [alarmProgress, setAlarmProgress] = useState(65);
  const [isDND, setIsDND] = useState(true);
  const [isMute, setIsMute] = useState(true);
  const [activeBar, setActiveBar] = useState<"Vol" | "Alarm" | "Bell" | null>(
    null
  );
  const [sectionState, setSectionState] = useState<"Hidden" | "Open" | "Full">(
    "Hidden"
  );
  const [throttleWorking, setThrottleWorking] = useState(false);

  function handleBarClick(
    e: React.MouseEvent<HTMLDivElement>,
    setter: (val: number) => void
  ) {
    e.preventDefault();
    const rect = e.currentTarget.getBoundingClientRect();
    const clickY = e.clientY - rect.top;
    const percentage = 100 - Math.round((clickY / rect.height) * 100);
    setter(Math.min(100, Math.max(0, percentage)));
  }

  useEffect(() => {
    function handleMove(e: PointerEvent) {
      if (!activeBar) return;

      // Prevent default to stop scrolling/zooming on mobile
      e.preventDefault();

      const bar = document.getElementById(activeBar);
      if (!bar) return;

      const rect = bar.getBoundingClientRect();
      const clickY = e.clientY - rect.top;
      const percentage = 100 - Math.round((clickY / rect.height) * 100);
      const clamped = Math.min(100, Math.max(0, percentage));

      if (activeBar === "Vol") setVolumeProgress(clamped);
      if (activeBar === "Bell") {
        if (isMute) {
          setIsMute(false);
        }
        setBellProgress(clamped);
      }
      if (activeBar === "Alarm") setAlarmProgress(clamped);
    }

    function stopDragging() {
      setActiveBar(null);
    }

    function handlePointerUp(e: PointerEvent) {
      e.preventDefault();
      stopDragging();
    }

    function handlePointerCancel(e: PointerEvent) {
      e.preventDefault();
      stopDragging();
    }

    if (activeBar) {
      // Prevent default touch behaviors
      window.addEventListener("pointermove", handleMove, { passive: false });
      window.addEventListener("pointerup", handlePointerUp, { passive: false });
      window.addEventListener("pointercancel", handlePointerCancel, {
        passive: false,
      });
      window.addEventListener("mouseup", stopDragging);
    }

    return () => {
      window.removeEventListener("pointermove", handleMove);
      window.removeEventListener("pointerup", handlePointerUp);
      window.removeEventListener("pointercancel", handlePointerCancel);
      window.removeEventListener("mouseup", stopDragging);
    };
  }, [activeBar]);

  const buttonVariants = {
    hidden: {
      opacity: 0,
      scale: 0,
    },
    visible: {
      opacity: 1,
      scale: 1,
      filter: "blur(0px)",
    },
    exit: {
      opacity: 0,
      scale: 0,
      width: 0,
      transition: {
        duration: 0.25,
      },
    },
  };

  useEffect(() => {
    if (bellProgress === 0) {
      setIsMute(true);
    } else {
      setIsMute(false);
    }
  }, [bellProgress]);

  return (
    <motion.div className="bg-[url('/androidWallpaper/pink-floyd.jpeg')] overflow-hidden  bg-cover bg-center bg-no-repeat h-160 w-72 rounded-2xl relative">
      <AnimatePresence>
        {sectionState !== "Hidden" && sectionState === "Full" && (
          <motion.div
            transition={{
              type: "spring",
              damping: 28,
              stiffness: 300,
              mass: 1.1,
            }}
            exit={{
              x: 300,
              y: -1,
              opacity: 0,
              filter: "blur(2px)",
              transition: {
                type: "spring",
                damping: 20,
                stiffness: 100,
                mass: 1,
              },
            }}
            animate={{
              x: 0,
              y: 0,
              opacity: 1,
            }}
            layoutId="container-layout"
            className="flex flex-col gap-[10px] w-fit bg-neutral-600/40 backdrop-blur-sm rounded-[inherit] p-[10px] absolute top-30 right-3"
          >
            <div className=" grid grid-cols-3 gap-[10px] h-30 ">
              <motion.div
                layoutId="bar-layout"
                onClick={(e) => handleBarClick(e, setVolumeProgress)}
                onMouseDown={() => setActiveBar("Vol")}
                onPointerDown={(e) => {
                  e.preventDefault();
                  setActiveBar("Vol");
                }}
                // onTouchStart={() => setActiveBar("Vol")}
                id="Vol"
                className="rounded-2xl w-12 relative bg-neutral-100/10 backdrop-blur-sm overflow-hidden touch-none"
              >
                <AnimatePresence>
                  {volumeProgress > 0 && volumeProgress < 40 ? (
                    <motion.div
                      key={"vol-1"}
                      variants={buttonVariants}
                      transition={{
                        type: "spring",
                        duration: 0.4,
                      }}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      className={cn(
                        "absolute bottom-4 left-1/2 -translate-x-1/2 z-10 transition-colors duration-200",
                        volumeProgress < 20
                          ? "text-neutral-200"
                          : "text-neutral-400"
                      )}
                    >
                      <Volume1 size={17} />
                    </motion.div>
                  ) : volumeProgress >= 40 ? (
                    <motion.div
                      key={"vol-2"}
                      variants={buttonVariants}
                      transition={{
                        type: "spring",
                        duration: 0.4,
                      }}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      className={cn(
                        "absolute bottom-4 left-1/2 -translate-x-1/2 z-10 transition-colors duration-200",
                        volumeProgress < 20
                          ? "text-neutral-200"
                          : "text-neutral-400"
                      )}
                    >
                      <Volume2 size={17} />
                    </motion.div>
                  ) : (
                    <motion.div
                      key={"vol-off"}
                      variants={buttonVariants}
                      transition={{
                        type: "spring",
                        duration: 0.4,
                      }}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      className={cn(
                        "absolute bottom-4 left-1/2 -translate-x-1/2 z-10 transition-colors duration-200",
                        volumeProgress < 20
                          ? "text-neutral-200"
                          : "text-neutral-400"
                      )}
                    >
                      <VolumeOff size={17} />
                    </motion.div>
                  )}
                </AnimatePresence>
                <div
                  className="absolute bg-neutral-50 w-full h-full z-0"
                  style={{ transform: `translateY(${100 - volumeProgress}%)` }}
                ></div>
              </motion.div>

              {/* Bell */}
              <motion.div
                initial={{
                  opacity: 0,
                  filter: "blur(10px)",
                }}
                animate={{
                  opacity: 1,
                  filter: "blur(0px)",
                }}
                transition={{
                  duration: 0.4,
                }}
                id="Bell"
                onClick={(e) => handleBarClick(e, setBellProgress)}
                onMouseDown={() => setActiveBar("Bell")}
                onPointerDown={(e) => {
                  e.preventDefault();
                  setActiveBar("Bell");
                }}
                className="rounded-2xl w-12 relative bg-neutral-100/10 backdrop-blur-sm overflow-hidden touch-none"
              >
                <AnimatePresence>
                  {bellProgress > 0 && bellProgress < 40 && !isMute ? (
                    <motion.div
                      key="bell-one"
                      variants={buttonVariants}
                      transition={{
                        type: "spring",
                        duration: 0.4,
                      }}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      className={cn(
                        "absolute bottom-4 left-1/2 -translate-x-1/2 z-10 transition-colors duration-200",
                        bellProgress < 20
                          ? "text-neutral-200"
                          : "text-neutral-400"
                      )}
                    >
                      <Bell size={17} />
                    </motion.div>
                  ) : bellProgress >= 40 && !isMute ? (
                    <motion.div
                      key="bell-2"
                      variants={buttonVariants}
                      transition={{
                        type: "spring",
                        duration: 0.4,
                      }}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      className={cn(
                        "absolute bottom-4 left-1/2 -translate-x-1/2 z-10 transition-colors duration-200",
                        bellProgress < 20
                          ? "text-neutral-200"
                          : "text-neutral-400"
                      )}
                    >
                      <BellRing size={17} />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="bell-off"
                      variants={buttonVariants}
                      transition={{
                        type: "spring",
                        duration: 0.4,
                      }}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      className={cn(
                        "absolute bottom-4 left-1/2 -translate-x-1/2 z-10 transition-colors duration-200",
                        bellProgress < 20
                          ? "text-neutral-200"
                          : "text-neutral-400"
                      )}
                    >
                      <BellOff size={17} />
                    </motion.div>
                  )}
                </AnimatePresence>
                <div
                  className={cn(
                    "absolute bg-neutral-50 w-full h-full z-0",
                    isMute && "bg-neutral-50/18"
                  )}
                  style={{ transform: `translateY(${100 - bellProgress}%)` }}
                ></div>
              </motion.div>

              {/* Alarm */}
              <motion.div
                initial={{
                  opacity: 0,
                  filter: "blur(10px)",
                }}
                animate={{
                  opacity: 1,
                  filter: "blur(0px)",
                }}
                transition={{
                  duration: 0.4,
                }}
                id="Alarm"
                onClick={(e) => handleBarClick(e, setAlarmProgress)}
                onMouseDown={() => setActiveBar("Alarm")}
                onPointerDown={(e) => {
                  e.preventDefault();
                  setActiveBar("Alarm");
                }}
                className="rounded-2xl w-12 relative bg-neutral-100/10 backdrop-blur-sm overflow-hidden touch-none"
              >
                <AnimatePresence>
                  {alarmProgress > 0 ? (
                    <motion.div
                      variants={buttonVariants}
                      transition={{
                        type: "spring",
                        duration: 0.4,
                      }}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      key={"alarm-on"}
                      className={cn(
                        "absolute bottom-4 left-1/2 -translate-x-1/2 z-10 transition-colors duration-200",
                        alarmProgress < 20
                          ? "text-neutral-200"
                          : "text-neutral-400"
                      )}
                    >
                      <AlarmClock size={17} />
                    </motion.div>
                  ) : (
                    <motion.div
                      variants={buttonVariants}
                      transition={{
                        type: "spring",
                        duration: 0.4,
                      }}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      key={"alarm-off"}
                      className={cn(
                        "absolute bottom-4 left-1/2 -translate-x-1/2 z-10 transition-colors duration-200",
                        alarmProgress < 20
                          ? "text-neutral-200"
                          : "text-neutral-400"
                      )}
                    >
                      <AlarmClockOff size={17} />
                    </motion.div>
                  )}
                </AnimatePresence>
                <div
                  className="absolute bg-neutral-50 w-full h-full z-0"
                  style={{ transform: `translateY(${100 - alarmProgress}%)` }}
                ></div>
              </motion.div>
            </div>

            <div className="flex flex-col gap-[10px] text-neutral-50">
              <div className="flex gap-[10px] ">
                {
                  <motion.div
                    onClick={() => {
                      if (isMute === true && bellProgress === 0) {
                        setBellProgress(20);
                      }
                      setIsMute((prev) => !prev);
                    }}
                    layoutId="bell-button-layout"
                    whileTap={{
                      scale: 0.95,
                    }}
                    className={cn(
                      "transition-colors relative ease-in-out cursor-pointer duration-150 bg-neutral-100/8 backdrop-blur-xs shrink-0 rounded-2xl flex justify-center items-center size-[44px]",
                      isMute && " bg-blue-600 "
                    )}
                  >
                    <AnimatePresence>
                      {bellProgress > 0 && bellProgress < 40 && !isMute ? (
                        <motion.div
                          variants={buttonVariants}
                          transition={{
                            type: "spring",
                            duration: 0.2,
                          }}
                          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
                          initial="hidden"
                          animate="visible"
                          exit="exit"
                          key={"mute-1"}
                        >
                          <Bell size={16} />
                        </motion.div>
                      ) : bellProgress >= 40 && !isMute ? (
                        <motion.div
                          variants={buttonVariants}
                          transition={{
                            type: "spring",
                            duration: 0.2,
                          }}
                          initial="hidden"
                          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
                          animate="visible"
                          exit="exit"
                          key={"mute-2"}
                        >
                          <BellRing size={16} />
                        </motion.div>
                      ) : (
                        <motion.div
                          variants={buttonVariants}
                          transition={{
                            type: "spring",
                            duration: 0.2,
                          }}
                          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
                          initial="hidden"
                          animate="visible"
                          exit="exit"
                          key={"mute-3"}
                        >
                          <BellOff size={16} />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                }

                <motion.div className="relative p-[1px] w-full ">
                  <SetTimerSlider isMute={isMute} setIsMute={setIsMute} />
                </motion.div>
              </div>

              <div className="flex gap-[10px] ">
                <motion.div
                  layoutId="moon-button-layout"
                  whileTap={{
                    scale: 0.95,
                  }}
                  onClick={() => setIsDND((prev) => !prev)}
                  className={cn(
                    "transition-colors cursor-pointer relative ease-in-out duration-150 bg-neutral-100/8  backdrop-blur-xs shrink-0 rounded-2xl flex justify-center items-center size-[44px]",
                    isDND && " bg-blue-600 "
                  )}
                >
                  <motion.div className=" absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                    <Moon size={16} />
                  </motion.div>
                </motion.div>
                {/* <motion.div
                  initial={{
                    opacity: 0,
                    filter: "blur(10px)",
                  }}
                  animate={{
                    opacity: 1,
                    filter: "blur(0px)",
                  }}
                  transition={{
                    duration: 0.4,
                  }}
                  className="select-none bg-neutral-100/15 backdrop-blur-xs p-[10px] w-full rounded-2xl font-medium flex items-center justify-center tracking-tight text-[10px] "
                >
                  Slide to set timer
                </motion.div> */}
                <motion.div className="relative p-[1px] w-full">
                  <SetTimerSlider isMute={isDND} setIsMute={setIsDND} />
                </motion.div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {sectionState !== "Hidden" && sectionState === "Open" && (
          <motion.div
            // key={"open-key"}
            initial={
              {
                // x: 100,
                // y: -1,
                // opacity: 0,
              }
            }
            exit={{
              x: 100,
              y: -1,
              opacity: 0,
            }}
            transition={{
              type: "spring",
              damping: 28,
              stiffness: 300,
              mass: 1.1,
            }}
            animate={{
              // x: 0,
              // y: 0,
              opacity: 1,
            }}
            layoutId="container-layout"
            className="flex flex-col gap-[10px] w-fit bg-transparent rounded-[inherit] p-[10px] absolute top-30 right-3"
          >
            <motion.div className=" flex gap-[10px] h-40 ">
              <motion.div
                initial={{
                  x: 100,
                  y: -1,
                  opacity: 0,
                }}
                exit={{
                  x: 100,
                  y: -1,
                  opacity: 0,
                }}
                transition={{
                  type: "spring",
                  damping: 28,
                  stiffness: 300,
                  mass: 1.1,
                }}
                animate={{
                  x: 0,
                  y: 0,
                  opacity: 1,
                }}
                layoutId="bar-layout"
                onClick={(e) => handleBarClick(e, setVolumeProgress)}
                onMouseDown={() => setActiveBar("Vol")}
                onPointerDown={(e) => {
                  e.preventDefault();
                  setActiveBar("Vol");
                }}
                // onTouchStart={() => setActiveBar("Vol")}
                id="Vol"
                className="rounded-2xl w-11 relative bg-neutral-500/30  backdrop-blur-md overflow-hidden touch-none"
              >
                <div
                  onClick={(e) => {
                    e.stopPropagation();
                    setSectionState("Full");
                  }}
                  className={cn(
                    "z-10 absolute top-2 left-1/2 -translate-x-1/2 text-neutral-50 cursor-pointer",
                    volumeProgress > 85 && "text-neutral-400"
                  )}
                >
                  <Ellipsis size={16} />
                </div>
                <AnimatePresence>
                  {volumeProgress > 0 && volumeProgress < 40 ? (
                    <motion.div
                      key={"vol-1"}
                      variants={buttonVariants}
                      transition={{
                        type: "spring",
                        duration: 0.4,
                      }}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      className={cn(
                        "absolute bottom-4 left-1/2 -translate-x-1/2 z-10 transition-colors duration-200",
                        volumeProgress < 20
                          ? "text-neutral-200"
                          : "text-neutral-400"
                      )}
                    >
                      <Volume1 size={16} />
                    </motion.div>
                  ) : volumeProgress >= 40 ? (
                    <motion.div
                      key={"vol-2"}
                      variants={buttonVariants}
                      transition={{
                        type: "spring",
                        duration: 0.4,
                      }}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      className={cn(
                        "absolute bottom-4 left-1/2 -translate-x-1/2 z-10 transition-colors duration-200",
                        volumeProgress < 20
                          ? "text-neutral-200"
                          : "text-neutral-400"
                      )}
                    >
                      <Volume2 size={16} />
                    </motion.div>
                  ) : (
                    <motion.div
                      key={"vol-off"}
                      variants={buttonVariants}
                      transition={{
                        type: "spring",
                        duration: 0.4,
                      }}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      className={cn(
                        "absolute bottom-4 left-1/2 -translate-x-1/2 z-10 transition-colors duration-200",
                        volumeProgress < 20
                          ? "text-neutral-200"
                          : "text-neutral-400"
                      )}
                    >
                      <VolumeOff size={16} />
                    </motion.div>
                  )}
                </AnimatePresence>
                <div
                  className="absolute bg-neutral-50 w-full h-full z-0"
                  style={{ transform: `translateY(${100 - volumeProgress}%)` }}
                ></div>
              </motion.div>
            </motion.div>

            <div className="flex flex-col gap-[10px] text-neutral-50">
              <div className="flex gap-[10px] ">
                {
                  <motion.div
                    initial={{
                      x: 100,
                      y: -1,
                      opacity: 0,
                    }}
                    exit={{
                      x: 100,
                      y: -1,
                      opacity: 0,
                    }}
                    transition={{
                      type: "spring",
                      damping: 28,
                      stiffness: 300,
                      mass: 1.1,
                    }}
                    animate={{
                      x: 0,
                      y: 0,
                      opacity: 1,
                    }}
                    onClick={() => setIsMute((prev) => !prev)}
                    layoutId="bell-button-layout"
                    whileTap={{
                      scale: 0.95,
                    }}
                    className={cn(
                      "transition-colors relative ease-in-out duration-150 bg-neutral-500/35 backdrop-blur-md shrink-0 rounded-2xl flex justify-center items-center w-[44px] h-[33px]",
                      isMute && " bg-blue-600 "
                    )}
                    style={{
                      willChange: "transform",
                      transform: "translateZ(0)",
                    }}
                  >
                    <AnimatePresence>
                      {bellProgress > 0 && bellProgress < 40 && !isMute ? (
                        <motion.div
                          variants={buttonVariants}
                          transition={{
                            type: "spring",
                            duration: 0.2,
                          }}
                          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
                          initial="hidden"
                          animate="visible"
                          exit="exit"
                          key={"mute-1"}
                        >
                          <Bell size={16} />
                        </motion.div>
                      ) : bellProgress >= 40 && !isMute ? (
                        <motion.div
                          variants={buttonVariants}
                          transition={{
                            type: "spring",
                            duration: 0.2,
                          }}
                          initial="hidden"
                          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
                          animate="visible"
                          exit="exit"
                          key={"mute-2"}
                        >
                          <BellRing size={16} />
                        </motion.div>
                      ) : (
                        <motion.div
                          variants={buttonVariants}
                          transition={{
                            type: "spring",
                            duration: 0.2,
                          }}
                          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
                          initial="hidden"
                          animate="visible"
                          exit="exit"
                          key={"mute-3"}
                        >
                          <BellOff size={16} />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                }
              </div>

              <div className="flex gap-[10px] ">
                <motion.div
                  initial={{
                    x: 100,
                    y: -1,
                    opacity: 0,
                  }}
                  exit={{
                    x: 100,
                    y: -1,
                    opacity: 0,
                  }}
                  transition={{
                    type: "spring",
                    damping: 28,
                    stiffness: 300,
                    mass: 1.1,
                  }}
                  animate={{
                    x: 0,
                    y: 0,
                    opacity: 1,
                  }}
                  layoutId="moon-button-layout"
                  whileTap={{
                    scale: 0.95,
                  }}
                  style={{
                    willChange: "transform",
                    transform: "translateZ(0)",
                  }}
                  onClick={() => setIsDND((prev) => !prev)}
                  className={cn(
                    "transition-colors relative ease-in-out duration-150 bg-neutral-500/35  backdrop-blur-md shrink-0 rounded-2xl flex justify-center items-center w-[44px] h-[33px]",
                    isDND && " bg-blue-600 "
                  )}
                >
                  <motion.div className=" absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                    <Moon size={16} />
                  </motion.div>
                </motion.div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex items-center w-full justify-center h-full gap-2 mt-40">
        <motion.button
          whileTap={{
            scale: 0.9,
          }}
          disabled={throttleWorking}
          className=" disabled:bg-neutral-500 relative disabled:cursor-auto transition-all duration-100 ease-in-out select-none cursor-pointer bg-neutral-100 tracking-tight text-sm font-medium text-neutral-800  rounded-2xl w-20 h-10"
          onClick={() => {
            setThrottleWorking(true);
            setTimeout(() => setThrottleWorking(false), 700);
            setSectionState((prev) => (prev === "Hidden" ? "Open" : "Hidden"));
          }}
        >
          <AnimatePresence>
            {sectionState === "Hidden" ? (
              <motion.div
                className="absolute top-1/2 right-1/2 translate-x-1/2 -translate-y-1/2"
                key={"trigger-btn"}
                initial={{
                  opacity: 0,
                  filter: "blur(2px)",
                }}
                animate={{
                  opacity: 1,
                  filter: "blur(0px)",
                }}
                exit={{
                  opacity: 0,
                  filter: "blur(2px)",
                }}
                transition={{
                  duration: 0.3,
                }}
              >
                {"Trigger"}
              </motion.div>
            ) : (
              <motion.div
                className="absolute top-1/2 right-1/2 translate-x-1/2 -translate-y-1/2"
                key={"remove-btn"}
                initial={{
                  opacity: 0,
                  filter: "blur(2px)",
                }}
                animate={{
                  opacity: 1,
                  filter: "blur(0px)",
                }}
                exit={{
                  opacity: 0,

                  filter: "blur(2px)",
                }}
                transition={{
                  duration: 0.3,
                }}
              >
                {"Remove"}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.button>
      </div>
    </motion.div>
  );
}
