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
const getRegExStr = (re) => typeof re === "string" ? re : re.source;
const isPrimitive = (v) => typeof v === "string" || typeof v === "number" || typeof v === "boolean";
const mongoDbToRqbOperatorMap = {
  $eq: "=",
  $ne: "!=",
  $gt: ">",
  $gte: ">=",
  $lt: "<",
  $lte: "<="
};
const emptyRuleGroup = { combinator: "and", rules: [] };
function parseMongoDB(mongoDbRules, options = {}) {
  const listsAsArrays = !!options.listsAsArrays;
  const fieldsFlat = getFieldsArray(options.fields);
  const getValueSources = options.getValueSources;
  const fieldIsValid = (fieldName, operator, subordinateFieldName) => fieldIsValidUtil({
    fieldName,
    fieldsFlat,
    operator,
    subordinateFieldName,
    getValueSources
  });
  function processMongoDbQueryBooleanOperator(field, mdbOperator, keyValue) {
    let operator = "=";
    let value = "";
    if (mdbOperator === "$eq" || mdbOperator === "$ne" || mdbOperator === "$gt" || mdbOperator === "$gte" || mdbOperator === "$lt" || mdbOperator === "$lte") {
      if (mdbOperator === "$ne" && keyValue === null) {
        if (fieldIsValid(field, "notNull")) {
          return { field, operator: "notNull", value: null };
        }
      } else {
        operator = mongoDbToRqbOperatorMap[mdbOperator];
        if (fieldIsValid(field, operator)) {
          return { field, operator, value: keyValue };
        }
      }
    } else if (mdbOperator === "$regex" && /^[^^].*[^$]$/.test(getRegExStr(keyValue))) {
      if (fieldIsValid(field, "contains")) {
        return {
          field,
          operator: "contains",
          value: getRegExStr(keyValue)
        };
      }
    } else if (mdbOperator === "$regex" && /^\^.*[^$]/.test(getRegExStr(keyValue))) {
      if (fieldIsValid(field, "beginsWith")) {
        return {
          field,
          operator: "beginsWith",
          value: getRegExStr(keyValue).replace(/^\^/, "")
        };
      }
    } else if (mdbOperator === "$regex" && /[^^].*\$/.test(getRegExStr(keyValue))) {
      if (fieldIsValid(field, "endsWith")) {
        return {
          field,
          operator: "endsWith",
          value: getRegExStr(keyValue).replace(/\$$/, "")
        };
      }
    } else if (mdbOperator === "$in" && Array.isArray(keyValue)) {
      if (fieldIsValid(field, "in")) {
        if (listsAsArrays) {
          value = keyValue;
        } else {
          value = keyValue.map((v) => `${v}`).join(",");
        }
        return { field, operator: "in", value };
      }
    } else if (mdbOperator === "$nin" && Array.isArray(keyValue)) {
      if (fieldIsValid(field, "notIn")) {
        if (listsAsArrays) {
          value = keyValue;
        } else {
          value = keyValue.map((v) => `${v}`).join(",");
        }
        return { field, operator: "notIn", value };
      }
    }
    return false;
  }
  function processMongoDbQueryObjectKey(key, keyValue) {
    let field = "";
    if (key === "$and") {
      if (!Array.isArray(keyValue) || keyValue.length === 0 || !keyValue.every(isPojo)) {
        return false;
      }
      if (keyValue.length === 2 && keyValue.every((kv) => objectKeys(kv).length === 1)) {
        const [rule1, rule2] = keyValue;
        const [ruleKey1, ruleKey2] = keyValue.map((kv) => objectKeys(kv)[0]);
        if (ruleKey1 === ruleKey2 && isPojo(rule1[ruleKey1]) && objectKeys(rule1[ruleKey1]).length === 1 && isPojo(rule2[ruleKey2]) && objectKeys(rule2[ruleKey2]).length === 1 && ("$gte" in rule1[ruleKey1] && "$lte" in rule2[ruleKey2] && rule2[ruleKey2].$lte >= rule1[ruleKey1].$gte || "$lte" in rule1[ruleKey1] && "$gte" in rule2[ruleKey2] && rule1[ruleKey1].$lte >= rule2[ruleKey2].$gte)) {
          const [val1, val2] = [
            rule1[ruleKey1].$gte ?? rule1[ruleKey1].$lte,
            rule2[ruleKey2].$lte ?? rule2[ruleKey2].$gte
          ];
          let value = listsAsArrays ? [val1, val2] : `${val1},${val2}`;
          if (val1 > val2) {
            value = listsAsArrays ? [val2, val1] : `${val2},${val1}`;
          }
          return { field: ruleKey1, operator: "between", value };
        }
      }
      const rules = keyValue.map((l) => processMongoDbQueryObject(l)).filter(Boolean);
      return rules.length > 0 ? { combinator: "and", rules } : false;
    } else if (key === "$or") {
      if (!Array.isArray(keyValue) || keyValue.length === 0 || !keyValue.every(isPojo)) {
        return false;
      }
      if (keyValue.length === 2 && keyValue.every((kv) => objectKeys(kv).length === 1)) {
        const [rule1, rule2] = keyValue;
        const [ruleKey1, ruleKey2] = keyValue.map((kv) => objectKeys(kv)[0]);
        if (ruleKey1 === ruleKey2 && isPojo(rule1[ruleKey1]) && objectKeys(rule1[ruleKey1]).length === 1 && isPojo(rule2[ruleKey2]) && objectKeys(rule2[ruleKey2]).length === 1 && ("$gt" in rule1[ruleKey1] && "$lt" in rule2[ruleKey2] && rule1[ruleKey1].$gt >= rule2[ruleKey2].$lt || "$lt" in rule1[ruleKey1] && "$gt" in rule2[ruleKey2] && rule2[ruleKey2].$gt >= rule1[ruleKey1].$lt)) {
          const [val1, val2] = [
            rule1[ruleKey1].$gt ?? rule1[ruleKey1].$lt,
            rule2[ruleKey2].$lt ?? rule2[ruleKey2].$gt
          ];
          let value = listsAsArrays ? [val1, val2] : `${val1},${val2}`;
          if (val1 > val2) {
            value = listsAsArrays ? [val2, val1] : `${val2},${val1}`;
          }
          return { field: ruleKey1, operator: "notBetween", value };
        }
      }
      const rules = keyValue.map((l) => processMongoDbQueryObject(l)).filter(Boolean);
      return rules.length > 0 ? { combinator: "or", rules } : false;
    } else if (key === "$not" && isPojo(keyValue)) {
      const rule = processMongoDbQueryObject(keyValue);
      if (rule) {
        if (!isRuleGroupType(rule) && (rule.operator === "between" || rule.operator === "in" || rule.operator === "contains" || rule.operator === "beginsWith" || rule.operator === "endsWith")) {
          return { ...rule, operator: defaultOperatorNegationMap[rule.operator] };
        }
        return { combinator: "and", rules: [rule], not: true };
      }
      return false;
    } else if (key === "$expr") {
      const op = objectKeys(keyValue)[0];
      if (/^\$(eq|gte?|lte?|n?in)$/.test(op)) {
        if (Array.isArray(keyValue[op]) && keyValue[op].length === 2 && typeof keyValue[op][0] === "string" && /^\$/.test(keyValue[op][0])) {
          field = keyValue[op][0].replace(/^\$/, "");
          const val = keyValue[op][1];
          if (typeof val === "string" && /^\$/.test(val) || Array.isArray(val) && val.every((v) => typeof v === "string") && val.every((v) => /^\$/.test(v))) {
            const valForProcessing = Array.isArray(val) ? val.map((v) => v.replace(/^\$/, "")) : val.replace(/^\$/, "");
            const tempRule = processMongoDbQueryBooleanOperator(field, op, valForProcessing);
            if (tempRule) {
              if (typeof tempRule.value === "string" && !fieldIsValid(field, tempRule.operator, tempRule.value)) {
                return false;
              }
              return { ...tempRule, valueSource: "field" };
            }
          }
          return processMongoDbQueryBooleanOperator(field, op, keyValue[op][1]);
        }
      }
    } else if (/^[^$]/.test(key)) {
      field = key;
      if (isPrimitive(keyValue)) {
        if (fieldIsValid(field, "=")) {
          return { field, operator: "=", value: keyValue };
        }
      } else if (keyValue === null) {
        if (fieldIsValid(field, "null")) {
          return { field, operator: "null", value: keyValue };
        }
      } else if (isPojo(keyValue)) {
        let betweenRule = false;
        const operators = objectKeys(keyValue).filter((o) => /^\$(eq|ne|gte?|lte?|n?in|regex)$/.test(o)).sort();
        if (operators.length === 0) {
          return false;
        }
        if ("$gte" in keyValue && "$lte" in keyValue) {
          betweenRule = {
            field,
            operator: "between",
            value: listsAsArrays ? [keyValue.$gte, keyValue.$lte] : `${keyValue.$gte},${keyValue.$lte}`
          };
        }
        const rules = operators.filter((op) => !(betweenRule && (op === "$gte" || op === "$lte"))).map((op) => processMongoDbQueryBooleanOperator(field, op, keyValue[op])).filter(Boolean);
        if (betweenRule) {
          rules.unshift(betweenRule);
        }
        if (rules.length === 0) {
          return false;
        }
        if (rules.length === 1) {
          return rules[0];
        }
        return { combinator: "and", rules };
      }
    }
    return false;
  }
  function processMongoDbQueryObject(mongoDbQueryObject) {
    const rules = objectKeys(mongoDbQueryObject).map((k) => processMongoDbQueryObjectKey(k, mongoDbQueryObject[k])).filter(Boolean);
    return rules.length === 1 ? rules[0] : rules.length > 1 ? { combinator: "and", rules } : false;
  }
  let mongoDbPOJO = mongoDbRules;
  if (typeof mongoDbRules === "string") {
    try {
      mongoDbPOJO = JSON.parse(mongoDbRules);
    } catch (err) {
      return emptyRuleGroup;
    }
  }
  if (!isPojo(mongoDbPOJO)) {
    return emptyRuleGroup;
  }
  const result = processMongoDbQueryObject(mongoDbPOJO);
  const finalQuery = result ? isRuleGroupType(result) ? result : { combinator: "and", rules: [result] } : emptyRuleGroup;
  return options.independentCombinators ? convertToIC(finalQuery) : finalQuery;
}
exports.parseMongoDB = parseMongoDB;
