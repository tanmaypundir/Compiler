import { Line, NonLogLine } from "./parser";

export const generateCCode = (sourceAst: Line[]) => {
  const cCodeForDeclarationOfVariable = getCCodeForDeclarationOfVariables(
    getDeclaredVariables(sourceAst)
  );

  const CCodes: string[] = [];

  for (const line of sourceAst) {
    const cCode = compileSingleLineToCCode(line);
    CCodes.push(cCode);
  }

  const customCode = `${cCodeForDeclarationOfVariable}\n${CCodes.join("\n")}`;

  const finalCode = generateFinalCCode(customCode);

  return finalCode;
};

const generateFinalCCode = (customCCode: string) => {
  return `
#include <stdio.h>

int main() {
${customCCode}
return 0;
}`;
};

const getDeclaredVariables = (sourceAst: Line[]) => {
  const knownVariables = new Map<string, boolean>();

  for (const line of sourceAst) {
    if (line.type === "log") {
      const variable = line.variable;

      const isValidVariable = knownVariables.has(variable);

      if (!isValidVariable) {
        console.log(
          `[INVALID VARIABLE] Unknown variable ${variable} passed to LOG instruction`
        );
        process.exit(1);
      }
      continue;
    }

    if (knownVariables.has(line.variable)) {
      continue;
    }

    knownVariables.set(line.variable, true);
  }

  return knownVariables;
};

const getCCodeForDeclarationOfVariables = (
  declaredVariables: Map<string, boolean>
) => {
  const variables: string[] = [];

  for (const variable of declaredVariables.keys()) {
    variables.push(variable);
  }

  return `int ${variables.join(",")};`;
};

const compileSingleLineToCCode = (line: Line) => {
  if (line.type === "non-log") {
    return `${line.variable} = ${line.leftInt} ${getCOperatorForInstruction(
      line
    )} ${line.rightInt};`;
  } else {
    return `printf("Value of variable ${line.variable} is %d\\n", ${line.variable});`;
  }
};

const getCOperatorForInstruction = (line: NonLogLine) => {
  const instToOpeartor = {
    ADD: "+",
    SUB: "-",
    MUL: "*",
    DIV: "/",
  };

  return instToOpeartor[line.instruction];
};
