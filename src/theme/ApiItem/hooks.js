"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useTypedSelector = exports.useTypedDispatch = void 0;
const react_redux_1 = require("react-redux");
const useTypedDispatch = () => (0, react_redux_1.useDispatch)();
exports.useTypedDispatch = useTypedDispatch;
exports.useTypedSelector = react_redux_1.useSelector;
