import { describe, it, expect } from "vitest";
import typer, { parseItem } from "./typer";
import * as yaml from "js-yaml";

describe("typer features", () => {
  describe("validation behaviors", () => {
    it("give error if typescript is not valid", () => {
      const output = typer("type test;");
      expect(output.hasError).toEqual(true);
      expect(output.errorMessage).toEqual("JS/TS syntax is invalid");
    });
    it("give error there is more than 1 object", () => {
      const output = typer(`
        const obj1 = {key : 1};
        const obj2 = {key : 2};
      `);
      expect(output.hasError).toEqual(true);
      expect(output.errorMessage).toEqual(
        "Only one JS/TS element is allowed (type, interface or object)"
      );
    });
    it("give error there is more than 1 type", () => {
      const output = typer(`
        type obj1 = {key : number, key2: void};
        type obj2 = {key?: number};
      `);
      expect(output.hasError).toEqual(true);
      expect(output.errorMessage).toEqual(
        "Only one JS/TS element is allowed (type, interface or object)"
      );
    });
    it("give error there is more than 1 interface", () => {
      const output = typer(`
        interface Obj1 {key : number; key2?: string[]};
        interface Obj2 {key?: number};
      `);
      expect(output.hasError).toEqual(true);
      expect(output.errorMessage).toEqual(
        "Only one JS/TS element is allowed (type, interface or object)"
      );
    });
  });
  describe("build parsed types", () => {
    it.each([
      [
        "field: string",
        { key: "field", type: "string", isRequired: true, hasError: false },
      ],
      [
        "field?: string",
        { key: "field", type: "string", isRequired: false, hasError: false },
      ],
      [
        "field ?: string",
        { key: "field", type: "string", isRequired: false, hasError: false },
      ],
      [
        "field? : string",
        { key: "field", type: "string", isRequired: false, hasError: false },
      ],
      [
        "field ? : string",
        { key: "field", type: "string", isRequired: false, hasError: false },
      ],
      [
        "field: string[]",
        {
          key: "field",
          type: "string",
          isRequired: true,
          hasError: false,
          isArray: true,
        },
      ],
    ])("parses %s", (text, expected) => {
      const parsed = parseItem(text);
      expect(parsed).toEqual(expected);
    });
  });
  describe("test outputs", () => {
    it("return yml from type", () => {
      const node = `
        type MyType = {
          reqField: string
          optionalField?: number []
        }
      `;
      expect(typer(node).output).toEqual(
        yaml.dump({
          components: {
            schemas: {
              MyType: {
                type: "object",
                properties: {
                  reqField: { type: "string" },
                  optionalField: { type: "array", items: { type: "number" } },
                },
                required: ["reqField"],
              },
            },
          },
        })
      );
    });
    it("return yml from interface", () => {
      const node = `
        interface MyInterface {
          reqField: string
          optionalField?: number []
        }
      `;
      expect(typer(node).output).toEqual(
        yaml.dump({
          components: {
            schemas: {
              MyInterface: {
                type: "object",
                properties: {
                  reqField: { type: "string" },
                  optionalField: { type: "array", items: { type: "number" } },
                },
                required: ["reqField"],
              },
            },
          },
        })
      );
    });
  });
});
