import { execSync } from "node:child_process";
import fs from "node:fs";
import { generateCCode } from "./codegen";
import { ParserFactor } from "./parser";
import { typecheck } from "./typechecker";


// 1. Get path from command line
// 2. Read that file
// 3. Store it as string 
const getSourceCode = () => {
  const fileName = process.argv.at(-1)!;
  const fileContent = fs.readFileSync(fileName, { encoding: "utf-8" });

  return fileContent;
};

// Parses the source code to generate AST
const getAst = (sourceCode: string) => {
  const parser = new ParserFactor(sourceCode);
  const tokens = parser.parse();
  return tokens;
};

// Converts the C code from temp.c to final.exe using GCC
const compileCSourceCode = (path: string) => {
  execSync(`gcc ${path} -o final.exe`, { encoding: "utf-8" });
  console.log("Created final.exe")
};



const main = () => {
  const asts = getAst(getSourceCode());

  if (!typecheck(asts)) {
    // If it fails the typechecking process
    // Then stop the process
    process.exit(1);
  }

  const cSourceCode = generateCCode(asts);

  // Write the genreated C code to temp.c
  fs.writeFileSync("./temp.c", cSourceCode, { encoding: "utf-8" });
  

  // Compiles the source code to .exe file
  compileCSourceCode("./temp.c");
};

// Start the main function
main();
