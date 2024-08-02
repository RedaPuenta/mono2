import { HashConfigType } from '@lib/configs';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import bcrypt from 'bcrypt';
import { createHash } from 'crypto';

type HashingAlgortihm = 'md5' | 'sha256' | 'bcrypt';
type HashingDigest = 'hex' | 'base64';

@Injectable()
export class HashingService {
  constructor(
    private configService: ConfigService<{
      hash: HashConfigType;
    }>,
  ) {}

  public hash = async (
    params: (
      | {
          algorithm: Exclude<HashingAlgortihm, 'bcrypt'>;
          digest: HashingDigest;
        }
      | {
          algorithm: Extract<HashingAlgortihm, 'bcrypt'>;
        }
    ) & {
      payload: string;
      length?: number;
    },
  ): Promise<string> => {
    let hash: string = 'undefined';

    if (params.algorithm === 'bcrypt') {
      hash = await bcrypt.hash(
        params.payload,
        this.configService.get('hash.salt', { infer: true })!,
      );
    } else {
      const creatingHash = createHash(params.algorithm);
      creatingHash.update(params.payload);
      hash = creatingHash.digest(params.digest);
    }

    if (!(typeof length === 'number')) return hash;
    return length === 0 ? '' : hash.slice(-length);
  };

  public compare = async ({
    payload,
    hash,
    algorithm,
  }: {
    payload: string;
    hash: string;
    algorithm: Extract<HashingAlgortihm, 'bcrypt'>;
  }): Promise<boolean> => {
    return bcrypt.compare(payload, hash);
  };
}
