import multer from "multer";
import { ApiError } from "../utils/api-error";
// import core, { fromBuffer } from "file-type/core";
import { NextFunction, Request, Response } from "express";

export class UploaderMiddleware {
  upload = () => {
    const storage = multer.memoryStorage();

    const limits = { fileSize: 5 * 1024 * 1024 }; // 5mb

    return multer({ storage, limits });
  };
}
