import { ElementAction } from "../elementAction";

export const elementActionToolCall = async (
  elementAction: ElementAction,
  driver: WebdriverIO.Browser
) => {
  const { element_identifier, action, value } = elementAction;

  console.log(
    "[ elementActionToolCall ] 📲 Performing action:",
    action,
    "on element:",
    element_identifier
  );

  const findElement = (identifier: string) => {
    console.log("Finding element with identifier:", identifier);

    if (identifier.includes("=")) {
      const parts = identifier.split("=");
      if (parts.length === 2) {
        const selectorType = parts[0].trim().toLowerCase();
        const selectorValue = parts[1].trim();

        if (selectorType === "xpath") {
          console.log("Using XPath selector:", selectorValue);
          return driver.$(selectorValue);
        } else if (selectorType === "id") {
          console.log("Using accessibility ID:", selectorValue);
          return driver.$(`~${selectorValue}`);
        }
      }
    }

    if (identifier.startsWith("//") || identifier.startsWith("/")) {
      console.log("Using XPath selector:", identifier);
      return driver.$(identifier);
    }

    if (
      identifier.includes("XCUIElementType") &&
      !identifier.startsWith("//") &&
      !identifier.startsWith("/")
    ) {
      console.log("Using iOS class chain:", identifier);
      return driver.$(`-ios class chain:${identifier}`);
    }

    console.log("Using accessibility ID:", identifier);
    const accessibilityId = identifier.startsWith("~")
      ? identifier
      : `~${identifier}`;
    return driver.$(accessibilityId);
  };

  try {
    const element = findElement(element_identifier);

    switch (action) {
      case "click":
        await element.click();
        break;
      case "set_text":
        if (!value) {
          throw new Error("Value is required for set_text action");
        }
        await element.setValue(value);
        break;
      case "clear_text":
        await element.clearValue();
        break;
      case "scroll_into_view": {
        const windowSize = await driver.getWindowSize();
        const centerX = windowSize.width / 2;
        const startY = windowSize.height * 0.7;
        const endY = windowSize.height * 0.3;

        await driver.swipe({
          direction: "up",
          from: { x: centerX, y: startY },
          to: { x: centerX, y: endY },
        });
        break;
      }
      default:
        throw new Error(`Unsupported action: ${action}`);
    }

    return {
      success: true,
      message: `Action ${action} performed on element ${element_identifier}`,
    };
  } catch (error) {
    console.error("Element action failed:", error);
    return {
      success: false,
      message: `Failed to perform action ${action} on element ${element_identifier}: ${error}`,
    };
  }
};
