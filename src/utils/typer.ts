import * as ts from "typescript";
import * as yaml from "js-yaml";
import { AppState } from "@/stores/AppStore";

export default function typer(input: string): Partial<AppState> {
  const output: Partial<AppState> = {};
  let json: Record<string, any> = {};
  const requiredItems: string[] = [];

  const sourceFile = ts.createSourceFile(
    "temp.ts",
    input,
    ts.ScriptTarget.Latest,
    true
  );
  const compilerOptions: ts.CompilerOptions = {
    allowJs: true,
    target: ts.ScriptTarget.Latest,
    moduleResolution: ts.ModuleResolutionKind.Node16, // update this line
    lib: ["es6", "dom"],
    strict: true,
    esModuleInterop: true,
    skipLibCheck: true,
  };
  const compilerHost = ts.createCompilerHost(compilerOptions, true);
  const program = ts.createProgram({
    rootNames: ["temp.ts"],
    options: compilerOptions,
    host: compilerHost,
  });

  const diagnostics = program.getSyntacticDiagnostics(sourceFile);
  if (diagnostics.length > 0) {
    output.hasError = true;
    output.errorMessage = "JS/TS syntax is invalid";
  }

  const { statements } = sourceFile;
  if (statements.length > 1) {
    output.hasError = true;
    output.errorMessage =
      "Only one JS/TS element is allowed (type, interface or object)";
  }

  let variableName: string;
  const [statement] = statements;

  if (ts.isTypeAliasDeclaration(statement)) {
    variableName = statement.name.getText();
    json.components = {};
    json.components.schemas = {};
    json.components.schemas[variableName] = {};
    json.components.schemas[variableName].type = "object";
    json.components.schemas[variableName].properties = {};
    statement.type.forEachChild((node) => {
      const isValid = node.getText().split(":").length === 2;
      if (isValid) {
        const { key, type, isArray, isRequired } = parseItem(node.getText());
        json.components.schemas[variableName].properties[key] = {
          type: isArray ? "array" : type,
          items: isArray ? { type } : undefined,
        };
        if (isRequired) requiredItems.push(key);
      }
    });
    json.components.schemas[variableName].required = requiredItems;
  }
  if (ts.isInterfaceDeclaration(statement)) {
    let i = 0;
    statement.forEachChild((node) => {
      if (i === 0) {
        variableName = node.getText();
        json.components = {};
        json.components.schemas = {};
        json.components.schemas[variableName] = {};
        json.components.schemas[variableName].type = "object";
        json.components.schemas[variableName].properties = {};
        i++;
      } else {
        const isValid = node.getText().split(":").length === 2;
        if (isValid) {
          const { key, type, isArray, isRequired } = parseItem(node.getText());
          json.components.schemas[variableName].properties[key] = {
            type: isArray ? "array" : type,
            items: isArray ? { type } : undefined,
          };
          if (isRequired) requiredItems.push(key);
        }

        json.components.schemas[variableName].required = requiredItems;
      }
    });
  }
  if (ts.isVariableStatement(statement)) {
    const objDeclaration = statement.declarationList.declarations[0];
    if (checkVariableHasObjectInitializer(objDeclaration)) {
      variableName = objDeclaration.name.getText();
      objDeclaration.initializer?.forEachChild((node) =>
        console.log("obj =>", node.getText())
      );
    }
  }

  output.output = yaml.dump(json);
  return output;
}

function checkVariableHasObjectInitializer(
  node: ts.VariableDeclaration
): boolean {
  if (!node.initializer) return false;
  if (node.initializer.kind === ts.SyntaxKind.ObjectLiteralExpression) {
    return true;
  }
  return false;
}

type ParsedItem = {
  isRequired: boolean;
  key: string;
  type: string;
  hasError: boolean;
  isArray?: boolean;
};

const primitives = /string|number|boolean/;

export function parseItem(item: string): ParsedItem {
  const [rawKey, rawType] = item.split(":");
  let isRequired = true;
  let hasError = false;
  let retType = rawType.replaceAll(/\s|,|;/g, "");
  let isArray: boolean | undefined;
  if (rawKey.trim().at(-1) === "?") {
    isRequired = false;
  }

  if (primitives.test(retType)) {
    if (retType.slice(-2) === "[]") {
      isArray = true;
      retType = retType.slice(0, retType.length - 2);
    }
  } else {
    hasError = true;
  }

  return {
    key: rawKey.replaceAll(/\s|[?]/g, ""),
    type: retType,
    isRequired,
    hasError,
    isArray,
  };
}

export const typerWeb = (input: string) => {
  const transpilationResult = ts.transpileModule(input, {
    fileName: "codeSnippet.ts",
    compilerOptions: {
      module: ts.ModuleKind.ESNext,
      target: ts.ScriptTarget.ESNext,
      allowJs: true,
      jsx: ts.JsxEmit.React,
    },
  });

  return transpilationResult?.diagnostics?.length === 0;
};
