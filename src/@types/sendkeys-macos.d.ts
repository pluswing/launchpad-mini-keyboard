declare module 'sendkeys-macos' {
  interface SendKeyOption {
    delay?: number;
    initialDelay?: number;
  }

  function sendKey(
    application: string | null,
    command: string,
    option?: SendKeyOption
  ): void;

  export default sendKey;
}
