import { Story } from 'inkjs';

export interface DialogueLine {
  text: string;
  speaker: string;
  choices?: DialogueChoice[];
}

export interface DialogueChoice {
  text: string;
  index: number;
  locked: boolean;
  lockReason?: string;
  requiredStat?: string;
  requiredValue?: number;
}

// Since we can't easily compile Ink in the browser for the prototype,
// we'll use a simplified dialogue tree system that mimics Ink's behavior
export interface DialogueNode {
  id: string;
  speaker: string;
  text: string | ((vars: Record<string, number>) => string);
  choices?: {
    text: string;
    condition?: (vars: Record<string, number>) => boolean;
    lockMessage?: string;
    next: string;
    effects?: Record<string, number>; // variable changes
  }[];
  next?: string; // auto-advance to this node
}

export interface DialogueScript {
  id: string;
  startNode: string;
  nodes: Record<string, DialogueNode>;
}

export class DialogueRunner {
  private script: DialogueScript;
  private currentNodeId: string;
  private variables: Record<string, number>;

  constructor(script: DialogueScript, initialVars: Record<string, number> = {}) {
    this.script = script;
    this.currentNodeId = script.startNode;
    this.variables = { ...initialVars };
  }

  getCurrentLine(): DialogueLine | null {
    const node = this.script.nodes[this.currentNodeId];
    if (!node) return null;

    const text = typeof node.text === 'function' ? node.text(this.variables) : node.text;

    const choices: DialogueChoice[] = node.choices?.map((c, i) => {
      const meetsCondition = c.condition ? c.condition(this.variables) : true;
      return {
        text: c.text,
        index: i,
        locked: !meetsCondition,
        lockReason: !meetsCondition ? c.lockMessage : undefined,
      };
    }) ?? [];

    return { text, speaker: node.speaker, choices: choices.length > 0 ? choices : undefined };
  }

  selectChoice(index: number): boolean {
    const node = this.script.nodes[this.currentNodeId];
    if (!node?.choices?.[index]) return false;

    const choice = node.choices[index];
    const meetsCondition = choice.condition ? choice.condition(this.variables) : true;
    if (!meetsCondition) return false;

    // Apply effects
    if (choice.effects) {
      for (const [key, val] of Object.entries(choice.effects)) {
        this.variables[key] = (this.variables[key] ?? 0) + val;
      }
    }

    this.currentNodeId = choice.next;
    return true;
  }

  advance(): boolean {
    const node = this.script.nodes[this.currentNodeId];
    if (!node?.next) return false;
    this.currentNodeId = node.next;
    return true;
  }

  isComplete(): boolean {
    return !this.script.nodes[this.currentNodeId];
  }

  getVariable(key: string): number {
    return this.variables[key] ?? 0;
  }

  getVariables(): Record<string, number> {
    return { ...this.variables };
  }
}
