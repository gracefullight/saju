export type Stem = "甲" | "乙" | "丙" | "丁" | "戊" | "己" | "庚" | "辛" | "壬" | "癸";
export type Branch =
  | "子"
  | "丑"
  | "寅"
  | "卯"
  | "辰"
  | "巳"
  | "午"
  | "未"
  | "申"
  | "酉"
  | "戌"
  | "亥";

export type Element = "wood" | "fire" | "earth" | "metal" | "water";
export type Polarity = "yang" | "yin";
export type Gender = "male" | "female";

export type PillarPosition = "year" | "month" | "day" | "hour";

export interface Pillar {
  stem: Stem;
  branch: Branch;
  pillar: string;
}

/**
 * 공통 레이블 타입 - 영어 키, 한글, 한자를 함께 제공
 */
export interface Label<T extends string = string> {
  key: T;
  korean: string;
  hanja: string;
}
