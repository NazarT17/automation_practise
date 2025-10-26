import { test, expect } from "@playwright/test";

test.describe("Reqres API Tests", () => {
  test("POST /api/users - Create a new user", async ({ playwright }) => {
    const request = await playwright.request.newContext({
      extraHTTPHeaders: {
        "x-api-key": "reqres-free-v1",
      },
    });

    const response = await request.post("https://reqres.in/api/users", {
      data: {
        name: "John Doe",
        job: "QA Engineer",
      },
    });

    expect(response.status()).toBe(201);
    const responseBody = await response.json();

    expect(responseBody).toHaveProperty("id");
    expect(responseBody).toHaveProperty("createdAt");
    expect(responseBody.name).toBe("John Doe");
    expect(responseBody.job).toBe("QA Engineer");

    await request.dispose();
  });

  test("PUT /api/users/:id - Update an existing user", async ({
    playwright,
  }) => {
    const request = await playwright.request.newContext({
      extraHTTPHeaders: {
        "x-api-key": "reqres-free-v1",
      },
    });

    const response = await request.put("https://reqres.in/api/users/2", {
      data: {
        name: "Jane Smith",
        job: "Senior QA Engineer",
      },
    });

    expect(response.status()).toBe(200);
    const responseBody = await response.json();

    expect(responseBody).toHaveProperty("updatedAt");
    expect(responseBody.name).toBe("Jane Smith");
    expect(responseBody.job).toBe("Senior QA Engineer");

    await request.dispose();
  });

  test("GET /api/users/:id - Get a single user", async ({ playwright }) => {
    const request = await playwright.request.newContext({
      extraHTTPHeaders: {
        "x-api-key": "reqres-free-v1",
      },
    });

    const response = await request.get("https://reqres.in/api/users/2");

    expect(response.status()).toBe(200);
    const responseBody = await response.json();

    expect(responseBody.data).toHaveProperty("id", 2);
    expect(responseBody.data).toHaveProperty("email");
    expect(responseBody.data).toHaveProperty("first_name");

    await request.dispose();
  });

  test("DELETE /api/users/:id - Delete a user", async ({ playwright }) => {
    const request = await playwright.request.newContext({
      extraHTTPHeaders: {
        "x-api-key": "reqres-free-v1",
      },
    });

    const response = await request.delete("https://reqres.in/api/users/2");
    expect(response.status()).toBe(204);

    await request.dispose();
  });

  test("GET /api/users with pagination", async ({ playwright }) => {
    const request = await playwright.request.newContext({
      extraHTTPHeaders: {
        "x-api-key": "reqres-free-v1",
      },
    });

    const response = await request.get("https://reqres.in/api/users?page=2");

    expect(response.status()).toBe(200);
    const responseBody = await response.json();

    expect(responseBody.page).toBe(2);
    expect(Array.isArray(responseBody.data)).toBeTruthy();
    expect(responseBody.data.length).toBeGreaterThan(0);

    await request.dispose();
  });
});
