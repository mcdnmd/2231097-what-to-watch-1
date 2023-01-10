import {MiddlewareInterface} from './middleware.interface.js';
import {NextFunction, Request, Response} from 'express';
import multer, {diskStorage} from 'multer';
import {extension} from 'mime-types';
import {nanoid} from 'nanoid';


export class UploadFileMiddleware implements MiddlewareInterface {
  constructor(private directory: string, private fieldName: string) {
  }

  public async execute(req: Request, res: Response, next: NextFunction): Promise<void> {
    const storage = diskStorage({
      destination: this.directory,
      filename: (_req, file, callback) => {
        const ext = extension(file.mimetype);
        const filename = nanoid();
        callback(null, `${filename}.${ext}`);
      }
    });

    const uploadSingleFileMiddleware = multer({storage})
      .single(this.fieldName);
    uploadSingleFileMiddleware(req, res, next);
  }
}
