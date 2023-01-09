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
var sqlParser = function() {
  var o = function(k, v, o2, l) {
    for (o2 = o2 || {}, l = k.length; l--; o2[k[l]] = v)
      ;
    return o2;
  }, $V0 = [1, 8], $V1 = [1, 4], $V2 = [2, 4], $V3 = [1, 11], $V4 = [1, 10], $V5 = [2, 16], $V6 = [1, 14], $V7 = [1, 15], $V8 = [1, 16], $V9 = [6, 8], $Va = [2, 147], $Vb = [1, 19], $Vc = [1, 20], $Vd = [16, 33, 35, 36, 37, 38, 39, 40, 41, 42, 45, 46, 50, 51, 54, 55, 57, 58, 60, 76, 79, 81, 82, 83, 84, 86, 87, 88, 91, 103, 195], $Ve = [16, 18, 32, 33, 35, 36, 37, 38, 39, 40, 41, 42, 45, 46, 50, 51, 54, 55, 57, 58, 60, 76, 79, 81, 82, 83, 84, 86, 87, 88, 91, 103, 195], $Vf = [2, 161], $Vg = [1, 29], $Vh = [6, 8, 14, 17, 146, 150, 152, 154], $Vi = [1, 42], $Vj = [1, 61], $Vk = [1, 53], $Vl = [1, 60], $Vm = [1, 62], $Vn = [1, 63], $Vo = [1, 64], $Vp = [1, 65], $Vq = [1, 66], $Vr = [1, 59], $Vs = [1, 54], $Vt = [1, 55], $Vu = [1, 56], $Vv = [1, 57], $Vw = [1, 58], $Vx = [1, 43], $Vy = [1, 44], $Vz = [1, 45], $VA = [1, 47], $VB = [1, 34], $VC = [1, 67], $VD = [16, 35, 36, 37, 38, 39, 40, 41, 42, 45, 46, 50, 51, 54, 55, 57, 58, 60, 76, 79, 81, 82, 83, 84, 86, 87, 88, 91, 103, 195], $VE = [6, 8, 14, 17, 150, 152, 154], $VF = [2, 144], $VG = [1, 76], $VH = [1, 77], $VI = [6, 8, 14, 17, 43, 133, 138, 144, 146, 150, 152, 154], $VJ = [1, 80], $VK = [1, 79], $VL = [1, 81], $VM = [6, 8, 14, 17, 36, 43, 49, 50, 51, 71, 72, 74, 77, 89, 109, 126, 127, 129, 133, 135, 138, 141, 142, 144, 146, 150, 152, 154, 157, 164, 165, 167, 168, 173, 177, 179, 180, 182], $VN = [6, 8, 14, 17, 34, 36, 43, 49, 50, 51, 71, 72, 74, 77, 89, 109, 114, 115, 116, 117, 118, 119, 123, 126, 127, 129, 133, 135, 138, 141, 142, 144, 146, 150, 152, 154, 157, 164, 165, 167, 168, 173, 177, 179, 180, 182], $VO = [1, 102], $VP = [1, 100], $VQ = [1, 101], $VR = [1, 96], $VS = [1, 97], $VT = [1, 98], $VU = [1, 99], $VV = [1, 103], $VW = [1, 104], $VX = [1, 105], $VY = [1, 106], $VZ = [1, 107], $V_ = [1, 108], $V$ = [2, 106], $V01 = [6, 8, 14, 17, 34, 36, 43, 45, 49, 50, 51, 71, 72, 74, 77, 79, 81, 89, 93, 94, 95, 96, 97, 98, 99, 100, 101, 103, 107, 108, 109, 110, 111, 112, 114, 115, 116, 117, 118, 119, 123, 126, 127, 129, 133, 135, 138, 141, 142, 144, 146, 150, 152, 154, 157, 164, 165, 167, 168, 173, 177, 179, 180, 182], $V11 = [6, 8, 14, 17, 34, 36, 43, 45, 49, 50, 51, 71, 72, 74, 77, 79, 81, 89, 93, 94, 95, 96, 97, 98, 99, 100, 101, 103, 105, 107, 108, 109, 110, 111, 112, 114, 115, 116, 117, 118, 119, 123, 126, 127, 129, 133, 135, 138, 141, 142, 144, 146, 150, 152, 154, 157, 164, 165, 167, 168, 173, 177, 179, 180, 182], $V21 = [1, 110], $V31 = [1, 117], $V41 = [2, 64], $V51 = [1, 119], $V61 = [16, 35, 37, 38, 39, 40, 41, 42, 45, 46, 50, 51, 54, 55, 57, 58, 60, 76, 79, 81, 82, 83, 84, 86, 87, 88, 91, 103, 195], $V71 = [16, 29, 35, 50, 51, 54, 55, 57, 58, 60, 76, 79, 81, 82, 83, 84, 86, 87, 88, 91, 121, 195], $V81 = [1, 164], $V91 = [17, 43], $Va1 = [6, 8, 14, 16, 17, 34, 35, 36, 43, 45, 49, 50, 51, 54, 55, 57, 58, 60, 67, 71, 72, 74, 76, 77, 79, 81, 82, 83, 84, 86, 87, 88, 89, 90, 91, 93, 94, 95, 96, 97, 98, 99, 100, 101, 103, 105, 107, 108, 109, 110, 111, 112, 114, 115, 116, 117, 118, 119, 123, 126, 127, 129, 133, 135, 138, 141, 142, 144, 146, 150, 152, 154, 157, 164, 165, 167, 168, 173, 177, 179, 180, 182, 192, 193, 194, 195], $Vb1 = [2, 59], $Vc1 = [1, 174], $Vd1 = [1, 172], $Ve1 = [1, 173], $Vf1 = [6, 8, 138, 146], $Vg1 = [16, 35, 38, 39, 40, 41, 42, 45, 46, 50, 51, 54, 55, 57, 58, 60, 76, 79, 81, 82, 83, 84, 86, 87, 88, 91, 103, 195], $Vh1 = [6, 8, 14, 17, 138, 144, 146, 150, 152, 154], $Vi1 = [6, 8, 14, 17, 36, 43, 49, 50, 51, 71, 72, 74, 77, 89, 126, 127, 129, 133, 135, 138, 141, 142, 144, 146, 150, 152, 154, 157, 164, 165, 167, 168, 173, 177, 179, 180, 182], $Vj1 = [6, 8, 14, 17, 34, 36, 43, 49, 50, 51, 71, 72, 74, 77, 89, 93, 94, 95, 96, 101, 103, 107, 108, 109, 110, 111, 112, 114, 115, 116, 117, 118, 119, 123, 126, 127, 129, 133, 135, 138, 141, 142, 144, 146, 150, 152, 154, 157, 164, 165, 167, 168, 173, 177, 179, 180, 182], $Vk1 = [6, 8, 14, 17, 34, 36, 43, 49, 50, 51, 71, 72, 74, 77, 79, 81, 89, 93, 94, 95, 96, 101, 103, 107, 108, 109, 110, 111, 112, 114, 115, 116, 117, 118, 119, 123, 126, 127, 129, 133, 135, 138, 141, 142, 144, 146, 150, 152, 154, 157, 164, 165, 167, 168, 173, 177, 179, 180, 182], $Vl1 = [16, 35, 39, 40, 41, 42, 45, 46, 50, 51, 54, 55, 57, 58, 60, 76, 79, 81, 82, 83, 84, 86, 87, 88, 91, 103, 195], $Vm1 = [16, 35, 40, 41, 42, 45, 46, 50, 51, 54, 55, 57, 58, 60, 76, 79, 81, 82, 83, 84, 86, 87, 88, 91, 103, 195], $Vn1 = [16, 35, 42, 45, 46, 50, 51, 54, 55, 57, 58, 60, 76, 79, 81, 82, 83, 84, 86, 87, 88, 91, 103, 195], $Vo1 = [71, 74, 77], $Vp1 = [16, 35, 45, 46, 50, 51, 54, 55, 57, 58, 60, 76, 79, 81, 82, 83, 84, 86, 87, 88, 91, 103, 195], $Vq1 = [1, 236], $Vr1 = [1, 237], $Vs1 = [6, 8, 14, 17], $Vt1 = [6, 8, 14, 17, 43, 157], $Vu1 = [1, 254], $Vv1 = [1, 250], $Vw1 = [2, 198], $Vx1 = [1, 258], $Vy1 = [1, 259], $Vz1 = [6, 8, 14, 17, 43, 129, 135, 138, 144, 146, 150, 152, 154, 182], $VA1 = [1, 261], $VB1 = [1, 264], $VC1 = [1, 265], $VD1 = [1, 266], $VE1 = [1, 267], $VF1 = [2, 175], $VG1 = [1, 263], $VH1 = [6, 8, 14, 17, 36, 43, 89, 129, 135, 138, 144, 146, 150, 152, 154, 164, 165, 167, 168, 173, 177, 179, 180, 182], $VI1 = [6, 8, 14, 17, 135, 138, 144, 146, 150, 152, 154], $VJ1 = [1, 279], $VK1 = [2, 180], $VL1 = [170, 173], $VM1 = [6, 8, 14, 17, 36, 43, 89, 129, 135, 138, 144, 146, 150, 152, 154, 164, 165, 167, 168, 173, 177, 179, 180, 182, 192, 193, 194], $VN1 = [2, 200], $VO1 = [1, 284], $VP1 = [1, 296], $VQ1 = [1, 304], $VR1 = [1, 305], $VS1 = [1, 306], $VT1 = [6, 8, 14, 17, 138, 146, 150, 152, 154], $VU1 = [1, 316], $VV1 = [1, 322], $VW1 = [1, 323], $VX1 = [2, 205], $VY1 = [1, 334], $VZ1 = [16, 152], $V_1 = [6, 8, 14, 17, 152, 154], $V$1 = [1, 350];
  var parser = {
    trace: function trace() {
    },
    yy: {},
    symbols_: { "error": 2, "main": 3, "selectClause": 4, "semicolonOpt": 5, "EOF": 6, "unionClause": 7, ";": 8, "unionClauseNotParenthesized": 9, "unionClauseParenthesized": 10, "order_by_opt": 11, "limit_opt": 12, "selectClauseParenthesized": 13, "UNION": 14, "distinctOpt": 15, "(": 16, ")": 17, "SELECT": 18, "highPriorityOpt": 19, "maxStateMentTimeOpt": 20, "straightJoinOpt": 21, "sqlSmallResultOpt": 22, "sqlBigResultOpt": 23, "sqlBufferResultOpt": 24, "sqlCacheOpt": 25, "sqlCalcFoundRowsOpt": 26, "selectExprList": 27, "selectDataSetOpt": 28, "ALL": 29, "DISTINCT": 30, "DISTINCTROW": 31, "HIGH_PRIORITY": 32, "MAX_STATEMENT_TIME": 33, "=": 34, "NUMERIC": 35, "STRAIGHT_JOIN": 36, "SQL_SMALL_RESULT": 37, "SQL_BIG_RESULT": 38, "SQL_BUFFER_RESULT": 39, "SQL_CACHE": 40, "SQL_NO_CACHE": 41, "SQL_CALC_FOUND_ROWS": 42, ",": 43, "selectExpr": 44, "*": 45, "SELECT_EXPR_STAR": 46, "expr": 47, "selectExprAliasOpt": 48, "AS": 49, "IDENTIFIER": 50, "STRING": 51, "string": 52, "number": 53, "EXPONENT_NUMERIC": 54, "HEX_NUMERIC": 55, "boolean": 56, "TRUE": 57, "FALSE": 58, "null": 59, "NULL": 60, "literal": 61, "place_holder": 62, "function_call": 63, "function_call_param_list": 64, "function_call_param": 65, "identifier": 66, "DOT": 67, "identifier_list": 68, "case_expr_opt": 69, "when_then_list": 70, "WHEN": 71, "THEN": 72, "case_when_else": 73, "ELSE": 74, "case_when": 75, "CASE": 76, "END": 77, "simple_expr_prefix": 78, "+": 79, "simple_expr": 80, "-": 81, "~": 82, "!": 83, "BINARY": 84, "expr_list": 85, "ROW": 86, "EXISTS": 87, "{": 88, "}": 89, "||": 90, "WILDCARD": 91, "bit_expr": 92, "|": 93, "&": 94, "<<": 95, ">>": 96, "/": 97, "DIV": 98, "MOD": 99, "%": 100, "^": 101, "not_opt": 102, "NOT": 103, "escape_opt": 104, "ESCAPE": 105, "predicate": 106, "IN": 107, "BETWEEN": 108, "AND": 109, "SOUNDS": 110, "LIKE": 111, "REGEXP": 112, "comparison_operator": 113, ">=": 114, ">": 115, "<=": 116, "<": 117, "<>": 118, "!=": 119, "sub_query_data_set_opt": 120, "ANY": 121, "boolean_primary": 122, "IS": 123, "boolean_extra": 124, "UNKNOWN": 125, "OR": 126, "XOR": 127, "where_opt": 128, "WHERE": 129, "group_by_opt": 130, "group_by": 131, "roll_up_opt": 132, "WITH": 133, "ROLLUP": 134, "GROUP_BY": 135, "group_by_order_by_item_list": 136, "order_by": 137, "ORDER_BY": 138, "group_by_order_by_item": 139, "sort_opt": 140, "ASC": 141, "DESC": 142, "having_opt": 143, "HAVING": 144, "limit": 145, "LIMIT": 146, "OFFSET": 147, "procedure_opt": 148, "procedure": 149, "PROCEDURE": 150, "for_update_lock_in_share_mode_opt": 151, "FOR": 152, "UPDATE": 153, "LOCK": 154, "SHARE": 155, "MODE": 156, "FROM": 157, "table_references": 158, "partitionOpt": 159, "escaped_table_reference": 160, "table_reference": 161, "OJ": 162, "join_inner_cross": 163, "INNER": 164, "CROSS": 165, "left_right": 166, "LEFT": 167, "RIGHT": 168, "out_opt": 169, "OUTER": 170, "left_right_out_opt": 171, "join_table": 172, "JOIN": 173, "table_factor": 174, "join_condition": 175, "on_join_condition": 176, "NATURAL": 177, "join_condition_opt": 178, "ON": 179, "USING": 180, "partition_names": 181, "PARTITION": 182, "aliasOpt": 183, "index_or_key": 184, "INDEX": 185, "KEY": 186, "for_opt": 187, "identifier_list_opt": 188, "index_hint_list_opt": 189, "index_hint_list": 190, "index_hint": 191, "USE": 192, "IGNORE": 193, "FORCE": 194, "PLACE_HOLDER": 195, "$accept": 0, "$end": 1 },
    terminals_: { 2: "error", 6: "EOF", 8: ";", 14: "UNION", 16: "(", 17: ")", 18: "SELECT", 29: "ALL", 30: "DISTINCT", 31: "DISTINCTROW", 32: "HIGH_PRIORITY", 33: "MAX_STATEMENT_TIME", 34: "=", 35: "NUMERIC", 36: "STRAIGHT_JOIN", 37: "SQL_SMALL_RESULT", 38: "SQL_BIG_RESULT", 39: "SQL_BUFFER_RESULT", 40: "SQL_CACHE", 41: "SQL_NO_CACHE", 42: "SQL_CALC_FOUND_ROWS", 43: ",", 45: "*", 46: "SELECT_EXPR_STAR", 49: "AS", 50: "IDENTIFIER", 51: "STRING", 54: "EXPONENT_NUMERIC", 55: "HEX_NUMERIC", 57: "TRUE", 58: "FALSE", 60: "NULL", 67: "DOT", 71: "WHEN", 72: "THEN", 74: "ELSE", 76: "CASE", 77: "END", 79: "+", 81: "-", 82: "~", 83: "!", 84: "BINARY", 86: "ROW", 87: "EXISTS", 88: "{", 89: "}", 90: "||", 91: "WILDCARD", 93: "|", 94: "&", 95: "<<", 96: ">>", 97: "/", 98: "DIV", 99: "MOD", 100: "%", 101: "^", 103: "NOT", 105: "ESCAPE", 107: "IN", 108: "BETWEEN", 109: "AND", 110: "SOUNDS", 111: "LIKE", 112: "REGEXP", 114: ">=", 115: ">", 116: "<=", 117: "<", 118: "<>", 119: "!=", 121: "ANY", 123: "IS", 125: "UNKNOWN", 126: "OR", 127: "XOR", 129: "WHERE", 133: "WITH", 134: "ROLLUP", 135: "GROUP_BY", 138: "ORDER_BY", 141: "ASC", 142: "DESC", 144: "HAVING", 146: "LIMIT", 147: "OFFSET", 150: "PROCEDURE", 152: "FOR", 153: "UPDATE", 154: "LOCK", 155: "SHARE", 156: "MODE", 157: "FROM", 162: "OJ", 164: "INNER", 165: "CROSS", 167: "LEFT", 168: "RIGHT", 170: "OUTER", 173: "JOIN", 177: "NATURAL", 179: "ON", 180: "USING", 182: "PARTITION", 185: "INDEX", 186: "KEY", 192: "USE", 193: "IGNORE", 194: "FORCE", 195: "PLACE_HOLDER" },
    productions_: [0, [3, 3], [3, 3], [5, 1], [5, 0], [7, 1], [7, 3], [10, 4], [10, 4], [13, 3], [9, 4], [9, 4], [4, 12], [15, 1], [15, 1], [15, 1], [15, 0], [19, 1], [19, 0], [20, 3], [20, 0], [21, 1], [21, 0], [22, 1], [22, 0], [23, 1], [23, 0], [24, 1], [24, 0], [25, 0], [25, 1], [25, 1], [26, 1], [26, 0], [27, 3], [27, 1], [44, 1], [44, 1], [44, 2], [48, 0], [48, 2], [48, 1], [48, 2], [48, 1], [52, 1], [53, 1], [53, 1], [53, 1], [56, 1], [56, 1], [59, 1], [61, 1], [61, 1], [61, 1], [61, 1], [61, 1], [63, 4], [64, 3], [64, 1], [65, 0], [65, 1], [65, 1], [65, 2], [65, 1], [66, 1], [66, 3], [68, 1], [68, 3], [69, 0], [69, 1], [70, 4], [70, 5], [73, 0], [73, 2], [75, 5], [78, 2], [78, 2], [78, 2], [78, 2], [78, 2], [80, 1], [80, 1], [80, 1], [80, 1], [80, 3], [80, 4], [80, 3], [80, 4], [80, 4], [80, 1], [80, 3], [80, 3], [80, 5], [92, 1], [92, 3], [92, 3], [92, 3], [92, 3], [92, 3], [92, 3], [92, 3], [92, 3], [92, 3], [92, 3], [92, 3], [92, 3], [102, 0], [102, 1], [104, 0], [104, 2], [106, 1], [106, 6], [106, 6], [106, 6], [106, 4], [106, 5], [106, 4], [113, 1], [113, 1], [113, 1], [113, 1], [113, 1], [113, 1], [113, 1], [120, 1], [120, 1], [122, 1], [122, 4], [122, 3], [122, 6], [124, 1], [124, 1], [47, 1], [47, 4], [47, 2], [47, 3], [47, 3], [47, 3], [85, 1], [85, 3], [128, 0], [128, 2], [130, 0], [130, 1], [132, 0], [132, 2], [131, 3], [11, 0], [11, 1], [137, 3], [136, 1], [136, 3], [139, 2], [140, 0], [140, 1], [140, 1], [143, 0], [143, 2], [145, 2], [145, 4], [145, 4], [12, 0], [12, 1], [148, 0], [148, 1], [149, 2], [151, 0], [151, 2], [151, 4], [28, 0], [28, 10], [158, 1], [158, 3], [160, 1], [160, 4], [163, 0], [163, 1], [163, 1], [166, 1], [166, 1], [169, 0], [169, 1], [171, 0], [171, 2], [172, 4], [172, 5], [172, 4], [172, 6], [172, 5], [178, 0], [178, 1], [176, 2], [175, 1], [175, 4], [161, 1], [161, 1], [181, 1], [181, 3], [159, 0], [159, 4], [183, 0], [183, 2], [183, 1], [184, 1], [184, 1], [187, 0], [187, 2], [187, 2], [187, 2], [188, 0], [188, 1], [189, 0], [189, 1], [190, 1], [190, 3], [191, 6], [191, 6], [191, 6], [174, 4], [174, 4], [174, 3], [62, 1]],
    performAction: function anonymous(yytext, yyleng, yylineno, yy, yystate, $$, _$) {
      var $0 = $$.length - 1;
      switch (yystate) {
        case 1:
        case 2:
          return { nodeType: "Main", value: $$[$0 - 2], hasSemicolon: $$[$0 - 1] };
        case 3:
        case 145:
          this.$ = true;
          break;
        case 4:
          this.$ = false;
          break;
        case 5:
        case 13:
        case 14:
        case 15:
        case 17:
        case 19:
        case 21:
        case 23:
        case 25:
        case 27:
        case 30:
        case 31:
        case 32:
        case 51:
        case 52:
        case 53:
        case 54:
        case 55:
        case 60:
        case 61:
        case 63:
        case 69:
        case 73:
        case 80:
        case 81:
        case 82:
        case 83:
        case 89:
        case 93:
        case 107:
        case 109:
        case 110:
        case 117:
        case 118:
        case 119:
        case 120:
        case 121:
        case 122:
        case 123:
        case 124:
        case 125:
        case 126:
        case 130:
        case 132:
        case 141:
        case 143:
        case 148:
        case 154:
        case 155:
        case 157:
        case 162:
        case 164:
        case 165:
        case 176:
        case 177:
        case 178:
        case 179:
        case 181:
        case 190:
        case 192:
        case 194:
        case 195:
        case 203:
        case 204:
        case 210:
        case 212:
          this.$ = $$[$0];
          break;
        case 6:
          this.$ = $$[$0 - 2], this.$.orderBy = $$[$0 - 1], this.$.limit = $$[$0];
          break;
        case 7:
        case 8:
          this.$ = { type: "Union", left: $$[$0 - 3], distinctOpt: $$[$0 - 1], right: $$[$0] };
          break;
        case 9:
          this.$ = { type: "SelectParenthesized", value: $$[$0 - 1] };
          break;
        case 10:
        case 11:
          this.$ = { type: "Union", left: $$[$0 - 3], distinctOpt: $$[$0 - 1], right: $$[$0] };
          break;
        case 12:
          this.$ = {
            type: "Select",
            distinctOpt: $$[$0 - 10],
            highPriorityOpt: $$[$0 - 9],
            maxStateMentTimeOpt: $$[$0 - 8],
            straightJoinOpt: $$[$0 - 7],
            sqlSmallResultOpt: $$[$0 - 6],
            sqlBigResultOpt: $$[$0 - 5],
            sqlBufferResultOpt: $$[$0 - 4],
            sqlCacheOpt: $$[$0 - 3],
            sqlCalcFoundRowsOpt: $$[$0 - 2],
            selectItems: $$[$0 - 1],
            from: $$[$0].from,
            partition: $$[$0].partition,
            where: $$[$0].where,
            groupBy: $$[$0].groupBy,
            having: $$[$0].having,
            orderBy: $$[$0].orderBy,
            limit: $$[$0].limit,
            procedure: $$[$0].procedure,
            updateLockMode: $$[$0].updateLockMode
          };
          break;
        case 16:
        case 18:
        case 20:
        case 22:
        case 24:
        case 26:
        case 28:
        case 29:
        case 33:
        case 59:
        case 68:
        case 72:
        case 106:
        case 108:
        case 140:
        case 142:
        case 144:
        case 147:
        case 153:
        case 156:
        case 161:
        case 163:
        case 166:
        case 175:
        case 180:
        case 189:
        case 198:
        case 205:
        case 209:
        case 211:
          this.$ = null;
          break;
        case 34:
          $$[$0 - 2].value.push($$[$0]);
          break;
        case 35:
          this.$ = { type: "SelectExpr", value: [$$[$0]] };
          break;
        case 36:
        case 37:
        case 64:
          this.$ = { type: "Identifier", value: $$[$0] };
          break;
        case 38:
          this.$ = $$[$0 - 1];
          this.$.alias = $$[$0].alias;
          this.$.hasAs = $$[$0].hasAs;
          break;
        case 39:
        case 200:
          this.$ = { alias: null, hasAs: null };
          break;
        case 40:
        case 42:
          this.$ = { alias: $$[$0], hasAs: true };
          break;
        case 41:
          this.$ = { alias: $$[$0], hasAs: false };
          break;
        case 43:
          this.$ = { alias: $$[$01], hasAs: false };
          break;
        case 44:
          this.$ = { type: "String", value: $$[$0] };
          break;
        case 45:
        case 46:
        case 47:
          this.$ = { type: "Number", value: $$[$0] };
          break;
        case 48:
          this.$ = { type: "Boolean", value: "TRUE" };
          break;
        case 49:
          this.$ = { type: "Boolean", value: "FALSE" };
          break;
        case 50:
          this.$ = { type: "Null", value: "null" };
          break;
        case 56:
          this.$ = { type: "FunctionCall", name: $$[$0 - 3], params: $$[$0 - 1] };
          break;
        case 57:
          $$[$0 - 2].push($$[$0]);
          this.$ = $$[$0 - 2];
          break;
        case 58:
          this.$ = [$$[$0]];
          break;
        case 62:
          this.$ = { type: "FunctionCallParam", distinctOpt: $$[$0 - 1], value: $$[$0] };
          break;
        case 65:
          this.$ = $$[$0 - 2];
          $$[$0 - 2].value += "." + $$[$0];
          break;
        case 66:
          this.$ = { type: "IdentifierList", value: [$$[$0]] };
          break;
        case 67:
        case 172:
          this.$ = $$[$0 - 2];
          $$[$0 - 2].value.push($$[$0]);
          break;
        case 70:
          this.$ = { type: "WhenThenList", value: [{ when: $$[$0 - 2], then: $$[$0] }] };
          break;
        case 71:
          this.$ = $$[$0 - 4];
          this.$.value.push({ when: $$[$0 - 2], then: $$[$0] });
          break;
        case 74:
          this.$ = { type: "CaseWhen", caseExprOpt: $$[$0 - 3], whenThenList: $$[$0 - 2], else: $$[$0 - 1] };
          break;
        case 75:
        case 76:
        case 77:
        case 78:
        case 79:
          this.$ = { type: "Prefix", prefix: $$[$0 - 1], value: $$[$0] };
          break;
        case 84:
          this.$ = { type: "SimpleExprParentheses", value: $$[$0 - 1] };
          break;
        case 85:
          this.$ = { type: "SimpleExprParentheses", value: $$[$0 - 2], hasRow: true };
          break;
        case 86:
          this.$ = { type: "SubQuery", value: $$[$0 - 1] };
          break;
        case 87:
          this.$ = { type: "SubQuery", value: $$[$0 - 1], hasExists: true };
          break;
        case 88:
          this.$ = { type: "IdentifierExpr", identifier: $$[$0 - 2], value: $$[$0 - 1] };
          break;
        case 90:
          this.$ = { type: "StartsWithExpr", value: $$[$0 - 2] };
          break;
        case 91:
          this.$ = { type: "EndsWithExpr", value: $$[$0] };
          break;
        case 92:
          this.$ = { type: "ContainsExpr", value: $$[$0 - 2] };
          break;
        case 94:
          this.$ = { type: "BitExpression", operator: "|", left: $$[$0 - 2], right: $$[$0] };
          break;
        case 95:
          this.$ = { type: "BitExpression", operator: "&", left: $$[$0 - 2], right: $$[$0] };
          break;
        case 96:
          this.$ = { type: "BitExpression", operator: "<<", left: $$[$0 - 2], right: $$[$0] };
          break;
        case 97:
          this.$ = { type: "BitExpression", operator: ">>", left: $$[$0 - 2], right: $$[$0] };
          break;
        case 98:
          this.$ = { type: "BitExpression", operator: "+", left: $$[$0 - 2], right: $$[$0] };
          break;
        case 99:
          this.$ = { type: "BitExpression", operator: "-", left: $$[$0 - 2], right: $$[$0] };
          break;
        case 100:
          this.$ = { type: "BitExpression", operator: "*", left: $$[$0 - 2], right: $$[$0] };
          break;
        case 101:
          this.$ = { type: "BitExpression", operator: "/", left: $$[$0 - 2], right: $$[$0] };
          break;
        case 102:
          this.$ = { type: "BitExpression", operator: "DIV", left: $$[$0 - 2], right: $$[$0] };
          break;
        case 103:
          this.$ = { type: "BitExpression", operator: "MOD", left: $$[$0 - 2], right: $$[$0] };
          break;
        case 104:
          this.$ = { type: "BitExpression", operator: "%", left: $$[$0 - 2], right: $$[$0] };
          break;
        case 105:
          this.$ = { type: "BitExpression", operator: "^", left: $$[$0 - 2], right: $$[$0] };
          break;
        case 111:
          this.$ = { type: "InSubQueryPredicate", hasNot: $$[$0 - 4], left: $$[$0 - 5], right: $$[$0 - 1] };
          break;
        case 112:
          this.$ = { type: "InExpressionListPredicate", hasNot: $$[$0 - 4], left: $$[$0 - 5], right: $$[$0 - 1] };
          break;
        case 113:
          this.$ = { type: "BetweenPredicate", hasNot: $$[$0 - 4], left: $$[$0 - 5], right: { left: $$[$0 - 2], right: $$[$0] } };
          break;
        case 114:
          this.$ = { type: "SoundsLikePredicate", hasNot: false, left: $$[$0 - 3], right: $$[$0] };
          break;
        case 115:
          this.$ = { type: "LikePredicate", hasNot: $$[$0 - 3], left: $$[$0 - 4], right: $$[$0 - 1], escape: $$[$0] };
          break;
        case 116:
          this.$ = { type: "RegexpPredicate", hasNot: $$[$0 - 2], left: $$[$0 - 3], right: $$[$0] };
          break;
        case 127:
          this.$ = { type: "IsNullBooleanPrimary", hasNot: $$[$0 - 1], value: $$[$0 - 3] };
          break;
        case 128:
          this.$ = { type: "ComparisonBooleanPrimary", left: $$[$0 - 2], operator: $$[$0 - 1], right: $$[$0] };
          break;
        case 129:
          this.$ = { type: "ComparisonSubQueryBooleanPrimary", operator: $$[$0 - 4], subQueryOpt: $$[$0 - 3], left: $$[$0 - 5], right: $$[$0 - 1] };
          break;
        case 131:
          this.$ = { type: "BooleanExtra", value: $$[$0] };
          break;
        case 133:
          this.$ = { type: "IsExpression", hasNot: $$[$0 - 1], left: $$[$0 - 3], right: $$[$0] };
          break;
        case 134:
          this.$ = { type: "NotExpression", value: $$[$0] };
          break;
        case 135:
          this.$ = { type: "OrExpression", operator: $$[$0 - 1], left: $$[$0 - 2], right: $$[$0] };
          break;
        case 136:
          this.$ = { type: "AndExpression", operator: $$[$0 - 1], left: $$[$0 - 2], right: $$[$0] };
          break;
        case 137:
          this.$ = { type: "XorExpression", operator: $$[$0 - 1], left: $$[$0 - 2], right: $$[$0] };
          break;
        case 138:
          this.$ = { type: "ExpressionList", value: [$$[$0]] };
          break;
        case 139:
        case 214:
          this.$ = $$[$0 - 2];
          this.$.value.push($$[$0]);
          break;
        case 146:
          this.$ = { type: "GroupBy", value: $$[$0 - 1], rollUp: $$[$0] };
          break;
        case 149:
          this.$ = { type: "OrderBy", value: $$[$0 - 1], rollUp: $$[$0] };
          break;
        case 150:
        case 196:
          this.$ = [$$[$0]];
          break;
        case 151:
          this.$ = $$[$0 - 2];
          $$[$0 - 2].push($$[$0]);
          break;
        case 152:
          this.$ = { type: "GroupByOrderByItem", value: $$[$0 - 1], sortOpt: $$[$0] };
          break;
        case 158:
          this.$ = { type: "Limit", value: [$$[$0]] };
          break;
        case 159:
          this.$ = { type: "Limit", value: [$$[$0 - 2], $$[$0]] };
          break;
        case 160:
          this.$ = { type: "Limit", value: [$$[$0], $$[$0 - 2]], offsetMode: true };
          break;
        case 167:
          this.$ = $$[$0 - 1] + " " + $$[$0];
          break;
        case 168:
          this.$ = $$[$0 - 3] + " " + $$[$0 - 2] + " " + $$[$0 - 1] + " " + $$[$0];
          break;
        case 169:
          this.$ = {};
          break;
        case 170:
          this.$ = { from: $$[$0 - 8], partition: $$[$0 - 7], where: $$[$0 - 6], groupBy: $$[$0 - 5], having: $$[$0 - 4], orderBy: $$[$0 - 3], limit: $$[$0 - 2], procedure: $$[$0 - 1], updateLockMode: $$[$0] };
          break;
        case 171:
          this.$ = { type: "TableReferences", value: [$$[$0]] };
          break;
        case 173:
          this.$ = { type: "TableReference", value: $$[$0] };
          break;
        case 174:
          this.$ = { type: "TableReference", hasOj: true, value: $$[$0 - 1] };
          break;
        case 182:
          this.$ = { leftRight: null, outOpt: null };
          break;
        case 183:
          this.$ = { leftRight: $$[$0 - 1], outOpt: $$[$0] };
          break;
        case 184:
          this.$ = { type: "InnerCrossJoinTable", innerCrossOpt: $$[$0 - 2], left: $$[$0 - 3], right: $$[$0], condition: null };
          break;
        case 185:
          this.$ = { type: "InnerCrossJoinTable", innerCrossOpt: $$[$0 - 3], left: $$[$0 - 4], right: $$[$0 - 1], condition: $$[$0] };
          break;
        case 186:
          this.$ = { type: "StraightJoinTable", left: $$[$0 - 3], right: $$[$0 - 1], condition: $$[$0] };
          break;
        case 187:
          this.$ = { type: "LeftRightJoinTable", leftRight: $$[$0 - 4], outOpt: $$[$0 - 3], left: $$[$0 - 5], right: $$[$0 - 1], condition: $$[$0] };
          break;
        case 188:
          this.$ = { type: "NaturalJoinTable", leftRight: $$[$0 - 2].leftRight, outOpt: $$[$0 - 2].outOpt, left: $$[$0 - 4], right: $$[$0] };
          break;
        case 191:
          this.$ = { type: "OnJoinCondition", value: $$[$0] };
          break;
        case 193:
          this.$ = { type: "UsingJoinCondition", value: $$[$0 - 1] };
          break;
        case 197:
          this.$ = $$[$0 - 2];
          $$[$0 - 2].push($$[$0]);
          break;
        case 199:
          this.$ = { type: "Partitions", value: $$[$0 - 1] };
          break;
        case 201:
          this.$ = { hasAs: true, alias: $$[$0] };
          break;
        case 202:
          this.$ = { hasAs: false, alias: $$[$0] };
          break;
        case 206:
        case 207:
        case 208:
          this.$ = { type: "ForOptIndexHint", value: $$[$0] };
          break;
        case 213:
          this.$ = { type: "IndexHintList", value: [$$[$0]] };
          break;
        case 215:
          this.$ = { type: "UseIndexHint", value: $$[$0 - 1], forOpt: $$[$0 - 3], indexOrKey: $$[$0 - 4] };
          break;
        case 216:
          this.$ = { type: "IgnoreIndexHint", value: $$[$0 - 1], forOpt: $$[$0 - 3], indexOrKey: $$[$0 - 4] };
          break;
        case 217:
          this.$ = { type: "ForceIndexHint", value: $$[$0 - 1], forOpt: $$[$0 - 3], indexOrKey: $$[$0 - 4] };
          break;
        case 218:
          this.$ = { type: "TableFactor", value: $$[$0 - 3], partition: $$[$0 - 2], alias: $$[$0 - 1].alias, hasAs: $$[$0 - 1].hasAs, indexHintOpt: $$[$0] };
          break;
        case 219:
          this.$ = { type: "TableFactor", value: { type: "SubQuery", value: $$[$0 - 2] }, alias: $$[$0].alias, hasAs: $$[$0].hasAs };
          break;
        case 220:
          this.$ = $$[$0 - 1];
          this.$.hasParentheses = true;
          break;
        case 221:
          this.$ = { type: "PlaceHolder", value: $$[$0], param: $$[$0].slice(2, -1) };
          break;
      }
    },
    table: [{ 3: 1, 4: 2, 7: 3, 9: 5, 10: 6, 13: 7, 16: $V0, 18: $V1 }, { 1: [3] }, { 5: 9, 6: $V2, 8: $V3, 14: $V4 }, { 5: 12, 6: $V2, 8: $V3 }, o([16, 32, 33, 35, 36, 37, 38, 39, 40, 41, 42, 45, 46, 50, 51, 54, 55, 57, 58, 60, 76, 79, 81, 82, 83, 84, 86, 87, 88, 91, 103, 195], $V5, { 15: 13, 29: $V6, 30: $V7, 31: $V8 }), o($V9, [2, 5]), o([6, 8, 146], $Va, { 11: 17, 137: 18, 138: $Vb }), { 14: $Vc }, { 4: 21, 18: $V1 }, { 6: [1, 22] }, { 15: 23, 18: $V5, 29: $V6, 30: $V7, 31: $V8 }, { 6: [2, 3] }, { 6: [1, 24] }, o($Vd, [2, 18], { 19: 25, 32: [1, 26] }), o($Ve, [2, 13]), o($Ve, [2, 14]), o($Ve, [2, 15]), o($V9, $Vf, { 12: 27, 145: 28, 146: $Vg }), o($Vh, [2, 148]), { 16: $Vi, 35: $Vj, 47: 32, 50: $Vk, 51: $Vl, 52: 48, 53: 49, 54: $Vm, 55: $Vn, 56: 50, 57: $Vo, 58: $Vp, 59: 51, 60: $Vq, 61: 38, 62: 52, 63: 40, 66: 39, 75: 46, 76: $Vr, 78: 41, 79: $Vs, 80: 37, 81: $Vt, 82: $Vu, 83: $Vv, 84: $Vw, 86: $Vx, 87: $Vy, 88: $Vz, 91: $VA, 92: 36, 103: $VB, 106: 35, 122: 33, 136: 30, 139: 31, 195: $VC }, { 15: 68, 16: $V5, 29: $V6, 30: $V7, 31: $V8 }, { 17: [1, 69] }, { 1: [2, 1] }, { 4: 70, 9: 71, 18: $V1 }, { 1: [2, 2] }, o($VD, [2, 20], { 20: 72, 33: [1, 73] }), o($Vd, [2, 17]), o($V9, [2, 6]), o($VE, [2, 162]), { 35: [1, 74] }, o($Vh, $VF, { 132: 75, 43: $VG, 133: $VH }), o($VI, [2, 150]), o($VI, [2, 153], { 140: 78, 109: $VJ, 126: $VK, 127: $VL, 141: [1, 82], 142: [1, 83] }), o($VM, [2, 132], { 113: 85, 34: [1, 86], 114: [1, 87], 115: [1, 88], 116: [1, 89], 117: [1, 90], 118: [1, 91], 119: [1, 92], 123: [1, 84] }), { 16: $Vi, 35: $Vj, 47: 93, 50: $Vk, 51: $Vl, 52: 48, 53: 49, 54: $Vm, 55: $Vn, 56: 50, 57: $Vo, 58: $Vp, 59: 51, 60: $Vq, 61: 38, 62: 52, 63: 40, 66: 39, 75: 46, 76: $Vr, 78: 41, 79: $Vs, 80: 37, 81: $Vt, 82: $Vu, 83: $Vv, 84: $Vw, 86: $Vx, 87: $Vy, 88: $Vz, 91: $VA, 92: 36, 103: $VB, 106: 35, 122: 33, 195: $VC }, o($VN, [2, 126]), o($VN, [2, 110], { 102: 94, 45: $VO, 79: $VP, 81: $VQ, 93: $VR, 94: $VS, 95: $VT, 96: $VU, 97: $VV, 98: $VW, 99: $VX, 100: $VY, 101: $VZ, 103: $V_, 107: $V$, 108: $V$, 111: $V$, 112: $V$, 110: [1, 95] }), o($V01, [2, 93]), o($V11, [2, 80]), o($V11, [2, 81], { 67: $V21, 90: [1, 109] }), o($V11, [2, 82]), o($V11, [2, 83]), { 4: 112, 16: $Vi, 18: $V1, 35: $Vj, 47: 113, 50: $Vk, 51: $Vl, 52: 48, 53: 49, 54: $Vm, 55: $Vn, 56: 50, 57: $Vo, 58: $Vp, 59: 51, 60: $Vq, 61: 38, 62: 52, 63: 40, 66: 39, 75: 46, 76: $Vr, 78: 41, 79: $Vs, 80: 37, 81: $Vt, 82: $Vu, 83: $Vv, 84: $Vw, 85: 111, 86: $Vx, 87: $Vy, 88: $Vz, 91: $VA, 92: 36, 103: $VB, 106: 35, 122: 33, 195: $VC }, { 16: [1, 114] }, { 16: [1, 115] }, { 50: $V31, 66: 116 }, o($V11, [2, 89]), { 90: [1, 118] }, o($V11, [2, 51]), o($V11, [2, 52]), o($V11, [2, 53]), o($V11, [2, 54]), o($V11, [2, 55]), o([6, 8, 14, 17, 34, 36, 43, 45, 49, 50, 51, 67, 71, 72, 74, 77, 79, 81, 89, 90, 93, 94, 95, 96, 97, 98, 99, 100, 101, 103, 105, 107, 108, 109, 110, 111, 112, 114, 115, 116, 117, 118, 119, 123, 126, 127, 129, 133, 135, 138, 141, 142, 144, 146, 150, 152, 154, 157, 164, 165, 167, 168, 173, 177, 179, 180, 182], $V41, { 16: $V51 }), { 16: $Vi, 35: $Vj, 50: $Vk, 51: $Vl, 52: 48, 53: 49, 54: $Vm, 55: $Vn, 56: 50, 57: $Vo, 58: $Vp, 59: 51, 60: $Vq, 61: 38, 62: 52, 63: 40, 66: 39, 75: 46, 76: $Vr, 78: 41, 79: $Vs, 80: 120, 81: $Vt, 82: $Vu, 83: $Vv, 84: $Vw, 86: $Vx, 87: $Vy, 88: $Vz, 91: $VA, 195: $VC }, { 16: $Vi, 35: $Vj, 50: $Vk, 51: $Vl, 52: 48, 53: 49, 54: $Vm, 55: $Vn, 56: 50, 57: $Vo, 58: $Vp, 59: 51, 60: $Vq, 61: 38, 62: 52, 63: 40, 66: 39, 75: 46, 76: $Vr, 78: 41, 79: $Vs, 80: 121, 81: $Vt, 82: $Vu, 83: $Vv, 84: $Vw, 86: $Vx, 87: $Vy, 88: $Vz, 91: $VA, 195: $VC }, { 16: $Vi, 35: $Vj, 50: $Vk, 51: $Vl, 52: 48, 53: 49, 54: $Vm, 55: $Vn, 56: 50, 57: $Vo, 58: $Vp, 59: 51, 60: $Vq, 61: 38, 62: 52, 63: 40, 66: 39, 75: 46, 76: $Vr, 78: 41, 79: $Vs, 80: 122, 81: $Vt, 82: $Vu, 83: $Vv, 84: $Vw, 86: $Vx, 87: $Vy, 88: $Vz, 91: $VA, 195: $VC }, { 16: $Vi, 35: $Vj, 50: $Vk, 51: $Vl, 52: 48, 53: 49, 54: $Vm, 55: $Vn, 56: 50, 57: $Vo, 58: $Vp, 59: 51, 60: $Vq, 61: 38, 62: 52, 63: 40, 66: 39, 75: 46, 76: $Vr, 78: 41, 79: $Vs, 80: 123, 81: $Vt, 82: $Vu, 83: $Vv, 84: $Vw, 86: $Vx, 87: $Vy, 88: $Vz, 91: $VA, 195: $VC }, { 16: $Vi, 35: $Vj, 50: $Vk, 51: $Vl, 52: 48, 53: 49, 54: $Vm, 55: $Vn, 56: 50, 57: $Vo, 58: $Vp, 59: 51, 60: $Vq, 61: 38, 62: 52, 63: 40, 66: 39, 75: 46, 76: $Vr, 78: 41, 79: $Vs, 80: 124, 81: $Vt, 82: $Vu, 83: $Vv, 84: $Vw, 86: $Vx, 87: $Vy, 88: $Vz, 91: $VA, 195: $VC }, { 16: $Vi, 35: $Vj, 47: 126, 50: $Vk, 51: $Vl, 52: 48, 53: 49, 54: $Vm, 55: $Vn, 56: 50, 57: $Vo, 58: $Vp, 59: 51, 60: $Vq, 61: 38, 62: 52, 63: 40, 66: 39, 69: 125, 71: [2, 68], 75: 46, 76: $Vr, 78: 41, 79: $Vs, 80: 37, 81: $Vt, 82: $Vu, 83: $Vv, 84: $Vw, 86: $Vx, 87: $Vy, 88: $Vz, 91: $VA, 92: 36, 103: $VB, 106: 35, 122: 33, 195: $VC }, o($V11, [2, 44]), o($V11, [2, 45]), o($V11, [2, 46]), o($V11, [2, 47]), o($V11, [2, 48]), o($V11, [2, 49]), o($V11, [2, 50]), o($V11, [2, 221]), { 10: 128, 13: 127, 16: $V0 }, o([6, 8, 14, 138, 146], [2, 9]), o($V9, [2, 10], { 14: $V4 }), o($V9, [2, 11]), o($V61, [2, 22], { 21: 129, 36: [1, 130] }), { 34: [1, 131] }, o($VE, [2, 158], { 43: [1, 132], 147: [1, 133] }), o($Vh, [2, 149]), { 16: $Vi, 35: $Vj, 47: 32, 50: $Vk, 51: $Vl, 52: 48, 53: 49, 54: $Vm, 55: $Vn, 56: 50, 57: $Vo, 58: $Vp, 59: 51, 60: $Vq, 61: 38, 62: 52, 63: 40, 66: 39, 75: 46, 76: $Vr, 78: 41, 79: $Vs, 80: 37, 81: $Vt, 82: $Vu, 83: $Vv, 84: $Vw, 86: $Vx, 87: $Vy, 88: $Vz, 91: $VA, 92: 36, 103: $VB, 106: 35, 122: 33, 139: 134, 195: $VC }, { 134: [1, 135] }, o($VI, [2, 152]), { 16: $Vi, 35: $Vj, 47: 136, 50: $Vk, 51: $Vl, 52: 48, 53: 49, 54: $Vm, 55: $Vn, 56: 50, 57: $Vo, 58: $Vp, 59: 51, 60: $Vq, 61: 38, 62: 52, 63: 40, 66: 39, 75: 46, 76: $Vr, 78: 41, 79: $Vs, 80: 37, 81: $Vt, 82: $Vu, 83: $Vv, 84: $Vw, 86: $Vx, 87: $Vy, 88: $Vz, 91: $VA, 92: 36, 103: $VB, 106: 35, 122: 33, 195: $VC }, { 16: $Vi, 35: $Vj, 47: 137, 50: $Vk, 51: $Vl, 52: 48, 53: 49, 54: $Vm, 55: $Vn, 56: 50, 57: $Vo, 58: $Vp, 59: 51, 60: $Vq, 61: 38, 62: 52, 63: 40, 66: 39, 75: 46, 76: $Vr, 78: 41, 79: $Vs, 80: 37, 81: $Vt, 82: $Vu, 83: $Vv, 84: $Vw, 86: $Vx, 87: $Vy, 88: $Vz, 91: $VA, 92: 36, 103: $VB, 106: 35, 122: 33, 195: $VC }, { 16: $Vi, 35: $Vj, 47: 138, 50: $Vk, 51: $Vl, 52: 48, 53: 49, 54: $Vm, 55: $Vn, 56: 50, 57: $Vo, 58: $Vp, 59: 51, 60: $Vq, 61: 38, 62: 52, 63: 40, 66: 39, 75: 46, 76: $Vr, 78: 41, 79: $Vs, 80: 37, 81: $Vt, 82: $Vu, 83: $Vv, 84: $Vw, 86: $Vx, 87: $Vy, 88: $Vz, 91: $VA, 92: 36, 103: $VB, 106: 35, 122: 33, 195: $VC }, o($VI, [2, 154]), o($VI, [2, 155]), o([57, 58, 60, 125], $V$, { 102: 139, 103: $V_ }), { 16: $Vi, 29: [1, 142], 35: $Vj, 50: $Vk, 51: $Vl, 52: 48, 53: 49, 54: $Vm, 55: $Vn, 56: 50, 57: $Vo, 58: $Vp, 59: 51, 60: $Vq, 61: 38, 62: 52, 63: 40, 66: 39, 75: 46, 76: $Vr, 78: 41, 79: $Vs, 80: 37, 81: $Vt, 82: $Vu, 83: $Vv, 84: $Vw, 86: $Vx, 87: $Vy, 88: $Vz, 91: $VA, 92: 36, 106: 140, 120: 141, 121: [1, 143], 195: $VC }, o($V71, [2, 117]), o($V71, [2, 118]), o($V71, [2, 119]), o($V71, [2, 120]), o($V71, [2, 121]), o($V71, [2, 122]), o($V71, [2, 123]), o($VM, [2, 134]), { 107: [1, 144], 108: [1, 145], 111: [1, 146], 112: [1, 147] }, { 111: [1, 148] }, { 16: $Vi, 35: $Vj, 50: $Vk, 51: $Vl, 52: 48, 53: 49, 54: $Vm, 55: $Vn, 56: 50, 57: $Vo, 58: $Vp, 59: 51, 60: $Vq, 61: 38, 62: 52, 63: 40, 66: 39, 75: 46, 76: $Vr, 78: 41, 79: $Vs, 80: 37, 81: $Vt, 82: $Vu, 83: $Vv, 84: $Vw, 86: $Vx, 87: $Vy, 88: $Vz, 91: $VA, 92: 149, 195: $VC }, { 16: $Vi, 35: $Vj, 50: $Vk, 51: $Vl, 52: 48, 53: 49, 54: $Vm, 55: $Vn, 56: 50, 57: $Vo, 58: $Vp, 59: 51, 60: $Vq, 61: 38, 62: 52, 63: 40, 66: 39, 75: 46, 76: $Vr, 78: 41, 79: $Vs, 80: 37, 81: $Vt, 82: $Vu, 83: $Vv, 84: $Vw, 86: $Vx, 87: $Vy, 88: $Vz, 91: $VA, 92: 150, 195: $VC }, { 16: $Vi, 35: $Vj, 50: $Vk, 51: $Vl, 52: 48, 53: 49, 54: $Vm, 55: $Vn, 56: 50, 57: $Vo, 58: $Vp, 59: 51, 60: $Vq, 61: 38, 62: 52, 63: 40, 66: 39, 75: 46, 76: $Vr, 78: 41, 79: $Vs, 80: 37, 81: $Vt, 82: $Vu, 83: $Vv, 84: $Vw, 86: $Vx, 87: $Vy, 88: $Vz, 91: $VA, 92: 151, 195: $VC }, { 16: $Vi, 35: $Vj, 50: $Vk, 51: $Vl, 52: 48, 53: 49, 54: $Vm, 55: $Vn, 56: 50, 57: $Vo, 58: $Vp, 59: 51, 60: $Vq, 61: 38, 62: 52, 63: 40, 66: 39, 75: 46, 76: $Vr, 78: 41, 79: $Vs, 80: 37, 81: $Vt, 82: $Vu, 83: $Vv, 84: $Vw, 86: $Vx, 87: $Vy, 88: $Vz, 91: $VA, 92: 152, 195: $VC }, { 16: $Vi, 35: $Vj, 50: $Vk, 51: $Vl, 52: 48, 53: 49, 54: $Vm, 55: $Vn, 56: 50, 57: $Vo, 58: $Vp, 59: 51, 60: $Vq, 61: 38, 62: 52, 63: 40, 66: 39, 75: 46, 76: $Vr, 78: 41, 79: $Vs, 80: 37, 81: $Vt, 82: $Vu, 83: $Vv, 84: $Vw, 86: $Vx, 87: $Vy, 88: $Vz, 91: $VA, 92: 153, 195: $VC }, { 16: $Vi, 35: $Vj, 50: $Vk, 51: $Vl, 52: 48, 53: 49, 54: $Vm, 55: $Vn, 56: 50, 57: $Vo, 58: $Vp, 59: 51, 60: $Vq, 61: 38, 62: 52, 63: 40, 66: 39, 75: 46, 76: $Vr, 78: 41, 79: $Vs, 80: 37, 81: $Vt, 82: $Vu, 83: $Vv, 84: $Vw, 86: $Vx, 87: $Vy, 88: $Vz, 91: $VA, 92: 154, 195: $VC }, { 16: $Vi, 35: $Vj, 50: $Vk, 51: $Vl, 52: 48, 53: 49, 54: $Vm, 55: $Vn, 56: 50, 57: $Vo, 58: $Vp, 59: 51, 60: $Vq, 61: 38, 62: 52, 63: 40, 66: 39, 75: 46, 76: $Vr, 78: 41, 79: $Vs, 80: 37, 81: $Vt, 82: $Vu, 83: $Vv, 84: $Vw, 86: $Vx, 87: $Vy, 88: $Vz, 91: $VA, 92: 155, 195: $VC }, { 16: $Vi, 35: $Vj, 50: $Vk, 51: $Vl, 52: 48, 53: 49, 54: $Vm, 55: $Vn, 56: 50, 57: $Vo, 58: $Vp, 59: 51, 60: $Vq, 61: 38, 62: 52, 63: 40, 66: 39, 75: 46, 76: $Vr, 78: 41, 79: $Vs, 80: 37, 81: $Vt, 82: $Vu, 83: $Vv, 84: $Vw, 86: $Vx, 87: $Vy, 88: $Vz, 91: $VA, 92: 156, 195: $VC }, { 16: $Vi, 35: $Vj, 50: $Vk, 51: $Vl, 52: 48, 53: 49, 54: $Vm, 55: $Vn, 56: 50, 57: $Vo, 58: $Vp, 59: 51, 60: $Vq, 61: 38, 62: 52, 63: 40, 66: 39, 75: 46, 76: $Vr, 78: 41, 79: $Vs, 80: 37, 81: $Vt, 82: $Vu, 83: $Vv, 84: $Vw, 86: $Vx, 87: $Vy, 88: $Vz, 91: $VA, 92: 157, 195: $VC }, { 16: $Vi, 35: $Vj, 50: $Vk, 51: $Vl, 52: 48, 53: 49, 54: $Vm, 55: $Vn, 56: 50, 57: $Vo, 58: $Vp, 59: 51, 60: $Vq, 61: 38, 62: 52, 63: 40, 66: 39, 75: 46, 76: $Vr, 78: 41, 79: $Vs, 80: 37, 81: $Vt, 82: $Vu, 83: $Vv, 84: $Vw, 86: $Vx, 87: $Vy, 88: $Vz, 91: $VA, 92: 158, 195: $VC }, { 16: $Vi, 35: $Vj, 50: $Vk, 51: $Vl, 52: 48, 53: 49, 54: $Vm, 55: $Vn, 56: 50, 57: $Vo, 58: $Vp, 59: 51, 60: $Vq, 61: 38, 62: 52, 63: 40, 66: 39, 75: 46, 76: $Vr, 78: 41, 79: $Vs, 80: 37, 81: $Vt, 82: $Vu, 83: $Vv, 84: $Vw, 86: $Vx, 87: $Vy, 88: $Vz, 91: $VA, 92: 159, 195: $VC }, { 16: $Vi, 35: $Vj, 50: $Vk, 51: $Vl, 52: 48, 53: 49, 54: $Vm, 55: $Vn, 56: 50, 57: $Vo, 58: $Vp, 59: 51, 60: $Vq, 61: 38, 62: 52, 63: 40, 66: 39, 75: 46, 76: $Vr, 78: 41, 79: $Vs, 80: 37, 81: $Vt, 82: $Vu, 83: $Vv, 84: $Vw, 86: $Vx, 87: $Vy, 88: $Vz, 91: $VA, 92: 160, 195: $VC }, o([57, 58, 60, 107, 108, 111, 112, 125], [2, 107]), { 91: [1, 161] }, { 50: [1, 162] }, { 17: [1, 163], 43: $V81 }, { 17: [1, 165] }, o($V91, [2, 138], { 109: $VJ, 126: $VK, 127: $VL }), { 16: $Vi, 35: $Vj, 47: 113, 50: $Vk, 51: $Vl, 52: 48, 53: 49, 54: $Vm, 55: $Vn, 56: 50, 57: $Vo, 58: $Vp, 59: 51, 60: $Vq, 61: 38, 62: 52, 63: 40, 66: 39, 75: 46, 76: $Vr, 78: 41, 79: $Vs, 80: 37, 81: $Vt, 82: $Vu, 83: $Vv, 84: $Vw, 85: 166, 86: $Vx, 87: $Vy, 88: $Vz, 91: $VA, 92: 36, 103: $VB, 106: 35, 122: 33, 195: $VC }, { 4: 167, 18: $V1 }, { 16: $Vi, 35: $Vj, 47: 168, 50: $Vk, 51: $Vl, 52: 48, 53: 49, 54: $Vm, 55: $Vn, 56: 50, 57: $Vo, 58: $Vp, 59: 51, 60: $Vq, 61: 38, 62: 52, 63: 40, 66: 39, 67: $V21, 75: 46, 76: $Vr, 78: 41, 79: $Vs, 80: 37, 81: $Vt, 82: $Vu, 83: $Vv, 84: $Vw, 86: $Vx, 87: $Vy, 88: $Vz, 91: $VA, 92: 36, 103: $VB, 106: 35, 122: 33, 195: $VC }, o($Va1, $V41), { 50: $V31, 66: 169 }, o($V91, $Vb1, { 122: 33, 106: 35, 92: 36, 80: 37, 61: 38, 66: 39, 63: 40, 78: 41, 75: 46, 52: 48, 53: 49, 56: 50, 59: 51, 62: 52, 64: 170, 65: 171, 47: 175, 16: $Vi, 30: $Vc1, 35: $Vj, 45: $Vd1, 46: $Ve1, 50: $Vk, 51: $Vl, 54: $Vm, 55: $Vn, 57: $Vo, 58: $Vp, 60: $Vq, 76: $Vr, 79: $Vs, 81: $Vt, 82: $Vu, 83: $Vv, 84: $Vw, 86: $Vx, 87: $Vy, 88: $Vz, 91: $VA, 103: $VB, 195: $VC }), o($V11, [2, 75]), o($V11, [2, 76]), o($V11, [2, 77]), o($V11, [2, 78]), o($V11, [2, 79]), { 70: 176, 71: [1, 177] }, { 71: [2, 69], 109: $VJ, 126: $VK, 127: $VL }, o($Vf1, [2, 7], { 14: $Vc }), o($Vf1, [2, 8]), o($Vg1, [2, 24], { 22: 178, 37: [1, 179] }), o($V61, [2, 21]), { 35: [1, 180] }, { 35: [1, 181] }, { 35: [1, 182] }, o($VI, [2, 151]), o($Vh1, [2, 145]), o($Vi1, [2, 135], { 109: $VJ }), o($VM, [2, 136]), o($Vi1, [2, 137], { 109: $VJ }), { 56: 185, 57: $Vo, 58: $Vp, 60: [1, 184], 124: 183, 125: [1, 186] }, o($VN, [2, 128]), { 16: [1, 187] }, { 16: [2, 124] }, { 16: [2, 125] }, { 16: [1, 188] }, { 16: $Vi, 35: $Vj, 50: $Vk, 51: $Vl, 52: 48, 53: 49, 54: $Vm, 55: $Vn, 56: 50, 57: $Vo, 58: $Vp, 59: 51, 60: $Vq, 61: 38, 62: 52, 63: 40, 66: 39, 75: 46, 76: $Vr, 78: 41, 79: $Vs, 80: 37, 81: $Vt, 82: $Vu, 83: $Vv, 84: $Vw, 86: $Vx, 87: $Vy, 88: $Vz, 91: $VA, 92: 189, 195: $VC }, { 16: $Vi, 35: $Vj, 50: $Vk, 51: $Vl, 52: 48, 53: 49, 54: $Vm, 55: $Vn, 56: 50, 57: $Vo, 58: $Vp, 59: 51, 60: $Vq, 61: 38, 62: 52, 63: 40, 66: 39, 75: 46, 76: $Vr, 78: 41, 79: $Vs, 80: 190, 81: $Vt, 82: $Vu, 83: $Vv, 84: $Vw, 86: $Vx, 87: $Vy, 88: $Vz, 91: $VA, 195: $VC }, { 16: $Vi, 35: $Vj, 50: $Vk, 51: $Vl, 52: 48, 53: 49, 54: $Vm, 55: $Vn, 56: 50, 57: $Vo, 58: $Vp, 59: 51, 60: $Vq, 61: 38, 62: 52, 63: 40, 66: 39, 75: 46, 76: $Vr, 78: 41, 79: $Vs, 80: 37, 81: $Vt, 82: $Vu, 83: $Vv, 84: $Vw, 86: $Vx, 87: $Vy, 88: $Vz, 91: $VA, 92: 191, 195: $VC }, { 16: $Vi, 35: $Vj, 50: $Vk, 51: $Vl, 52: 48, 53: 49, 54: $Vm, 55: $Vn, 56: 50, 57: $Vo, 58: $Vp, 59: 51, 60: $Vq, 61: 38, 62: 52, 63: 40, 66: 39, 75: 46, 76: $Vr, 78: 41, 79: $Vs, 80: 37, 81: $Vt, 82: $Vu, 83: $Vv, 84: $Vw, 86: $Vx, 87: $Vy, 88: $Vz, 91: $VA, 92: 192, 195: $VC }, o([6, 8, 14, 17, 34, 36, 43, 49, 50, 51, 71, 72, 74, 77, 89, 93, 103, 107, 108, 109, 110, 111, 112, 114, 115, 116, 117, 118, 119, 123, 126, 127, 129, 133, 135, 138, 141, 142, 144, 146, 150, 152, 154, 157, 164, 165, 167, 168, 173, 177, 179, 180, 182], [2, 94], { 45: $VO, 79: $VP, 81: $VQ, 94: $VS, 95: $VT, 96: $VU, 97: $VV, 98: $VW, 99: $VX, 100: $VY, 101: $VZ }), o([6, 8, 14, 17, 34, 36, 43, 49, 50, 51, 71, 72, 74, 77, 89, 93, 94, 101, 103, 107, 108, 109, 110, 111, 112, 114, 115, 116, 117, 118, 119, 123, 126, 127, 129, 133, 135, 138, 141, 142, 144, 146, 150, 152, 154, 157, 164, 165, 167, 168, 173, 177, 179, 180, 182], [2, 95], { 45: $VO, 79: $VP, 81: $VQ, 95: $VT, 96: $VU, 97: $VV, 98: $VW, 99: $VX, 100: $VY }), o($Vj1, [2, 96], { 45: $VO, 79: $VP, 81: $VQ, 97: $VV, 98: $VW, 99: $VX, 100: $VY }), o($Vj1, [2, 97], { 45: $VO, 79: $VP, 81: $VQ, 97: $VV, 98: $VW, 99: $VX, 100: $VY }), o($Vk1, [2, 98], { 45: $VO, 97: $VV, 98: $VW, 99: $VX, 100: $VY }), o($Vk1, [2, 99], { 45: $VO, 97: $VV, 98: $VW, 99: $VX, 100: $VY }), o($V01, [2, 100]), o($V01, [2, 101]), o($V01, [2, 102]), o($V01, [2, 103]), o($V01, [2, 104]), o([6, 8, 14, 17, 34, 36, 43, 49, 50, 51, 71, 72, 74, 77, 89, 93, 101, 103, 107, 108, 109, 110, 111, 112, 114, 115, 116, 117, 118, 119, 123, 126, 127, 129, 133, 135, 138, 141, 142, 144, 146, 150, 152, 154, 157, 164, 165, 167, 168, 173, 177, 179, 180, 182], [2, 105], { 45: $VO, 79: $VP, 81: $VQ, 94: $VS, 95: $VT, 96: $VU, 97: $VV, 98: $VW, 99: $VX, 100: $VY }), o($V11, [2, 90]), o($Va1, [2, 65]), o($V11, [2, 84]), { 16: $Vi, 35: $Vj, 47: 193, 50: $Vk, 51: $Vl, 52: 48, 53: 49, 54: $Vm, 55: $Vn, 56: 50, 57: $Vo, 58: $Vp, 59: 51, 60: $Vq, 61: 38, 62: 52, 63: 40, 66: 39, 75: 46, 76: $Vr, 78: 41, 79: $Vs, 80: 37, 81: $Vt, 82: $Vu, 83: $Vv, 84: $Vw, 86: $Vx, 87: $Vy, 88: $Vz, 91: $VA, 92: 36, 103: $VB, 106: 35, 122: 33, 195: $VC }, o($V11, [2, 86]), { 17: [1, 194], 43: $V81 }, { 17: [1, 195] }, { 89: [1, 196], 109: $VJ, 126: $VK, 127: $VL }, o($V11, [2, 91], { 67: $V21, 90: [1, 197] }), { 17: [1, 198], 43: [1, 199] }, o($V91, [2, 58]), o($V91, [2, 60]), o($V91, [2, 61]), { 16: $Vi, 35: $Vj, 47: 200, 50: $Vk, 51: $Vl, 52: 48, 53: 49, 54: $Vm, 55: $Vn, 56: 50, 57: $Vo, 58: $Vp, 59: 51, 60: $Vq, 61: 38, 62: 52, 63: 40, 66: 39, 75: 46, 76: $Vr, 78: 41, 79: $Vs, 80: 37, 81: $Vt, 82: $Vu, 83: $Vv, 84: $Vw, 86: $Vx, 87: $Vy, 88: $Vz, 91: $VA, 92: 36, 103: $VB, 106: 35, 122: 33, 195: $VC }, o($V91, [2, 63], { 109: $VJ, 126: $VK, 127: $VL }), { 71: [1, 202], 73: 201, 74: [1, 203], 77: [2, 72] }, { 16: $Vi, 35: $Vj, 47: 204, 50: $Vk, 51: $Vl, 52: 48, 53: 49, 54: $Vm, 55: $Vn, 56: 50, 57: $Vo, 58: $Vp, 59: 51, 60: $Vq, 61: 38, 62: 52, 63: 40, 66: 39, 75: 46, 76: $Vr, 78: 41, 79: $Vs, 80: 37, 81: $Vt, 82: $Vu, 83: $Vv, 84: $Vw, 86: $Vx, 87: $Vy, 88: $Vz, 91: $VA, 92: 36, 103: $VB, 106: 35, 122: 33, 195: $VC }, o($Vl1, [2, 26], { 23: 205, 38: [1, 206] }), o($Vg1, [2, 23]), o($VD, [2, 19]), o($VE, [2, 159]), o($VE, [2, 160]), o($VM, [2, 133]), o($VN, [2, 127]), o($VM, [2, 130]), o($VM, [2, 131]), { 4: 207, 18: $V1 }, { 4: 208, 16: $Vi, 18: $V1, 35: $Vj, 47: 113, 50: $Vk, 51: $Vl, 52: 48, 53: 49, 54: $Vm, 55: $Vn, 56: 50, 57: $Vo, 58: $Vp, 59: 51, 60: $Vq, 61: 38, 62: 52, 63: 40, 66: 39, 75: 46, 76: $Vr, 78: 41, 79: $Vs, 80: 37, 81: $Vt, 82: $Vu, 83: $Vv, 84: $Vw, 85: 209, 86: $Vx, 87: $Vy, 88: $Vz, 91: $VA, 92: 36, 103: $VB, 106: 35, 122: 33, 195: $VC }, { 45: $VO, 79: $VP, 81: $VQ, 93: $VR, 94: $VS, 95: $VT, 96: $VU, 97: $VV, 98: $VW, 99: $VX, 100: $VY, 101: $VZ, 109: [1, 210] }, o($VN, [2, 108], { 104: 211, 105: [1, 212] }), o($VN, [2, 116], { 45: $VO, 79: $VP, 81: $VQ, 93: $VR, 94: $VS, 95: $VT, 96: $VU, 97: $VV, 98: $VW, 99: $VX, 100: $VY, 101: $VZ }), o($VN, [2, 114], { 45: $VO, 79: $VP, 81: $VQ, 93: $VR, 94: $VS, 95: $VT, 96: $VU, 97: $VV, 98: $VW, 99: $VX, 100: $VY, 101: $VZ }), o($V91, [2, 139], { 109: $VJ, 126: $VK, 127: $VL }), o($V11, [2, 85]), o($V11, [2, 87]), o($V11, [2, 88]), { 91: [1, 213] }, o($V11, [2, 56]), o($V91, $Vb1, { 122: 33, 106: 35, 92: 36, 80: 37, 61: 38, 66: 39, 63: 40, 78: 41, 75: 46, 52: 48, 53: 49, 56: 50, 59: 51, 62: 52, 47: 175, 65: 214, 16: $Vi, 30: $Vc1, 35: $Vj, 45: $Vd1, 46: $Ve1, 50: $Vk, 51: $Vl, 54: $Vm, 55: $Vn, 57: $Vo, 58: $Vp, 60: $Vq, 76: $Vr, 79: $Vs, 81: $Vt, 82: $Vu, 83: $Vv, 84: $Vw, 86: $Vx, 87: $Vy, 88: $Vz, 91: $VA, 103: $VB, 195: $VC }), o($V91, [2, 62], { 109: $VJ, 126: $VK, 127: $VL }), { 77: [1, 215] }, { 16: $Vi, 35: $Vj, 47: 216, 50: $Vk, 51: $Vl, 52: 48, 53: 49, 54: $Vm, 55: $Vn, 56: 50, 57: $Vo, 58: $Vp, 59: 51, 60: $Vq, 61: 38, 62: 52, 63: 40, 66: 39, 75: 46, 76: $Vr, 78: 41, 79: $Vs, 80: 37, 81: $Vt, 82: $Vu, 83: $Vv, 84: $Vw, 86: $Vx, 87: $Vy, 88: $Vz, 91: $VA, 92: 36, 103: $VB, 106: 35, 122: 33, 195: $VC }, { 16: $Vi, 35: $Vj, 47: 217, 50: $Vk, 51: $Vl, 52: 48, 53: 49, 54: $Vm, 55: $Vn, 56: 50, 57: $Vo, 58: $Vp, 59: 51, 60: $Vq, 61: 38, 62: 52, 63: 40, 66: 39, 75: 46, 76: $Vr, 78: 41, 79: $Vs, 80: 37, 81: $Vt, 82: $Vu, 83: $Vv, 84: $Vw, 86: $Vx, 87: $Vy, 88: $Vz, 91: $VA, 92: 36, 103: $VB, 106: 35, 122: 33, 195: $VC }, { 72: [1, 218], 109: $VJ, 126: $VK, 127: $VL }, o($Vm1, [2, 28], { 24: 219, 39: [1, 220] }), o($Vl1, [2, 25]), { 17: [1, 221] }, { 17: [1, 222] }, { 17: [1, 223], 43: $V81 }, { 16: $Vi, 35: $Vj, 50: $Vk, 51: $Vl, 52: 48, 53: 49, 54: $Vm, 55: $Vn, 56: 50, 57: $Vo, 58: $Vp, 59: 51, 60: $Vq, 61: 38, 62: 52, 63: 40, 66: 39, 75: 46, 76: $Vr, 78: 41, 79: $Vs, 80: 37, 81: $Vt, 82: $Vu, 83: $Vv, 84: $Vw, 86: $Vx, 87: $Vy, 88: $Vz, 91: $VA, 92: 36, 106: 224, 195: $VC }, o($VN, [2, 115]), { 16: $Vi, 35: $Vj, 50: $Vk, 51: $Vl, 52: 48, 53: 49, 54: $Vm, 55: $Vn, 56: 50, 57: $Vo, 58: $Vp, 59: 51, 60: $Vq, 61: 38, 62: 52, 63: 40, 66: 39, 75: 46, 76: $Vr, 78: 41, 79: $Vs, 80: 225, 81: $Vt, 82: $Vu, 83: $Vv, 84: $Vw, 86: $Vx, 87: $Vy, 88: $Vz, 91: $VA, 195: $VC }, o($V11, [2, 92]), o($V91, [2, 57]), o($V11, [2, 74]), { 72: [1, 226], 109: $VJ, 126: $VK, 127: $VL }, { 77: [2, 73], 109: $VJ, 126: $VK, 127: $VL }, { 16: $Vi, 35: $Vj, 47: 227, 50: $Vk, 51: $Vl, 52: 48, 53: 49, 54: $Vm, 55: $Vn, 56: 50, 57: $Vo, 58: $Vp, 59: 51, 60: $Vq, 61: 38, 62: 52, 63: 40, 66: 39, 75: 46, 76: $Vr, 78: 41, 79: $Vs, 80: 37, 81: $Vt, 82: $Vu, 83: $Vv, 84: $Vw, 86: $Vx, 87: $Vy, 88: $Vz, 91: $VA, 92: 36, 103: $VB, 106: 35, 122: 33, 195: $VC }, o($Vn1, [2, 29], { 25: 228, 40: [1, 229], 41: [1, 230] }), o($Vm1, [2, 27]), o($VN, [2, 129]), o($VN, [2, 111]), o($VN, [2, 112]), o($VN, [2, 113]), o($VN, [2, 109]), { 16: $Vi, 35: $Vj, 47: 231, 50: $Vk, 51: $Vl, 52: 48, 53: 49, 54: $Vm, 55: $Vn, 56: 50, 57: $Vo, 58: $Vp, 59: 51, 60: $Vq, 61: 38, 62: 52, 63: 40, 66: 39, 75: 46, 76: $Vr, 78: 41, 79: $Vs, 80: 37, 81: $Vt, 82: $Vu, 83: $Vv, 84: $Vw, 86: $Vx, 87: $Vy, 88: $Vz, 91: $VA, 92: 36, 103: $VB, 106: 35, 122: 33, 195: $VC }, o($Vo1, [2, 70], { 109: $VJ, 126: $VK, 127: $VL }), o($Vp1, [2, 33], { 26: 232, 42: [1, 233] }), o($Vn1, [2, 30]), o($Vn1, [2, 31]), o($Vo1, [2, 71], { 109: $VJ, 126: $VK, 127: $VL }), { 16: $Vi, 27: 234, 35: $Vj, 44: 235, 45: $Vq1, 46: $Vr1, 47: 238, 50: $Vk, 51: $Vl, 52: 48, 53: 49, 54: $Vm, 55: $Vn, 56: 50, 57: $Vo, 58: $Vp, 59: 51, 60: $Vq, 61: 38, 62: 52, 63: 40, 66: 39, 75: 46, 76: $Vr, 78: 41, 79: $Vs, 80: 37, 81: $Vt, 82: $Vu, 83: $Vv, 84: $Vw, 86: $Vx, 87: $Vy, 88: $Vz, 91: $VA, 92: 36, 103: $VB, 106: 35, 122: 33, 195: $VC }, o($Vp1, [2, 32]), o($Vs1, [2, 169], { 28: 239, 43: [1, 240], 157: [1, 241] }), o($Vt1, [2, 35]), o($Vt1, [2, 36]), o($Vt1, [2, 37]), o($Vt1, [2, 39], { 48: 242, 49: [1, 243], 50: [1, 244], 51: [1, 245], 109: $VJ, 126: $VK, 127: $VL }), o($Vs1, [2, 12]), { 16: $Vi, 35: $Vj, 44: 246, 45: $Vq1, 46: $Vr1, 47: 238, 50: $Vk, 51: $Vl, 52: 48, 53: 49, 54: $Vm, 55: $Vn, 56: 50, 57: $Vo, 58: $Vp, 59: 51, 60: $Vq, 61: 38, 62: 52, 63: 40, 66: 39, 75: 46, 76: $Vr, 78: 41, 79: $Vs, 80: 37, 81: $Vt, 82: $Vu, 83: $Vv, 84: $Vw, 86: $Vx, 87: $Vy, 88: $Vz, 91: $VA, 92: 36, 103: $VB, 106: 35, 122: 33, 195: $VC }, { 16: $Vu1, 50: $V31, 66: 253, 88: $Vv1, 158: 247, 160: 248, 161: 249, 172: 252, 174: 251 }, o($Vt1, [2, 38]), { 50: [1, 255], 51: [1, 256] }, o($Vt1, [2, 41]), o($Vt1, [2, 43]), o($Vt1, [2, 34]), o([6, 8, 14, 17, 129, 135, 138, 144, 146, 150, 152, 154], $Vw1, { 159: 257, 43: $Vx1, 182: $Vy1 }), o($Vz1, [2, 171]), o($Vz1, [2, 173], { 163: 260, 166: 262, 36: $VA1, 164: $VB1, 165: $VC1, 167: $VD1, 168: $VE1, 173: $VF1, 177: $VG1 }), { 162: [1, 268] }, o($VH1, [2, 194]), o($VH1, [2, 195]), o([6, 8, 14, 17, 36, 43, 49, 50, 89, 129, 135, 138, 144, 146, 150, 152, 154, 164, 165, 167, 168, 173, 177, 179, 180, 192, 193, 194], $Vw1, { 159: 269, 67: $V21, 182: $Vy1 }), { 4: 270, 16: $Vu1, 18: $V1, 50: $V31, 66: 253, 88: $Vv1, 158: 271, 160: 248, 161: 249, 172: 252, 174: 251 }, o($Vt1, [2, 40]), o($Vt1, [2, 42]), o($VI1, [2, 140], { 128: 272, 129: [1, 273] }), { 16: $Vu1, 50: $V31, 66: 253, 88: $Vv1, 160: 274, 161: 249, 172: 252, 174: 251 }, { 16: [1, 275] }, { 173: [1, 276] }, { 16: $Vu1, 50: $V31, 66: 253, 174: 277 }, { 169: 278, 170: $VJ1, 173: $VK1 }, { 166: 281, 167: $VD1, 168: $VE1, 171: 280, 173: [2, 182] }, { 173: [2, 176] }, { 173: [2, 177] }, o($VL1, [2, 178]), o($VL1, [2, 179]), { 16: $Vu1, 50: $V31, 66: 253, 161: 282, 172: 252, 174: 251 }, o($VM1, $VN1, { 183: 283, 66: 285, 49: $VO1, 50: $V31 }), { 17: [1, 286] }, { 17: [1, 287], 43: $Vx1 }, o($Vh1, [2, 142], { 130: 288, 131: 289, 135: [1, 290] }), { 16: $Vi, 35: $Vj, 47: 291, 50: $Vk, 51: $Vl, 52: 48, 53: 49, 54: $Vm, 55: $Vn, 56: 50, 57: $Vo, 58: $Vp, 59: 51, 60: $Vq, 61: 38, 62: 52, 63: 40, 66: 39, 75: 46, 76: $Vr, 78: 41, 79: $Vs, 80: 37, 81: $Vt, 82: $Vu, 83: $Vv, 84: $Vw, 86: $Vx, 87: $Vy, 88: $Vz, 91: $VA, 92: 36, 103: $VB, 106: 35, 122: 33, 195: $VC }, o($Vz1, [2, 172]), { 50: $V31, 66: 293, 181: 292 }, { 16: $Vu1, 50: $V31, 66: 253, 174: 294 }, { 176: 295, 179: $VP1 }, { 173: [1, 297] }, { 173: [2, 181] }, { 173: [1, 298] }, { 169: 299, 170: $VJ1, 173: $VK1 }, { 36: $VA1, 89: [1, 300], 163: 260, 164: $VB1, 165: $VC1, 166: 262, 167: $VD1, 168: $VE1, 173: $VF1, 177: $VG1 }, o($VH1, [2, 211], { 189: 301, 190: 302, 191: 303, 192: $VQ1, 193: $VR1, 194: $VS1 }), { 50: $V31, 66: 307 }, o($VM1, [2, 202], { 67: $V21 }), o($VH1, $VN1, { 66: 285, 183: 308, 49: $VO1, 50: $V31 }), o($VH1, [2, 220]), o($VT1, [2, 156], { 143: 309, 144: [1, 310] }), o($Vh1, [2, 143]), { 16: $Vi, 35: $Vj, 47: 32, 50: $Vk, 51: $Vl, 52: 48, 53: 49, 54: $Vm, 55: $Vn, 56: 50, 57: $Vo, 58: $Vp, 59: 51, 60: $Vq, 61: 38, 62: 52, 63: 40, 66: 39, 75: 46, 76: $Vr, 78: 41, 79: $Vs, 80: 37, 81: $Vt, 82: $Vu, 83: $Vv, 84: $Vw, 86: $Vx, 87: $Vy, 88: $Vz, 91: $VA, 92: 36, 103: $VB, 106: 35, 122: 33, 136: 311, 139: 31, 195: $VC }, o($VI1, [2, 141], { 109: $VJ, 126: $VK, 127: $VL }), { 17: [1, 312], 43: [1, 313] }, o($V91, [2, 196], { 67: $V21 }), o([6, 8, 14, 17, 36, 43, 89, 129, 135, 138, 144, 146, 150, 152, 154, 164, 165, 167, 168, 173, 177, 182], [2, 184], { 175: 314, 176: 315, 179: $VP1, 180: $VU1 }), o($VH1, [2, 186]), { 16: $Vi, 35: $Vj, 47: 317, 50: $Vk, 51: $Vl, 52: 48, 53: 49, 54: $Vm, 55: $Vn, 56: 50, 57: $Vo, 58: $Vp, 59: 51, 60: $Vq, 61: 38, 62: 52, 63: 40, 66: 39, 75: 46, 76: $Vr, 78: 41, 79: $Vs, 80: 37, 81: $Vt, 82: $Vu, 83: $Vv, 84: $Vw, 86: $Vx, 87: $Vy, 88: $Vz, 91: $VA, 92: 36, 103: $VB, 106: 35, 122: 33, 195: $VC }, { 16: $Vu1, 50: $V31, 66: 253, 161: 318, 172: 252, 174: 251 }, { 16: $Vu1, 50: $V31, 66: 253, 174: 319 }, { 173: [2, 183] }, o($Vz1, [2, 174]), o($VH1, [2, 218]), o($VH1, [2, 212]), o($VH1, [2, 213]), { 184: 321, 185: $VV1, 186: $VW1 }, { 184: 324, 185: $VV1, 186: $VW1 }, { 184: 325, 185: $VV1, 186: $VW1 }, o($VM1, [2, 201], { 67: $V21 }), o($VH1, [2, 219]), o($Vh, $Va, { 137: 18, 11: 326, 138: $Vb }), { 16: $Vi, 35: $Vj, 47: 327, 50: $Vk, 51: $Vl, 52: 48, 53: 49, 54: $Vm, 55: $Vn, 56: 50, 57: $Vo, 58: $Vp, 59: 51, 60: $Vq, 61: 38, 62: 52, 63: 40, 66: 39, 75: 46, 76: $Vr, 78: 41, 79: $Vs, 80: 37, 81: $Vt, 82: $Vu, 83: $Vv, 84: $Vw, 86: $Vx, 87: $Vy, 88: $Vz, 91: $VA, 92: 36, 103: $VB, 106: 35, 122: 33, 195: $VC }, o($Vh1, $VF, { 132: 328, 43: $VG, 133: $VH }), o([6, 8, 14, 17, 36, 43, 49, 50, 89, 129, 135, 138, 144, 146, 150, 152, 154, 164, 165, 167, 168, 173, 177, 179, 180, 182, 192, 193, 194], [2, 199]), { 50: $V31, 66: 329 }, o($VH1, [2, 185]), o($VH1, [2, 192]), { 16: [1, 330] }, o($VH1, [2, 191], { 109: $VJ, 126: $VK, 127: $VL }), { 36: $VA1, 163: 260, 164: $VB1, 165: $VC1, 166: 262, 167: $VD1, 168: $VE1, 173: $VF1, 175: 331, 176: 315, 177: $VG1, 179: $VP1, 180: $VU1 }, o($VH1, [2, 188]), { 191: 332, 192: $VQ1, 193: $VR1, 194: $VS1 }, { 16: $VX1, 152: $VY1, 187: 333 }, o($VZ1, [2, 203]), o($VZ1, [2, 204]), { 16: $VX1, 152: $VY1, 187: 335 }, { 16: $VX1, 152: $VY1, 187: 336 }, o($VE, $Vf, { 145: 28, 12: 337, 146: $Vg }), o($VT1, [2, 157], { 109: $VJ, 126: $VK, 127: $VL }), o($Vh1, [2, 146]), o($V91, [2, 197], { 67: $V21 }), { 50: $V31, 66: 339, 68: 338 }, o($VH1, [2, 187]), o($VH1, [2, 214]), { 16: [1, 340] }, { 135: [1, 343], 138: [1, 342], 173: [1, 341] }, { 16: [1, 344] }, { 16: [1, 345] }, o($V_1, [2, 163], { 148: 346, 149: 347, 150: [1, 348] }), { 17: [1, 349], 43: $V$1 }, o($V91, [2, 66], { 67: $V21 }), { 17: [2, 209], 50: $V31, 66: 339, 68: 352, 188: 351 }, { 16: [2, 206] }, { 16: [2, 207] }, { 16: [2, 208] }, { 50: $V31, 66: 339, 68: 353 }, { 50: $V31, 66: 339, 68: 354 }, o($Vs1, [2, 166], { 151: 355, 152: [1, 356], 154: [1, 357] }), o($V_1, [2, 164]), { 50: [1, 359], 63: 358 }, o($VH1, [2, 193]), { 50: $V31, 66: 360 }, { 17: [1, 361] }, { 17: [2, 210], 43: $V$1 }, { 17: [1, 362], 43: $V$1 }, { 17: [1, 363], 43: $V$1 }, o($Vs1, [2, 170]), { 153: [1, 364] }, { 107: [1, 365] }, o($V_1, [2, 165]), { 16: $V51 }, o($V91, [2, 67], { 67: $V21 }), o($VH1, [2, 215]), o($VH1, [2, 216]), o($VH1, [2, 217]), o($Vs1, [2, 167]), { 155: [1, 366] }, { 156: [1, 367] }, o($Vs1, [2, 168])],
    defaultActions: { 11: [2, 3], 22: [2, 1], 24: [2, 2], 142: [2, 124], 143: [2, 125], 264: [2, 176], 265: [2, 177], 279: [2, 181], 299: [2, 183], 341: [2, 206], 342: [2, 207], 343: [2, 208] },
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
      options: { "case-insensitive": true },
      performAction: function anonymous(yy, yy_, $avoiding_name_collisions, YY_START) {
        switch ($avoiding_name_collisions) {
          case 0:
            break;
          case 1:
            break;
          case 2:
            break;
          case 3:
            break;
          case 4:
            return 195;
          case 5:
            return 50;
          case 6:
            return 50;
          case 7:
            return 50;
          case 8:
            return 18;
          case 9:
            return 29;
          case 10:
            return 121;
          case 11:
            return 30;
          case 12:
            return 31;
          case 13:
            return 32;
          case 14:
            return 33;
          case 15:
            return 36;
          case 16:
            return 37;
          case 17:
            return 38;
          case 18:
            return 39;
          case 19:
            return 40;
          case 20:
            return 41;
          case 21:
            return 42;
          case 22:
            return 46;
          case 23:
            return 49;
          case 24:
            return 57;
          case 25:
            return 58;
          case 26:
            return 60;
          case 27:
            return "COLLATE";
          case 28:
            return 84;
          case 29:
            return 86;
          case 30:
            return 87;
          case 31:
            return 76;
          case 32:
            return 71;
          case 33:
            return 72;
          case 34:
            return 74;
          case 35:
            return 77;
          case 36:
            return 98;
          case 37:
            return 99;
          case 38:
            return 103;
          case 39:
            return 108;
          case 40:
            return 107;
          case 41:
            return 110;
          case 42:
            return 111;
          case 43:
            return 105;
          case 44:
            return 112;
          case 45:
            return 123;
          case 46:
            return 125;
          case 47:
            return 109;
          case 48:
            return 126;
          case 49:
            return 127;
          case 50:
            return 157;
          case 51:
            return 182;
          case 52:
            return 192;
          case 53:
            return 185;
          case 54:
            return 186;
          case 55:
            return 152;
          case 56:
            return 173;
          case 57:
            return 138;
          case 58:
            return 135;
          case 59:
            return 193;
          case 60:
            return 194;
          case 61:
            return 164;
          case 62:
            return 165;
          case 63:
            return 179;
          case 64:
            return 180;
          case 65:
            return 167;
          case 66:
            return 168;
          case 67:
            return 170;
          case 68:
            return 177;
          case 69:
            return 129;
          case 70:
            return 141;
          case 71:
            return 142;
          case 72:
            return 133;
          case 73:
            return 134;
          case 74:
            return 144;
          case 75:
            return 147;
          case 76:
            return 150;
          case 77:
            return 153;
          case 78:
            return 154;
          case 79:
            return 155;
          case 80:
            return 156;
          case 81:
            return 162;
          case 82:
            return 146;
          case 83:
            return 14;
          case 84:
            return 43;
          case 85:
            return 34;
          case 86:
            return 16;
          case 87:
            return 17;
          case 88:
            return 82;
          case 89:
            return 119;
          case 90:
            return 83;
          case 91:
            return 90;
          case 92:
            return 93;
          case 93:
            return 94;
          case 94:
            return 79;
          case 95:
            return 81;
          case 96:
            return 45;
          case 97:
            return 97;
          case 98:
            return 100;
          case 99:
            return 101;
          case 100:
            return 96;
          case 101:
            return 114;
          case 102:
            return 115;
          case 103:
            return 95;
          case 104:
            return "<=>";
          case 105:
            return 116;
          case 106:
            return 118;
          case 107:
            return 117;
          case 108:
            return 88;
          case 109:
            return 89;
          case 110:
            return 8;
          case 111:
            return 91;
          case 112:
            return 51;
          case 113:
            return 51;
          case 114:
            return 55;
          case 115:
            return 35;
          case 116:
            return 54;
          case 117:
            return 50;
          case 118:
            return 67;
          case 119:
            return 51;
          case 120:
            return 51;
          case 121:
            return 50;
          case 122:
            return 6;
          case 123:
            return "INVALID";
        }
      },
      rules: [/^(?:[/][*](.|\n)*?[*][/])/i, /^(?:[-][-]\s.*\n)/i, /^(?:[#]\s.*\n)/i, /^(?:\s+)/i, /^(?:[$][{](.*?)[}])/i, /^(?:[`][a-zA-Z_\u4e00-\u9fa5][a-zA-Z0-9_\u4e00-\u9fa5]*[`])/i, /^(?:[\w]+[\u4e00-\u9fa5]+[0-9a-zA-Z_\u4e00-\u9fa5]*)/i, /^(?:[\u4e00-\u9fa5][0-9a-zA-Z_\u4e00-\u9fa5]*)/i, /^(?:SELECT\b)/i, /^(?:ALL\b)/i, /^(?:ANY\b)/i, /^(?:DISTINCT\b)/i, /^(?:DISTINCTROW\b)/i, /^(?:HIGH_PRIORITY\b)/i, /^(?:MAX_STATEMENT_TIME\b)/i, /^(?:STRAIGHT_JOIN\b)/i, /^(?:SQL_SMALL_RESULT\b)/i, /^(?:SQL_BIG_RESULT\b)/i, /^(?:SQL_BUFFER_RESULT\b)/i, /^(?:SQL_CACHE\b)/i, /^(?:SQL_NO_CACHE\b)/i, /^(?:SQL_CALC_FOUND_ROWS\b)/i, /^(?:([a-zA-Z_\u4e00-\u9fa5][a-zA-Z0-9_\u4e00-\u9fa5]*\.){1,2}\*)/i, /^(?:AS\b)/i, /^(?:TRUE\b)/i, /^(?:FALSE\b)/i, /^(?:NULL\b)/i, /^(?:COLLATE\b)/i, /^(?:BINARY\b)/i, /^(?:ROW\b)/i, /^(?:EXISTS\b)/i, /^(?:CASE\b)/i, /^(?:WHEN\b)/i, /^(?:THEN\b)/i, /^(?:ELSE\b)/i, /^(?:END\b)/i, /^(?:DIV\b)/i, /^(?:MOD\b)/i, /^(?:NOT\b)/i, /^(?:BETWEEN\b)/i, /^(?:IN\b)/i, /^(?:SOUNDS\b)/i, /^(?:LIKE\b)/i, /^(?:ESCAPE\b)/i, /^(?:REGEXP\b)/i, /^(?:IS\b)/i, /^(?:UNKNOWN\b)/i, /^(?:AND\b)/i, /^(?:OR\b)/i, /^(?:XOR\b)/i, /^(?:FROM\b)/i, /^(?:PARTITION\b)/i, /^(?:USE\b)/i, /^(?:INDEX\b)/i, /^(?:KEY\b)/i, /^(?:FOR\b)/i, /^(?:JOIN\b)/i, /^(?:ORDER\s+BY\b)/i, /^(?:GROUP\s+BY\b)/i, /^(?:IGNORE\b)/i, /^(?:FORCE\b)/i, /^(?:INNER\b)/i, /^(?:CROSS\b)/i, /^(?:ON\b)/i, /^(?:USING\b)/i, /^(?:LEFT\b)/i, /^(?:RIGHT\b)/i, /^(?:OUTER\b)/i, /^(?:NATURAL\b)/i, /^(?:WHERE\b)/i, /^(?:ASC\b)/i, /^(?:DESC\b)/i, /^(?:WITH\b)/i, /^(?:ROLLUP\b)/i, /^(?:HAVING\b)/i, /^(?:OFFSET\b)/i, /^(?:PROCEDURE\b)/i, /^(?:UPDATE\b)/i, /^(?:LOCK\b)/i, /^(?:SHARE\b)/i, /^(?:MODE\b)/i, /^(?:OJ\b)/i, /^(?:LIMIT\b)/i, /^(?:UNION\b)/i, /^(?:,)/i, /^(?:=)/i, /^(?:\()/i, /^(?:\))/i, /^(?:~)/i, /^(?:!=)/i, /^(?:!)/i, /^(?:\|\|)/i, /^(?:\|)/i, /^(?:&)/i, /^(?:\+)/i, /^(?:-)/i, /^(?:\*)/i, /^(?:\/)/i, /^(?:%)/i, /^(?:\^)/i, /^(?:>>)/i, /^(?:>=)/i, /^(?:>)/i, /^(?:<<)/i, /^(?:<=>)/i, /^(?:<=)/i, /^(?:<>)/i, /^(?:<)/i, /^(?:\{)/i, /^(?:\})/i, /^(?:;)/i, /^(?:['](%+)['])/i, /^(?:['](\\.|[^'])*['])/i, /^(?:["](\\.|[^"])*["])/i, /^(?:[0][x][0-9a-fA-F]+)/i, /^(?:[-]?[0-9]+(\.[0-9]+)?)/i, /^(?:[-]?[0-9]+(\.[0-9]+)?[eE][-][0-9]+(\.[0-9]+)?)/i, /^(?:[a-zA-Z_\u4e00-\u9fa5][a-zA-Z0-9_\u4e00-\u9fa5]*)/i, /^(?:\.)/i, /^(?:["][a-zA-Z_\u4e00-\u9fa5][a-zA-Z0-9_\u4e00-\u9fa5]*["])/i, /^(?:['][a-zA-Z_\u4e00-\u9fa5][a-zA-Z0-9_\u4e00-\u9fa5]*['])/i, /^(?:([`])(?:(?=(\\?))\2.)*?\1)/i, /^(?:$)/i, /^(?:.)/i],
      conditions: { "INITIAL": { "rules": [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90, 91, 92, 93, 94, 95, 96, 97, 98, 99, 100, 101, 102, 103, 104, 105, 106, 107, 108, 109, 110, 111, 112, 113, 114, 115, 116, 117, 118, 119, 120, 121, 122, 123], "inclusive": true } }
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
const isSQLLiteralValue = (v) => !!v && (v.type === "String" || v.type === "Number" || v.type === "Boolean");
const isSQLIdentifier = (v) => !!v && v.type === "Identifier";
const getParamString = (param) => {
  switch (typeof param) {
    case "number":
      return `${param}`;
    case "boolean":
      return param ? "TRUE" : "FALSE";
    default:
      return `'${param}'`;
  }
};
const getFieldName = (f) => (typeof f === "string" ? f : f.value).replace(/(^`|`$)/g, "");
const normalizeCombinator = (c) => c.replace("&&", "and").replace("||", "or").toLowerCase();
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
  if (op === "<>")
    return "!=";
  return op;
};
const evalSQLLiteralValue = (valueObj) => valueObj.type === "String" ? valueObj.value.replace(/^(['"]?)(.+?)\1$/, "$2") : valueObj.type === "Boolean" ? valueObj.value.toLowerCase() === "true" : parseFloat(valueObj.value);
const generateFlatAndOrList = (expr) => {
  const combinator = normalizeCombinator(expr.operator);
  if (expr.left.type === "AndExpression" || expr.left.type === "OrExpression" || expr.left.type === "XorExpression") {
    return [...generateFlatAndOrList(expr.left), combinator, expr.right];
  }
  return [expr.left, combinator, expr.right];
};
const generateMixedAndXorOrList = (expr) => {
  const arr = generateFlatAndOrList(expr);
  let currentLevel = 0;
  const orArray = { combinator: "or", expressions: [] };
  let xorArray = { combinator: "xor", expressions: [] };
  let andArray = { combinator: "and", expressions: [] };
  for (let i = 0; i < arr.length - 2; i += 2) {
    let levelDelta = 0;
    if (arr[i + 1] === "and") {
      levelDelta = 2 - currentLevel;
    } else if (arr[i + 1] === "xor") {
      levelDelta = 1 - currentLevel;
    } else if (arr[i + 1] === "or") {
      levelDelta = 0 - currentLevel;
    }
    if (levelDelta > 0) {
      for (let d = 0; d < levelDelta; d++) {
        currentLevel += 1;
        if (currentLevel === 1) {
          xorArray = { combinator: "xor", expressions: [] };
          if (levelDelta === 1) {
            xorArray.expressions.push(arr[i]);
            if (i >= arr.length - 3 || arr[i + 3] === "xor") {
              xorArray.expressions.push(arr[i + 2]);
            }
          }
        } else if (currentLevel === 2) {
          andArray = { combinator: "and", expressions: [] };
          andArray.expressions.push(arr[i], arr[i + 2]);
        }
      }
    } else if (levelDelta < 0) {
      for (let d = 0; d > levelDelta; d--) {
        currentLevel -= 1;
        if (currentLevel === 1) {
          xorArray.expressions.push(andArray);
          if (levelDelta === -1) {
            xorArray.expressions.push(arr[i + 2]);
          }
        } else if (currentLevel === 0) {
          orArray.expressions.push(xorArray);
          if (i >= arr.length - 3) {
            orArray.expressions.push(arr[i + 2]);
          }
        }
      }
    } else {
      if (currentLevel === 0) {
        if (i === 0 || i > 3 && arr[i - 3] !== "or") {
          orArray.expressions.push(arr[i]);
        }
        if (i >= arr.length - 3 || arr[i + 3] === "or") {
          orArray.expressions.push(arr[i + 2]);
        }
      } else if (currentLevel === 1) {
        xorArray.expressions.push(arr[i + 2]);
      } else if (currentLevel === 2) {
        andArray.expressions.push(arr[i + 2]);
      }
    }
  }
  if (currentLevel === 2) {
    xorArray.expressions.push(andArray);
    currentLevel -= 1;
  }
  if (currentLevel === 1) {
    orArray.expressions.push(xorArray);
    currentLevel -= 1;
  }
  if (orArray.expressions.length === 1 && "combinator" in orArray.expressions[0]) {
    if (orArray.expressions[0].expressions.length === 1 && "combinator" in orArray.expressions[0].expressions[0]) {
      return orArray.expressions[0].expressions[0];
    } else {
      return orArray.expressions[0];
    }
  }
  const returnArray = { combinator: "or", expressions: [] };
  for (const o of orArray.expressions) {
    if ("combinator" in o) {
      if ("combinator" in o.expressions[0] && o.expressions.length === 1) {
        returnArray.expressions.push(o.expressions[0]);
      } else {
        returnArray.expressions.push(o);
      }
    } else {
      returnArray.expressions.push(o);
    }
  }
  return returnArray;
};
function parseSQL(sql, options = {}) {
  const { params, paramPrefix, independentCombinators, fields, getValueSources } = options;
  let sqlString = /^[ \t\n\r\s]*SELECT\b/i.test(sql) ? sql : /^[ \t\n\r\s]*WHERE\b/i.test(sql) ? `SELECT * FROM t ${sql}` : `SELECT * FROM t WHERE ${sql}`;
  let ic = false;
  const fieldsFlat = getFieldsArray(fields);
  ic = !!independentCombinators;
  if (params) {
    if (Array.isArray(params)) {
      let i = 0;
      sqlString = sqlString.replace(/\?/g, () => {
        const paramString = getParamString(params[i]);
        i++;
        return paramString;
      });
    } else {
      const keys = Object.keys(params);
      const prefix = paramPrefix ?? ":";
      keys.forEach((p) => {
        sqlString = sqlString.replace(
          new RegExp(`\\${prefix}${p}\\b`, "ig"),
          getParamString(params[p])
        );
      });
    }
  }
  const fieldIsValid = (fieldName, operator, subordinateFieldName) => fieldIsValidUtil({
    fieldName,
    fieldsFlat,
    operator,
    subordinateFieldName,
    getValueSources
  });
  const processSQLExpression = (expr) => {
    if (expr.type === "NotExpression") {
      const val = expr.value.type === "SimpleExprParentheses" ? expr.value.value.value[0] : expr.value;
      const rule = processSQLExpression(val);
      if (rule) {
        if ("rules" in rule) {
          return { ...rule, not: true };
        }
        return {
          rules: [rule],
          not: true,
          ...!ic && { combinator: "and" }
        };
      }
    } else if (expr.type === "SimpleExprParentheses") {
      const ex = expr.value.value[0];
      if (ex.type === "AndExpression" || ex.type === "OrExpression" || ex.type === "XorExpression") {
        return processSQLExpression(ex);
      }
      const rule = processSQLExpression(ex);
      return rule ? { rules: [rule], ...ic ? {} : { combinator: "and" } } : null;
    } else if (expr.type === "AndExpression" || expr.type === "OrExpression" || expr.type === "XorExpression") {
      if (ic) {
        const andOrList = generateFlatAndOrList(expr);
        const rules2 = andOrList.map((v) => {
          if (typeof v === "string") {
            return v;
          }
          return processSQLExpression(v);
        });
        if (rules2.includes(null)) {
          return null;
        }
        return {
          rules: rules2
        };
      }
      const andXorOrList = generateMixedAndXorOrList(expr);
      const { combinator } = andXorOrList;
      const rules = andXorOrList.expressions.map((obj) => {
        if ("combinator" in obj) {
          return {
            combinator: obj.combinator,
            rules: obj.expressions.map((o) => {
              if ("combinator" in o) {
                return {
                  combinator: o.combinator,
                  rules: o.expressions.map((oa) => processSQLExpression(oa)).filter(Boolean)
                };
              } else {
                return processSQLExpression(o);
              }
            }).filter(Boolean)
          };
        }
        return processSQLExpression(obj);
      }).filter(Boolean);
      if (rules.length > 0) {
        return { combinator, rules };
      }
    } else if (expr.type === "IsNullBooleanPrimary") {
      if (isSQLIdentifier(expr.value)) {
        const f = getFieldName(expr.value);
        const operator = expr.hasNot ? "notNull" : "null";
        if (fieldIsValid(f, operator)) {
          return {
            field: f,
            operator,
            value: null
          };
        }
      }
    } else if (expr.type === "ComparisonBooleanPrimary") {
      if (isSQLIdentifier(expr.left) && !isSQLIdentifier(expr.right) || !isSQLIdentifier(expr.left) && isSQLIdentifier(expr.right)) {
        const identifier = isSQLIdentifier(expr.left) ? expr.left.value : expr.right.value;
        const valueObj = [expr.left, expr.right].find((t) => !isSQLIdentifier(t));
        if (isSQLLiteralValue(valueObj)) {
          const f = getFieldName(identifier);
          const operator = normalizeOperator(expr.operator, isSQLIdentifier(expr.right));
          if (fieldIsValid(f, operator)) {
            return {
              field: f,
              operator,
              value: evalSQLLiteralValue(valueObj)
            };
          }
        }
      } else if (isSQLIdentifier(expr.left) && isSQLIdentifier(expr.right)) {
        const f = getFieldName(expr.left);
        const sf = getFieldName(expr.right);
        const operator = normalizeOperator(expr.operator);
        if (fieldIsValid(f, operator, sf)) {
          return {
            field: f,
            operator,
            value: sf,
            valueSource: "field"
          };
        }
      }
    } else if (expr.type === "InExpressionListPredicate") {
      if (isSQLIdentifier(expr.left)) {
        const f = getFieldName(expr.left);
        const valueArray = expr.right.value.filter(isSQLLiteralValue).map(evalSQLLiteralValue);
        const operator = expr.hasNot ? "notIn" : "in";
        const fieldArray = expr.right.value.filter(isSQLIdentifier).filter((sf) => fieldIsValid(f, operator, sf.value)).map(getFieldName);
        if (valueArray.length > 0) {
          const value = (options == null ? void 0 : options.listsAsArrays) ? valueArray : valueArray.join(", ");
          return { field: getFieldName(expr.left), operator, value };
        } else if (fieldArray.length > 0) {
          const value = (options == null ? void 0 : options.listsAsArrays) ? fieldArray : fieldArray.join(", ");
          return {
            field: getFieldName(expr.left),
            operator,
            value,
            valueSource: "field"
          };
        }
      }
    } else if (expr.type === "BetweenPredicate") {
      if (isSQLIdentifier(expr.left) && isSQLLiteralValue(expr.right.left) && isSQLLiteralValue(expr.right.right)) {
        const valueArray = [expr.right.left, expr.right.right].map(evalSQLLiteralValue);
        const value = (options == null ? void 0 : options.listsAsArrays) ? valueArray : valueArray.join(", ");
        const operator = expr.hasNot ? "notBetween" : "between";
        return { field: getFieldName(expr.left), operator, value };
      } else if (isSQLIdentifier(expr.left) && isSQLIdentifier(expr.right.left) && isSQLIdentifier(expr.right.right)) {
        const f = getFieldName(expr.left);
        const valueArray = [expr.right.left, expr.right.right].map(getFieldName);
        const operator = expr.hasNot ? "notBetween" : "between";
        if (valueArray.every((sf) => fieldIsValid(f, operator, sf))) {
          const value = (options == null ? void 0 : options.listsAsArrays) ? valueArray : valueArray.join(", ");
          return { field: f, operator, value, valueSource: "field" };
        }
      }
    } else if (expr.type === "LikePredicate") {
      if (isSQLIdentifier(expr.left) && expr.right.type === "String") {
        const valueWithWildcards = evalSQLLiteralValue(expr.right);
        const valueWithoutWildcards = valueWithWildcards.replace(/(^%)|(%$)/g, "");
        let operator = "=";
        if (/^%.*%$/.test(valueWithWildcards) || valueWithWildcards === "%") {
          operator = expr.hasNot ? "doesNotContain" : "contains";
        } else if (/%$/.test(valueWithWildcards)) {
          operator = expr.hasNot ? "doesNotBeginWith" : "beginsWith";
        } else if (/^%/.test(valueWithWildcards)) {
          operator = expr.hasNot ? "doesNotEndWith" : "endsWith";
        }
        const f = getFieldName(expr.left);
        if (fieldIsValid(f, operator)) {
          return { field: f, operator, value: valueWithoutWildcards };
        }
      } else if (isSQLIdentifier(expr.left) && (expr.right.type === "StartsWithExpr" || expr.right.type === "EndsWithExpr" || expr.right.type === "ContainsExpr")) {
        let subordinateFieldName = "";
        let operator = "=";
        if (isSQLIdentifier(expr.right.value)) {
          subordinateFieldName = getFieldName(expr.right.value);
        }
        if (expr.right.type === "EndsWithExpr") {
          operator = expr.hasNot ? "doesNotEndWith" : "endsWith";
        } else if (expr.right.type === "StartsWithExpr") {
          operator = expr.hasNot ? "doesNotBeginWith" : "beginsWith";
        } else if (expr.right.type === "ContainsExpr") {
          operator = expr.hasNot ? "doesNotContain" : "contains";
        }
        const baseFieldName = getFieldName(expr.left);
        if (operator !== "=" && fieldIsValid(baseFieldName, operator, subordinateFieldName)) {
          return {
            field: baseFieldName,
            operator,
            value: subordinateFieldName,
            valueSource: "field"
          };
        }
      } else if (isSQLIdentifier(expr.left) && isSQLIdentifier(expr.right)) {
        const baseFieldName = getFieldName(expr.left);
        const subordinateFieldName = getFieldName(expr.right);
        const operator = "=";
        if (fieldIsValid(baseFieldName, operator, subordinateFieldName)) {
          return {
            field: baseFieldName,
            operator,
            value: subordinateFieldName,
            valueSource: "field"
          };
        }
      }
    }
    return null;
  };
  const { where } = sqlParser.parse(sqlString).value;
  if (where) {
    const result = processSQLExpression(where);
    if (result) {
      if ("rules" in result) {
        return result;
      }
      return { rules: [result], ...ic ? {} : { combinator: "and" } };
    }
  }
  return { rules: [], ...ic ? {} : { combinator: "and" } };
}
exports.parseSQL = parseSQL;
