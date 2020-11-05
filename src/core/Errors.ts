export class FileNotFoundError extends Error {
    constructor(message: any | undefined) {
        super();
        this.name = "FileNotFoundError"
        this.message = message;
    }
}

export class ConfigError extends Error {
    constructor(message: any | undefined) {
        super();
        this.name = "ConfigError";
        this.message = message;
    }
}
