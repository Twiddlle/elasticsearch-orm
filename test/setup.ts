import { ReadableStream } from 'web-streams-polyfill';
import { Blob } from 'buffer';
import { MessageChannel, MessagePort } from 'worker_threads';

// File class polyfill for Node.js environments
class File extends Blob {
    name: string;
    lastModified: number;

    constructor(
        chunks: Array<ArrayBuffer | ArrayBufferView | Blob | string>,
        name: string,
        options?: { type?: string; lastModified?: number },
    ) {
        super(chunks as unknown as Array<ArrayBuffer | Blob>, options);
        this.name = name;
        this.lastModified = options?.lastModified ?? Date.now();
    }
}

// DOMException polyfill
class DOMException extends Error {
    code: number;
    constructor(message?: string, name?: string) {
        super(message);
        this.name = name || 'Error';
        this.code = 0;
    }
}

// eslint-disable-next-line no-undef, @typescript-eslint/no-explicit-any
(global as any).ReadableStream = ReadableStream;
// eslint-disable-next-line no-undef, @typescript-eslint/no-explicit-any
(global as any).Blob = Blob;
// eslint-disable-next-line no-undef, @typescript-eslint/no-explicit-any
(global as any).File = File;
// eslint-disable-next-line no-undef, @typescript-eslint/no-explicit-any
(global as any).MessagePort = MessagePort;
// eslint-disable-next-line no-undef, @typescript-eslint/no-explicit-any
(global as any).MessageChannel = MessageChannel;
// eslint-disable-next-line no-undef, @typescript-eslint/no-explicit-any
(global as any).DOMException = DOMException;
