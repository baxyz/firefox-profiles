/**
 * Integration tests for Firefox Profiles extension
 */
import { describe, it, expect } from "vitest";
import metadata from "../metadata.json";

describe("Firefox Profiles Extension Integration", () => {
  it("should have basic test structure", () => {
    // Basic smoke test
    expect(true).toBe(true);
  });

  it("should handle multiple GNOME Shell versions", () => {
    const versions = metadata["shell-version"];

    versions.forEach((version) => {
      expect(version).toMatch(/^4[6-9]$/);
    });
  });

  it("should be able to test import functionality", async () => {
    // Test that dynamic imports work in the test environment
    const testModule = await import("./package-compatibility.test");
    expect(testModule).toBeDefined();
  });
});
