/**
 * Integration tests for Firefox Profiles extension
 */
import { describe, it, expect } from "vitest";
import { execSync } from "child_process";
import { writeFileSync, unlinkSync } from "fs";
import { resolve } from "path";
import metadata from "../metadata.json";
import tsconfig from "../tsconfig.json";

describe("Firefox Profiles Extension Integration", () => {
  it("should have basic test structure", () => {
    // Basic smoke test
    expect(true).toBe(true);
  });

  it("should handle multiple GNOME Shell versions", () => {
    const versions = metadata["shell-version"];

    versions.forEach((version) => {
      expect(version).toMatch(/^(4[6-9]|50)$/);
    });
  });

  it("should compile successfully with all GNOME Shell versions", { timeout: 20000 }, () => {
    const versions = metadata["shell-version"];

    versions.forEach((version) => {
      const tempConfigPath = resolve(process.cwd(), `.tsconfig.test-${version}.json`);

      const tempConfig = {
        ...tsconfig,
        compilerOptions: {
          ...tsconfig.compilerOptions,
          noEmit: true,
          skipLibCheck: true,
          paths: {
            ...tsconfig.compilerOptions.paths,
            "@girs/gnome-shell": [`./node_modules/@girs/gnome-shell-${version}`],
          },
        },
      };

      try {
        writeFileSync(tempConfigPath, JSON.stringify(tempConfig, null, 2));
        execSync(`npx tsc --project ${tempConfigPath}`, {
          cwd: process.cwd(),
          encoding: "utf-8",
        });
      } catch (error: any) {
        throw new Error(
          `TypeScript compilation failed for GNOME Shell ${version}:\n${error.stdout || error.message}`,
        );
      } finally {
        try {
          unlinkSync(tempConfigPath);
        } catch {
          // Ignore cleanup errors
        }
      }
    });
  });
});
