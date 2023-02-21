/**
 * Add the schema to the schema index file
 */
import { AnswersType } from ".";
import { injectLine } from "../utils/inject-line";
import { prettierFile } from "../utils/prettier-file";
import { formatName } from "./format-name";
import {
  getModulePageQuery,
  getModulePageQueryImport,
} from "./templates/module-page-query";

const fs = require("fs");

export function injectQuery(
  answers: Pick<AnswersType, "moduleName">,
  WRITE = false,
) {
  let { pascalName, lowerName } = formatName(answers.moduleName);

  const filePath = `${__dirname}/../../queries/page.query.ts`;
  let lines = fs.readFileSync(filePath).toString().split("\n");

  lines.push(getModulePageQueryImport({ pascalName, lowerName }));
  lines = injectLine({
    addition: getModulePageQuery({ pascalName, lowerName }),
    lines,
    needle: '"modules":',
    adjustLine: -3,
  });

  lines = lines.join("\n");

  if (WRITE) {
    fs.writeFileSync(filePath, lines);
    prettierFile(filePath);
  }
  return lines;
}
