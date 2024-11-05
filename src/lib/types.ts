import * as t from "io-ts";

export type BulletPoint = {
  id: string;
  text: string;
};


const BulletPointSchema = t.type({
  id: t.string,
  text: t.string,
});

const ValueSchema = t.type({
  title: t.string,
  richEditor: t.string,
  bulletPoints: t.array(BulletPointSchema),
});
const ValueArraySchema = t.array(ValueSchema);
export function validateJsonOnValueType(value: unknown): boolean {
  const result = ValueArraySchema.decode(value);
  return !(result._tag === "Left");
}
export type AImportStatus = {
  status: "initial" | "loading" | "success" | "error";
  message: string;
};

export type List = {
  list_id: number;
  list_name: string;
  created_at: string;
  user_id: string;
  list: Slide[]
};

export type Slide = {
  title: string;
  richEditor: string;
  bulletPoints: BulletPoint[];
  slideId: string;
  neededTime: number; // in minutes
};
export type setList = (newSlide: Slide[]) => void;
