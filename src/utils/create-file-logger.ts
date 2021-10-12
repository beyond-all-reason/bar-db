import fs from "fs";

export function createFileLogger(name: string) {
    fs.mkdirSync("logs", { recursive: true });

    const writeStream = fs.createWriteStream(`logs/${name}.log`, { flags: "a" });

    return (...data: any[]) => {
        writeStream.write(`${new Date().toISOString()}: ${data}\r\n`);
    };
}