# Open Test Bench

Open Test Bench is a CLI tool that uses AI to run end-to-end tests on mobile applications. It uses Appium to drive the tests and an LLM agent to interpret the test instructions.

## Prerequisites

- Node.js
- Appium
- An OpenRouter API Key

## Installation

1. Clone the repository:
```bash
git clone https://github.com/your-username/open-test-bench.git
```

2. Install the dependencies:
```bash
npm install
```

3. Set up the environment variables:
```bash
cp .env.sample .env
```

4. Add your OpenAI or OpenRouter API key to the `.env` file:
```bash
OPENAI_API_KEY=your-api-key
```

5. If you are using OpenRouter, add your LLM_BASE_URL to the `.env` file:
```bash
LLM_BASE_URL=https://openrouter.ai/api/v1

```
6. Add your desired LLM_Model the `.env` file:
```bash
LLM_MODEL=
```

7. Add the device and bundle options to the `.env` file
```bash
DEFAULT_DEVICE=
DEFAULT_OS_VERSION=
BUNDLE_ID=
APP_FILE_PATH=
DEFAULT_BUNDLE_ID=
```

## Usage

To run a test, use the following command:

```bash
npm start -- -b <bundle-id> -a <path-to-app>
```

### Options

- `-b, --bundle-id <id>`: App bundle identifier
- `-a, --app <path>`: Path to .app/.apk file
- `-p, --platform <name>`: iOS or Android (default: iOS)
- `-d, --device <name>`: Device name
- `-o, --os-version <ver>`: OS version
- `-t, --timeout <ms>`: Appium command timeout (default: 240)
- `-w, --wait <ms>`: Initial wait before test (default: 2000)
- `--test-prompt <txt>`: Inline test instructions or file path

## Contributing

Contributions are welcome! Please open an issue or submit a pull request.
