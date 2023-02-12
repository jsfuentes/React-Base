import { Blocker, Transition } from "history";
import { customAlphabet } from "nanoid";
import React, {
  DependencyList,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { UNSAFE_NavigationContext } from "react-router-dom";
import { inDev } from "src/utils/utils";
const debug = require("debug")("app:utils:helpers");

export function useDebounce<Type>(value: Type, delay = 500) {
  const [debouncedVal, setDebouncedVal] = useState(value);

  useEffect(() => {
    const timeoutID = setTimeout(() => setDebouncedVal(value), delay);
    return () => clearTimeout(timeoutID);
  }, [value, delay]);

  return debouncedVal;
}

//TODO: Make more efficient Math.random implementation for when doesn't need to be secure
export function useRandomId() {
  const randomId = useMemo(() => {
    const nanoid = customAlphabet("abcdefghijklmnopqrstuvwxyz", 5);
    return nanoid();
  }, []);

  return randomId;
}

export function useTraceUpdate(props: Record<any, any>, name = "") {
  const prev = useRef(props);
  useEffect(() => {
    const changedProps = Object.entries(props).reduce(
      (ps: Record<any, any>, [k, v]) => {
        if (prev.current[k] !== v) {
          ps[k] = [prev.current[k], v];
        }
        return ps;
      },
      {}
    );

    if (Object.keys(changedProps).length > 0) {
      debug(`${name} changed props:`, changedProps);
    }
    prev.current = props;
  });
}

export function useOnUnmount(f: (() => void) | null) {
  const fR = useRef(f);

  useEffect(() => {
    fR.current = f;
  }, [f]);

  useEffect(() => {
    return () => {
      if (fR.current) {
        fR.current();
      }
    };
  }, []);
}

//must be mounted to activate, so need loading to reset
export function useScrollTransfer(
  fromR: React.MutableRefObject<HTMLElement | null>,
  toR: React.MutableRefObject<HTMLElement | null>,
  loading = false
) {
  useEffect(() => {
    const f = fromR.current;
    const t = toR.current;

    function scrollToR(e: WheelEvent) {
      e.preventDefault();
      if (t) {
        const newScrollTop = t.scrollTop + e.deltaY;
        t.scroll(0, newScrollTop);
      } else {
        debug("scrollToR fails to find toScroll");
      }
    }

    if (!loading) {
      if (f && t) {
        f.addEventListener("wheel", scrollToR);
        return () => f.removeEventListener("wheel", scrollToR);
      }
    }
  }, [fromR, toR, loading]);
}

//f should be from useCallback to avoid reruns
export function useClickOutside(
  ref: React.MutableRefObject<HTMLElement | null>,
  f: () => void,
  isActive: boolean
) {
  useEffect(() => {
    function stopExit(e: MouseEvent) {
      e.stopPropagation();
    }

    const elRef = ref.current;
    if (isActive && elRef) {
      //https://stackoverflow.com/questions/33657212/javascript-click-anywhere-in-body-except-the-one-element-inside-it/33657471
      elRef.addEventListener("mousedown", stopExit);
      document.body.addEventListener("mousedown", f);
      return () => {
        if (elRef) {
          elRef.removeEventListener("mousedown", stopExit);
        }
        document.body.removeEventListener("mousedown", f);
      };
    }
  }, [ref, f, isActive]);
}

enum SCRIPT_STATE {
  LOADING = "LOADING",
  IDLE = "IDLE",
  READY = "READY",
  ERROR = "ERROR",
}

export function useScript(src: string) {
  // Keep track of script status ("idle", "loading", "ready", "error")
  const [status, setStatus] = useState<SCRIPT_STATE>(
    src ? SCRIPT_STATE.LOADING : SCRIPT_STATE.IDLE
  );

  useEffect(() => {
    debug("Script status: ", status, src);
  }, [src, status]);

  useEffect(
    () => {
      if (!src) {
        setStatus(SCRIPT_STATE.IDLE);
        return;
      }

      // Fetch existing script element by src
      // It may have been added by another intance of this hook
      let script = document.querySelector(`script[src="${src}"]`);
      if (!script) {
        // Create script
        script = document.createElement("script");
        script.setAttribute("src", src);
        script.setAttribute("async", "true");
        script.setAttribute("data-status", SCRIPT_STATE.LOADING);
        // Add script to document body
        document.body.appendChild(script);
        // Store status in attribute on script
        // This can be read by other instances of this hook
        const setAttributeFromEvent = (event: Event) => {
          script &&
            script.setAttribute(
              "data-status",
              event.type === "load" ? SCRIPT_STATE.READY : SCRIPT_STATE.ERROR
            );
        };

        script.addEventListener("load", setAttributeFromEvent);
        script.addEventListener("error", setAttributeFromEvent);
      } else {
        // Grab existing script status from attribute and set to state.
        setStatus(
          (script.getAttribute("data-status") as SCRIPT_STATE) ||
            SCRIPT_STATE.LOADING
        );
      }
      // Script event handler to update status in state
      // Note: Even if the script already exists we still need to add
      // event handlers to update the state for *this* hook instance.
      const setStateFromEvent = (event: Event) => {
        setStatus(
          event.type === "load" ? SCRIPT_STATE.READY : SCRIPT_STATE.ERROR
        );
      };
      // Add event listeners
      script.addEventListener("load", setStateFromEvent);
      script.addEventListener("error", setStateFromEvent);
      // Remove event listeners on cleanup
      return () => {
        if (script) {
          script.removeEventListener("load", setStateFromEvent);
          script.removeEventListener("error", setStateFromEvent);
        }
      };
    },
    [src] // Only re-run effect if script src changes
  );

  const isLoading = status !== SCRIPT_STATE.READY;
  return isLoading;
}

export function useDimensions(ref: React.RefObject<HTMLDivElement>) {
  const [dimensions, setDimensions] = useState({ width: 1, height: 1 });

  // Update width and height of grid when window is resized
  useEffect(() => {
    let frame: number;
    function handleResize() {
      // debug("Handle resize");
      if (frame) cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        if (ref.current) {
          // Floor and minus 1 to create some leeway so doesnt jump around in resize if decimals
          const width = Math.floor(ref.current.clientWidth) - 1;
          const height = Math.floor(ref.current.clientHeight) - 1;
          setDimensions({ width, height });
        }
      });
    }

    handleResize();

    window.addEventListener("resize", handleResize);
    window.addEventListener("orientationchange", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("orientationchange", handleResize);
    };
  }, [ref]);

  return dimensions;
}

// Removed from react router v6. Bringing them back manually: https://github.com/remix-run/react-router/issues/8139
// These were removed from the release of v6 due to some edge case bugs https://blog.logrocket.com/migrating-react-router-v6-complete-guide/
export function useBlocker(blocker: Blocker, when = true) {
  const navigator = React.useContext(UNSAFE_NavigationContext).navigator;

  React.useEffect(() => {
    if (!when) return;

    // @ts-ignore Removed from official types. See link above
    const unblock = navigator.block((tx: Transition) => {
      const autoUnblockingTx = {
        ...tx,
        retry() {
          unblock();
          tx.retry();
        },
      };

      blocker(autoUnblockingTx);
    });

    return unblock;
  }, [navigator, blocker, when]);
}

export default function usePrompt(message: string, when = true) {
  const blocker = React.useCallback(
    (tx: Transition) => {
      if (window.confirm(message)) tx.retry();
    },
    [message]
  );

  // Don't block in dev to not be annoying during development
  useBlocker(blocker, !inDev && when);
}

export function useThrottledEffect(
  effect: () => void,
  deps: DependencyList,
  minInterval = 250
) {
  const effectRef = useRef(effect);
  const timeoutRef = useRef<NodeJS.Timer | null>(null);

  useEffect(() => {
    effectRef.current = effect;
  }, [effect]);

  useEffect(() => {
    // debug("Deps change checking timeoutRef", timeoutRef.current);
    if (!timeoutRef.current) {
      // debug("Setting timeout");
      timeoutRef.current = setTimeout(() => {
        // debug("Running timeout");
        timeoutRef.current = null;
        effectRef.current();
      }, minInterval);
    }
    //can't spread and depend on deps
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...deps, minInterval]);

  // useTraceUpdate(deps);
}

export function useValueRef<Type>(value: Type) {
  const valueRef = useRef<Type>(value);

  useEffect(() => {
    valueRef.current = value;
  }, [value]);

  return valueRef;
}

export function useTimer(props: {
  initialTimeInSeconds: number;
  onDone?: () => void;
}) {
  const [seconds, setSeconds] = useState(props.initialTimeInSeconds);
  const [active, setActive] = useState(false);

  const startTimer = useCallback(() => {
    setActive(true);
  }, []);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    if (active) {
      timeoutId = setTimeout(() => {
        if (seconds === 1) {
          setActive(false);
          props.onDone && props.onDone();
        }
        setSeconds((seconds) => seconds - 1);
      }, 1000);
    }

    return () => clearTimeout(timeoutId);
  }, [active, props, seconds]);

  return { seconds, setSeconds, startTimer, active };
}
