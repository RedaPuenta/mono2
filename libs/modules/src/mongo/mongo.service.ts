import { RpcException } from '@nestjs/microservices';
import {
  Document,
  HydratedDocument,
  IfAny,
  MergeType,
  Model,
  Require_id,
  Types,
} from 'mongoose';
import { inspect } from 'util';

export type Pagination = {
  current: number;
  count: number;
  limit: number;
};

export type Paging<T> = {
  list: T[];
  paging: Pagination;
};

const globalLimit = 300;

export class MongoService<T> {
  private readonly modelName: any;

  constructor(protected readonly model: Model<T>) {
    for (const modelName of Object.keys(model.collection.conn.models)) {
      if (model.collection.conn.models[modelName] === this.model) {
        this.modelName = modelName;
        break;
      }
    }
  }

  // -------------------------
  // Filtre les paramètres de recherche
  // pour éventuellement les modifier
  // -------------------------
  async paramize(search: any = {}): Promise<any> {
    return search;
  }

  // -------------------------
  // Processus de création d'un nouveau document
  // -------------------------
  async createOne(
    data: any = {},
    options: any = {},
  ): Promise<HydratedDocument<T, {}, {}>> {
    const filteredData = this.filterFields(data, options.authorizedFields);
    const cleanedData = this.cleanModelData(filteredData);
    return this.model.create(cleanedData);
  }

  // -------------------------
  // Processus de création de plusieurs nouveaux models
  // -------------------------
  async createMany(
    list: any = [],
    options: any = {},
  ): Promise<
    MergeType<
      IfAny<T, any, Document<unknown, {}, T> & Require_id<T>>,
      Omit<any, '_id'>
    >[]
  > {
    const filteredList = list.map((m: any) =>
      this.filterFields(m, options.authorizedFields),
    );
    const cleanedList = filteredList.map(this.cleanModelData.bind(this));
    return this.model.insertMany(cleanedList);
  }

  // -------------------------
  // Compte le nombre de documents
  // -------------------------
  async count(search: any = {}): Promise<number> {
    // On nettoie les données en entrée
    const cleanedQuery = this.cleanModelData(search);
    const paramizedQuery: any = await this.paramize(cleanedQuery);
    return this.model.countDocuments(paramizedQuery).exec();
  }

  // -------------------------
  // Recherche un seul document
  // -------------------------
  async findOne(search: any = {}): Promise<any> {
    // On nettoie les données en entrée
    const cleanedQuery = this.cleanModelData(search);
    const paramizedQuery: any = await this.paramize(cleanedQuery);
    return this.model.findOne(paramizedQuery).exec();
  }

  // -------------------------
  // Recherche de documents
  // -------------------------
  async find(
    search: any = {},
    options: { limit?: number; force?: boolean; order?: string } = {
      limit: 20,
      force: false,
      order: '',
    },
  ): Promise<HydratedDocument<T, {}, {}>[]> {
    // On récupère la limite si il y en a une
    let limit = options.limit || globalLimit;
    if (!options.force && limit > globalLimit) limit = globalLimit;

    // On nettoie les données en entrée
    const cleanedQuery = this.cleanModelData(search);
    const paramizedQuery: any = await this.paramize(cleanedQuery);

    // On lance la recherche
    return this.model
      .find(paramizedQuery)
      .limit(limit)
      .sort(options.order || '-createdAt')
      .exec();
  }

  // -------------------------
  // Lance une recherche sur les documents avec pagination
  // -------------------------
  async paging(
    search: any = {},
    options: {
      limit?: number | null;
      page?: number | null;
      order?: string | null;
    } = {
      limit: 20,
      page: 1,
      order: '-createdAt',
    },
  ): Promise<Paging<HydratedDocument<T, {}, {}>>> {
    const { order } = options;

    let { limit = 20, page = 1 } = options;

    // Sécurité pour éviter les dépassements de mémoires
    if (limit && limit > globalLimit) limit = globalLimit;
    if (page && page < 1) page = 1;

    const cleanedQuery: any = this.cleanModelData(search);
    const paramizedQuery: any = await this.paramize(cleanedQuery);

    const [list, count] = await Promise.all([
      this.model
        .find(paramizedQuery)
        .limit(limit!)
        .skip((page! - 1) * limit!)
        .sort(order)
        .exec(),
      Object.keys(paramizedQuery).length
        ? this.model.countDocuments(paramizedQuery)
        : this.model.estimatedDocumentCount(),
    ]);

    return {
      list,
      paging: {
        limit: limit!,
        count,
        current: page!,
      },
    };
  }

  // -------------------------
  // Retourne le render d'un document
  // Note : "id" peut être un ID ou un
  // objet de recherche
  // -------------------------
  async read<Type>(id: string | any, options: any = {}): Promise<Type> {
    // Securities
    if (typeof id === 'object' && Object.keys(id).length === 0)
      throw new RpcException({
        code: 'MCRTL_1',
        message: `Unknow item ${inspect(id)}`,
      });
    else if (!id)
      throw new RpcException({
        code: 'MCRTL_1',
        message: `Unknow item ${id}`,
      });

    const item = await (typeof id === 'object'
      ? this.findOne(id)
      : this.findOne({ _id: id }));

    if (!item) {
      throw new RpcException({
        code: 'MCRTL_1',
        message: `Unknow item ${inspect(id)}`,
      });
    }

    return this.render<Type>(item, options);
  }

  // -------------------------
  // Méthode de mise à jour d'un document
  // -------------------------
  async update(
    id: string | any,
    data: any = {},
    options: any = {},
  ): Promise<any> {
    const filteredData = await this.filterFields(
      data,
      options.authorizedFields,
    );

    const [cleanedData, model] = await Promise.all([
      // On nettoie les données avant l'ajout en BDD
      this.cleanModelData(filteredData),
      // On récupère le document
      id instanceof Types.ObjectId || typeof id === 'string'
        ? this.model.findById(id).exec()
        : this.model.findOne(id).exec(),
    ]);

    if (!model) {
      throw new RpcException({
        code: 'MCRTL_2',
        message: `Unknow ${this.modelName} document ID ${id}`,
      });
    }
    // Si pas de données à modifier, on retourne le model
    if (!Object.keys(cleanedData).length) return model;

    return this.model.findOneAndUpdate({ _id: model.get('_id') }, cleanedData, {
      new: true,
    });
  }

  // -------------------------
  // Méthode de mise à jour ou de création de  documents
  // -------------------------
  async upsert(
    query: string | any,
    data: any = {},
    options: any = {},
  ): Promise<any> {
    const filteredData = await this.filterFields(
      data,
      options.authorizedFields,
    );

    // On nettoie les données avant l'ajout en BDD
    const cleanedData = await this.cleanModelData(filteredData);

    // Si pas de données à modifier, on retourne le model
    if (!Object.keys(cleanedData).length) return;

    return this.model.findOneAndUpdate(query, cleanedData, {
      upsert: true,
      new: true,
    });
  }
  // -------------------------
  // Supprime un ou des documents
  // Note : "id" peut être un ID ou un
  // objet de recherche
  // -------------------------
  async remove(id: string | any): Promise<string | string[]> {
    return Promise.resolve().then(() =>
      typeof id === 'object'
        ? // On lance la suppression des documents
          this.model
            // On recherche la liste à supprimer
            .find(id, '_id')
            .then((list) =>
              Promise.all([
                // On récupère les ID des documents
                list.map((l) => l.get('id')),
                // On supprime avec la recherche
                this.model.deleteMany(id),
              ]),
            )
            // On retourne la liste des ID supprimés
            .then(([ids]) => ids)
        : // On supprime le document
          this.model
            .findOneAndDelete({ _id: id })
            .exec()
            .then(() => id),
    );
  }

  // -------------------------
  // Nettoie les données passées en paramètre
  // -------------------------
  cleanModelData(data: any = {}): any {
    const result: any = {};
    const emptyValues = [null, 'null', undefined];
    const castValues: [[RegExp, (value: any) => boolean]] = [
      // Si on trouve un texte "true" ou
      // "false", on le cast en Boolean
      [/true|false/i, (value) => value === 'true'],
    ];

    Object.keys(data).forEach((key) => {
      // On exclue les valeurs vides
      if (emptyValues.includes(data[key])) return;

      // On gère les chaines de caractères dans la recherche
      if (typeof data[key] === 'string') {
        // On transforme les données qui en ont besoin
        castValues.find((regs) => {
          // On récupère le cast
          const cast: any = regs.pop();
          // On parcours chaque regex pour voir si il y en a une qui match
          const reg = regs.find((r: any) => r.test(data[key]));

          if (reg) {
            // On a trouvé une correspondance, on cast
            data[key] = cast(data[key].trim());
            // On s'arrête là
            return true;
          }

          return false;
        });
      }

      // On sauvegarde les données dans l'objet
      result[key] = data[key];
    });

    return result;
  }

  // -------------------------
  // Formatte les items
  // -------------------------
  async render<Type>(
    list: HydratedDocument<T, {}, {}> | HydratedDocument<T, {}, {}>[],
    options: any = {},
  ): Promise<Type> {
    const isAlone = !Array.isArray(list);
    let realList = isAlone ? [list] : list;

    if (options.fields) {
      // Si la liste des champs est une
      // chaine de caractère, on la découpe
      if (typeof options.fields === 'string') {
        options.fields = options.fields.split(' ');
      }

      // On fait le tri des champs
      realList = realList.map((model) => {
        const modelstring = model.toObject();
        return this.filterFields(modelstring, options.fields);
      });
    }

    // On regarde si on doit gérer des populates
    if (options.populates) {
      const populatedList = (await this.model.populate(
        realList,
        options.populates,
      )) as any;
      realList = populatedList;
    }

    const returns: unknown = isAlone ? realList.pop() : realList;
    return returns as Type;
  }

  // -------------------------
  // Filtre un objet de données pour
  // ne garder que les champs listés
  // -------------------------
  filterFields(data: any = {}, fields: any = null): any {
    if (!fields) return data;

    const isRemoveMode = fields.find((f: any) => f.startsWith('-'));

    if (isRemoveMode) {
      fields = fields.map((f: any) => f.replace(/^-/i, ''));
      return this.deepRemove(data, fields);
    }

    return this.deepFilter(data, fields);
  }

  // -------------------------
  // fields : {..., parentField: [...]}
  // fieldsToRemove : ['-fieldName', '-parentField.subField']
  // -------------------------
  deepRemove(fields: any, fieldsToRemove: any) {
    const filteredFields = { ...fields };

    fieldsToRemove.forEach((key: any) => {
      if (!key.includes('.')) delete filteredFields[key];
      else {
        const [parentKey, childKey] = key.split('.');

        // Delete sub-field
        filteredFields[parentKey] = filteredFields[parentKey].map(
          (item: any) => ({
            ...item,
            [childKey]: undefined,
          }),
        );
      }
    });

    return filteredFields;
  }

  // -------------------------
  // fields : {..., parentField: [...]}
  // fieldsToShow : ['fieldName', 'parentField.subField']
  // -------------------------
  deepFilter(fields: any, fieldsToShow: any) {
    const filteredFields: any = {};

    fieldsToShow.forEach((key: any) => {
      if (key.includes('.')) {
        // Deep show
        const [parentKey, childKey] = key.split('.');

        // Create empty element if it's first time
        if (!filteredFields[parentKey]) filteredFields[parentKey] = {};

        // For each element,
        filteredFields[parentKey] = fields[parentKey].map(
          (item: any, i: number) => ({
            ...filteredFields[parentKey][i],
            [childKey]: item[childKey],
          }),
        );
      } else if (fields[key] !== undefined) filteredFields[key] = fields[key];
    });

    return filteredFields;
  }

  public async delete({ _id }: { _id: string }) {
    return this.model.findByIdAndDelete({ _id }, { _id }).exec();
  }
}
