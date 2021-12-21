declare module 'midi' {
  class Input {
    getPortCount(): number;
    getPortName(n: number): string;
    closePort(): void;
    openPort(n: number): void;
    on(
      eventName: 'message',
      listener: (deltaTime: number, message: number[]) => void
    );
    ignoreTypes(sysex: boolean, timing: boolean, activeSensing: boolean);
  }

  class Output {
    getPortCount(): number;
    getPortName(n: number): string;
    closePort(): void;
    openPort(n: number): void;
    sendMessage(message: number[]): void;
    isPortOpen(): boolean;
  }
}
