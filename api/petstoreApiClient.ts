import { APIRequestContext, APIResponse, test } from "@playwright/test";
import logger from "../utils/logger";
import { Pet } from "../factories/petFactory";

/**
 * API Client for Petstore API
 * Wraps all API calls with logging and error handling
 */
export class PetstoreApiClient {
  constructor(private request: APIRequestContext) {}

  /**
   * Attach API request/response details to Allure report
   */
  private async attachApiTrace(
    method: string,
    url: string,
    requestData: any,
    response: APIResponse
  ) {
    let responseBody = "";
    try {
      responseBody = await response.text();
    } catch (e) {
      responseBody = "Unable to read response body";
    }

    // Attach request details
    await test.info().attach(`${method} Request: ${url}`, {
      body: JSON.stringify(
        {
          method,
          url,
          body: requestData,
        },
        null,
        2
      ),
      contentType: "application/json",
    });

    // Attach response details
    await test.info().attach(`${method} Response: ${response.status()}`, {
      body: JSON.stringify(
        {
          status: response.status(),
          statusText: response.statusText(),
          headers: response.headers(),
          body: responseBody ? JSON.parse(responseBody) : null,
        },
        null,
        2
      ),
      contentType: "application/json",
    });
  }

  /**
   * Get pets by status
   * @param status - Pet status filter (available, pending, sold)
   */
  async getPetsByStatus(
    status: "available" | "pending" | "sold"
  ): Promise<{ response: APIResponse; pets: Pet[] }> {
    const url = `pet/findByStatus?status=${status}`;
    logger.info(`[API] Getting pets with status: ${status}`);

    const response = await this.request.get(url);

    logger.info(`[API] Response status: ${response.status()}`);

    // Attach API trace to Allure
    await this.attachApiTrace("GET", url, null, response);

    if (!response.ok()) {
      const errorText = await response.text();
      logger.error(`[API] Failed to get pets by status: ${errorText}`);
      throw new Error(
        `API call failed with status ${response.status()}: ${errorText}`
      );
    }

    const pets = await response.json();
    logger.info(`[API] Found ${pets.length} pets with status: ${status}`);

    return { response, pets };
  }

  /**
   * Create a new pet
   * @param pet - Pet object to create
   */
  async createPet(pet: Pet): Promise<{ response: APIResponse; pet: Pet }> {
    logger.info(`[API] Creating pet with name: "${pet.name}", id: ${pet.id}`);

    const response = await this.request.post("pet", {
      data: pet,
    });

    logger.info(`[API] Response status: ${response.status()}`);

    // Attach API trace to Allure
    await this.attachApiTrace("POST", "pet", pet, response);

    if (!response.ok()) {
      const errorText = await response.text();
      logger.error(`[API] Failed to create pet: ${errorText}`);
      throw new Error(
        `API call failed with status ${response.status()}: ${errorText}`
      );
    }

    const createdPet = await response.json();
    logger.info(
      `[API] Pet created successfully with id: ${createdPet.id}, name: "${createdPet.name}"`
    );

    return { response, pet: createdPet };
  }

  /**
   * Update an existing pet
   * @param pet - Pet object with updated data
   */
  async updatePet(pet: Pet): Promise<{ response: APIResponse; pet: Pet }> {
    logger.info(
      `[API] Updating pet with id: ${pet.id}, new name: "${pet.name}"`
    );

    const response = await this.request.put("pet", {
      data: pet,
    });

    logger.info(`[API] Response status: ${response.status()}`);

    // Attach API trace to Allure
    await this.attachApiTrace("PUT", "pet", pet, response);

    if (!response.ok()) {
      const errorText = await response.text();
      logger.error(`[API] Failed to update pet: ${errorText}`);
      throw new Error(
        `API call failed with status ${response.status()}: ${errorText}`
      );
    }

    const updatedPet = await response.json();
    logger.info(
      `[API] Pet updated successfully - id: ${updatedPet.id}, name: "${updatedPet.name}", status: "${updatedPet.status}"`
    );

    return { response, pet: updatedPet };
  }

  /**
   * Get a pet by ID
   * @param petId - Pet ID to retrieve
   */
  async getPetById(
    petId: number
  ): Promise<{ response: APIResponse; pet: Pet }> {
    logger.info(`[API] Getting pet by id: ${petId}`);

    const response = await this.request.get(`pet/${petId}`);

    logger.info(`[API] Response status: ${response.status()}`);

    if (!response.ok()) {
      const errorText = await response.text();
      logger.error(`[API] Failed to get pet by id: ${errorText}`);
      throw new Error(
        `API call failed with status ${response.status()}: ${errorText}`
      );
    }

    const pet = await response.json();
    logger.info(`[API] Pet found - id: ${pet.id}, name: "${pet.name}"`);

    return { response, pet };
  }

  /**
   * Delete a pet by ID
   * @param petId - Pet ID to delete
   */
  async deletePet(petId: number): Promise<{ response: APIResponse }> {
    logger.info(`[API] Deleting pet with id: ${petId}`);

    const response = await this.request.delete(`pet/${petId}`);

    logger.info(`[API] Response status: ${response.status()}`);

    if (!response.ok()) {
      const errorText = await response.text();
      logger.error(`[API] Failed to delete pet: ${errorText}`);
      throw new Error(
        `API call failed with status ${response.status()}: ${errorText}`
      );
    }

    logger.info(`[API] Pet deleted successfully - id: ${petId}`);

    return { response };
  }

  /**
   * Get store inventory (counts of pets by status)
   */
  async getStoreInventory(): Promise<{
    response: APIResponse;
    inventory: Record<string, number>;
  }> {
    logger.info(`[API] Getting store inventory`);

    const response = await this.request.get("store/inventory");

    logger.info(`[API] Response status: ${response.status()}`);

    if (!response.ok()) {
      const errorText = await response.text();
      logger.error(`[API] Failed to get store inventory: ${errorText}`);
      throw new Error(
        `API call failed with status ${response.status()}: ${errorText}`
      );
    }

    const inventory = await response.json();
    logger.info(`[API] Store inventory retrieved successfully`);

    return { response, inventory };
  }
}
