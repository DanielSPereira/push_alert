import express from "express";

export interface IRequest extends express.Request {
    query: {
        id: string;
    }
}

export interface IResponse extends express.Response {
    json: (object: any) => any;
}