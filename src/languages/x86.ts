/* Copyright 2018 Mozilla Foundation
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

import IRichLanguageConfiguration = monaco.languages.LanguageConfiguration;
import ILanguage = monaco.languages.IMonarchLanguage;
import IModel = monaco.editor.IModel;
import IPosition = monaco.IPosition;

let completionItems: monaco.languages.CompletionItem[] = null;
function getCompletionItems() {
  const keyword = monaco.languages.CompletionItemKind.Keyword;
  if (completionItems) {
    return completionItems;
  }
  return completionItems = [

  ];
}

const LanguageConfiguration: IRichLanguageConfiguration = {
  // the default separators except `@$`
  wordPattern: /(-?\d*\.\d\w*)|([^\`\~\!\#\%\^\&\*\(\)\-\=\+\[\{\]\}\\\|\;\:\'\"\,\.\<\>\/\?\s]+)/g,
  brackets: [
    ["{", "}"],
    ["[", "]"],
    ["(", ")"],
  ],

  autoClosingPairs: [
    { open: "{", close: "}" },
    { open: "[", close: "]" },
    { open: "(", close: ")" },
    { open: '"', close: '"' },
    { open: "'", close: "'" },
  ],
  surroundingPairs: [
    { open: "{", close: "}" },
    { open: "[", close: "]" },
    { open: "(", close: ")" },
    { open: '"', close: '"' },
    { open: "'", close: "'" },
    { open: "<", close: ">" },
  ]
};

const MonarchDefinitions = {
  // Set defaultToken to invalid to see what you do not tokenize yet
  defaultToken: "invalid",

  ignoreCase: true,

  keywords: [
    "qword", "ptr"
  ],

  typeKeywords: [
    "i32", "i64", "f32", "f64"
  ],

  ops: [
    "add",
    "sub",
    "mov",
    "jmp",
    "ret",
    "int3",
    "nop",
    "cmp"
  ],

  registers: [
    "R8", "R9", "R10", "R11", "R12", "R13", "R14", "R15",
    "CS", "DS", "ES", "FS", "GS", "SS", "RAX", "EAX", "RBX", "EBX", "RCX", "ECX", "RDX", "EDX",
    "RCX", "RIP", "EIP", "IP", "RSP", "ESP", "SP", "RSI", "ESI", "SI", "RDI", "EDI", "DI", "RFLAGS", "EFLAGS", "FLAGS"
  ],

  // C# style strings
  escapes: /\\(?:[abfnrtv\\"']|x[0-9A-Fa-f]{1,4}|u[0-9A-Fa-f]{4}|U[0-9A-Fa-f]{8})/,

  // The main tokenizer for our languages
  tokenizer: {
    root: [
      // identifiers and keywords
      [/[a-z_$][\w$\.]*/, {
        cases: {
          "@ops": "keyword",
          "@registers": "type",
          "@keywords": "keyword",
          "@typeKeywords": "keyword.type",
          "@default": "identifier"
        }
      }],

      // whitespace
      { include: "@whitespace" },

      // numbers
      [/0[xX][0-9a-fA-F]+/, "number.hex"],
      [/\d+/, "number"],

      // delimiter: after number because of .\d floats
      [/[;,.]/, "delimiter"],

      // strings
      [/"/, { token: "string.quote", bracket: "@open", next: "@string" }],

      [/[{}()\[\]]/, "@brackets"]
    ] as any,

    comment: [
      [/;.*/, "comment"]
    ],

    string: [
      [/[^\\"]+/, "string"],
      [/@escapes/, "string.escape"],
      [/\\./, "string.escape.invalid"],
      [/"/, { token: "string.quote", bracket: "@close", next: "@pop" }]
    ],

    whitespace: [
      [/[ \t\r\n]+/, "white"],
      [/;.*$/, "comment"]
    ],
  },
};

export const X86 = {
  MonarchDefinitions,
  LanguageConfiguration,
  CompletionItemProvider: {
    provideCompletionItems: function(model: IModel, position: IPosition) {
      return getCompletionItems();
    }
  },
  HoverProvider: {
    provideHover: function(model: IModel, position: IPosition) {
      return {
        range: new monaco.Range(1, 1, model.getLineCount(), model.getLineMaxColumn(model.getLineCount())),
        contents: [
          "**DETAILS**",
          { language: "html", value: "TODO" }
        ]
      };
    }
  }
};
