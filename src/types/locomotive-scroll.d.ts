declare module "locomotive-scroll" {
  type LocomotiveScrollOptions = {
    el?: HTMLElement;
    smooth?: boolean;
    lerp?: number;
    multiplier?: number;
    tablet?: { smooth?: boolean };
    smartphone?: { smooth?: boolean };
  };

  export default class LocomotiveScroll {
    constructor(options?: LocomotiveScrollOptions);
    scroll?: { instance?: { scroll?: { y?: number } } };
    destroy(): void;
    on(event: "scroll", callback: () => void): void;
    scrollTo(
      target: string | number | HTMLElement,
      options?: Record<string, unknown>
    ): void;
    update(): void;
  }
}
