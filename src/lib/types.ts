import * as t from "io-ts";

export type BulletPoint = {
  id: string;
  text: string;
};

export type Value = {
  title: string;
  richEditor: string;
  bulletPoints: BulletPoint[];
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
