"use strict";
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const defaultOperatorNegationMap = {
  "=": "!=",
  "!=": "=",
  "<": ">=",
  "<=": ">",
  ">": "<=",
  ">=": "<",
  beginsWith: "doesNotBeginWith",
  doesNotBeginWith: "beginsWith",
  endsWith: "doesNotEndWith",
  doesNotEndWith: "endsWith",
  contains: "doesNotContain",
  doesNotContain: "contains",
  between: "notBetween",
  notBetween: "between",
  in: "notIn",
  notIn: "in",
  notNull: "null",
  null: "notNull"
};
const isRuleGroup = (rg) => typeof rg === "object" && "rules" in rg && Array.isArray(rg.rules);
const isRuleGroupType = (rg) => isRuleGroup(rg) && "combinator" in rg;
const convertToIC = (rg) => {
  const { combinator, ...queryWithoutCombinator } = rg;
  const rules = [];
  rg.rules.forEach((r, idx, arr) => {
    if ("rules" in r) {
      rules.push(convertToIC(r));
    } else {
      rules.push(r);
    }
    if (idx < arr.length - 1) {
      rules.push(combinator);
    }
  });
  return { ...queryWithoutCombinator, rules };
};
const objectKeys = (obj) => Object.keys(obj);
const isOptionGroupArray = (arr) => Array.isArray(arr) && arr.length > 0 && "options" in arr[0];
const filterFieldsByComparator = (field, fields, operator) => {
  if (!field.comparator) {
    const filterOutSameName = (f) => f.name !== field.name;
    if (isOptionGroupArray(fields)) {
      return fields.map((og) => ({
        ...og,
        options: og.options.filter(filterOutSameName)
      }));
    }
    return fields.filter(filterOutSameName);
  }
  const filterByComparator = (fieldToCompare) => {
    if (field.name === fieldToCompare.name) {
      return false;
    }
    if (typeof field.comparator === "string") {
      return field[field.comparator] === fieldToCompare[field.comparator];
    }
    return field.comparator(fieldToCompare, operator);
  };
  if (isOptionGroupArray(fields)) {
    return fields.map((og) => ({ ...og, options: og.options.filter(filterByComparator) })).filter((og) => og.options.length > 0);
  }
  return fields.filter(filterByComparator);
};
const getValueSourcesUtil = (fieldData, operator, getValueSources) => {
  const fd = fieldData ?? {};
  if (fd.valueSources) {
    if (typeof fd.valueSources === "function") {
      return fd.valueSources(operator);
    }
    return fd.valueSources;
  }
  if (getValueSources) {
    const vals = getValueSources(fd.name, operator);
    if (vals)
      return vals;
  }
  return ["value"];
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
const isPojo = (obj) => obj === null || typeof obj !== "object" ? false : Object.getPrototypeOf(obj) === Object.prototype;
const getFieldsArray = (fields) => {
  let fieldsFlat = [];
  const fieldsArray = !fields ? [] : Array.isArray(fields) ? fields : Object.keys(fields).map((fld) => ({ ...fields[fld], name: fld })).sort((a, b) => a.label.localeCompare(b.label));
  if (isOptionGroupArray(fieldsArray)) {
    fieldsFlat = uniqByName(fieldsFlat.concat(...fieldsArray.map((opt) => opt.options)));
  } else {
    fieldsFlat = uniqByName(fieldsArray);
  }
  return fieldsFlat;
};
function fieldIsValidUtil({
  fieldsFlat,
  fieldName,
  operator,
  subordinateFieldName,
  getValueSources
}) {
  if (fieldsFlat.length === 0)
    return true;
  let valid = false;
  const primaryField = fieldsFlat.find((ff) => ff.name === fieldName);
  if (primaryField) {
    if (!subordinateFieldName && operator !== "notNull" && operator !== "null" && !getValueSourcesUtil(primaryField, operator, getValueSources).some((vs) => vs === "value")) {
      valid = false;
    } else {
      valid = true;
    }
    if (valid && !!subordinateFieldName) {
      if (getValueSourcesUtil(primaryField, operator, getValueSources).some((vs) => vs === "field") && fieldName !== subordinateFieldName) {
        const validSubordinateFields = filterFieldsByComparator(
          primaryField,
          fieldsFlat,
          operator
        );
        if (!validSubordinateFields.find((vsf) => vsf.name === subordinateFieldName)) {
          valid = false;
        }
      } else {
        valid = false;
      }
    }
  }
  return valid;
}
const isJsonLogicVar = (logic) => isPojo(logic) && "var" in logic;
const isRQBJsonLogicVar = (logic) => isJsonLogicVar(logic) && typeof logic.var === "string";
const isJsonLogicEqual = (logic) => isPojo(logic) && "==" in logic;
const isJsonLogicStrictEqual = (logic) => isPojo(logic) && "===" in logic;
const isJsonLogicNotEqual = (logic) => isPojo(logic) && "!=" in logic;
const isJsonLogicStrictNotEqual = (logic) => isPojo(logic) && "!==" in logic;
const isJsonLogicNegation = (logic) => isPojo(logic) && "!" in logic;
const isJsonLogicDoubleNegation = (logic) => isPojo(logic) && "!!" in logic;
const isJsonLogicOr = (logic) => isPojo(logic) && "or" in logic;
const isJsonLogicAnd = (logic) => isPojo(logic) && "and" in logic;
const isJsonLogicGreaterThan = (logic) => isPojo(logic) && ">" in logic;
const isJsonLogicGreaterThanOrEqual = (logic) => isPojo(logic) && ">=" in logic;
const isJsonLogicLessThan = (logic) => isPojo(logic) && "<" in logic && logic["<"].length === 2;
const isJsonLogicLessThanOrEqual = (logic) => isPojo(logic) && "<=" in logic && logic["<="].length === 2;
const isJsonLogicInArray = (logic) => isPojo(logic) && "in" in logic && Array.isArray(logic.in[1]);
const isJsonLogicInString = (logic) => isPojo(logic) && "in" in logic && !Array.isArray(logic.in[1]);
const isJsonLogicBetweenExclusive = (logic) => isPojo(logic) && "<" in logic && Array.isArray(logic["<"]) && logic["<"].length === 3;
const isJsonLogicBetweenInclusive = (logic) => isPojo(logic) && "<=" in logic && Array.isArray(logic["<="]) && logic["<="].length === 3;
const isRQBJsonLogicStartsWith = (logic) => isPojo(logic) && "startsWith" in logic;
const isRQBJsonLogicEndsWith = (logic) => isPojo(logic) && "endsWith" in logic;
const emptyRuleGroup = { combinator: "and", rules: [] };
function parseJsonLogic(rqbJsonLogic, options = {}) {
  const fieldsFlat = getFieldsArray(options.fields);
  const { getValueSources, listsAsArrays, jsonLogicOperations } = options;
  const fieldIsValid = (fieldName, operator, subordinateFieldName) => fieldIsValidUtil({
    fieldName,
    fieldsFlat,
    operator,
    subordinateFieldName,
    getValueSources
  });
  function processLogic(logic, outermost) {
    if (outermost && typeof logic !== "object") {
      return false;
    }
    const key = Object.keys(logic)[0];
    const keyValue = logic[key];
    if (isJsonLogicAnd(logic)) {
      return {
        combinator: "and",
        rules: logic.and.map((l) => processLogic(l)).filter(Boolean)
      };
    } else if (isJsonLogicOr(logic)) {
      return {
        combinator: "or",
        rules: logic.or.map((l) => processLogic(l)).filter(Boolean)
      };
    } else if (isJsonLogicNegation(logic)) {
      const rule2 = processLogic(logic["!"]);
      if (rule2) {
        if (!isRuleGroupType(rule2) && (rule2.operator === "between" || rule2.operator === "in" || rule2.operator === "contains" || rule2.operator === "beginsWith" || rule2.operator === "endsWith")) {
          return { ...rule2, operator: defaultOperatorNegationMap[rule2.operator] };
        } else if (isJsonLogicBetweenExclusive(logic["!"]) && isRuleGroupType(rule2)) {
          return { ...rule2, not: true };
        }
        return { combinator: "and", rules: [rule2], not: true };
      }
      return false;
    } else if (isJsonLogicDoubleNegation(logic)) {
      const rule2 = processLogic(logic["!!"]);
      return rule2 || false;
    }
    let rule = false;
    let field = "";
    let operator = "=";
    let value = "";
    let valueSource = void 0;
    if (jsonLogicOperations && objectKeys(jsonLogicOperations).includes(key)) {
      rule = jsonLogicOperations[key](keyValue);
    } else if (isJsonLogicEqual(logic) || isJsonLogicStrictEqual(logic) || isJsonLogicNotEqual(logic) || isJsonLogicStrictNotEqual(logic) || isJsonLogicGreaterThan(logic) || isJsonLogicGreaterThanOrEqual(logic) || isJsonLogicLessThan(logic) || isJsonLogicLessThanOrEqual(logic) || isJsonLogicInString(logic) || isRQBJsonLogicStartsWith(logic) || isRQBJsonLogicEndsWith(logic)) {
      const [first, second] = keyValue;
      if (isRQBJsonLogicVar(first) && !isPojo(second)) {
        field = first.var;
        value = second;
      } else if (!isPojo(first) && isRQBJsonLogicVar(second)) {
        field = second.var;
        value = first;
      } else if (isRQBJsonLogicVar(first) && isRQBJsonLogicVar(second)) {
        field = first.var;
        value = second.var;
        valueSource = "field";
      } else {
        return false;
      }
      if (isJsonLogicEqual(logic) || isJsonLogicStrictEqual(logic)) {
        operator = value === null ? "null" : "=";
      } else if (isJsonLogicNotEqual(logic) || isJsonLogicStrictNotEqual(logic)) {
        operator = value === null ? "notNull" : "!=";
      } else if (isJsonLogicInString(logic)) {
        operator = "contains";
      } else if (isRQBJsonLogicStartsWith(logic)) {
        operator = "beginsWith";
      } else if (isRQBJsonLogicEndsWith(logic)) {
        operator = "endsWith";
      } else {
        operator = key;
      }
      if (fieldIsValid(field, operator, valueSource === "field" ? value : void 0)) {
        rule = { field, operator, value, valueSource };
      }
    } else if (isJsonLogicBetweenExclusive(logic) && isRQBJsonLogicVar(logic["<"][1])) {
      field = logic["<"][1].var;
      const values = [logic["<"][0], logic["<"][2]];
      if (values.every(isRQBJsonLogicVar) || values.every((el) => typeof el === "string") || values.every((el) => typeof el === "number") || values.every((el) => typeof el === "boolean")) {
        return processLogic({
          and: [{ ">": [{ var: field }, values[0]] }, { "<": [{ var: field }, values[1]] }]
        }) || false;
      }
    } else if (isJsonLogicBetweenInclusive(logic) && isRQBJsonLogicVar(logic["<="][1])) {
      field = logic["<="][1].var;
      operator = "between";
      const values = [logic["<="][0], logic["<="][2]];
      if (logic["<="].every(isRQBJsonLogicVar)) {
        const vars = values;
        valueSource = "field";
        const fieldList = vars.map((el) => el.var).filter((sf) => fieldIsValid(field, operator, sf));
        value = listsAsArrays ? fieldList : fieldList.join(",");
      } else {
        if (values.every((el) => typeof el === "string") || values.every((el) => typeof el === "number") || values.every((el) => typeof el === "boolean")) {
          value = listsAsArrays ? values : values.map((el) => `${el}`).join(",");
        }
      }
      if (fieldIsValid(field, operator) && value.length >= 2) {
        rule = { field, operator, value, valueSource };
      }
    } else if (isJsonLogicInArray(logic) && isRQBJsonLogicVar(keyValue[0])) {
      field = keyValue[0].var;
      operator = "in";
      if (logic.in[1].every(isRQBJsonLogicVar)) {
        valueSource = "field";
        const fieldList = logic.in[1].map((el) => el.var).filter((sf) => fieldIsValid(field, operator, sf));
        value = listsAsArrays ? fieldList : fieldList.join(",");
      } else {
        if (logic.in[1].every((el) => typeof el === "string") || logic.in[1].every((el) => typeof el === "number") || logic.in[1].every((el) => typeof el === "boolean")) {
          value = listsAsArrays ? logic.in[1] : logic.in[1].map((el) => `${el}`).join(",");
        }
      }
      if (value.length > 0) {
        rule = { field, operator, value, valueSource };
      }
    }
    return !rule ? false : outermost ? { combinator: "and", rules: [rule] } : rule;
  }
  let logicRoot = rqbJsonLogic;
  if (typeof rqbJsonLogic === "string") {
    try {
      logicRoot = JSON.parse(rqbJsonLogic);
    } catch (err) {
      return emptyRuleGroup;
    }
  }
  const result = processLogic(logicRoot, true);
  const finalQuery = !result ? emptyRuleGroup : result;
  return options.independentCombinators ? convertToIC(finalQuery) : finalQuery;
}
exports.parseJsonLogic = parseJsonLogic;
