export default function typer(input: string): string {
  let output = "";
  try {
    const obj = JSON.parse(input);
    if (typeof obj === "object") {
      if (Array.isArray(obj)) {
        output = "JSON Array";
      } else {
        output = "JSON Object";
      }
    } else if (typeof obj === "string") {
      output = "JSON String";
    }
  } catch (err) {
    try {
      // Attempt to parse as TypeScript interface or type
      const interfaceType = eval(input);
      if (typeof interfaceType === "object") {
        output = "TypeScript Interface";
      } else {
        output = "TypeScript Type";
      }
    } catch (err) {
      output = "Not a valid input";
    }
  }
  return output;
}
