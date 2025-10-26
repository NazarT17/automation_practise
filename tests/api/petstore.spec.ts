import { test, expect } from "@playwright/test";

test.describe("Petstore API Tests", () => {
  test("GET - Find pets by status", async ({ request }) => {
    const response = await request.get("pet/findByStatus?status=available");

    expect(response.status()).toBe(200);
    const pets = await response.json();

    expect(Array.isArray(pets)).toBeTruthy();
    expect(pets.length).toBeGreaterThan(0);
  });

  test("POST - Create a new pet", async ({ request }) => {
    const newPet = {
      id: Math.floor(Math.random() * 100000),
      name: "Fluffy",
      photoUrls: ["https://example.com/photo.jpg"],
      status: "available",
    };

    const response = await request.post("pet", {
      data: newPet,
    });

    expect(response.status()).toBe(200);
    const pet = await response.json();

    expect(pet.id).toBe(newPet.id);
    expect(pet.name).toBe("Fluffy");
    expect(pet.status).toBe("available");
  });

  test("PUT - Update an existing pet", async ({ request }) => {
    // First create a pet
    const newPet = {
      id: Math.floor(Math.random() * 100000),
      name: "Original Name",
      photoUrls: ["https://example.com/photo.jpg"],
      status: "available",
    };

    await request.post("pet", { data: newPet });

    // Now update it
    const updatedPet = {
      ...newPet,
      name: "Updated Name",
      status: "sold",
    };

    const response = await request.put("pet", {
      data: updatedPet,
    });

    expect(response.status()).toBe(200);
    const pet = await response.json();

    expect(pet.name).toBe("Updated Name");
    expect(pet.status).toBe("sold");
  });
});
