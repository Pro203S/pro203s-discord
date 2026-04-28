import c from "chalk";
import ora from "ora";
import BotClient from "../../modules/botclient";
import Project from "../../modules/project";
import { packageJson } from "..";

const logCheck = (...msg: any[]) => console.log(c.greenBright(c.bold("✓")), ...msg);

export default async function Start() {
    const spinner = ora("Starting...").start();
    try {
        console.log(c.cyanBright("@pro203s/discord v" + packageJson.version));
        const start = new Date().getTime();
        const project = new Project(process.cwd());
        const client = new BotClient(project);
        await client.load();
        await client.start();
        spinner.stop().clear();

        logCheck("Ready in " + (new Date().getTime() - start) + "ms");
        console.log("  Logged In as " + client.user.username + "#" + client.user.discriminator);

        await client.watch();
    } finally {
        spinner.stop().clear();
    }
}