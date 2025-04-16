// types/aphelion.ts
export type AphelionBlock = [string, ...string[]];

export interface AphelionAttributes {
  [key: string]:
    | string
    | number
    | boolean
    | { $raw: string }
    | { $var: string }
    | { $func: string }
    | AphelionAttributes
    | Array<string | number | AphelionAttributes>;
}

export interface AphelionNode {
  block: AphelionBlock;
  attr?: AphelionAttributes;
  child?: AphelionNode[];
}

export type AphelionConfig = AphelionNode | AphelionNode[];