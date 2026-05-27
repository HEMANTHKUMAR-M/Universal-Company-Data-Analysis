declare module 'papaparse' {
  export interface ParseError {
    type: string;
    code: string;
    message: string;
    row?: number;
    file?: File;
  }

  export interface ParseResult<T> {
    data: T[];
    errors: ParseError[];
    meta: any;
  }

  export interface ParseConfig {
    header?: boolean;
    skipEmptyLines?: boolean;
    dynamicTyping?: boolean | Record<string, boolean>;
  }

  function parse<T = any>(input: string | File, config?: ParseConfig): ParseResult<T>;
  namespace parse {}
  export default { parse };
}
