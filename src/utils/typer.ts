import * as ts from "typescript";
import * as yaml from "js-yaml";
import { AppState } from "@/stores/AppStore";

interface TyperConfig {}

export default function typer(input: string): Partial<AppState> {
  const output: Partial<AppState> = {};
  const json: any = { components: { schemas: {} } };
  const requiredItems: string[] = [];

  const sourceFile = ts.createSourceFile(
    "temp.ts",
    input,
    ts.ScriptTarget.Latest,
    true
  );

  const compilerHost = ts.createCompilerHost({});
  const program = ts.createProgram({
    rootNames: ["temp.ts"],
    options: { allowJs: true },
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
    statement.type.forEachChild((node) =>
      console.log("type =>", node.getText())
    );
  }
  if (ts.isInterfaceDeclaration(statement)) {
    let i = 0;
    statement.forEachChild((node) => {
      if (i === 0) {
        variableName = node.getText();
        i++;
      } else console.log("interface =>", node.getText());
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

  // const yamlOutput = yaml.dump().
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
