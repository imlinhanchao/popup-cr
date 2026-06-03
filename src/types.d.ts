declare module 'https://unpkg.com/vue@3/dist/vue.esm-browser.prod.js' {
  export interface Ref<T = any> {
    value: T;
  }
  
  export interface ComputedRef<T = any> {
    readonly value: T;
  }
  
  export interface App {
    mount(rootContainer: Element | string): any;
    unmount(): void;
  }
  
  export interface Component {
    props?: any;
    setup?: (props: any) => any;
    template?: string;
    components?: Record<string, Component>;
  }
  
  export function createApp(rootComponent: Component, props?: any): App;
  export function ref<T>(value: T): Ref<T>;
  export function reactive<T extends object>(target: T): T;
  export function computed<T>(getter: () => T): ComputedRef<T>;
  export function nextTick(fn?: () => void): Promise<void>;
  export function onMounted(hook: () => void): void;
  export function h(type: string | Component, props?: any, children?: any): any;
  export const Transition: Component;
}

declare global {
  namespace JSX {
    interface Element {
      [key: string]: any;
    }
    interface IntrinsicElements {
      [elemName: string]: any;
    }
    interface ElementChildrenAttribute {
      children: {};
    }
  }
}

export {};
