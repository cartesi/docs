"use strict";
var __createBinding =
  (this && this.__createBinding) ||
  (Object.create
    ? function (o, m, k, k2) {
        if (k2 === undefined) k2 = k;
        var desc = Object.getOwnPropertyDescriptor(m, k);
        if (
          !desc ||
          ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)
        ) {
          desc = {
            enumerable: true,
            get: function () {
              return m[k];
            },
          };
        }
        Object.defineProperty(o, k2, desc);
      }
    : function (o, m, k, k2) {
        if (k2 === undefined) k2 = k;
        o[k2] = m[k];
      });
var __setModuleDefault =
  (this && this.__setModuleDefault) ||
  (Object.create
    ? function (o, v) {
        Object.defineProperty(o, "default", { enumerable: true, value: v });
      }
    : function (o, v) {
        o["default"] = v;
      });
var __importStar =
  (this && this.__importStar) ||
  function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null)
      for (var k in mod)
        if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k))
          __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
  };
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importStar(require("react"));
const internal_1 = require("@docusaurus/theme-common/internal");
const useIsBrowser_1 = __importDefault(require("@docusaurus/useIsBrowser"));
const Heading_1 = __importDefault(require("@theme/Heading"));
const clsx_1 = __importDefault(require("clsx"));
function TabList({
  className,
  block,
  selectedValue,
  selectValue,
  tabValues,
  label = "Responses",
  id = "responses",
}) {
  const tabRefs = [];
  const { blockElementScrollPositionUntilNextRender } = (0,
  internal_1.useScrollPositionBlocker)();
  const handleTabChange = (event) => {
    const newTab = event.currentTarget;
    const newTabIndex = tabRefs.indexOf(newTab);
    const newTabValue = tabValues[newTabIndex].value;
    if (newTabValue !== selectedValue) {
      blockElementScrollPositionUntilNextRender(newTab);
      selectValue(newTabValue);
    }
  };
  const handleKeydown = (event) => {
    let focusElement = null;
    switch (event.key) {
      case "Enter": {
        handleTabChange(event);
        break;
      }
      case "ArrowRight": {
        const nextTab = tabRefs.indexOf(event.currentTarget) + 1;
        focusElement = tabRefs[nextTab] ?? tabRefs[0];
        break;
      }
      case "ArrowLeft": {
        const prevTab = tabRefs.indexOf(event.currentTarget) - 1;
        focusElement = tabRefs[prevTab] ?? tabRefs[tabRefs.length - 1];
        break;
      }
      default:
        break;
    }
    focusElement?.focus();
  };
  const tabItemListContainerRef = (0, react_1.useRef)(null);
  const [showTabArrows, setShowTabArrows] = (0, react_1.useState)(false);
  (0, react_1.useEffect)(() => {
    const resizeObserver = new ResizeObserver((entries) => {
      for (let entry of entries) {
        requestAnimationFrame(() => {
          if (entry.target.clientWidth < entry.target.scrollWidth) {
            setShowTabArrows(true);
          } else {
            setShowTabArrows(false);
          }
        });
      }
    });
    resizeObserver.observe(tabItemListContainerRef.current);
    return () => {
      resizeObserver.disconnect();
    };
  }, []);
  const handleRightClick = () => {
    tabItemListContainerRef.current.scrollLeft += 90;
  };
  const handleLeftClick = () => {
    tabItemListContainerRef.current.scrollLeft -= 90;
  };
  return react_1.default.createElement(
    "div",
    { className: "openapi-tabs__response-header-section" },
    react_1.default.createElement(
      Heading_1.default,
      {
        as: "h2",
        id: id,
        className: "openapi-tabs__heading openapi-tabs__response-header",
      },
      label
    ),
    react_1.default.createElement(
      "div",
      { className: "openapi-tabs__response-container" },
      showTabArrows &&
        react_1.default.createElement("button", {
          className: "openapi-tabs__arrow left",
          onClick: handleLeftClick,
        }),
      react_1.default.createElement(
        "ul",
        {
          ref: tabItemListContainerRef,
          role: "tablist",
          "aria-orientation": "horizontal",
          className: (0, clsx_1.default)(
            "openapi-tabs__response-list-container",
            "tabs",
            {
              "tabs--block": block,
            },
            className
          ),
        },
        tabValues.map(({ value, label, attributes }) =>
          react_1.default.createElement(
            "li",
            {
              // TODO extract TabListItem
              role: "tab",
              tabIndex: selectedValue === value ? 0 : -1,
              "aria-selected": selectedValue === value,
              key: value,
              ref: (tabControl) => tabRefs.push(tabControl),
              onKeyDown: handleKeydown,
              onClick: handleTabChange,
              ...attributes,
              className: (0, clsx_1.default)(
                "tabs__item",
                "openapi-tabs__response-code-item",
                attributes?.className,
                parseInt(value) >= 400
                  ? "danger"
                  : parseInt(value) >= 200 && parseInt(value) < 300
                    ? "success"
                    : "info",
                {
                  active: selectedValue === value,
                }
              ),
            },
            label ?? value
          )
        )
      ),
      showTabArrows &&
        react_1.default.createElement("button", {
          className: "openapi-tabs__arrow right",
          onClick: handleRightClick,
        })
    )
  );
}
function TabContent({ lazy, children, selectedValue }) {
  const childTabs = (Array.isArray(children) ? children : [children]).filter(
    Boolean
  );
  if (lazy) {
    const selectedTabItem = childTabs.find(
      (tabItem) => tabItem.props.value === selectedValue
    );
    if (!selectedTabItem) {
      // fail-safe or fail-fast? not sure what's best here
      return null;
    }
    return (0, react_1.cloneElement)(selectedTabItem, {
      className: "margin-top--md",
    });
  }
  return react_1.default.createElement(
    "div",
    { className: "margin-top--md" },
    childTabs.map((tabItem, i) =>
      (0, react_1.cloneElement)(tabItem, {
        key: i,
        hidden: tabItem.props.value !== selectedValue,
      })
    )
  );
}
function TabsComponent(props) {
  const tabs = (0, internal_1.useTabs)(props);
  return react_1.default.createElement(
    "div",
    { className: "openapi-tabs__container" },
    react_1.default.createElement(TabList, { ...props, ...tabs }),
    react_1.default.createElement(TabContent, { ...props, ...tabs })
  );
}
function ApiTabs(props) {
  const isBrowser = (0, useIsBrowser_1.default)();
  return react_1.default.createElement(
    TabsComponent,
    // Remount tabs after hydration
    // Temporary fix for https://github.com/facebook/docusaurus/issues/5653
    {
      // Remount tabs after hydration
      // Temporary fix for https://github.com/facebook/docusaurus/issues/5653
      key: String(isBrowser),
      ...props,
    },
    (0, internal_1.sanitizeTabsChildren)(props.children)
  );
}
exports.default = ApiTabs;