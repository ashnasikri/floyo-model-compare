export interface Workflow {
  name: string;
  type: string;
  url: string;
  description: string;
  runs: string;
  status: string;
}

export interface Model {
  id: string; // slug derived from model name
  name: string;
  version: string;
  maker: string;
  sourceType: "Open Source" | "Closed Source";
  license: string;
  released: string;
  architecture: string;
  parameters: string;
  maxResolution: string;
  maxDuration: string;
  fps: string;
  nativeAudio: boolean;
  comfyUISupport: boolean;
  finetuneable: boolean;
  minVRAM: string;
  costPerSecond: string;
  inputsSupported: string;
  tier: "S" | "A" | "B" | "C";
  onFloyo: boolean;
  scores: {
    quality: number;
    motion: number;
    speed: number;
    control: number;
    audio: number;
    value: number;
  };
  strengths: string[];
  weaknesses: string[];
  bestFor: string[];
  verdict: string;
  workflows: Workflow[];
}
