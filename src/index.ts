import dotenv from "dotenv";
dotenv.config();
import { remote } from "webdriverio";
import { readFileSync } from "fs";
import { join } from "path";
import { callAgentInit } from "./ai/agent/browser-agent";
import Handlebars from "handlebars";
import { LLMModel, OpenAIModel } from "./ai/providers/models";
import { opts } from "./cmd";

async function main() {
  console.log("🚀 Starting mobile app test...");
  console.log("📋 Options:", opts);

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
    console.log("✅ App launched successfully!");

    let testPrompt = opts.testPrompt as string;
    if (!testPrompt) {
      try {
        const defaultTestPath = join(__dirname, "prompt-templates", "DefaultTest.md");
        testPrompt = readFileSync(defaultTestPath, "utf-8");
        console.log("📝 Loaded default test instructions from default_test.md");
      } catch (error: unknown) {
        console.warn(
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
    console.log("[ test complete ]", results);
  } catch (error) {
    console.error("❌ Test failed:", error);
  } finally {
    await driver.deleteSession();
    console.log("🔚 Session closed");
  }
}

main().catch(console.error);
