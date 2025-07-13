# Open Test Bench

Open Test Bench is a CLI tool that uses AI to run end-to-end tests on mobile applications. It uses Appium to drive the tests and an LLM agent to interpret the test instructions.

## Prerequisites

- Node.js
- Appium
- An OpenAI API key

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

4. Add your OpenAI API key to the `.env` file:
```bash
OPENAI_API_KEY=your-api-key
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
