import { Command } from "commander";

const program = new Command();

program
  .name("mobile-tester")
  .description("Run Appium tests driven by AI prompts")
  .version("1.0.0")
  .option(
    "-b, --bundle-id <id>",
    "App bundle identifier",
    process.env.DEFAULT_BUNDLE_ID
  )
  .option(
    "-a, --app <path>",
    "Path to .app/.apk file",
    process.env.APP_FILE_PATH
  )
  .option(
    "-p, --platform <name>",
    "iOS or Android",
    process.env.PLATFORM || "iOS"
  )
  .option("-d, --device <name>", "Device name", process.env.DEFAULT_DEVICE)
  .option("-o, --os-version <ver>", "OS version", process.env.DEFAULT_OS_VERSION)
  .option(
    "-t, --timeout <ms>",
    "Appium command timeout",
    process.env.TIMEOUT_MS || "240"
  )
  .option("-w, --wait <ms>", "Initial wait before test", "2000")
  .option("--test-prompt <txt>", "Inline test instructions or file path")
  .option("-l, --log-level <level>", "Log level (debug, info, warn, error, silent)", "info")
  .option("-tf, --test-file <path>", "Test file name")
  .parse(process.argv);

export const opts = program.opts();
