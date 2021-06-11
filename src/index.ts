import * as core from "@actions/core";
import * as http from "@actions/http-client";

const SUPPORTED_METHODS = ["GET", "HEAD", "OPTIONS", "PATCH", "POST", "PUT"];

function getInput(name: string): string {
  return core.getInput(name, { required: true, trimWhitespace: true });
}

async function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function request(url: string, method: string, expectedStatus: number, interval: number): Promise<void> {
  const client = new http.HttpClient();

  while (true) {
    try {
      const response = await client.request(method, url, null, {});
      const status = response.message.statusCode;

      if (status === expectedStatus) return;

      await delay(interval);
    } catch (_) {
      continue;
    }
  }
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

    const requestPromise = request(url, method, expectedStatus, interval);
    const timeoutTimer = new Promise((resolve) =>
      setTimeout(() => {
        core.setFailed("Waiting exceeded timeout.");
        resolve(null);
      }, timeout)
    );

    return Promise.race([requestPromise, timeoutTimer]);
  } catch (error) {
    core.setFailed(error.message);
  }
}

main();
