"use strict";
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
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
var celParser = function() {
  var o = function(k, v, o2, l) {
    for (o2 = o2 || {}, l = k.length; l--; o2[k[l]] = v)
      ;
    return o2;
  }, $V0 = [1, 27], $V1 = [1, 31], $V2 = [1, 32], $V3 = [1, 28], $V4 = [1, 29], $V5 = [1, 30], $V6 = [1, 33], $V7 = [1, 34], $V8 = [1, 18], $V9 = [1, 26], $Va = [1, 12], $Vb = [1, 13], $Vc = [1, 19], $Vd = [1, 20], $Ve = [1, 40], $Vf = [1, 39], $Vg = [1, 41], $Vh = [1, 42], $Vi = [1, 43], $Vj = [1, 36], $Vk = [1, 37], $Vl = [1, 38], $Vm = [5, 37, 43, 45, 49, 50, 53, 54, 55, 56, 60, 61, 62, 63], $Vn = [1, 44], $Vo = [1, 45], $Vp = [1, 46], $Vq = [5, 23, 24, 25, 26, 27, 28, 31, 37, 40, 43, 44, 45, 46, 49, 50, 53, 54, 55, 56, 60, 61, 62, 63], $Vr = [7, 9, 10, 12, 13, 14, 16, 18, 21, 35, 40, 41, 44, 46], $Vs = [2, 36], $Vt = [1, 85], $Vu = [43, 45, 50], $Vv = [5, 37, 43, 45, 49, 50, 53, 61, 62, 63], $Vw = [5, 37, 43, 45, 49, 50, 53, 54, 55, 56, 61, 62, 63], $Vx = [2, 37], $Vy = [49, 50];
  var parser = {
    trace: function trace() {
    },
    yy: {},
    symbols_: { "error": 2, "main": 3, "expr": 4, "EOF": 5, "string_literal": 6, "STRING_LIT": 7, "bytes_literal": 8, "b": 9, "B": 10, "number_literal": 11, "INT_LIT": 12, "UINT_LIT": 13, "FLOAT_LIT": 14, "boolean_literal": 15, "BOOL_LIT": 16, "null_literal": 17, "NULL_LIT": 18, "literal": 19, "ident": 20, "IDENT": 21, "relop": 22, "==": 23, ">=": 24, ">": 25, "<=": 26, "<": 27, "!=": 28, "relation": 29, "member": 30, "in": 31, "list": 32, "map": 33, "negation": 34, "!": 35, "negative": 36, "-": 37, "unary": 38, "primary": 39, "DOT": 40, "(": 41, "expr_list": 42, ")": 43, "[": 44, "]": 45, "{": 46, "field_inits": 47, "trailing_comma": 48, "}": 49, ",": 50, "map_inits": 51, "math_operation": 52, "+": 53, "*": 54, "/": 55, "%": 56, "conditional_expr": 57, "conditional_and": 58, "conditional_or": 59, "?": 60, ":": 61, "&&": 62, "||": 63, "$accept": 0, "$end": 1 },
    terminals_: { 2: "error", 5: "EOF", 7: "STRING_LIT", 9: "b", 10: "B", 12: "INT_LIT", 13: "UINT_LIT", 14: "FLOAT_LIT", 16: "BOOL_LIT", 18: "NULL_LIT", 21: "IDENT", 23: "==", 24: ">=", 25: ">", 26: "<=", 27: "<", 28: "!=", 31: "in", 35: "!", 37: "-", 40: "DOT", 41: "(", 43: ")", 44: "[", 45: "]", 46: "{", 49: "}", 50: ",", 53: "+", 54: "*", 55: "/", 56: "%", 60: "?", 61: ":", 62: "&&", 63: "||" },
    productions_: [0, [3, 2], [6, 1], [8, 2], [8, 2], [11, 1], [11, 1], [11, 1], [15, 1], [17, 1], [19, 1], [19, 1], [19, 1], [19, 1], [19, 1], [20, 1], [22, 1], [22, 1], [22, 1], [22, 1], [22, 1], [22, 1], [29, 3], [29, 3], [29, 3], [34, 1], [34, 2], [36, 1], [36, 2], [38, 2], [30, 1], [30, 1], [30, 3], [30, 6], [30, 4], [30, 5], [48, 0], [48, 1], [39, 1], [39, 2], [39, 5], [39, 6], [39, 3], [39, 1], [39, 1], [39, 1], [32, 4], [33, 4], [52, 3], [52, 3], [52, 3], [52, 3], [52, 3], [4, 1], [4, 1], [4, 1], [4, 1], [4, 1], [4, 1], [57, 5], [58, 3], [59, 3], [42, 1], [42, 3], [47, 3], [47, 5], [51, 3], [51, 5]],
    performAction: function anonymous(yytext, yyleng, yylineno, yy, yystate, $$, _$) {
      var $0 = $$.length - 1;
      switch (yystate) {
        case 1:
          return { nodeType: "Main", value: $$[$0 - 1] };
        case 2:
          this.$ = { type: "StringLiteral", value: $$[$0] };
          break;
        case 3:
        case 4:
          this.$ = { type: "BytesLiteral", value: $$[$0] };
          break;
        case 5:
          this.$ = { type: "IntegerLiteral", value: parseInt($$[$0], /x/.test($$[$0]) ? 16 : 10) };
          break;
        case 6:
          this.$ = { type: "UnsignedIntegerLiteral", value: parseInt($$[$0].replace(/u$/i, ""), /^0x/.test($$[$0]) ? 16 : 10) };
          break;
        case 7:
          this.$ = { type: "FloatLiteral", value: parseFloat($$[$0]) };
          break;
        case 8:
          this.$ = { type: "BooleanLiteral", value: $$[$0] === "true" };
          break;
        case 9:
          this.$ = { type: "NullLiteral", value: null };
          break;
        case 10:
        case 11:
        case 12:
        case 13:
        case 14:
        case 16:
        case 17:
        case 18:
        case 19:
        case 20:
        case 21:
        case 38:
        case 43:
        case 44:
        case 45:
        case 53:
        case 54:
        case 55:
        case 56:
        case 57:
        case 58:
          this.$ = $$[$0];
          break;
        case 15:
          this.$ = { type: "Identifier", value: $$[$0] };
          break;
        case 22:
        case 23:
        case 24:
          this.$ = { type: "Relation", left: $$[$0 - 2], operator: $$[$0 - 1], right: $$[$0] };
          break;
        case 25:
        case 27:
          this.$ = 1;
          break;
        case 26:
        case 28:
          this.$ = this.$ += 1;
          break;
        case 29:
          this.$ = { type: "Negation", negations: $$[$0 - 1], value: $$[$0] };
          break;
        case 30:
        case 31:
          this.$ = $$[$0];
          break;
        case 32:
          this.$ = { type: "Member", left: $$[$0 - 2], right: $$[$0] };
          break;
        case 33:
          this.$ = { type: "Member", left: $$[$0 - 5], right: $$[$0 - 3], list: $$[$0 - 1] };
          break;
        case 34:
          this.$ = { type: "DynamicPropertyAccessor", left: $$[$0 - 3], right: $$[$0 - 1] };
          break;
        case 35:
          this.$ = { type: "FieldsObject", left: $$[$0 - 4], list: $$[$0 - 2], trailingComma: $$[$0 - 1] };
          break;
        case 36:
          this.$ = false;
          break;
        case 37:
          this.$ = true;
          break;
        case 39:
          this.$ = { type: "Property", value: $$[$0] };
          break;
        case 40:
          this.$ = { type: "FunctionCall", name: $$[$0 - 4], args: $$[$0 - 2], trailingComma: $$[$0 - 1] };
          break;
        case 41:
          this.$ = { type: "Property", value: $$[$0 - 4], args: $$[$0 - 2], trailingComma: $$[$0 - 1] };
          break;
        case 42:
          this.$ = { type: "ExpressionGroup", value: $$[$0 - 1] };
          break;
        case 46:
          this.$ = { type: "List", value: $$[$0 - 2], trailingComma: $$[$0 - 1] };
          break;
        case 47:
          this.$ = { type: "Map", value: $$[$0 - 2], trailingComma: $$[$0 - 1] };
          break;
        case 48:
          this.$ = { type: "Addition", left: $$[$0 - 2], right: $$[$0] };
          break;
        case 49:
          this.$ = { type: "Subtraction", left: $$[$0 - 2], right: $$[$0] };
          break;
        case 50:
          this.$ = { type: "Multiplication", left: $$[$0 - 2], right: $$[$0] };
          break;
        case 51:
          this.$ = { type: "Division", left: $$[$0 - 2], right: $$[$0] };
          break;
        case 52:
          this.$ = { type: "Modulo", left: $$[$0 - 2], right: $$[$0] };
          break;
        case 59:
          this.$ = { type: "ConditionalExpr", condition: $$[$0 - 4], valueIfTrue: $$[$0 - 2], valueIfFalse: $$[$0] };
          break;
        case 60:
          this.$ = { type: "ConditionalAnd", left: $$[$0 - 2], right: $$[$0] };
          break;
        case 61:
          this.$ = { type: "ConditionalOr", left: $$[$0 - 2], right: $$[$0] };
          break;
        case 62:
          this.$ = { type: "ExpressionList", value: [$$[$0]] };
          break;
        case 63:
          this.$ = $$[$0 - 2];
          this.$.value.push($$[$0]);
          break;
        case 64:
          this.$ = { type: "FieldInits", value: [{ type: "FieldInit", left: $$[$0 - 2], right: $$[$0] }] };
          break;
        case 65:
          this.$ = $$[$0 - 4];
          this.$.value.push({ type: "FieldInit", left: $$[$0 - 2], right: $$[$0] });
          break;
        case 66:
          this.$ = { type: "MapInits", value: [{ type: "MapInit", left: $$[$0 - 2], right: $$[$0] }] };
          break;
        case 67:
          this.$ = $$[$0 - 4];
          this.$.value.push({ type: "MapInit", left: $$[$0 - 2], right: $$[$0] });
          break;
      }
    },
    table: [{ 3: 1, 4: 2, 6: 21, 7: $V0, 8: 23, 9: $V1, 10: $V2, 11: 22, 12: $V3, 13: $V4, 14: $V5, 15: 24, 16: $V6, 17: 25, 18: $V7, 19: 16, 20: 11, 21: $V8, 29: 7, 30: 3, 32: 14, 33: 15, 34: 17, 35: $V9, 38: 10, 39: 9, 40: $Va, 41: $Vb, 44: $Vc, 46: $Vd, 52: 8, 57: 4, 58: 5, 59: 6 }, { 1: [3] }, { 5: [1, 35], 37: $Ve, 53: $Vf, 54: $Vg, 55: $Vh, 56: $Vi, 60: $Vj, 62: $Vk, 63: $Vl }, o($Vm, [2, 53], { 22: 47, 23: [1, 49], 24: [1, 50], 25: [1, 51], 26: [1, 52], 27: [1, 53], 28: [1, 54], 31: [1, 48], 40: $Vn, 44: $Vo, 46: $Vp }), o($Vm, [2, 54]), o($Vm, [2, 55]), o($Vm, [2, 56]), o($Vm, [2, 57]), o($Vm, [2, 58]), o($Vq, [2, 30]), o($Vq, [2, 31]), o($Vq, [2, 38], { 41: [1, 55] }), { 20: 56, 21: $V8 }, { 4: 57, 6: 21, 7: $V0, 8: 23, 9: $V1, 10: $V2, 11: 22, 12: $V3, 13: $V4, 14: $V5, 15: 24, 16: $V6, 17: 25, 18: $V7, 19: 16, 20: 11, 21: $V8, 29: 7, 30: 3, 32: 14, 33: 15, 34: 17, 35: $V9, 38: 10, 39: 9, 40: $Va, 41: $Vb, 44: $Vc, 46: $Vd, 52: 8, 57: 4, 58: 5, 59: 6 }, o($Vq, [2, 43]), o($Vq, [2, 44]), o($Vq, [2, 45]), { 6: 21, 7: $V0, 8: 23, 9: $V1, 10: $V2, 11: 22, 12: $V3, 13: $V4, 14: $V5, 15: 24, 16: $V6, 17: 25, 18: $V7, 19: 16, 20: 11, 21: $V8, 32: 14, 33: 15, 35: [1, 59], 39: 58, 40: $Va, 41: $Vb, 44: $Vc, 46: $Vd }, o([5, 23, 24, 25, 26, 27, 28, 31, 37, 40, 41, 43, 44, 45, 46, 49, 50, 53, 54, 55, 56, 60, 61, 62, 63], [2, 15]), { 4: 61, 6: 21, 7: $V0, 8: 23, 9: $V1, 10: $V2, 11: 22, 12: $V3, 13: $V4, 14: $V5, 15: 24, 16: $V6, 17: 25, 18: $V7, 19: 16, 20: 11, 21: $V8, 29: 7, 30: 3, 32: 14, 33: 15, 34: 17, 35: $V9, 38: 10, 39: 9, 40: $Va, 41: $Vb, 42: 60, 44: $Vc, 46: $Vd, 52: 8, 57: 4, 58: 5, 59: 6 }, { 4: 63, 6: 21, 7: $V0, 8: 23, 9: $V1, 10: $V2, 11: 22, 12: $V3, 13: $V4, 14: $V5, 15: 24, 16: $V6, 17: 25, 18: $V7, 19: 16, 20: 11, 21: $V8, 29: 7, 30: 3, 32: 14, 33: 15, 34: 17, 35: $V9, 38: 10, 39: 9, 40: $Va, 41: $Vb, 44: $Vc, 46: $Vd, 51: 62, 52: 8, 57: 4, 58: 5, 59: 6 }, o($Vq, [2, 10]), o($Vq, [2, 11]), o($Vq, [2, 12]), o($Vq, [2, 13]), o($Vq, [2, 14]), o($Vr, [2, 25]), o($Vq, [2, 2]), o($Vq, [2, 5]), o($Vq, [2, 6]), o($Vq, [2, 7]), { 6: 64, 7: $V0 }, { 6: 65, 7: $V0 }, o($Vq, [2, 8]), o($Vq, [2, 9]), { 1: [2, 1] }, { 4: 66, 6: 21, 7: $V0, 8: 23, 9: $V1, 10: $V2, 11: 22, 12: $V3, 13: $V4, 14: $V5, 15: 24, 16: $V6, 17: 25, 18: $V7, 19: 16, 20: 11, 21: $V8, 29: 7, 30: 3, 32: 14, 33: 15, 34: 17, 35: $V9, 38: 10, 39: 9, 40: $Va, 41: $Vb, 44: $Vc, 46: $Vd, 52: 8, 57: 4, 58: 5, 59: 6 }, { 4: 67, 6: 21, 7: $V0, 8: 23, 9: $V1, 10: $V2, 11: 22, 12: $V3, 13: $V4, 14: $V5, 15: 24, 16: $V6, 17: 25, 18: $V7, 19: 16, 20: 11, 21: $V8, 29: 7, 30: 3, 32: 14, 33: 15, 34: 17, 35: $V9, 38: 10, 39: 9, 40: $Va, 41: $Vb, 44: $Vc, 46: $Vd, 52: 8, 57: 4, 58: 5, 59: 6 }, { 4: 68, 6: 21, 7: $V0, 8: 23, 9: $V1, 10: $V2, 11: 22, 12: $V3, 13: $V4, 14: $V5, 15: 24, 16: $V6, 17: 25, 18: $V7, 19: 16, 20: 11, 21: $V8, 29: 7, 30: 3, 32: 14, 33: 15, 34: 17, 35: $V9, 38: 10, 39: 9, 40: $Va, 41: $Vb, 44: $Vc, 46: $Vd, 52: 8, 57: 4, 58: 5, 59: 6 }, { 4: 69, 6: 21, 7: $V0, 8: 23, 9: $V1, 10: $V2, 11: 22, 12: $V3, 13: $V4, 14: $V5, 15: 24, 16: $V6, 17: 25, 18: $V7, 19: 16, 20: 11, 21: $V8, 29: 7, 30: 3, 32: 14, 33: 15, 34: 17, 35: $V9, 38: 10, 39: 9, 40: $Va, 41: $Vb, 44: $Vc, 46: $Vd, 52: 8, 57: 4, 58: 5, 59: 6 }, { 4: 70, 6: 21, 7: $V0, 8: 23, 9: $V1, 10: $V2, 11: 22, 12: $V3, 13: $V4, 14: $V5, 15: 24, 16: $V6, 17: 25, 18: $V7, 19: 16, 20: 11, 21: $V8, 29: 7, 30: 3, 32: 14, 33: 15, 34: 17, 35: $V9, 38: 10, 39: 9, 40: $Va, 41: $Vb, 44: $Vc, 46: $Vd, 52: 8, 57: 4, 58: 5, 59: 6 }, { 4: 71, 6: 21, 7: $V0, 8: 23, 9: $V1, 10: $V2, 11: 22, 12: $V3, 13: $V4, 14: $V5, 15: 24, 16: $V6, 17: 25, 18: $V7, 19: 16, 20: 11, 21: $V8, 29: 7, 30: 3, 32: 14, 33: 15, 34: 17, 35: $V9, 38: 10, 39: 9, 40: $Va, 41: $Vb, 44: $Vc, 46: $Vd, 52: 8, 57: 4, 58: 5, 59: 6 }, { 4: 72, 6: 21, 7: $V0, 8: 23, 9: $V1, 10: $V2, 11: 22, 12: $V3, 13: $V4, 14: $V5, 15: 24, 16: $V6, 17: 25, 18: $V7, 19: 16, 20: 11, 21: $V8, 29: 7, 30: 3, 32: 14, 33: 15, 34: 17, 35: $V9, 38: 10, 39: 9, 40: $Va, 41: $Vb, 44: $Vc, 46: $Vd, 52: 8, 57: 4, 58: 5, 59: 6 }, { 4: 73, 6: 21, 7: $V0, 8: 23, 9: $V1, 10: $V2, 11: 22, 12: $V3, 13: $V4, 14: $V5, 15: 24, 16: $V6, 17: 25, 18: $V7, 19: 16, 20: 11, 21: $V8, 29: 7, 30: 3, 32: 14, 33: 15, 34: 17, 35: $V9, 38: 10, 39: 9, 40: $Va, 41: $Vb, 44: $Vc, 46: $Vd, 52: 8, 57: 4, 58: 5, 59: 6 }, { 20: 74, 21: $V8 }, { 4: 75, 6: 21, 7: $V0, 8: 23, 9: $V1, 10: $V2, 11: 22, 12: $V3, 13: $V4, 14: $V5, 15: 24, 16: $V6, 17: 25, 18: $V7, 19: 16, 20: 11, 21: $V8, 29: 7, 30: 3, 32: 14, 33: 15, 34: 17, 35: $V9, 38: 10, 39: 9, 40: $Va, 41: $Vb, 44: $Vc, 46: $Vd, 52: 8, 57: 4, 58: 5, 59: 6 }, { 20: 77, 21: $V8, 47: 76 }, { 6: 21, 7: $V0, 8: 23, 9: $V1, 10: $V2, 11: 22, 12: $V3, 13: $V4, 14: $V5, 15: 24, 16: $V6, 17: 25, 18: $V7, 19: 16, 20: 11, 21: $V8, 30: 78, 32: 14, 33: 15, 34: 17, 35: $V9, 38: 10, 39: 9, 40: $Va, 41: $Vb, 44: $Vc, 46: $Vd }, { 32: 79, 33: 80, 44: $Vc, 46: $Vd }, o($Vr, [2, 16]), o($Vr, [2, 17]), o($Vr, [2, 18]), o($Vr, [2, 19]), o($Vr, [2, 20]), o($Vr, [2, 21]), { 4: 61, 6: 21, 7: $V0, 8: 23, 9: $V1, 10: $V2, 11: 22, 12: $V3, 13: $V4, 14: $V5, 15: 24, 16: $V6, 17: 25, 18: $V7, 19: 16, 20: 11, 21: $V8, 29: 7, 30: 3, 32: 14, 33: 15, 34: 17, 35: $V9, 38: 10, 39: 9, 40: $Va, 41: $Vb, 42: 81, 44: $Vc, 46: $Vd, 52: 8, 57: 4, 58: 5, 59: 6 }, o($Vq, [2, 39], { 41: [1, 82] }), { 37: $Ve, 43: [1, 83], 53: $Vf, 54: $Vg, 55: $Vh, 56: $Vi, 60: $Vj, 62: $Vk, 63: $Vl }, o($Vq, [2, 29]), o($Vr, [2, 26]), { 45: $Vs, 48: 84, 50: $Vt }, o($Vu, [2, 62], { 37: $Ve, 53: $Vf, 54: $Vg, 55: $Vh, 56: $Vi, 60: $Vj, 62: $Vk, 63: $Vl }), { 48: 86, 49: $Vs, 50: [1, 87] }, { 37: $Ve, 53: $Vf, 54: $Vg, 55: $Vh, 56: $Vi, 60: $Vj, 61: [1, 88], 62: $Vk, 63: $Vl }, o($Vq, [2, 3]), o($Vq, [2, 4]), { 37: $Ve, 53: $Vf, 54: $Vg, 55: $Vh, 56: $Vi, 60: $Vj, 61: [1, 89], 62: $Vk, 63: $Vl }, o([5, 43, 45, 49, 50, 61, 62, 63], [2, 60], { 37: $Ve, 53: $Vf, 54: $Vg, 55: $Vh, 56: $Vi, 60: $Vj }), o([5, 43, 45, 49, 50, 61, 63], [2, 61], { 37: $Ve, 53: $Vf, 54: $Vg, 55: $Vh, 56: $Vi, 60: $Vj, 62: $Vk }), o($Vv, [2, 48], { 54: $Vg, 55: $Vh, 56: $Vi, 60: $Vj }), o($Vv, [2, 49], { 54: $Vg, 55: $Vh, 56: $Vi, 60: $Vj }), o($Vw, [2, 50], { 60: $Vj }), o($Vw, [2, 51], { 60: $Vj }), o($Vw, [2, 52], { 60: $Vj }), o($Vq, [2, 32], { 41: [1, 90] }), { 37: $Ve, 45: [1, 91], 53: $Vf, 54: $Vg, 55: $Vh, 56: $Vi, 60: $Vj, 62: $Vk, 63: $Vl }, { 48: 92, 49: $Vs, 50: [1, 93] }, { 61: [1, 94] }, o($Vm, [2, 22], { 40: $Vn, 44: $Vo, 46: $Vp }), o($Vm, [2, 23]), o($Vm, [2, 24]), { 43: $Vs, 48: 95, 50: $Vt }, { 4: 61, 6: 21, 7: $V0, 8: 23, 9: $V1, 10: $V2, 11: 22, 12: $V3, 13: $V4, 14: $V5, 15: 24, 16: $V6, 17: 25, 18: $V7, 19: 16, 20: 11, 21: $V8, 29: 7, 30: 3, 32: 14, 33: 15, 34: 17, 35: $V9, 38: 10, 39: 9, 40: $Va, 41: $Vb, 42: 96, 44: $Vc, 46: $Vd, 52: 8, 57: 4, 58: 5, 59: 6 }, o($Vq, [2, 42]), { 45: [1, 97] }, o([43, 45], $Vx, { 30: 3, 57: 4, 58: 5, 59: 6, 29: 7, 52: 8, 39: 9, 38: 10, 20: 11, 32: 14, 33: 15, 19: 16, 34: 17, 6: 21, 11: 22, 8: 23, 15: 24, 17: 25, 4: 98, 7: $V0, 9: $V1, 10: $V2, 12: $V3, 13: $V4, 14: $V5, 16: $V6, 18: $V7, 21: $V8, 35: $V9, 40: $Va, 41: $Vb, 44: $Vc, 46: $Vd }), { 49: [1, 99] }, { 4: 100, 6: 21, 7: $V0, 8: 23, 9: $V1, 10: $V2, 11: 22, 12: $V3, 13: $V4, 14: $V5, 15: 24, 16: $V6, 17: 25, 18: $V7, 19: 16, 20: 11, 21: $V8, 29: 7, 30: 3, 32: 14, 33: 15, 34: 17, 35: $V9, 38: 10, 39: 9, 40: $Va, 41: $Vb, 44: $Vc, 46: $Vd, 49: $Vx, 52: 8, 57: 4, 58: 5, 59: 6 }, { 4: 101, 6: 21, 7: $V0, 8: 23, 9: $V1, 10: $V2, 11: 22, 12: $V3, 13: $V4, 14: $V5, 15: 24, 16: $V6, 17: 25, 18: $V7, 19: 16, 20: 11, 21: $V8, 29: 7, 30: 3, 32: 14, 33: 15, 34: 17, 35: $V9, 38: 10, 39: 9, 40: $Va, 41: $Vb, 44: $Vc, 46: $Vd, 52: 8, 57: 4, 58: 5, 59: 6 }, { 4: 102, 6: 21, 7: $V0, 8: 23, 9: $V1, 10: $V2, 11: 22, 12: $V3, 13: $V4, 14: $V5, 15: 24, 16: $V6, 17: 25, 18: $V7, 19: 16, 20: 11, 21: $V8, 29: 7, 30: 3, 32: 14, 33: 15, 34: 17, 35: $V9, 38: 10, 39: 9, 40: $Va, 41: $Vb, 44: $Vc, 46: $Vd, 52: 8, 57: 4, 58: 5, 59: 6 }, { 4: 61, 6: 21, 7: $V0, 8: 23, 9: $V1, 10: $V2, 11: 22, 12: $V3, 13: $V4, 14: $V5, 15: 24, 16: $V6, 17: 25, 18: $V7, 19: 16, 20: 11, 21: $V8, 29: 7, 30: 3, 32: 14, 33: 15, 34: 17, 35: $V9, 38: 10, 39: 9, 40: $Va, 41: $Vb, 42: 103, 44: $Vc, 46: $Vd, 52: 8, 57: 4, 58: 5, 59: 6 }, o($Vq, [2, 34]), { 49: [1, 104] }, { 20: 105, 21: $V8, 49: $Vx }, { 4: 106, 6: 21, 7: $V0, 8: 23, 9: $V1, 10: $V2, 11: 22, 12: $V3, 13: $V4, 14: $V5, 15: 24, 16: $V6, 17: 25, 18: $V7, 19: 16, 20: 11, 21: $V8, 29: 7, 30: 3, 32: 14, 33: 15, 34: 17, 35: $V9, 38: 10, 39: 9, 40: $Va, 41: $Vb, 44: $Vc, 46: $Vd, 52: 8, 57: 4, 58: 5, 59: 6 }, { 43: [1, 107] }, { 43: $Vs, 48: 108, 50: $Vt }, o($Vq, [2, 46]), o($Vu, [2, 63], { 37: $Ve, 53: $Vf, 54: $Vg, 55: $Vh, 56: $Vi, 60: $Vj, 62: $Vk, 63: $Vl }), o($Vq, [2, 47]), { 37: $Ve, 53: $Vf, 54: $Vg, 55: $Vh, 56: $Vi, 60: $Vj, 61: [1, 109], 62: $Vk, 63: $Vl }, o($Vy, [2, 66], { 37: $Ve, 53: $Vf, 54: $Vg, 55: $Vh, 56: $Vi, 60: $Vj, 62: $Vk, 63: $Vl }), o($Vm, [2, 59]), { 43: [1, 110], 50: [1, 111] }, o($Vq, [2, 35]), { 61: [1, 112] }, o($Vy, [2, 64], { 37: $Ve, 53: $Vf, 54: $Vg, 55: $Vh, 56: $Vi, 60: $Vj, 62: $Vk, 63: $Vl }), o($Vq, [2, 40]), { 43: [1, 113] }, { 4: 114, 6: 21, 7: $V0, 8: 23, 9: $V1, 10: $V2, 11: 22, 12: $V3, 13: $V4, 14: $V5, 15: 24, 16: $V6, 17: 25, 18: $V7, 19: 16, 20: 11, 21: $V8, 29: 7, 30: 3, 32: 14, 33: 15, 34: 17, 35: $V9, 38: 10, 39: 9, 40: $Va, 41: $Vb, 44: $Vc, 46: $Vd, 52: 8, 57: 4, 58: 5, 59: 6 }, o($Vq, [2, 33]), { 4: 98, 6: 21, 7: $V0, 8: 23, 9: $V1, 10: $V2, 11: 22, 12: $V3, 13: $V4, 14: $V5, 15: 24, 16: $V6, 17: 25, 18: $V7, 19: 16, 20: 11, 21: $V8, 29: 7, 30: 3, 32: 14, 33: 15, 34: 17, 35: $V9, 38: 10, 39: 9, 40: $Va, 41: $Vb, 44: $Vc, 46: $Vd, 52: 8, 57: 4, 58: 5, 59: 6 }, { 4: 115, 6: 21, 7: $V0, 8: 23, 9: $V1, 10: $V2, 11: 22, 12: $V3, 13: $V4, 14: $V5, 15: 24, 16: $V6, 17: 25, 18: $V7, 19: 16, 20: 11, 21: $V8, 29: 7, 30: 3, 32: 14, 33: 15, 34: 17, 35: $V9, 38: 10, 39: 9, 40: $Va, 41: $Vb, 44: $Vc, 46: $Vd, 52: 8, 57: 4, 58: 5, 59: 6 }, o($Vq, [2, 41]), o($Vy, [2, 67], { 37: $Ve, 53: $Vf, 54: $Vg, 55: $Vh, 56: $Vi, 60: $Vj, 62: $Vk, 63: $Vl }), o($Vy, [2, 65], { 37: $Ve, 53: $Vf, 54: $Vg, 55: $Vh, 56: $Vi, 60: $Vj, 62: $Vk, 63: $Vl })],
    defaultActions: { 35: [2, 1] },
    parseError: function parseError(str, hash) {
      if (hash.recoverable) {
        this.trace(str);
      } else {
        var error = new Error(str);
        error.hash = hash;
        throw error;
      }
    },
    parse: function parse(input) {
      var self = this, stack = [0], vstack = [null], lstack = [], table = this.table, yytext = "", yylineno = 0, yyleng = 0, TERROR = 2, EOF = 1;
      var args = lstack.slice.call(arguments, 1);
      var lexer2 = Object.create(this.lexer);
      var sharedState = { yy: {} };
      for (var k in this.yy) {
        if (Object.prototype.hasOwnProperty.call(this.yy, k)) {
          sharedState.yy[k] = this.yy[k];
        }
      }
      lexer2.setInput(input, sharedState.yy);
      sharedState.yy.lexer = lexer2;
      sharedState.yy.parser = this;
      if (typeof lexer2.yylloc == "undefined") {
        lexer2.yylloc = {};
      }
      var yyloc = lexer2.yylloc;
      lstack.push(yyloc);
      var ranges = lexer2.options && lexer2.options.ranges;
      if (typeof sharedState.yy.parseError === "function") {
        this.parseError = sharedState.yy.parseError;
      } else {
        this.parseError = Object.getPrototypeOf(this).parseError;
      }
      var lex = function() {
        var token;
        token = lexer2.lex() || EOF;
        if (typeof token !== "number") {
          token = self.symbols_[token] || token;
        }
        return token;
      };
      var symbol, state, action, r, yyval = {}, p, len, newState, expected;
      while (true) {
        state = stack[stack.length - 1];
        if (this.defaultActions[state]) {
          action = this.defaultActions[state];
        } else {
          if (symbol === null || typeof symbol == "undefined") {
            symbol = lex();
          }
          action = table[state] && table[state][symbol];
        }
        if (typeof action === "undefined" || !action.length || !action[0]) {
          var errStr = "";
          expected = [];
          for (p in table[state]) {
            if (this.terminals_[p] && p > TERROR) {
              expected.push("'" + this.terminals_[p] + "'");
            }
          }
          if (lexer2.showPosition) {
            errStr = "Parse error on line " + (yylineno + 1) + ":\n" + lexer2.showPosition() + "\nExpecting " + expected.join(", ") + ", got '" + (this.terminals_[symbol] || symbol) + "'";
          } else {
            errStr = "Parse error on line " + (yylineno + 1) + ": Unexpected " + (symbol == EOF ? "end of input" : "'" + (this.terminals_[symbol] || symbol) + "'");
          }
          this.parseError(errStr, {
            text: lexer2.match,
            token: this.terminals_[symbol] || symbol,
            line: lexer2.yylineno,
            loc: yyloc,
            expected
          });
        }
        if (action[0] instanceof Array && action.length > 1) {
          throw new Error("Parse Error: multiple actions possible at state: " + state + ", token: " + symbol);
        }
        switch (action[0]) {
          case 1:
            stack.push(symbol);
            vstack.push(lexer2.yytext);
            lstack.push(lexer2.yylloc);
            stack.push(action[1]);
            symbol = null;
            {
              yyleng = lexer2.yyleng;
              yytext = lexer2.yytext;
              yylineno = lexer2.yylineno;
              yyloc = lexer2.yylloc;
            }
            break;
          case 2:
            len = this.productions_[action[1]][1];
            yyval.$ = vstack[vstack.length - len];
            yyval._$ = {
              first_line: lstack[lstack.length - (len || 1)].first_line,
              last_line: lstack[lstack.length - 1].last_line,
              first_column: lstack[lstack.length - (len || 1)].first_column,
              last_column: lstack[lstack.length - 1].last_column
            };
            if (ranges) {
              yyval._$.range = [
                lstack[lstack.length - (len || 1)].range[0],
                lstack[lstack.length - 1].range[1]
              ];
            }
            r = this.performAction.apply(yyval, [
              yytext,
              yyleng,
              yylineno,
              sharedState.yy,
              action[1],
              vstack,
              lstack
            ].concat(args));
            if (typeof r !== "undefined") {
              return r;
            }
            if (len) {
              stack = stack.slice(0, -1 * len * 2);
              vstack = vstack.slice(0, -1 * len);
              lstack = lstack.slice(0, -1 * len);
            }
            stack.push(this.productions_[action[1]][0]);
            vstack.push(yyval.$);
            lstack.push(yyval._$);
            newState = table[stack[stack.length - 2]][stack[stack.length - 1]];
            stack.push(newState);
            break;
          case 3:
            return true;
        }
      }
      return true;
    }
  };
  var lexer = function() {
    var lexer2 = {
      EOF: 1,
      parseError: function parseError(str, hash) {
        if (this.yy.parser) {
          this.yy.parser.parseError(str, hash);
        } else {
          throw new Error(str);
        }
      },
      setInput: function(input, yy) {
        this.yy = yy || this.yy || {};
        this._input = input;
        this._more = this._backtrack = this.done = false;
        this.yylineno = this.yyleng = 0;
        this.yytext = this.matched = this.match = "";
        this.conditionStack = ["INITIAL"];
        this.yylloc = {
          first_line: 1,
          first_column: 0,
          last_line: 1,
          last_column: 0
        };
        if (this.options.ranges) {
          this.yylloc.range = [0, 0];
        }
        this.offset = 0;
        return this;
      },
      input: function() {
        var ch = this._input[0];
        this.yytext += ch;
        this.yyleng++;
        this.offset++;
        this.match += ch;
        this.matched += ch;
        var lines = ch.match(/(?:\r\n?|\n).*/g);
        if (lines) {
          this.yylineno++;
          this.yylloc.last_line++;
        } else {
          this.yylloc.last_column++;
        }
        if (this.options.ranges) {
          this.yylloc.range[1]++;
        }
        this._input = this._input.slice(1);
        return ch;
      },
      unput: function(ch) {
        var len = ch.length;
        var lines = ch.split(/(?:\r\n?|\n)/g);
        this._input = ch + this._input;
        this.yytext = this.yytext.substr(0, this.yytext.length - len);
        this.offset -= len;
        var oldLines = this.match.split(/(?:\r\n?|\n)/g);
        this.match = this.match.substr(0, this.match.length - 1);
        this.matched = this.matched.substr(0, this.matched.length - 1);
        if (lines.length - 1) {
          this.yylineno -= lines.length - 1;
        }
        var r = this.yylloc.range;
        this.yylloc = {
          first_line: this.yylloc.first_line,
          last_line: this.yylineno + 1,
          first_column: this.yylloc.first_column,
          last_column: lines ? (lines.length === oldLines.length ? this.yylloc.first_column : 0) + oldLines[oldLines.length - lines.length].length - lines[0].length : this.yylloc.first_column - len
        };
        if (this.options.ranges) {
          this.yylloc.range = [r[0], r[0] + this.yyleng - len];
        }
        this.yyleng = this.yytext.length;
        return this;
      },
      more: function() {
        this._more = true;
        return this;
      },
      reject: function() {
        if (this.options.backtrack_lexer) {
          this._backtrack = true;
        } else {
          return this.parseError("Lexical error on line " + (this.yylineno + 1) + ". You can only invoke reject() in the lexer when the lexer is of the backtracking persuasion (options.backtrack_lexer = true).\n" + this.showPosition(), {
            text: "",
            token: null,
            line: this.yylineno
          });
        }
        return this;
      },
      less: function(n) {
        this.unput(this.match.slice(n));
      },
      pastInput: function() {
        var past = this.matched.substr(0, this.matched.length - this.match.length);
        return (past.length > 20 ? "..." : "") + past.substr(-20).replace(/\n/g, "");
      },
      upcomingInput: function() {
        var next = this.match;
        if (next.length < 20) {
          next += this._input.substr(0, 20 - next.length);
        }
        return (next.substr(0, 20) + (next.length > 20 ? "..." : "")).replace(/\n/g, "");
      },
      showPosition: function() {
        var pre = this.pastInput();
        var c = new Array(pre.length + 1).join("-");
        return pre + this.upcomingInput() + "\n" + c + "^";
      },
      test_match: function(match, indexed_rule) {
        var token, lines, backup;
        if (this.options.backtrack_lexer) {
          backup = {
            yylineno: this.yylineno,
            yylloc: {
              first_line: this.yylloc.first_line,
              last_line: this.last_line,
              first_column: this.yylloc.first_column,
              last_column: this.yylloc.last_column
            },
            yytext: this.yytext,
            match: this.match,
            matches: this.matches,
            matched: this.matched,
            yyleng: this.yyleng,
            offset: this.offset,
            _more: this._more,
            _input: this._input,
            yy: this.yy,
            conditionStack: this.conditionStack.slice(0),
            done: this.done
          };
          if (this.options.ranges) {
            backup.yylloc.range = this.yylloc.range.slice(0);
          }
        }
        lines = match[0].match(/(?:\r\n?|\n).*/g);
        if (lines) {
          this.yylineno += lines.length;
        }
        this.yylloc = {
          first_line: this.yylloc.last_line,
          last_line: this.yylineno + 1,
          first_column: this.yylloc.last_column,
          last_column: lines ? lines[lines.length - 1].length - lines[lines.length - 1].match(/\r?\n?/)[0].length : this.yylloc.last_column + match[0].length
        };
        this.yytext += match[0];
        this.match += match[0];
        this.matches = match;
        this.yyleng = this.yytext.length;
        if (this.options.ranges) {
          this.yylloc.range = [this.offset, this.offset += this.yyleng];
        }
        this._more = false;
        this._backtrack = false;
        this._input = this._input.slice(match[0].length);
        this.matched += match[0];
        token = this.performAction.call(this, this.yy, this, indexed_rule, this.conditionStack[this.conditionStack.length - 1]);
        if (this.done && this._input) {
          this.done = false;
        }
        if (token) {
          return token;
        } else if (this._backtrack) {
          for (var k in backup) {
            this[k] = backup[k];
          }
          return false;
        }
        return false;
      },
      next: function() {
        if (this.done) {
          return this.EOF;
        }
        if (!this._input) {
          this.done = true;
        }
        var token, match, tempMatch, index;
        if (!this._more) {
          this.yytext = "";
          this.match = "";
        }
        var rules = this._currentRules();
        for (var i = 0; i < rules.length; i++) {
          tempMatch = this._input.match(this.rules[rules[i]]);
          if (tempMatch && (!match || tempMatch[0].length > match[0].length)) {
            match = tempMatch;
            index = i;
            if (this.options.backtrack_lexer) {
              token = this.test_match(tempMatch, rules[i]);
              if (token !== false) {
                return token;
              } else if (this._backtrack) {
                match = false;
                continue;
              } else {
                return false;
              }
            } else if (!this.options.flex) {
              break;
            }
          }
        }
        if (match) {
          token = this.test_match(match, rules[index]);
          if (token !== false) {
            return token;
          }
          return false;
        }
        if (this._input === "") {
          return this.EOF;
        } else {
          return this.parseError("Lexical error on line " + (this.yylineno + 1) + ". Unrecognized text.\n" + this.showPosition(), {
            text: "",
            token: null,
            line: this.yylineno
          });
        }
      },
      lex: function lex() {
        var r = this.next();
        if (r) {
          return r;
        } else {
          return this.lex();
        }
      },
      begin: function begin(condition) {
        this.conditionStack.push(condition);
      },
      popState: function popState() {
        var n = this.conditionStack.length - 1;
        if (n > 0) {
          return this.conditionStack.pop();
        } else {
          return this.conditionStack[0];
        }
      },
      _currentRules: function _currentRules() {
        if (this.conditionStack.length && this.conditionStack[this.conditionStack.length - 1]) {
          return this.conditions[this.conditionStack[this.conditionStack.length - 1]].rules;
        } else {
          return this.conditions["INITIAL"].rules;
        }
      },
      topState: function topState(n) {
        n = this.conditionStack.length - 1 - Math.abs(n || 0);
        if (n >= 0) {
          return this.conditionStack[n];
        } else {
          return "INITIAL";
        }
      },
      pushState: function pushState(condition) {
        this.begin(condition);
      },
      stateStackSize: function stateStackSize() {
        return this.conditionStack.length;
      },
      options: { "flex": true },
      performAction: function anonymous(yy, yy_, $avoiding_name_collisions, YY_START) {
        switch ($avoiding_name_collisions) {
          case 0:
            break;
          case 1:
            break;
          case 2:
            return 31;
          case 3:
            return "as";
          case 4:
            return "break";
          case 5:
            return "const";
          case 6:
            return "continue";
          case 7:
            return "else";
          case 8:
            return "for";
          case 9:
            return "function";
          case 10:
            return "if";
          case 11:
            return "import";
          case 12:
            return "let";
          case 13:
            return "loop";
          case 14:
            return "package";
          case 15:
            return "namespace";
          case 16:
            return "return";
          case 17:
            return "var";
          case 18:
            return "void";
          case 19:
            return "while";
          case 20:
            return 18;
          case 21:
            return 16;
          case 22:
            return 16;
          case 23:
            return 40;
          case 24:
            return 60;
          case 25:
            return 61;
          case 26:
            return 50;
          case 27:
            return 44;
          case 28:
            return 45;
          case 29:
            return 41;
          case 30:
            return 43;
          case 31:
            return 28;
          case 32:
            return 35;
          case 33:
            return 53;
          case 34:
            return 37;
          case 35:
            return 54;
          case 36:
            return 55;
          case 37:
            return 56;
          case 38:
            return 23;
          case 39:
            return 24;
          case 40:
            return 25;
          case 41:
            return 26;
          case 42:
            return 27;
          case 43:
            return 46;
          case 44:
            return 49;
          case 45:
            return 62;
          case 46:
            return 63;
          case 47:
            return 21;
          case 48:
            return 7;
          case 49:
            return 7;
          case 50:
            return 7;
          case 51:
            return 7;
          case 52:
            return 12;
          case 53:
            return 13;
          case 54:
            return 14;
          case 55:
            return 5;
          case 56:
            return "INVALID";
          case 57:
            console.log(yy_.yytext);
            break;
        }
      },
      rules: [/^(?:[/][/]\s.*\n)/, /^(?:\s+)/, /^(?:in)/, /^(?:as)/, /^(?:break)/, /^(?:const)/, /^(?:continue)/, /^(?:else)/, /^(?:for)/, /^(?:function)/, /^(?:if)/, /^(?:import)/, /^(?:let)/, /^(?:loop)/, /^(?:package)/, /^(?:namespace)/, /^(?:return)/, /^(?:var)/, /^(?:void)/, /^(?:while)/, /^(?:null)/, /^(?:true)/, /^(?:false)/, /^(?:\.)/, /^(?:\?)/, /^(?::)/, /^(?:,)/, /^(?:\[)/, /^(?:\])/, /^(?:\()/, /^(?:\))/, /^(?:!=)/, /^(?:!)/, /^(?:\+)/, /^(?:-)/, /^(?:\*)/, /^(?:\/)/, /^(?:%)/, /^(?:==)/, /^(?:>=)/, /^(?:>)/, /^(?:<=)/, /^(?:<)/, /^(?:\{)/, /^(?:\})/, /^(?:&&)/, /^(?:\|\|)/, /^(?:[_a-zA-Z][_a-zA-Z0-9]*)/, /^(?:[rR]?['][']['](\.|[^'])*['][']['])/, /^(?:[rR]?["]["]["](\.|[^"])*["]["]["])/, /^(?:[rR]?['](\.|[^'\n\r])*['])/, /^(?:[rR]?["](\.|[^"\n\r])*["])/, /^(?:[-]?([0-9]+|0x[0-9a-fA-F]+))/, /^(?:([0-9]+|0x[0-9a-fA-F]+)[uU])/, /^(?:[-]?[0-9]+(\.[0-9]+)?([eE][+-]?[0-9]+(\.[0-9]+)?)?)/, /^(?:$)/, /^(?:.)/, /^(?:.)/],
      conditions: { "INITIAL": { "rules": [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57], "inclusive": true } }
    };
    return lexer2;
  }();
  parser.lexer = lexer;
  function Parser() {
    this.yy = {};
  }
  Parser.prototype = parser;
  parser.Parser = Parser;
  return new Parser();
}();
const isCELExpressionGroup = (expr) => expr.type === "ExpressionGroup";
const isCELConditionalAnd = (expr) => expr.type === "ConditionalAnd";
const isCELConditionalOr = (expr) => expr.type === "ConditionalOr";
const isCELStringLiteral = (expr) => expr.type === "StringLiteral";
const isCELLiteral = (expr) => isCELNumericLiteral(expr) || isCELStringLiteral(expr) || expr.type === "BooleanLiteral" || expr.type === "NullLiteral" || expr.type === "BytesLiteral";
const isCELNumericLiteral = (expr) => expr.type === "FloatLiteral" || expr.type === "IntegerLiteral" || expr.type === "UnsignedIntegerLiteral";
const isCELRelation = (expr) => expr.type === "Relation";
const isCELList = (expr) => expr.type === "List";
const isCELMap = (expr) => expr.type === "Map";
const isCELIdentifier = (expr) => expr.type === "Identifier";
const isCELNegation = (expr) => expr.type === "Negation";
const isCELMember = (expr) => expr.type === "Member";
const isCELLikeExpression = (expr) => isCELMember(expr) && !!expr.left && !!expr.right && !!expr.list && isCELIdentifier(expr.left) && isCELIdentifier(expr.right) && (expr.right.value === "contains" || expr.right.value === "startsWith" || expr.right.value === "endsWith") && expr.list.value.length === 1 && (isCELStringLiteral(expr.list.value[0]) || isCELIdentifier(expr.list.value[0]));
function evalCELLiteralValue(literal) {
  if (literal.type === "StringLiteral") {
    return literal.value.replace(/^((?:'''|"""|'|")?)([\s\S]*?)\1$/gm, "$2");
  } else if (literal.type === "BooleanLiteral") {
    return literal.value;
  } else if (literal.type === "NullLiteral" || literal.type === "BytesLiteral") {
    return null;
  }
  return literal.value;
}
const normalizeCombinator = (c) => c === "||" ? "or" : "and";
const normalizeOperator = (op, flip) => {
  if (flip) {
    if (op === "<")
      return ">";
    if (op === "<=")
      return ">=";
    if (op === ">")
      return "<";
    if (op === ">=")
      return "<=";
  }
  if (op === "==")
    return "=";
  return op;
};
const generateFlatAndOrList = (expr) => {
  const combinator = normalizeCombinator(expr.type === "ConditionalAnd" ? "&&" : "||");
  const { left, right } = expr;
  if (isCELConditionalAnd(left) || isCELConditionalOr(left)) {
    return [...generateFlatAndOrList(left), combinator, right];
  }
  return [left, combinator, right];
};
const generateMixedAndOrList = (expr) => {
  const arr = generateFlatAndOrList(expr);
  const returnArray = [];
  let startIndex = 0;
  for (let i = 0; i < arr.length; i += 2) {
    if (arr[i + 1] === "and") {
      startIndex = i;
      let j = 1;
      while (arr[startIndex + j] === "and") {
        i += 2;
        j += 2;
      }
      const tempAndArray = arr.slice(startIndex, i + 1);
      returnArray.push(tempAndArray);
      i -= 2;
    } else if (arr[i + 1] === "or") {
      if (i === 0 || i === arr.length - 3) {
        if (i === 0 || arr[i - 1] === "or") {
          returnArray.push(arr[i]);
        }
        returnArray.push(arr[i + 1]);
        if (i === arr.length - 3) {
          returnArray.push(arr[i + 2]);
        }
      } else {
        if (arr[i - 1] === "and") {
          returnArray.push(arr[i + 1]);
        } else {
          returnArray.push(arr[i]);
          returnArray.push(arr[i + 1]);
        }
      }
    }
  }
  if (returnArray.length === 1 && Array.isArray(returnArray[0])) {
    return returnArray[0];
  }
  return returnArray;
};
function parseCEL(cel, options = {}) {
  const { fields, independentCombinators, listsAsArrays } = options;
  const ic = !!independentCombinators;
  const fieldsFlat = getFieldsArray(fields);
  const fieldIsValid = (fieldName, operator, subordinateFieldName) => fieldIsValidUtil({
    fieldName,
    fieldsFlat,
    operator,
    subordinateFieldName,
    getValueSources: options == null ? void 0 : options.getValueSources
  });
  const emptyQuery = {
    rules: [],
    ...ic ? {} : { combinator: "and" }
  };
  const processCELExpression = (expr, processOpts = {}) => {
    const { forwardNegation: forwardedNegation, groupOnlyIfNecessary } = processOpts;
    if (isCELNegation(expr)) {
      const negate = expr.negations % 2 === 1;
      const negatedExpr = isCELExpressionGroup(expr.value) && isCELLikeExpression(expr.value.value) ? processCELExpression(expr.value.value, { forwardNegation: negate }) : processCELExpression(expr.value, {
        groupOnlyIfNecessary: true,
        forwardNegation: negate
      });
      if (negatedExpr) {
        if (!negate || negate && !("rules" in negatedExpr) && negatedExpr.operator.startsWith("doesNot")) {
          return ic ? { rules: [negatedExpr] } : {
            combinator: "and",
            rules: [negatedExpr]
          };
        }
        return ic ? { rules: [negatedExpr], not: true } : {
          combinator: "and",
          rules: [negatedExpr],
          not: true
        };
      }
    } else if (isCELExpressionGroup(expr)) {
      const rule = processCELExpression(expr.value, {
        groupOnlyIfNecessary: true
      });
      if (rule) {
        if ("rules" in rule || groupOnlyIfNecessary && isCELExpressionGroup(expr.value)) {
          return rule;
        }
        return ic ? { rules: [rule] } : { combinator: "and", rules: [rule] };
      }
    } else if (isCELConditionalAnd(expr) || isCELConditionalOr(expr)) {
      if (ic) {
        const andOrList2 = generateFlatAndOrList(expr);
        const rules2 = andOrList2.map((v) => {
          if (typeof v === "string") {
            return v;
          }
          return processCELExpression(v);
        });
        if (!rules2.every(Boolean)) {
          return null;
        }
        return {
          rules: rules2
        };
      }
      const andOrList = generateMixedAndOrList(expr);
      const combinator = andOrList[1];
      const filteredList = andOrList.filter((v) => Array.isArray(v) || !!v && typeof v !== "string" && "type" in v).map(
        (v) => Array.isArray(v) ? v.filter((vf) => !!v && typeof vf !== "string" && "type" in vf) : v
      );
      const rules = filteredList.map((exp) => {
        if (Array.isArray(exp)) {
          return {
            combinator: "and",
            rules: exp.map((e) => processCELExpression(e)).filter((r) => !!r)
          };
        }
        return processCELExpression(exp);
      }).filter((r) => !!r);
      if (rules.length > 0) {
        return { combinator, rules };
      }
    } else if (isCELLikeExpression(expr)) {
      const {
        left: { value: field },
        right: { value: func }
      } = expr;
      const operatorPre = func === "startsWith" ? "beginsWith" : func;
      const operator = forwardedNegation ? `doesNot${operatorPre[0].toUpperCase()}${operatorPre.slice(1).replace("s", "")}` : operatorPre;
      const valueObj = expr.list.value[0];
      const value = isCELStringLiteral(valueObj) ? evalCELLiteralValue(valueObj) : valueObj.value;
      const valueSource = expr.list.value[0].type === "Identifier" ? "field" : void 0;
      if (fieldIsValid(field, operator, valueSource === "field" ? value : void 0)) {
        return valueSource ? { field, operator, value, valueSource } : { field, operator, value };
      }
    } else if (isCELRelation(expr)) {
      let field = null;
      let value = void 0;
      let valueSource = void 0;
      let flip = false;
      const { left, right } = expr;
      if (isCELIdentifier(left)) {
        field = left.value;
        if (isCELIdentifier(right)) {
          value = right.value;
          valueSource = "field";
        } else if (isCELLiteral(right)) {
          value = evalCELLiteralValue(right);
        }
      } else {
        if (isCELIdentifier(right) && isCELLiteral(left) && expr.operator !== "in") {
          flip = true;
          field = right.value;
          value = evalCELLiteralValue(left);
        }
      }
      let operator = normalizeOperator(expr.operator, flip);
      if (value === null && (operator === "=" || operator === "!=")) {
        operator = operator === "=" ? "null" : "notNull";
      } else if (operator === "in" && isCELList(right)) {
        if (right.value.value.every(isCELLiteral)) {
          value = right.value.value.map(evalCELLiteralValue);
        } else {
          if (right.value.value.every(isCELIdentifier)) {
            valueSource = "field";
            value = right.value.value.map((id) => id.value);
          }
        }
        if (value && !listsAsArrays) {
          value = value.map((v) => `${v}`).join(",");
        }
      } else if (operator === "in" && isCELMap(right)) {
        const keys = right.value.value.map((v) => v.left);
        if (keys.every((k) => isCELLiteral(k) || isCELIdentifier(k))) {
          value = keys.map(
            (k) => isCELLiteral(k) ? evalCELLiteralValue(k) : k.value
          );
        }
        if (value && !listsAsArrays) {
          value = value.map((v) => `${v}`).join(",");
        }
      }
      if (field && fieldIsValid(field, operator, valueSource === "field" ? value : void 0) && typeof value !== "undefined") {
        return valueSource ? { field, operator, value, valueSource } : { field, operator, value };
      }
    }
    return null;
  };
  let processedCEL;
  try {
    processedCEL = celParser.parse(cel).value;
  } catch (err) {
    return emptyQuery;
  }
  const result = processCELExpression(processedCEL);
  if (result) {
    if ("rules" in result) {
      return result;
    }
    return { rules: [result], ...ic ? {} : { combinator: "and" } };
  }
  return emptyQuery;
}
exports.parseCEL = parseCEL;
