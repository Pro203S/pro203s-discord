import * as fs from 'fs';
import { createRequire } from 'module';
import path from 'path';

type CommonJsModule = {
    "exports": unknown
};

export function loadTypeScriptModule(filePath: string) {
    let typescript: typeof import('typescript');

    try {
        typescript = require("typescript");
    } catch {
        throw new Error("Loading discord-env.ts requires the `typescript` package in the bot project.");
    }

    const source = fs.readFileSync(filePath, "utf-8");
    const output = typescript.transpileModule(source, {
        "compilerOptions": {
            "module": typescript.ModuleKind.CommonJS,
            "target": typescript.ScriptTarget.ES2022,
            "esModuleInterop": true
        },
        "fileName": filePath
    });

    const localRequire = createRequire(filePath);
    const localModule: CommonJsModule = {
        "exports": {}
    };

    const compiled = new Function("exports", "require", "module", "__filename", "__dirname", output.outputText);
    compiled(localModule.exports, localRequire, localModule, filePath, path.dirname(filePath));

    return localModule.exports;
}

export function getDefaultExport(moduleValue: unknown) {
    if (typeof moduleValue === "object" && moduleValue !== null && "default" in moduleValue)
        return (moduleValue as { "default": unknown }).default;

    return moduleValue;
}