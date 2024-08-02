import { MessagingService } from '@lib/modules';
import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { RpcException } from '@nestjs/microservices';
import { createObjectCsvWriter } from 'csv-writer';
import { readFile } from 'fs/promises';
import { DateTime } from 'luxon';
import { ExportSessionCsvDto } from './dto/export-session-csv.dto';

@Injectable()
export class ExportsService {
  constructor(
    private messagingService: MessagingService,
    private httpService: HttpService,
    private config: ConfigService,
  ) {}
  async createCsvAndUpload(
    exportParams: ExportSessionCsvDto,
  ): Promise<Buffer | null> {
    console.log('🚀 ~ ExportsService ~ exportParams:', exportParams);

    const FETCH_LIMIT = 50;
    const CSV_PATH = 'src/exports/csv/sessions.csv';
    const { startDate, endDate, upsId } = exportParams;
    const { ups } = await this.messagingService.send<any>({
      app: 'API_ONSTREET',
      pattern: 'ups:read',
      payload: { _id: upsId },
    });
    // Create CSV file with headers
    const csvWriter = createObjectCsvWriter({
      path: CSV_PATH,
      header: [
        { id: 'parkingName', title: 'ParkingName' },
        { id: 'lpn', title: 'lpn' },
        { id: 'startDate', title: 'StartDate' },
        { id: 'endDate', title: 'EndDate' },
        { id: 'duration', title: 'Duration' },
        { id: 'uncoveredDuration', title: 'UncoveredDuration' },
        { id: 'rightType', title: 'Right Type' },
        { id: 'rightsDuration', title: 'RightsDuration' },
        { id: 'sessionStatus', title: 'SessionStatus' },
        { id: 'controlStatus', title: 'ControlStatus' },
      ],
    });

    const sessionSearch = {
      minStartDate: startDate,
      maxEndDate: endDate,
      limit: FETCH_LIMIT,
    };

    // Get first page
    const { list, paging } = await this.messagingService.send<any>({
      app: 'API_CONTROL',
      pattern: 'sessions:search',
      payload: {
        ...sessionSearch,
        page: 1,
      },
    });

    // Stop here if nothing to handle
    if (!paging || list?.length === 0) return null;

    // Write first page
    await this.writeInCsv({ list: [...list], upsCode: ups.code }, csvWriter);

    // Calculate other pages to handle
    const { count } = paging;
    const pages = Math.ceil(count / Number(FETCH_LIMIT));

    for (let p = 2; p <= pages; p++) {
      console.log('PROCESS PAGE', p);

      const { list } = await this.messagingService.send<any>({
        app: 'API_CONTROL',
        pattern: 'sessions:search',
        payload: { ...sessionSearch, page: p },
      });
      await this.writeInCsv({ list: [...list], upsCode: ups.code }, csvWriter);
    }

    // Send file by mail if DEV mode

    const fileToSend = await readFile(CSV_PATH);

    console.log('🚀 ~ ExportsService ~ fileToSend:', fileToSend);

    const blob = new Blob([fileToSend], { type: 'text/csv' });
    // // Delete local file
    // await unlink('src/exports/csv/sessions.csv');

    return fileToSend;
  }
  // --------------------
  // Export parking rights
  // --------------------
  async writeInCsv({ list, upsCode }: any, writer: any) {
    const records = await Promise.all(
      list.map(
        async ({
          lpn,
          startDate,
          endDate,
          uncoveredDuration,
          significantRights,
          rightsDuration,
          exitEventId,
          controlState,
        }: any) => {
          try {
            return {
              parkingName: upsCode,
              lpn,
              startDate:
                //convert startDate from ISO Zulu to Excel default format
                DateTime.fromISO(startDate).toFormat('yyyy-MM-dd HH:mm:ss'),
              endDate: DateTime.fromISO(endDate).toFormat(
                'yyyy-MM-dd HH:mm:ss',
              ),
              duration:
                //only 2 digits after the comma
                Math.ceil(
                  DateTime.fromISO(endDate).diff(
                    DateTime.fromISO(startDate),
                    'minutes',
                  ).minutes,
                ),
              uncoveredDuration,
              rightType: this.translateSignificantRights(significantRights),
              rightsDuration: Math.ceil(rightsDuration),
              sessionStatus: exitEventId ? 'complete' : 'incomplete',
              controlStatus: this.translateControlState(controlState),
            };
          } catch (e: any) {
            if (e.message.includes('Unknow item')) return;

            throw new RpcException({
              code: 'BPRSC_10',
              message: 'Error while fetching sessions',
              pattern: `bff-presto-scan/exports/sessions`,
              payload: {},
            });
          }
        },
      ),
    );

    console.log('🚀 ~ ExportsService ~ writeInCsv ~ records:', records);
    try {
      await writer.writeRecords(records.filter((record) => !!record));
    } catch (e) {
      console.log('🚀 ~ ExportsService ~ writeInCsv ~ e:', e);
    }

    return records;
  }

  translateSignificantRights(significantRights: any) {
    const foundFps = !!significantRights.find(
      ({ type }: any) => type === 'FPS',
    );
    const foundSubscription = !!significantRights.find(
      ({ type }: any) => type === 'SUBSCRIPTION',
    );
    const foundTicket = !!significantRights.find(
      ({ type }: any) => type === 'TICKET',
    );

    return foundFps
      ? 'FPS'
      : foundSubscription
      ? 'Abonnement'
      : foundTicket
      ? 'Horaire'
      : '';
  }

  translateControlState(controlState: any) {
    switch (controlState) {
      case 'UNDEFINED':
        return 'Incomplete';
      case 'OK':
        return 'En regle';
      case 'TO_CONTROL':
        return 'A controler';
      case 'ERROR':
        return 'ERREUR';
      case 'NOT_FINED':
        return 'non-verbalisee';
      case 'FINED':
        return 'verbalisee';
      case 'ERROR':
        return 'ERREUR';
      default:
        return '';
    }
  }
}
