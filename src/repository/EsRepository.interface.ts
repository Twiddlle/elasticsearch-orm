export interface EsRequestBulkOptions {
  throwException?: true;
}

export interface EsRepositoryInterface<Entity = unknown> {
  create(entity: Entity): Promise<Entity>;

  createMultiple(
    entities: Entity[],
    requestBulkOptions: EsRequestBulkOptions,
  ): Promise<Entity[]>;

  update(entity: Entity): Promise<Entity>;

  updateMultiple(
    entities: Entity[],
    requestBulkOptions: EsRequestBulkOptions,
  ): Promise<Entity[]>;

  save(entity: Entity): Promise<Entity>;

  saveMultiple(
    entities: Entity[],
    requestBulkOptions: EsRequestBulkOptions,
  ): Promise<Entity[]>;

  delete(id: string[]): Promise<boolean>;

  deleteMultiple(
    entity: Entity,
    requestBulkOptions: EsRequestBulkOptions,
  ): Promise<Entity>;

  findOne(query): Promise<Entity>;

  findOneOrFail(query): Promise<Entity>;

  find(query): Promise<Entity[]>;

  findById(id: string | number): Promise<Entity>;
}
