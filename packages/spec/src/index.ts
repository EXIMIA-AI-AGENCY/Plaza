import Ajv2020, { type ValidateFunction } from "ajv/dist/2020.js";
import addFormats from "ajv-formats";
import manifestSchema from "../schemas/manifest.schema.json" with { type: "json" };
import messageSchema from "../schemas/message.schema.json" with { type: "json" };
import receiptSchema from "../schemas/receipt.schema.json" with { type: "json" };

export const PLAZA_VERSION = "0.1" as const;
export const MAX_ROUNDS = 6;
export const MAX_NOTE_LENGTH = 280;
export const REPLAY_WINDOW_MS = 5 * 60 * 1000;

export { manifestSchema, messageSchema, receiptSchema };

const ajv = new Ajv2020({ allErrors: true, strict: true, strictRequired: false });
addFormats(ajv);
ajv.addSchema(receiptSchema);
ajv.addSchema(manifestSchema);
ajv.addSchema(messageSchema);

function compile(id: string): ValidateFunction {
  const fn = ajv.getSchema(id);
  if (!fn) throw new Error(`schema not registered: ${id}`);
  return fn;
}

export const validateManifest = compile(manifestSchema.$id);
export const validateMessage = compile(messageSchema.$id);
export const validateReceipt = compile(receiptSchema.$id);

export type ValidationResult = { ok: true } | { ok: false; errors: string[] };

function run(fn: ValidateFunction, data: unknown): ValidationResult {
  if (fn(data)) return { ok: true };
  const errors = (fn.errors ?? []).map((e) => `${e.instancePath || "/"} ${e.message ?? ""}`.trim());
  return { ok: false, errors };
}

export const checkManifest = (data: unknown) => run(validateManifest, data);
export const checkMessage = (data: unknown) => run(validateMessage, data);
export const checkReceipt = (data: unknown) => run(validateReceipt, data);
