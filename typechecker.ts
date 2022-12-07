import { Line, NonLogLine } from "./parser";

export const typecheck = (lines: Line[]) => {
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    if (line.type === "log") {
      continue;
    }

    if (
      isValidInstruction(line) &&
      isValidVariableName(line) &&
      isValidInteger(line)
    ) {
      continue;
    }

    return false;
  }

  return true;
};

const isValidInstruction = (line: NonLogLine) => {
  const instruction = line.instruction;
  const validInstructions = ["ADD", "SUB", "DIV", "MUL"];

  const isValid = validInstructions.includes(instruction);

  if (!isValid) {
    console.log(
      `[Invalid Instruction] Accepted Instruction are ${validInstructions.join(
        ","
      )} but instead got ${instruction}`
    );
  }

  return isValid;
};

const isValidVariableName = (line : NonLogLine) => {
  const variable = line.variable;

  if (variable.at(0)?.match(/^[a-zA-z]+$/)) {
    return true;
  }

  console.log(
    `[Invalid Variable Name] Variable should start with a letter between A-Z but instead we got variable that starts with ${variable.at(
      0
    )}`
  );

  return false;
};

const isValidInteger = (line: NonLogLine) => {
  const leftInt = parseInt(line.leftInt, 10);
  const rightInt = parseInt(line.rightInt, 10);

  const isLeftValid = !Number.isNaN(leftInt);

  if (!isLeftValid) {
    console.log(
      `[Invalid Integer] Expected integer but instead got ${line.leftInt}`
    );
  }

  const isRightValid = !Number.isNaN(rightInt);

  if (!isRightValid) {
    console.log(
      `[Invalid Integer] Expected integer but instead  got ${line.rightInt}`
    );
  }

  return isLeftValid && isRightValid;
};
