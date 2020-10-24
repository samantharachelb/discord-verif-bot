const logger = require('@src/core/logging');

export default function forceExit(reason: string, exitCode = 1): void {
    logger.error("Something broke and the bot couldn't recover.");
    if (reason) {
        logger.error(reason);
    }
    process.exit(exitCode);
}
