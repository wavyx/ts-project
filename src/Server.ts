import express, {
  Application,
  NextFunction,
  Request,
  Response,
  Router,
} from 'express';
import Helmet from 'helmet';
import * as _ from 'lodash';
import { Logger } from './helpers';
import path from 'path';
import ManagedError from '@webinmove/kosa';
import { Barabara } from '@webinmove/barabara';

const log = Logger.create({ module: module.id });

export class Server {
  public app: Application;
  public router: Router;

  constructor() {
    log.info('TSPROJECT_LOADING');

    // Express configuration
    this.app = express();
    this.app.enable('trust proxy');
    this.app.use(express.json({ strict: true, limit: '20mb' }));
    this.app.use(express.urlencoded({ extended: false }));
    this.app.use(Helmet());

    // Routes
    this.app.get(
      '/',
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      async (_req: Request, res: Response, _next: NextFunction) => {
        return res.status(200).json({ service: 'TSPROJECT' });
      },
    );

    const autoroute: Barabara = new Barabara(express.Router, {
      read: 'get',
      create: 'post',
      update: 'put',
      destroy: 'delete',
    });
    this.router = autoroute.createRouter(path.join(__dirname, 'controllers'));
    this.app.use('/', this.router);
    console.log(
      'constructor',
      this.router,
      path.join(__dirname, 'controllers'),
    );

    // Default catch all => 404 NOT FOUND
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    this.app.all('*', (_req: Request, _res: Response, next: NextFunction) => {
      next(new ManagedError('TS_PROJECT_GENERAL', 404));
    });

    // Global Error handler
    // eslint-disable-next-line @typescript-eslint/no-unused-vars,@typescript-eslint/no-explicit-any
    this.app.use(
      (error: any, req: Request, res: Response, _next: NextFunction) => {
        const statusCode = error.statusCode || 500;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const data: any = {
          error: error.message,
        };

        if (error.validations) {
          data.validations = error.validations;
        }

        const meta = _.pick(req, ['method', 'path', 'query', 'body']);

        log.error('TSPROJECT_FAIL', error, meta);
        res.status(statusCode).json(data);
      },
    );
  }
}
