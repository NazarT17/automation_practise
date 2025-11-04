import { faker } from "@faker-js/faker";

export interface Pet {
  id: number;
  name: string;
  photoUrls: string[];
  status: "available" | "pending" | "sold";
  category?: {
    id: number;
    name: string;
  };
  tags?: Array<{
    id: number;
    name: string;
  }>;
}

export class PetFactory {
  /**
   * Creates a pet with random data using Faker
   * @param overrides - Optional properties to override the default random values
   * @returns Pet object
   */
  static createPet(overrides?: Partial<Pet>): Pet {
    return {
      id: faker.number.int({ min: 1, max: 100000 }),
      name: faker.animal.dog(),
      photoUrls: [faker.image.url()],
      status: "available",
      category: {
        id: faker.number.int({ min: 1, max: 10 }),
        name: faker.animal.type(),
      },
      tags: [
        {
          id: faker.number.int({ min: 1, max: 100 }),
          name: faker.lorem.word(),
        },
      ],
      ...overrides, // Override with custom values if provided
    };
  }

  /**
   * Creates a pet with "available" status
   */
  static createAvailablePet(overrides?: Partial<Pet>): Pet {
    return this.createPet({ status: "available", ...overrides });
  }

  /**
   * Creates a pet with "sold" status
   */
  static createSoldPet(overrides?: Partial<Pet>): Pet {
    return this.createPet({ status: "sold", ...overrides });
  }

  /**
   * Creates a pet with "pending" status
   */
  static createPendingPet(overrides?: Partial<Pet>): Pet {
    return this.createPet({ status: "pending", ...overrides });
  }

  /**
   * Creates a simple pet with minimal data (only required fields)
   */
  static createSimplePet(overrides?: Partial<Pet>): Pet {
    return {
      id: faker.number.int({ min: 1, max: 100000 }),
      name: faker.animal.dog(),
      photoUrls: [faker.image.url()],
      status: "available",
      ...overrides,
    };
  }
}
