import { LoginGuard } from '@lib/guards';
import { Body, Controller, Post, Res, UseGuards } from '@nestjs/common';
import { Response } from 'express'; // Import Response type from express package
import { createReadStream } from 'fs';
import { join } from 'path';
import { ExportSessionCsvDto } from './dto/export-session-csv.dto';
import { ExportsService } from './exports.service';

@Controller('exports')
export class ExportsController {
  constructor(private service: ExportsService) {}
  @Post('sessions-csv')
  @UseGuards(LoginGuard)
  async sessionCsv(
    @Body() exportParams: ExportSessionCsvDto,
    @Res() res: Response,
  ) {
    const t = await this.service.createCsvAndUpload(exportParams);

    const file = createReadStream(
      join(process.cwd(), '/src/exports/csv/sessions.csv'),
    );

    res.set({
      'Content-Type': 'text/csv',
      'Content-Disposition': 'attachment; filename="sessions.csv"',
    });

    // file.pipe(res);
    res.sendFile(join(process.cwd(), '/src/exports/csv/sessions.csv'));
  }
}
