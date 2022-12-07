export type NonLogLine = {
  type: "non-log";
  variable: string;
  instruction: string;
  leftInt: string;
  rightInt: string;
};

export type LogLine = {
  type: "log";
  variable: string;
};

export type Line = NonLogLine | LogLine;

export class ParserFactor {
  content: string;
  curPos = 0;

  output: Line[];

  constructor(content: string) {
    this.content = content;
    this.output = [];
  }

  parse() {
    const shouldGo = () => this.getCurChar() !== undefined;

    while (shouldGo()) {
      this.eatWhiteSpace();

      const variable = this.alphabet();

      if (variable === "LOG") {
        this.eatWhiteSpace();
        const variableToPrint = this.alphabet();
        this.eatWhiteSpace();

        this.output.push({ type: "log", variable: variableToPrint });
        continue;
      }

      this.eatWhiteSpace();

      this.equalSign();

      this.eatWhiteSpace();

      const leftInt = this.integer();

      this.eatWhiteSpace();

      const instruction = this.alphabet();

      this.eatWhiteSpace();

      const rightInt = this.integer();

      this.eatWhiteSpace();

      this.output.push({
        instruction,
        leftInt,
        rightInt,
        variable,
        type: "non-log",
      });
    }

    return this.output;
  }

  alphabet() {
    const startingPos = this.curPos;

    while ( this.getCurChar() !== undefined && !this.getCurChar().match(/^\s*$/)) {
      this.consume();
    }

    const endingPos = this.curPos;

    const variableName = this.content.slice(startingPos, endingPos);
    return variableName;
  }

  equalSign() {
    const curChar = this.getCurChar();

    if (curChar === "=") {
      this.consume();
      return "=";
    } else {
      throw new Error(`Unknown symbol ${curChar}`);
    }
  }

  integer() {
    const startPos = this.curPos;

    while (!this.getCurChar().match(/^\s*$/)) {
      this.consume();
    }

    const endingPos = this.curPos;

    const integer = this.content.slice(startPos, endingPos);
    return integer;
  }

  eatWhiteSpace() {
    while (
      this.getCurChar() !== undefined &&
      this.getCurChar().match(/^\s*$/)
    ) {
      this.consume();
    }
  }

  getCurChar() {
    const curChar = this.content[this.curPos];

    return curChar;
  }

  consume() {
    this.curPos++;
  }
}
