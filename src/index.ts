import dotenv from "dotenv";
dotenv.config();
import { remote } from "webdriverio";
import { readFileSync } from "fs";
import { join } from "path";
import { callAgentInit } from "./ai/agent/browser-agent";
import Handlebars from "handlebars";
import { LLMModel, OpenAIModel } from "./ai/providers/models";
import { opts } from "./cmd";
import { logger, parseLogLevel } from "./utils/logger";

async function main() {
  logger.setLogLevel(parseLogLevel(opts.logLevel as string));
  
  logger.log("🚀 Starting mobile app test...");
  logger.info("📋 Options:", opts);

  const bundleId = (opts.bundleId as string) || process.env.DEFAULT_BUNDLE_ID;

  const appFilePath = (opts.app as string) || process.env.APP_FILE_PATH;

  if (!bundleId) {
    throw new Error("Bundle ID is required");
  }

  if (!appFilePath) {
    throw new Error("App file path is required");
  }

  const driver = await remote({
    logLevel: "warn",
    hostname: "localhost",
    port: 4723,
    path: "/",
    capabilities: {
      platformName: (opts.platform as string) || "iOS",
      "appium:automationName":
        opts.platform === "Android" ? "UiAutomator2" : "XCUITest",
      "appium:deviceName":
        (opts.device as string) ||
        process.env.DEFAULT_DEVICE ||
        "iPhone 16 Pro",
      "appium:platformVersion":
        (opts.version as string) || process.env.DEFAULT_OS_VERSION || "18.1",
      "appium:app": appFilePath,
      "appium:bundleId": bundleId,
      "appium:newCommandTimeout": parseInt(opts.timeout as string) || 240,
    },
  });

  try {
    logger.log("✅ App launched successfully!");

    let testPrompt = opts.testPrompt as string;
    if (!testPrompt) {
      try {
        const testFilePath = opts.testFile ?? "DefaultTest.md";
        const defaultTestPath = join(__dirname, "prompt-templates", testFilePath);
        testPrompt = readFileSync(defaultTestPath, "utf-8");
        logger.info("📝 Loaded test instructions from", testFilePath);
      } catch (error: unknown) {
        logger.warn(
          "⚠️  Could not load default_test, using fallback prompt",
          error
        );
        testPrompt = "I want to login";
      }
    }

    const systemPromptTemplate = Handlebars.compile(
      readFileSync(join(__dirname, "prompt-templates", "SystemPrompt.hbs"), "utf-8")
    );

    const systemPrompt = systemPromptTemplate({
      companyName: process.env.COMPANY_NAME,
      companyDescription: process.env.COMPANY_DESCRIPTION,
      appName: process.env.APP_NAME,
      appDescription: process.env.APP_DESCRIPTION,
    });

    const waitTime = parseInt(opts.wait as string) || 2000;
    await driver.pause(waitTime);

    const results = await callAgentInit(
      testPrompt,
      systemPrompt,
      driver,
      (process.env.LLM_MODEL as LLMModel) || OpenAIModel.GPT_4o
    );
    logger.log("[ test complete ]", results);
  } catch (error) {
    logger.error("❌ Test failed:", error);
  } finally {
    await driver.deleteSession();
    logger.log("🔚 Session closed");
  }
}

main().catch(logger.error);
