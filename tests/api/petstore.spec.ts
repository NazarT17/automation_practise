import { test, expect } from "@playwright/test";
import { PetstoreApiClient } from "../../api/petstoreApiClient";
import { PetFactory } from "../../factories/petFactory";
import logger from "../../utils/logger";

test.describe("Petstore API Tests @api", () => {
  let apiClient: PetstoreApiClient;

  test.beforeEach(async ({ request }) => {
    apiClient = new PetstoreApiClient(request);
    logger.info("=".repeat(80));
    logger.info("Starting new API test");
  });

  test.afterEach(async () => {
    logger.info("Test completed");
    logger.info("=".repeat(80));
  });

  test("GET - Find pets by status", async () => {
    await test.step("Fetch available pets from API", async () => {
      logger.info("[TEST] Step 1: Getting available pets");

      const { response, pets } = await apiClient.getPetsByStatus("available");

      expect(response.status()).toBe(200);
      expect(Array.isArray(pets)).toBeTruthy();
      expect(pets.length).toBeGreaterThan(0);

      logger.info(`[TEST] ✓ Verified ${pets.length} available pets found`);
    });

    await test.step("Verify response structure", async () => {
      logger.info("[TEST] Step 2: Verifying response structure");

      const { pets } = await apiClient.getPetsByStatus("available");

      const firstPet = pets[0];
      expect(firstPet).toHaveProperty("id");
      expect(firstPet).toHaveProperty("name");
      expect(firstPet).toHaveProperty("status");
      expect(firstPet.status).toBe("available");

      logger.info("[TEST] ✓ Response structure is valid");
    });
  });

  test("POST - Create a new pet", async () => {
    await test.step("Generate random pet data using Faker and create pet", async () => {
      logger.info("[TEST] Step 1: Generating pet data with Faker");

      const newPet = PetFactory.createAvailablePet();
      logger.info(`[TEST] Generated pet: ${JSON.stringify(newPet, null, 2)}`);

      const result = await apiClient.createPet(newPet);

      expect(result.response.status()).toBe(200);
      expect(result.pet.id).toBe(newPet.id);
      expect(result.pet.name).toBe(newPet.name);
      expect(result.pet.status).toBe("available");

      logger.info("[TEST] ✓ Pet created successfully with all expected fields");
    });
  });
  test("PUT - Update an existing pet", async () => {
    let petId: number;
    let originalName: string;

    await test.step("Create a pet with random data", async () => {
      logger.info("[TEST] Step 1: Creating initial pet");

      const newPet = PetFactory.createAvailablePet();
      originalName = newPet.name;

      const result = await apiClient.createPet(newPet);
      petId = result.pet.id;

      logger.info(
        `[TEST] ✓ Pet created with id: ${petId}, name: "${originalName}"`
      );
    });

    await test.step("Update pet status and name", async () => {
      logger.info("[TEST] Step 2: Updating pet details");

      const updatedPetData = PetFactory.createSoldPet({
        id: petId,
        name: "Updated Pet Name",
      });

      const result = await apiClient.updatePet(updatedPetData);

      expect(result.response.status()).toBe(200);
      expect(result.pet.id).toBe(petId);
      expect(result.pet.name).toBe("Updated Pet Name");
      expect(result.pet.status).toBe("sold");

      logger.info(
        `[TEST] ✓ Pet updated from "${originalName}" to "Updated Pet Name"`
      );
      logger.info(`[TEST] ✓ Status changed from "available" to "sold"`);
      logger.info("[TEST] ✓ Update completed successfully");
    });
  });

  test("DEMO - Intentional Failure (DELETE AFTER DEMO)", async () => {
    await test.step("This test will fail to demonstrate screenshot/trace capture", async () => {
      logger.info("[TEST] 🎬 DEMO: Demonstrating failure handling");
      logger.info(
        "[TEST] This test intentionally fails to show artifacts capture"
      );

      // Create a pet first (to have some API activity)
      const newPet = PetFactory.createAvailablePet();
      logger.info(`[TEST] Created test data: ${newPet.name}`);

      const result = await apiClient.createPet(newPet);
      expect(result.response.status()).toBe(200);

      logger.info("[TEST] Pet created successfully");
      logger.info("[TEST] Now triggering intentional failure...");

      // This will intentionally fail to demonstrate failure artifacts
      expect(result.pet.status).toBe("sold"); // ❌ Will fail because status is "available"

      logger.info("[TEST] This line won't be reached");
    });
  });
});
