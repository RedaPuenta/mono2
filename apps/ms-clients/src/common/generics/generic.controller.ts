import { MongoService } from '@lib/modules';
import {
  CreateError,
  DeleteError,
  ReadError,
  SearchError,
  UpdateError,
} from '../types/crud-errors';
import {
  DeleteDto,
  DeleteManyDto,
  Paginated,
  ReadDto,
  SearchDto,
  UpdateDto,
  UpdateManyDto,
} from '../types/generic.dto';

/**
 * A generic controller class that provides CRUD operations and search functionality for a given entity type.
 * @template EntityType The type of entity this controller operates on.
 */
export class GenericController<EntityType> {
  constructor(protected service: MongoService<EntityType>) {}

  /**
   * Searches for entities based on the provided search parameters.
   * @param searchParams The search parameters to use. @see SearchDto
   * @returns An object containing the formatted list of entities and the paging information.
   * @throws {SearchError} If an error occurs while searching.
   */
  async search(searchParams: SearchDto<EntityType>) {
    const { page, limit, order, ...searchData } = searchParams;
    let serviceResponse: Paginated<EntityType>;

    try {
      serviceResponse = await this.service.paging(searchData, {
        page,
        limit,
        order,
      });

      const { list, paging } = serviceResponse;
      const formattedList = await this.service.render<EntityType[]>(list);
      return { list: formattedList, paging };
    } catch (e: any) {
      throw new SearchError(e.message, searchParams);
    }
  }

  /**
   * Reads an entity by its ID.
   * @param id The ID of the entity to read.
   * @returns An object containing the entity.
   * @throws {ReadError} If the entity cannot be read.
   */
  async read({ id }: ReadDto): Promise<EntityType> {
    try {
      const entity: EntityType = await this.service.read(id);
      return entity;
    } catch (e: any) {
      throw new ReadError(e.message, id);
    }
  }

  /**
   * Creates a new entity of type `EntityType`.
   * @param entity The entity to create.
   * @returns An object containing the created entity.
   * @throws {CreateError} If there was a problem creating the entity.
   */
  async create(entity: EntityType): Promise<{ created: EntityType }> {
    try {
      const createdEntity = await this.service.createOne(entity);
      return { created: createdEntity };
    } catch (e: any) {
      throw new CreateError(e.message, entity);
    }
  }

  /**
   * Creates multiple entities.
   * @param {EntityType[]} entities - The entities to create.
   * @returns {Promise<{ created: EntityType[] }>} The created entities.
   * @throws {CreateError} If an error occurs during creation.
   */
  async createMany(entities: EntityType[]): Promise<{ created: EntityType[] }> {
    try {
      const createdEntities = await this.service.createMany(entities);
      return { created: createdEntities };
    } catch (e: any) {
      throw new CreateError(e.message, entities);
    }
  }

  /**
   * Updates an entity with the given ID and returns the updated entity.
   * @param id The ID of the entity to update.
   * @param entity The updated entity data.
   * @returns An object containing the updated entity.
   * @throws {UpdateError} If there was an error updating the entity.
   */
  async update({
    id,
    update,
  }: UpdateDto<EntityType>): Promise<{ updated: EntityType }> {
    try {
      const updatedEntity = await this.service.update(id, update);
      return { updated: updatedEntity };
    } catch (e: any) {
      throw new UpdateError(e.message, update);
    }
  }

  /**
   * Updates multiple entities.
   * @param {EntityType[]} entity - The entities to update.
   * @returns {Promise<{ updated: EntityType[] }>} The updated entities.
   * @throws {UpdateError} If an error occurs during update.
   */
  async updateMany(
    updates: UpdateManyDto<EntityType>,
  ): Promise<{ updated: EntityType[] }> {
    try {
      const updatedEntities = await Promise.all(
        updates.map(({ id, update }) => this.service.update(id, update)),
      );
      return { updated: updatedEntities };
    } catch (e: any) {
      throw new UpdateError(e.message, updates);
    }
  }

  /**
   * Deletes an entity by ID.
   * @param {DeleteDto} dto - The DTO containing the ID of the entity to delete.
   * @returns {Promise<{ deletedId: string }>} - An object containing the ID of the deleted entity.
   * @throws {DeleteError} - If the entity could not be deleted.
   */
  async delete({ id }: DeleteDto): Promise<{ deletedId: string }> {
    try {
      const deletedEntity = await this.service.remove(id);
      return {
        deletedId: Array.isArray(deletedEntity)
          ? deletedEntity[0]
          : deletedEntity,
      };
    } catch (e: any) {
      throw new DeleteError(e.message, id);
    }
  }

  /**
   * Deletes multiple entities by their IDs.
   * @param {DeleteManyDto} dto - The DTO containing the IDs of the entities to delete.
   * @returns {Promise<{ deletedIds: string[] }>} - An object containing the IDs of the deleted entities.
   * @throws {DeleteError} - If any error occurs while deleting the entities.
   */
  async deleteMany({ ids }: DeleteManyDto): Promise<{ deletedIds: string[] }> {
    try {
      const deletedEntities = await Promise.all(
        ids.map((id) => this.service.remove(id)),
      );
      return {
        deletedIds: deletedEntities.flat(),
      };
    } catch (e: any) {
      throw new DeleteError(e.message, ids);
    }
  }

  /**
   * Counts the number of entities matching the given search parameters.
   * @param {SearchParams<EntityType>} searchParams - The search parameters.
   * @returns {Promise<number>} The number of entities matching the search parameters.
   * @throws {ReadError} If an error occurs during counting.
   */
  async count(searchParams: SearchDto<EntityType>): Promise<number> {
    try {
      return this.service.count(searchParams);
    } catch (e: any) {
      throw new ReadError(e.message, searchParams);
    }
  }
}
