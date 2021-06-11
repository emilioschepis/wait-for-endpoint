import * as core from "@actions/core";
import * as http from "@actions/http-client";

const SUPPORTED_METHODS = ["GET", "HEAD", "OPTIONS", "PATCH", "POST", "PUT"];

function getInput(name: string): string {
  return core.getInput(name, { required: true, trimWhitespace: true });
}

async function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function main() {
  try {
    const url = getInput("url");
    const method = getInput("method").toUpperCase();
    const expectedStatus = parseInt(getInput("expected-status"));
    const timeout = parseInt(getInput("timeout"));
    const interval = parseInt(getInput("interval"));

    if (!SUPPORTED_METHODS.includes(method)) {
      core.setFailed("Specify a valid HTTP method.");
      return;
    }

    const client = new http.HttpClient();
    const startTime = new Date().getTime();

    while (new Date().getTime() - startTime < timeout) {
      try {
        const response = await client.request(method, url, null, {});
        const status = response.message.statusCode;

        if (status === expectedStatus) {
          return;
        } else {
          await delay(interval);
        }
      } catch {
        await delay(interval);
      }
    }

    core.setFailed("Waiting exceeded timeout.");
  } catch (error) {
    core.setFailed(error.message);
  }
}

main();
