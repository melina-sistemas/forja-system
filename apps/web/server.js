import { createServer } from "node:http";
import { existsSync } from "node:fs";
import { readFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const workspaceRoot = path.resolve(__dirname, "../..");
const appNodeModules = path.join(__dirname, "node_modules");
const rootNodeModules = path.join(workspaceRoot, "node_modules");
const port = Number(process.env.PORT ?? 3000);

const MIME_TYPES = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png"
};

createServer(async (request, response) => {
  try {
    const requestPath =
      request.url === "/" ? "/index.html" : decodeURIComponent(request.url ?? "/");
    const normalizedRequestPath = requestPath.replace(/\\/g, "/");
    const filePath = resolveRequestPath(normalizedRequestPath);

    if (!filePath) {
      response.writeHead(403);
      response.end("Forbidden");
      return;
    }

    const fileBuffer = await readFile(filePath);
    const extension = path.extname(filePath);
    const contentType = MIME_TYPES[extension] ?? "application/octet-stream";

    response.writeHead(200, {
      "Content-Type": contentType
    });
    response.end(fileBuffer);
  } catch (error) {
    if (request.url !== "/favicon.ico") {
      response.writeHead(404, {
        "Content-Type": "text/plain; charset=utf-8"
      });
      response.end("Arquivo nao encontrado.");
      return;
    }

    response.writeHead(204);
    response.end();
  }
}).listen(port, "0.0.0.0", () => {
  console.log(`Frontend rodando em http://localhost:${port}`);
  for (const address of getLocalAddresses()) {
    console.log(`Frontend em rede local: http://${address}:${port}`);
  }
});

function resolveRequestPath(requestPath) {
  if (requestPath.startsWith("/vendor/")) {
    const vendorRelativePath = requestPath.replace("/vendor/", "");
    const vendorCandidates = [
      path.join(appNodeModules, vendorRelativePath),
      path.join(rootNodeModules, vendorRelativePath)
    ];

    for (const vendorPath of vendorCandidates) {
      if (existsSync(vendorPath)) {
        return vendorPath;
      }
    }

    return null;
  }

  const safePath = path.normalize(requestPath).replace(/^(\.\.[/\\])+/, "");
  const relativeSafePath = safePath.replace(/^[/\\]+/, "");
  const publicPath = path.join(__dirname, "public", relativeSafePath);

  if (publicPath.startsWith(path.join(__dirname, "public")) && existsSync(publicPath)) {
    return publicPath;
  }

  const appPath = path.join(__dirname, safePath);

  if (appPath.startsWith(__dirname) && existsSync(appPath)) {
    return appPath;
  }

  if (!path.extname(relativeSafePath)) {
    return path.join(__dirname, "index.html");
  }

  return null;
}

function getLocalAddresses() {
  const interfaces = os.networkInterfaces();
  const addresses = [];

  for (const group of Object.values(interfaces)) {
    for (const item of group ?? []) {
      if (item.family === "IPv4" && !item.internal) {
        addresses.push(item.address);
      }
    }
  }

  return [...new Set(addresses)];
}
