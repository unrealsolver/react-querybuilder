"use strict";
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const placeholderName = "~";
const defaultPlaceholderFieldName = placeholderName;
const defaultPlaceholderOperatorName = placeholderName;
const defaultJoinChar = ",";
const splitBy = (str, splitChar = defaultJoinChar) => typeof str === "string" ? str.split(`\\${splitChar}`).map((c) => c.split(splitChar)).reduce((prev, curr, idx) => {
  if (idx === 0)
    return curr;
  return [
    ...prev.slice(0, prev.length - 1),
    `${prev[prev.length - 1]}${splitChar}${curr[0]}`,
    ...curr.slice(1)
  ];
}, []) : [];
const trimIfString = (val) => typeof val === "string" ? val.trim() : val;
const toArray = (v) => (Array.isArray(v) ? v : typeof v === "string" ? splitBy(v, defaultJoinChar).filter((s) => !/^\s*$/.test(s)) : []).map(trimIfString);
const numericRegex = /^\s*[+-]?(\d+|\d*\.\d+|\d+\.\d*)([Ee][+-]?\d+)?\s*$/;
const mapSQLOperator = (op) => {
  switch (op.toLowerCase()) {
    case "null":
      return "is null";
    case "notnull":
      return "is not null";
    case "notin":
      return "not in";
    case "notbetween":
      return "not between";
    case "contains":
    case "beginswith":
    case "endswith":
      return "like";
    case "doesnotcontain":
    case "doesnotbeginwith":
    case "doesnotendwith":
      return "not like";
    default:
      return op;
  }
};
const mongoOperators = {
  "=": "$eq",
  "!=": "$ne",
  "<": "$lt",
  "<=": "$lte",
  ">": "$gt",
  ">=": "$gte",
  in: "$in",
  notIn: "$nin"
};
const celCombinatorMap = {
  and: "&&",
  or: "||"
};
const jsonLogicAdditionalOperators = {
  startsWith: (a, b) => a.startsWith(b),
  endsWith: (a, b) => a.endsWith(b)
};
const numerifyValues = (rg) => ({
  ...rg,
  rules: rg.rules.map((r) => {
    if (typeof r === "string") {
      return r;
    } else if ("rules" in r) {
      return numerifyValues(r);
    }
    let { value } = r;
    if (typeof value === "string" && numericRegex.test(value)) {
      value = parseFloat(value);
    }
    return { ...r, value };
  })
});
const isValidValue = (v) => typeof v === "string" && v.length > 0 || typeof v === "number" && !isNaN(v) || typeof v !== "string" && typeof v !== "number";
const shouldRenderAsNumber = (v, parseNumbers) => !!parseNumbers && (typeof v === "number" || typeof v === "bigint" || typeof v === "string" && numericRegex.test(v));
const isValueProcessorLegacy = (vp) => vp.length >= 3;
const shouldNegate$1 = (op) => /^(does)?not/i.test(op);
const defaultRuleProcessorCEL = ({ field, operator, value, valueSource }, { escapeQuotes, parseNumbers } = {}) => {
  const escapeDoubleQuotes = (v) => typeof v !== "string" || !escapeQuotes ? v : v.replaceAll(`"`, `\\"`);
  const valueIsField = valueSource === "field";
  const operatorTL = operator.replace(/^=$/, "==");
  const useBareValue = typeof value === "number" || typeof value === "boolean" || typeof value === "bigint" || shouldRenderAsNumber(value, parseNumbers);
  if (operatorTL === "<" || operatorTL === "<=" || operatorTL === "==" || operatorTL === "!=" || operatorTL === ">" || operatorTL === ">=") {
    return `${field} ${operatorTL} ${valueIsField || useBareValue ? trimIfString(value) : `"${escapeDoubleQuotes(value)}"`}`;
  } else if (operatorTL === "contains" || operatorTL === "doesNotContain") {
    const negate = shouldNegate$1(operatorTL) ? "!" : "";
    return `${negate}${field}.contains(${valueIsField ? trimIfString(value) : `"${escapeDoubleQuotes(value)}"`})`;
  } else if (operatorTL === "beginsWith" || operatorTL === "doesNotBeginWith") {
    const negate = shouldNegate$1(operatorTL) ? "!" : "";
    return `${negate}${field}.startsWith(${valueIsField ? trimIfString(value) : `"${escapeDoubleQuotes(value)}"`})`;
  } else if (operatorTL === "endsWith" || operatorTL === "doesNotEndWith") {
    const negate = shouldNegate$1(operatorTL) ? "!" : "";
    return `${negate}${field}.endsWith(${valueIsField ? trimIfString(value) : `"${escapeDoubleQuotes(value)}"`})`;
  } else if (operatorTL === "null") {
    return `${field} == null`;
  } else if (operatorTL === "notNull") {
    return `${field} != null`;
  } else if (operatorTL === "in" || operatorTL === "notIn") {
    const negate = shouldNegate$1(operatorTL);
    const valArray = toArray(value);
    if (valArray.length > 0) {
      return `${negate ? "!(" : ""}${field} in [${valArray.map(
        (val) => valueIsField || shouldRenderAsNumber(val, parseNumbers) ? `${trimIfString(val)}` : `"${escapeDoubleQuotes(val)}"`
      ).join(", ")}]${negate ? ")" : ""}`;
    } else {
      return "";
    }
  } else if (operatorTL === "between" || operatorTL === "notBetween") {
    const valArray = toArray(value);
    if (valArray.length >= 2 && !!valArray[0] && !!valArray[1]) {
      const [first, second] = valArray;
      const firstNum = shouldRenderAsNumber(first, true) ? parseFloat(first) : NaN;
      const secondNum = shouldRenderAsNumber(second, true) ? parseFloat(second) : NaN;
      let firstValue = isNaN(firstNum) ? valueIsField ? `${first}` : `"${escapeDoubleQuotes(first)}"` : firstNum;
      let secondValue = isNaN(secondNum) ? valueIsField ? `${second}` : `"${escapeDoubleQuotes(second)}"` : secondNum;
      if (firstValue === firstNum && secondValue === secondNum && secondNum < firstNum) {
        const tempNum = secondNum;
        secondValue = firstNum;
        firstValue = tempNum;
      }
      if (operator === "between") {
        return `(${field} >= ${firstValue} && ${field} <= ${secondValue})`;
      } else {
        return `(${field} < ${firstValue} || ${field} > ${secondValue})`;
      }
    } else {
      return "";
    }
  }
  return "";
};
const defaultRuleProcessorMongoDB = ({ field, operator, value, valueSource }, { parseNumbers } = {}) => {
  const escapeDoubleQuotes = (v) => typeof v !== "string" ? v : v.replaceAll("\\", "\\\\").replaceAll(`"`, `\\"`);
  const valueIsField = valueSource === "field";
  const useBareValue = typeof value === "number" || typeof value === "boolean" || typeof value === "bigint" || shouldRenderAsNumber(value, parseNumbers);
  if (operator === "=" && !valueIsField) {
    return `{"${field}":${useBareValue ? trimIfString(value) : `"${escapeDoubleQuotes(value)}"`}}`;
  } else if (operator === "<" || operator === "<=" || operator === "=" || operator === "!=" || operator === ">" || operator === ">=") {
    const mongoOperator = mongoOperators[operator];
    return valueIsField ? `{"$expr":{"${mongoOperator}":["$${field}","$${value}"]}}` : `{"${field}":{"${mongoOperator}":${useBareValue ? trimIfString(value) : `"${escapeDoubleQuotes(value)}"`}}}`;
  } else if (operator === "contains") {
    return valueIsField ? `{"$where":"this.${field}.includes(this.${value})"}` : `{"${field}":{"$regex":"${escapeDoubleQuotes(value)}"}}`;
  } else if (operator === "beginsWith") {
    return valueIsField ? `{"$where":"this.${field}.startsWith(this.${value})"}` : `{"${field}":{"$regex":"^${escapeDoubleQuotes(value)}"}}`;
  } else if (operator === "endsWith") {
    return valueIsField ? `{"$where":"this.${field}.endsWith(this.${value})"}` : `{"${field}":{"$regex":"${escapeDoubleQuotes(value)}$"}}`;
  } else if (operator === "doesNotContain") {
    return valueIsField ? `{"$where":"!this.${field}.includes(this.${value})"}` : `{"${field}":{"$not":{"$regex":"${escapeDoubleQuotes(value)}"}}}`;
  } else if (operator === "doesNotBeginWith") {
    return valueIsField ? `{"$where":"!this.${field}.startsWith(this.${value})"}` : `{"${field}":{"$not":{"$regex":"^${escapeDoubleQuotes(value)}"}}}`;
  } else if (operator === "doesNotEndWith") {
    return valueIsField ? `{"$where":"!this.${field}.endsWith(this.${value})"}` : `{"${field}":{"$not":{"$regex":"${escapeDoubleQuotes(value)}$"}}}`;
  } else if (operator === "null") {
    return `{"${field}":null}`;
  } else if (operator === "notNull") {
    return `{"${field}":{"$ne":null}}`;
  } else if (operator === "in" || operator === "notIn") {
    const valArray = toArray(value);
    if (valArray.length > 0) {
      return valueIsField ? `{"$where":"${operator === "notIn" ? "!" : ""}[${valArray.map((val) => `this.${val}`).join(",")}].includes(this.${field})"}` : `{"${field}":{"${mongoOperators[operator]}":[${valArray.map(
        (val) => shouldRenderAsNumber(val, parseNumbers) ? `${trimIfString(val)}` : `"${escapeDoubleQuotes(val)}"`
      ).join(",")}]}}`;
    } else {
      return "";
    }
  } else if (operator === "between" || operator === "notBetween") {
    const valArray = toArray(value);
    if (valArray.length >= 2 && isValidValue(valArray[0]) && isValidValue(valArray[1])) {
      const [first, second] = valArray;
      const firstNum = shouldRenderAsNumber(first, true) ? parseFloat(first) : NaN;
      const secondNum = shouldRenderAsNumber(second, true) ? parseFloat(second) : NaN;
      const firstValue = valueIsField || !isNaN(firstNum) ? `${first}` : `"${escapeDoubleQuotes(first)}"`;
      const secondValue = valueIsField || !isNaN(secondNum) ? `${second}` : `"${escapeDoubleQuotes(second)}"`;
      if (operator === "between") {
        return valueIsField ? `{"$and":[{"$expr":{"$gte":["$${field}","$${firstValue}"]}},{"$expr":{"$lte":["$${field}","$${secondValue}"]}}]}` : `{"${field}":{"$gte":${firstValue},"$lte":${secondValue}}}`;
      } else {
        return valueIsField ? `{"$or":[{"$expr":{"$lt":["$${field}","$${firstValue}"]}},{"$expr":{"$gt":["$${field}","$${secondValue}"]}}]}` : `{"$or":[{"${field}":{"$lt":${firstValue}}},{"${field}":{"$gt":${secondValue}}}]}`;
      }
    } else {
      return "";
    }
  }
  return "";
};
const shouldNegate = (op) => /^(does)?not/i.test(op);
const wrapInNegation = (clause, negate) => `${negate ? "!(" : ""}${clause}${negate ? ")" : ""}`;
const defaultRuleProcessorSpEL = ({ field, operator, value, valueSource }, { escapeQuotes, parseNumbers } = {}) => {
  const escapeSingleQuotes = (v) => typeof v !== "string" || !escapeQuotes ? v : v.replaceAll(`'`, `\\'`);
  const valueIsField = valueSource === "field";
  const operatorTL = operator.replace(/^=$/, "==");
  const useBareValue = typeof value === "number" || typeof value === "boolean" || typeof value === "bigint" || shouldRenderAsNumber(value, parseNumbers);
  if (operatorTL === "<" || operatorTL === "<=" || operatorTL === "==" || operatorTL === "!=" || operatorTL === ">" || operatorTL === ">=") {
    return `${field} ${operatorTL} ${valueIsField || useBareValue ? trimIfString(value) : `'${escapeSingleQuotes(value)}'`}`;
  } else if (operatorTL === "contains" || operatorTL === "doesNotContain") {
    return wrapInNegation(
      `${field} matches ${valueIsField || useBareValue ? trimIfString(value) : `'${escapeSingleQuotes(value)}'`}`,
      shouldNegate(operatorTL)
    );
  } else if (operatorTL === "beginsWith" || operatorTL === "doesNotBeginWith") {
    const valueTL = valueIsField ? `'^'.concat(${trimIfString(value)})` : `'${typeof value === "string" && !value.startsWith("^") || useBareValue ? "^" : ""}${escapeSingleQuotes(value)}'`;
    return wrapInNegation(`${field} matches ${valueTL}`, shouldNegate(operatorTL));
  } else if (operatorTL === "endsWith" || operatorTL === "doesNotEndWith") {
    const valueTL = valueIsField ? `${trimIfString(value)}.concat('$')` : `'${escapeSingleQuotes(value)}${typeof value === "string" && !value.endsWith("$") || useBareValue ? "$" : ""}'`;
    return wrapInNegation(`${field} matches ${valueTL}`, shouldNegate(operatorTL));
  } else if (operatorTL === "null") {
    return `${field} == null`;
  } else if (operatorTL === "notNull") {
    return `${field} != null`;
  } else if (operatorTL === "in" || operatorTL === "notIn") {
    const negate = shouldNegate(operatorTL) ? "!" : "";
    const valArray = toArray(value);
    if (valArray.length > 0) {
      return `${negate}(${valArray.map(
        (val) => `${field} == ${valueIsField || shouldRenderAsNumber(val, parseNumbers) ? `${trimIfString(val)}` : `'${escapeSingleQuotes(val)}'`}`
      ).join(" or ")})`;
    } else {
      return "";
    }
  } else if (operatorTL === "between" || operatorTL === "notBetween") {
    const valArray = toArray(value);
    if (valArray.length >= 2 && !!valArray[0] && !!valArray[1]) {
      const [first, second] = valArray;
      const firstNum = shouldRenderAsNumber(first, true) ? parseFloat(first) : NaN;
      const secondNum = shouldRenderAsNumber(second, true) ? parseFloat(second) : NaN;
      let firstValue = isNaN(firstNum) ? valueIsField ? `${first}` : `'${escapeSingleQuotes(first)}'` : firstNum;
      let secondValue = isNaN(secondNum) ? valueIsField ? `${second}` : `'${escapeSingleQuotes(second)}'` : secondNum;
      if (firstValue === firstNum && secondValue === secondNum && secondNum < firstNum) {
        const tempNum = secondNum;
        secondValue = firstNum;
        firstValue = tempNum;
      }
      if (operator === "between") {
        return `(${field} >= ${firstValue} and ${field} <= ${secondValue})`;
      } else {
        return `(${field} < ${firstValue} or ${field} > ${secondValue})`;
      }
    } else {
      return "";
    }
  }
  return "";
};
const defaultValueProcessorByRule = ({ operator, value, valueSource }, { escapeQuotes, parseNumbers } = {}) => {
  const escapeSingleQuotes = (v) => typeof v !== "string" || !escapeQuotes ? v : v.replaceAll(`'`, `''`);
  const valueIsField = valueSource === "field";
  const operatorLowerCase = operator.toLowerCase();
  if (operatorLowerCase === "null" || operatorLowerCase === "notnull") {
    return "";
  } else if (operatorLowerCase === "in" || operatorLowerCase === "notin") {
    const valArray = toArray(value);
    if (valArray.length > 0) {
      return `(${valArray.map(
        (v) => valueIsField || shouldRenderAsNumber(v, parseNumbers) ? `${trimIfString(v)}` : `'${escapeSingleQuotes(v)}'`
      ).join(", ")})`;
    }
    return "";
  } else if (operatorLowerCase === "between" || operatorLowerCase === "notbetween") {
    const valArray = toArray(value);
    if (valArray.length >= 2 && isValidValue(valArray[0]) && isValidValue(valArray[1])) {
      const [first, second] = valArray;
      return valueIsField || shouldRenderAsNumber(first, parseNumbers) && shouldRenderAsNumber(second, parseNumbers) ? `${trimIfString(first)} and ${trimIfString(second)}` : `'${escapeSingleQuotes(first)}' and '${escapeSingleQuotes(second)}'`;
    }
    return "";
  } else if (operatorLowerCase === "contains" || operatorLowerCase === "doesnotcontain") {
    return valueIsField ? `'%' || ${value} || '%'` : `'%${escapeSingleQuotes(value)}%'`;
  } else if (operatorLowerCase === "beginswith" || operatorLowerCase === "doesnotbeginwith") {
    return valueIsField ? `${value} || '%'` : `'${escapeSingleQuotes(value)}%'`;
  } else if (operatorLowerCase === "endswith" || operatorLowerCase === "doesnotendwith") {
    return valueIsField ? `'%' || ${value}` : `'%${escapeSingleQuotes(value)}'`;
  } else if (typeof value === "boolean") {
    return `${value}`.toUpperCase();
  }
  return valueIsField || shouldRenderAsNumber(value, parseNumbers) ? `${trimIfString(value)}` : `'${escapeSingleQuotes(value)}'`;
};
const convertOperator = (op) => op.replace(/^(=)$/, "$1=").replace(/^notNull$/i, "!=").replace(/^null$/i, "==");
const negateIfNotOp = (op, jsonRule) => /^(does)?not/i.test(op) ? { "!": jsonRule } : jsonRule;
const defaultRuleProcessorJsonLogic = ({ field, operator, value, valueSource }, { parseNumbers } = {}) => {
  const valueIsField = valueSource === "field";
  const fieldObject = { var: field };
  const fieldOrNumberRenderer = (v) => valueIsField ? { var: `${v}` } : shouldRenderAsNumber(v, parseNumbers) ? parseFloat(v) : v;
  if (operator === "<" || operator === "<=" || operator === "=" || operator === "!=" || operator === ">" || operator === ">=") {
    return {
      [convertOperator(operator)]: [fieldObject, fieldOrNumberRenderer(value)]
    };
  } else if (operator === "null" || operator === "notNull") {
    return {
      [`${operator === "notNull" ? "!" : "="}=`]: [fieldObject, null]
    };
  } else if (operator === "in" || operator === "notIn") {
    const valArray = toArray(value).map(fieldOrNumberRenderer);
    if (valArray.length > 0) {
      const jsonRule = { in: [fieldObject, valArray] };
      return negateIfNotOp(operator, jsonRule);
    }
    return false;
  } else if (operator === "between" || operator === "notBetween") {
    const valArray = toArray(value);
    if (valArray.length >= 2 && isValidValue(valArray[0]) && isValidValue(valArray[1])) {
      let [first, second] = valArray;
      if (!valueIsField && shouldRenderAsNumber(first, true) && shouldRenderAsNumber(second, true)) {
        const firstNum = parseFloat(first);
        const secondNum = parseFloat(second);
        if (secondNum < firstNum) {
          const tempNum = secondNum;
          second = firstNum;
          first = tempNum;
        } else {
          first = firstNum;
          second = secondNum;
        }
      } else if (valueIsField) {
        first = { var: first };
        second = { var: second };
      }
      const jsonRule = { "<=": [first, fieldObject, second] };
      return negateIfNotOp(operator, jsonRule);
    }
    return false;
  } else if (operator === "contains" || operator === "doesNotContain") {
    const jsonRule = {
      in: [fieldOrNumberRenderer(value), fieldObject]
    };
    return negateIfNotOp(operator, jsonRule);
  } else if (operator === "beginsWith" || operator === "doesNotBeginWith") {
    const jsonRule = {
      startsWith: [fieldObject, fieldOrNumberRenderer(value)]
    };
    return negateIfNotOp(operator, jsonRule);
  } else if (operator === "endsWith" || operator === "doesNotEndWith") {
    const jsonRule = {
      endsWith: [fieldObject, fieldOrNumberRenderer(value)]
    };
    return negateIfNotOp(operator, jsonRule);
  }
  return false;
};
const uniqByName = (originalArray) => {
  const names = /* @__PURE__ */ new Set();
  const newArray = [];
  originalArray.forEach((el) => {
    if (!names.has(el.name)) {
      names.add(el.name);
      newArray.push(el);
    }
  });
  return newArray;
};
const processRuleOrStringOrRuleGroupIC = (r) => typeof r === "object" && "rules" in r ? generateRuleGroupICWithConsistentCombinators(r) : r;
const generateRuleGroupICWithConsistentCombinators = (rg) => {
  const returnArray = [];
  const push = (r) => returnArray.push(processRuleOrStringOrRuleGroupIC(r));
  let startIndex = 0;
  for (let i = 0; i < rg.rules.length; i += 2) {
    if (rg.rules.length === 1) {
      push(rg.rules[0]);
    } else if (rg.rules[i + 1] === "and") {
      startIndex = i;
      let j = 1;
      while (rg.rules[startIndex + j] === "and") {
        i += 2;
        j += 2;
      }
      returnArray.push({
        rules: rg.rules.slice(startIndex, i + 1).map(processRuleOrStringOrRuleGroupIC)
      });
      i -= 2;
    } else if (rg.rules[i + 1] === "or") {
      if (i === 0 || i === rg.rules.length - 3) {
        if (i === 0 || rg.rules[i - 1] === "or") {
          push(rg.rules[i]);
        }
        push(rg.rules[i + 1]);
        if (i === rg.rules.length - 3) {
          push(rg.rules[i + 2]);
        }
      } else {
        if (rg.rules[i - 1] === "and") {
          push(rg.rules[i + 1]);
        } else {
          push(rg.rules[i]);
          push(rg.rules[i + 1]);
        }
      }
    }
  }
  if (returnArray.length === 1 && typeof returnArray[0] === "object" && "rules" in returnArray[0]) {
    return { ...rg, ...returnArray[0] };
  }
  return { ...rg, rules: returnArray };
};
const convertFromIC = (rg) => {
  const processedRG = generateRuleGroupICWithConsistentCombinators(rg);
  const rulesAsMixedList = processedRG.rules.map(
    (r) => typeof r === "string" || !("rules" in r) ? r : convertFromIC(r)
  );
  const combinator = rulesAsMixedList.length < 2 ? "and" : rulesAsMixedList[1];
  const rules = rulesAsMixedList.filter((r) => typeof r !== "string");
  return { ...processedRG, combinator, rules };
};
const isPojo = (obj) => obj === null || typeof obj !== "object" ? false : Object.getPrototypeOf(obj) === Object.prototype;
const isValidationResult = (vr) => isPojo(vr) && typeof vr.valid === "boolean";
const isRuleOrGroupValid = (rg, validationResult, validator) => {
  if (typeof validationResult === "boolean") {
    return validationResult;
  }
  if (isValidationResult(validationResult)) {
    return validationResult.valid;
  }
  if (typeof validator === "function" && !("rules" in rg)) {
    const vr = validator(rg);
    if (typeof vr === "boolean") {
      return vr;
    }
    if (isValidationResult(vr)) {
      return vr.valid;
    }
  }
  return true;
};
function formatQuery(ruleGroup, options = {}) {
  let format = "json";
  let valueProcessorInternal = defaultValueProcessorByRule;
  let ruleProcessorInternal = null;
  let quoteFieldNamesWith = "";
  let validator = () => true;
  let fields = [];
  let validationMap = {};
  let fallbackExpression = "";
  let paramPrefix = ":";
  let parseNumbers = false;
  let placeholderFieldName = defaultPlaceholderFieldName;
  let placeholderOperatorName = defaultPlaceholderOperatorName;
  if (typeof options === "string") {
    format = options.toLowerCase();
    if (format === "mongodb") {
      ruleProcessorInternal = defaultRuleProcessorMongoDB;
    } else if (format === "cel") {
      ruleProcessorInternal = defaultRuleProcessorCEL;
    } else if (format === "spel") {
      ruleProcessorInternal = defaultRuleProcessorSpEL;
    } else if (format === "jsonlogic") {
      ruleProcessorInternal = defaultRuleProcessorJsonLogic;
    }
  } else {
    format = (options.format ?? "json").toLowerCase();
    const { valueProcessor = null, ruleProcessor = null } = options;
    if (typeof ruleProcessor === "function") {
      ruleProcessorInternal = ruleProcessor;
    }
    valueProcessorInternal = typeof valueProcessor === "function" ? (r) => isValueProcessorLegacy(valueProcessor) ? valueProcessor(r.field, r.operator, r.value, r.valueSource) : valueProcessor(r, { parseNumbers }) : format === "mongodb" ? ruleProcessorInternal ?? defaultRuleProcessorMongoDB : format === "cel" ? ruleProcessorInternal ?? defaultRuleProcessorCEL : format === "spel" ? ruleProcessorInternal ?? defaultRuleProcessorSpEL : format === "jsonlogic" ? ruleProcessorInternal ?? defaultRuleProcessorJsonLogic : defaultValueProcessorByRule;
    quoteFieldNamesWith = options.quoteFieldNamesWith ?? "";
    validator = options.validator ?? (() => true);
    fields = options.fields ?? [];
    fallbackExpression = options.fallbackExpression ?? "";
    paramPrefix = options.paramPrefix ?? ":";
    parseNumbers = !!options.parseNumbers;
    placeholderFieldName = options.placeholderFieldName ?? defaultPlaceholderFieldName;
    placeholderOperatorName = options.placeholderOperatorName ?? defaultPlaceholderOperatorName;
  }
  if (!fallbackExpression) {
    fallbackExpression = format === "mongodb" ? '"$and":[{"$expr":true}]' : format === "cel" || format === "spel" ? "1 == 1" : "(1 = 1)";
  }
  if (format === "json" || format === "json_without_ids") {
    const rg = parseNumbers ? numerifyValues(ruleGroup) : ruleGroup;
    if (format === "json") {
      return JSON.stringify(rg, null, 2);
    } else {
      return JSON.stringify(rg, [
        "rules",
        "field",
        "value",
        "operator",
        "combinator",
        "not",
        "valueSource"
      ]);
    }
  } else {
    if (typeof validator === "function") {
      const validationResult = validator(ruleGroup);
      if (typeof validationResult === "boolean") {
        if (validationResult === false) {
          return format === "parameterized" ? { sql: fallbackExpression, params: [] } : format === "parameterized_named" ? { sql: fallbackExpression, params: {} } : format === "mongodb" ? `{${fallbackExpression}}` : format === "jsonlogic" ? false : fallbackExpression;
        }
      } else {
        validationMap = validationResult;
      }
    }
    const validatorMap = {};
    const uniqueFields = uniqByName(fields);
    uniqueFields.forEach((f) => {
      if (typeof f.validator === "function") {
        validatorMap[f.name] = f.validator;
      }
    });
    const validateRule = (rule) => {
      let validationResult = void 0;
      let fieldValidator = void 0;
      if (rule.id) {
        validationResult = validationMap[rule.id];
      }
      if (fields.length) {
        const fieldArr = fields.filter((f) => f.name === rule.field);
        if (fieldArr.length) {
          const field = fieldArr[0];
          if (typeof field.validator === "function") {
            fieldValidator = field.validator;
          }
        }
      }
      return [validationResult, fieldValidator];
    };
    if (format === "sql" || format === "parameterized" || format === "parameterized_named") {
      const parameterized = format === "parameterized";
      const parameterized_named = format === "parameterized_named";
      const params = [];
      const params_named = {};
      const fieldParamIndexes = {};
      const getNextNamedParam = (field) => {
        fieldParamIndexes[field] = (fieldParamIndexes[field] ?? 0) + 1;
        return `${field}_${fieldParamIndexes[field]}`;
      };
      const processRule = (rule) => {
        const [validationResult, fieldValidator] = validateRule(rule);
        if (!isRuleOrGroupValid(rule, validationResult, fieldValidator) || rule.field === placeholderFieldName || rule.operator === placeholderOperatorName) {
          return "";
        }
        const value = valueProcessorInternal(rule, {
          parseNumbers,
          escapeQuotes: format === "sql" && (rule.valueSource ?? "value") === "value"
        });
        const operator = mapSQLOperator(rule.operator);
        if ((parameterized || parameterized_named) && (rule.valueSource ?? "value") === "value") {
          if (operator.toLowerCase() === "is null" || operator.toLowerCase() === "is not null") {
            return `${quoteFieldNamesWith}${rule.field}${quoteFieldNamesWith} ${operator}`;
          } else if (operator.toLowerCase() === "in" || operator.toLowerCase() === "not in") {
            if (value) {
              const splitValue = toArray(rule.value);
              if (parameterized) {
                splitValue.forEach(
                  (v) => params.push(shouldRenderAsNumber(v, parseNumbers) ? parseFloat(v) : v)
                );
                return `${quoteFieldNamesWith}${rule.field}${quoteFieldNamesWith} ${operator} (${splitValue.map(() => "?").join(", ")})`;
              }
              const inParams = [];
              splitValue.forEach((v) => {
                const thisParamName = getNextNamedParam(rule.field);
                inParams.push(`${paramPrefix}${thisParamName}`);
                params_named[thisParamName] = shouldRenderAsNumber(v, parseNumbers) ? parseFloat(v) : v;
              });
              return `${quoteFieldNamesWith}${rule.field}${quoteFieldNamesWith} ${operator} (${inParams.join(", ")})`;
            } else {
              return "";
            }
          } else if (operator.toLowerCase() === "between" || operator.toLowerCase() === "not between") {
            if (value) {
              const valArray = toArray(rule.value);
              const [first, second] = valArray.slice(0, 2).map((v) => shouldRenderAsNumber(v, parseNumbers) ? parseFloat(v) : v);
              if (parameterized) {
                params.push(first);
                params.push(second);
                return `${quoteFieldNamesWith}${rule.field}${quoteFieldNamesWith} ${operator} ? and ?`;
              }
              const firstParamName = getNextNamedParam(rule.field);
              const secondParamName = getNextNamedParam(rule.field);
              params_named[firstParamName] = first;
              params_named[secondParamName] = second;
              return `${quoteFieldNamesWith}${rule.field}${quoteFieldNamesWith} ${operator} ${paramPrefix}${firstParamName} and ${paramPrefix}${secondParamName}`;
            } else {
              return "";
            }
          }
          let paramValue = rule.value;
          if (typeof rule.value === "string") {
            if (shouldRenderAsNumber(rule.value, parseNumbers)) {
              paramValue = parseFloat(rule.value);
            } else {
              paramValue = /^'.*'$/g.test(value) ? value.replace(/(^'|'$)/g, "") : value;
            }
          }
          let paramName = "";
          if (parameterized) {
            params.push(paramValue);
          } else {
            paramName = getNextNamedParam(rule.field);
            params_named[paramName] = paramValue;
          }
          return `${quoteFieldNamesWith}${rule.field}${quoteFieldNamesWith} ${operator} ${parameterized ? "?" : `${paramPrefix}${paramName}`}`.trim();
        } else {
          const operatorLowerCase = operator.toLowerCase();
          if ((operatorLowerCase === "in" || operatorLowerCase === "not in" || operatorLowerCase === "between" || operatorLowerCase === "not between") && !value) {
            return "";
          }
        }
        return `${quoteFieldNamesWith}${rule.field}${quoteFieldNamesWith} ${operator} ${value}`.trim();
      };
      const processRuleGroup = (rg, outermost) => {
        if (!isRuleOrGroupValid(rg, validationMap[rg.id ?? ""])) {
          return outermost ? fallbackExpression : "";
        }
        const processedRules = rg.rules.map((rule) => {
          if (typeof rule === "string") {
            return rule;
          }
          if ("rules" in rule) {
            return processRuleGroup(rule);
          }
          return processRule(rule);
        });
        if (processedRules.length === 0) {
          return fallbackExpression;
        }
        return `${rg.not ? "NOT " : ""}(${processedRules.filter(Boolean).join("combinator" in rg ? ` ${rg.combinator} ` : " ")})`;
      };
      if (parameterized) {
        return { sql: processRuleGroup(ruleGroup, true), params };
      } else if (parameterized_named) {
        return { sql: processRuleGroup(ruleGroup, true), params: params_named };
      } else {
        return processRuleGroup(ruleGroup, true);
      }
    } else if (format === "mongodb") {
      const processRuleGroup = (rg, outermost) => {
        if (!isRuleOrGroupValid(rg, validationMap[rg.id ?? ""])) {
          return outermost ? fallbackExpression : "";
        }
        const combinator = `"$${rg.combinator.toLowerCase()}"`;
        let hasChildRules = false;
        const expressions = rg.rules.map((rule) => {
          if ("rules" in rule) {
            const processedRuleGroup = processRuleGroup(rule);
            if (processedRuleGroup) {
              hasChildRules = true;
              return /^\{.+\}$/.test(processedRuleGroup) ? processedRuleGroup : `{${processedRuleGroup}}`;
            }
            return "";
          }
          const [validationResult, fieldValidator] = validateRule(rule);
          if (!isRuleOrGroupValid(rule, validationResult, fieldValidator) || rule.field === placeholderFieldName || rule.operator === placeholderOperatorName) {
            return "";
          }
          return (ruleProcessorInternal ?? valueProcessorInternal)(rule, { parseNumbers });
        }).filter(Boolean);
        return expressions.length > 0 ? expressions.length === 1 && !hasChildRules ? expressions[0] : `${combinator}:[${expressions.join(",")}]` : fallbackExpression;
      };
      const rgStandard = "combinator" in ruleGroup ? ruleGroup : convertFromIC(ruleGroup);
      const processedQuery = processRuleGroup(rgStandard, true);
      return /^\{.+\}$/.test(processedQuery) ? processedQuery : `{${processedQuery}}`;
    } else if (format === "cel") {
      const processRuleGroup = (rg, outermost) => {
        if (!isRuleOrGroupValid(rg, validationMap[rg.id ?? ""])) {
          return outermost ? fallbackExpression : "";
        }
        const expression = rg.rules.map((rule) => {
          if (typeof rule === "string") {
            return celCombinatorMap[rule];
          }
          if ("rules" in rule) {
            return processRuleGroup(rule);
          }
          const [validationResult, fieldValidator] = validateRule(rule);
          if (!isRuleOrGroupValid(rule, validationResult, fieldValidator) || rule.field === placeholderFieldName || rule.operator === placeholderOperatorName) {
            return "";
          }
          return (ruleProcessorInternal ?? valueProcessorInternal)(rule, {
            parseNumbers,
            escapeQuotes: (rule.valueSource ?? "value") === "value"
          });
        }).filter(Boolean).join(
          "combinator" in rg ? ` ${celCombinatorMap[rg.combinator]} ` : " "
        );
        const [prefix, suffix] = rg.not || !outermost ? [`${rg.not ? "!" : ""}(`, ")"] : ["", ""];
        return expression ? `${prefix}${expression}${suffix}` : fallbackExpression;
      };
      return processRuleGroup(ruleGroup, true);
    } else if (format === "spel") {
      const processRuleGroup = (rg, outermost) => {
        if (!isRuleOrGroupValid(rg, validationMap[rg.id ?? ""])) {
          return outermost ? fallbackExpression : "";
        }
        const expression = rg.rules.map((rule) => {
          if (typeof rule === "string") {
            return rule;
          }
          if ("rules" in rule) {
            return processRuleGroup(rule);
          }
          const [validationResult, fieldValidator] = validateRule(rule);
          if (!isRuleOrGroupValid(rule, validationResult, fieldValidator) || rule.field === placeholderFieldName || rule.operator === placeholderOperatorName) {
            return "";
          }
          return (ruleProcessorInternal ?? valueProcessorInternal)(rule, {
            parseNumbers,
            escapeQuotes: (rule.valueSource ?? "value") === "value"
          });
        }).filter(Boolean).join("combinator" in rg ? ` ${rg.combinator} ` : " ");
        const [prefix, suffix] = rg.not || !outermost ? [`${rg.not ? "!" : ""}(`, ")"] : ["", ""];
        return expression ? `${prefix}${expression}${suffix}` : fallbackExpression;
      };
      return processRuleGroup(ruleGroup, true);
    } else if (format === "jsonlogic") {
      const query = "combinator" in ruleGroup ? ruleGroup : convertFromIC(ruleGroup);
      const processRuleGroup = (rg) => {
        if (!isRuleOrGroupValid(rg, validationMap[rg.id ?? ""])) {
          return false;
        }
        const processedRules = rg.rules.map((rule) => {
          if ("rules" in rule) {
            return processRuleGroup(rule);
          }
          const [validationResult, fieldValidator] = validateRule(rule);
          if (!isRuleOrGroupValid(rule, validationResult, fieldValidator) || rule.field === placeholderFieldName || rule.operator === placeholderOperatorName) {
            return false;
          }
          return (ruleProcessorInternal ?? valueProcessorInternal)(rule, { parseNumbers });
        }).filter(Boolean);
        if (processedRules.length === 0) {
          return false;
        }
        const jsonRuleGroup = processedRules.length === 1 ? processedRules[0] : {
          [rg.combinator]: processedRules
        };
        return rg.not ? { "!": jsonRuleGroup } : jsonRuleGroup;
      };
      return processRuleGroup(query);
    } else {
      return "";
    }
  }
}
const internalValueProcessors = {
  default: defaultValueProcessorByRule,
  mongodb: defaultRuleProcessorMongoDB,
  cel: defaultRuleProcessorCEL,
  spel: defaultRuleProcessorSpEL
};
const generateValueProcessor = (format) => (field, operator, value, valueSource) => internalValueProcessors[format](
  { field, operator, value, valueSource },
  { parseNumbers: false }
);
const defaultValueProcessor = generateValueProcessor("default");
const defaultMongoDBValueProcessor = generateValueProcessor("mongodb");
const defaultCELValueProcessor = generateValueProcessor("cel");
const defaultSpELValueProcessor = generateValueProcessor("spel");
const defaultValueProcessorCELByRule = defaultRuleProcessorCEL;
const defaultValueProcessorMongoDBByRule = defaultRuleProcessorMongoDB;
const defaultValueProcessorSpELByRule = defaultRuleProcessorSpEL;
exports.defaultCELValueProcessor = defaultCELValueProcessor;
exports.defaultMongoDBValueProcessor = defaultMongoDBValueProcessor;
exports.defaultRuleProcessorCEL = defaultRuleProcessorCEL;
exports.defaultRuleProcessorJsonLogic = defaultRuleProcessorJsonLogic;
exports.defaultRuleProcessorMongoDB = defaultRuleProcessorMongoDB;
exports.defaultRuleProcessorSpEL = defaultRuleProcessorSpEL;
exports.defaultSpELValueProcessor = defaultSpELValueProcessor;
exports.defaultValueProcessor = defaultValueProcessor;
exports.defaultValueProcessorByRule = defaultValueProcessorByRule;
exports.defaultValueProcessorCELByRule = defaultValueProcessorCELByRule;
exports.defaultValueProcessorMongoDBByRule = defaultValueProcessorMongoDBByRule;
exports.defaultValueProcessorSpELByRule = defaultValueProcessorSpELByRule;
exports.formatQuery = formatQuery;
exports.jsonLogicAdditionalOperators = jsonLogicAdditionalOperators;
