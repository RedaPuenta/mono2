import { Injectable } from '@nestjs/common';
import { HydratedDocument } from 'mongoose';
import { DictionaryEntityType } from '../../../data';

type Paginated<T> = {
  list: HydratedDocument<T>[];
  paging: {
    count: number;
    current: number;
    limit: number;
  };
};

@Injectable()
export class UtilService {
  constructor() {}

  public async cascade<T>(promises: any) {
    const results: any = [];

    await promises.reduce(
      (acc: any, cur: any) =>
        acc
          .then(cur)
          .then((result: any) => results.push(result))
          .catch((error: Error) => console.error(error)),
      Promise.resolve(),
    );

    return results;
  }

  public groupBy<T, K extends keyof T>(arr: T[], key: K) {
    return [
      ...arr.reduce((acc, cur) => {
        const keyValue = cur[key];

        if (!acc.has(keyValue)) {
          acc.set(keyValue, []);
        }

        acc.get(keyValue)?.push(cur);

        return acc;
      }, new Map<any, T[]>()),
    ];
  }

  public groupByLamb<T>(arr: T[], compare: (item: T) => string) {
    return [
      ...arr.reduce((acc, cur) => {
        const keyValue = compare(cur);

        if (!acc.has(keyValue)) {
          acc.set(keyValue, []);
        }

        acc.get(keyValue)?.push(cur);

        return acc;
      }, new Map<string, T[]>()),
    ];
  }

  public primitiveCompare<T>(a: T, b: T): number {
    if (a < b) return -1;
    if (a > b) return 1;
    return 0;
  }

  public minBy<T>(
    arr: T[],
    compare: (a: T, b: T) => number = this.primitiveCompare,
  ): T | undefined {
    if (arr.length === 0) return undefined;

    return arr.reduce((min, curr) => {
      if (!min) return curr;

      return compare(curr, min) < 0 ? curr : min;
    });
  }

  public maxBy<T>(
    arr: T[],
    compare: (a: T, b: T) => number = this.primitiveCompare,
  ): T | undefined {
    if (arr.length === 0) return undefined;

    return arr.reduce((max, curr) => {
      if (!max) return curr;

      return compare(curr, max) > 0 ? curr : max;
    });
  }

  public removeDuplicatesS<T>(array: T[]): T[] {
    return array.filter(
      (value, index, self) =>
        self.findIndex((t) => JSON.stringify(t) === JSON.stringify(value)) ===
        index,
    );
  }

  public arraysIntersect<T>(array1: T[], array2: T[]): boolean {
    return array1.some((value) => array2.includes(value));
  }

  public deepCopy<T>(object: T): T {
    return JSON.parse(JSON.stringify(object));
  }

  public deepMerge = <ConfigType>(...objects: object[]) => {
    const isObject = (obj: any) => obj && typeof obj === 'object';

    function deepMergeInner(target: any, source: any) {
      Object.keys(source).forEach((key: string) => {
        const targetValue = target[key];
        const sourceValue = source[key];

        if (Array.isArray(targetValue) && Array.isArray(sourceValue)) {
          target[key] = sourceValue;
        } else if (isObject(targetValue) && isObject(sourceValue)) {
          target[key] = deepMergeInner(
            Object.assign({}, targetValue),
            sourceValue,
          );
        } else {
          target[key] = sourceValue;
        }
      });

      return target;
    }

    const target = objects.shift();
    let source: any;

    while ((source = objects.shift())) {
      deepMergeInner(target, source);
    }

    return target as ConfigType;
  };

  private readonly RETRIES_DEFAULT_VALUE = 2;

  /**
   * Retries a list of promises until they all resolve successfully or the maximum number of retries is reached.
   * @param promises - An array of promises to retry.
   * @param retries - The maximum number of retries. Defaults to 3.
   * @returns A promise that resolves to an array of the resolved values of the input promises.
   * @throws The error from the last failed promise if the maximum number of retries is reached.
   */
  public async retryAll<T>(
    promises: Promise<T>[],
    retries = this.RETRIES_DEFAULT_VALUE,
  ): Promise<T[]> {
    try {
      return await Promise.all(promises);
    } catch (e) {
      if (retries > 0) {
        return this.retryAll(promises, retries - 1);
      } else {
        throw e;
      }
    }
  }

  /**
   * Retries a promise a certain number of times before throwing an error.
   * @param promise - The promise to retry.
   * @param retries - The number of retries before giving up. Defaults to 3.
   * @returns The resolved value of the promise.
   */
  public async retry<T>(
    promise: Promise<T>,
    retries = this.RETRIES_DEFAULT_VALUE,
  ): Promise<T> {
    try {
      return await promise;
    } catch (e) {
      if (retries > 0) {
        await this.sleep(3);
        return this.retry(promise, retries - 1);
      } else {
        throw e;
      }
    }
  }

  public async sleep(seconds: number) {
    return new Promise((resolve) => setTimeout(resolve, seconds * 1000));
  }

  public IDENTITY = (x: any) => x;

  /**
   * Processes a paginated list of items using a fetcher and a processor function.
   * 
   * @example I fetch a paginated list of resources and I want to get only the ids 
   *   bucketResourceIds = await paginatedProcessor<Resource, string>(
              async (page, limit) =>
                this.mservices.send('resources:search', {
                  _id: { $in: resourcesIds },
                  limit,
                  page,
                }),
              (resource) => resource._id,
            )
  * @example I fetch a paginated list of resources and i want just to collect as a list
  *   bucketResources = await paginatedProcessor<Resource>(
              async (page, limit) =>
                this.mservices.send('resources:search', {
                  _id: { $in: resourcesIds },
                  limit,
                  page,
                })
            )
  * @example I fetch a paginated list of resources and i want to run a method on each item
  *   await paginatedProcessor<Resource, void>(
          async (page, limit) =>
            this.mservices.send('resources:search', {
              _id: { $in: resourcesIds },
              limit,
              page,
            }),
          (resource) => { console.log(resource) },
        )
  * 
  * @param T The type of the items in the list.
  * @param R The type of the processed items. Defaults to 'void'.
  * @param fetcher A function that fetches a paginated list of items.
  * @param processor A function that processes an individual item of a page. By default, it's the identity function.
  * @param batchSize The page size for pagination. Defaults to '300'.
  * @returns A Promise that resolves to an array of processed items.
  */

  public paginatedProcessor = async <T, R = T>(
    fetcher: (page: string, limit: string) => Promise<Paginated<T>>,
    processor: (input: T) => R = this.IDENTITY,
    batchSize = '300',
  ) => {
    // We fetch the first page so we get the first page and the total count
    const { list, paging } = await fetcher('0', batchSize);

    if (!paging && list?.length === 0) return [];

    const { count } = paging;
    const results: R[] = list.map(processor);

    // If there is only one page, we run processor function on the first page
    if (count <= Number(batchSize)) {
      return results;
    }

    // If the count is greater than the batch size, we need
    // to fetch the rest of the pages
    const pages = Math.ceil((count - Number(batchSize)) / Number(batchSize));

    // Foreach page we run the processor function on each item of that page
    // and we store the results
    for (let p = 1; p <= pages; p++) {
      const nextPage = await fetcher(String(p + 1), batchSize);
      const nextPageResults = nextPage.list.map(processor);
      results.push(...nextPageResults);
    }

    return results;
  };

  public dictionariesMerge = ({
    master,
    other = [],
  }: {
    master: DictionaryEntityType;
    other?: DictionaryEntityType[];
  }): DictionaryEntityType => {
    return other.reduce(
      (acc: DictionaryEntityType, { documents }: DictionaryEntityType) => {
        acc.documents = acc.documents.map(
          ({
            translations: translationsMaster,
            lang: langMaster,
            ...rest
          }: any) => ({
            lang: langMaster,
            translations: {
              ...(documents.find(
                ({ lang: langAdd }: any) => langMaster === langAdd,
              )?.translations || {}),
              ...translationsMaster,
            },
            ...rest,
          }),
        );

        return acc;
      },
      { ...master },
    );
  };
}
