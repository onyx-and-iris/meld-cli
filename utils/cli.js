import meow from "meow";
import meowHelp from "cli-meow-help";

const commands = {
    scene: {
        desc: "Manage scenes",
    },
};

const flags = {
    help: {
        type: "boolean",
        shortFlag: "h",
        description: "Display help information"
    },
    version: {
        type: "boolean",
        shortFlag: "v",
        description: "Display the version number"
    }
}

const helpText = meowHelp({
    name: "meld-cli",
    flags,
    commands,
    description: "A command-line interface for managing scenes in Meld",
    defaults: false,
});

export default meow(helpText, {
    importMeta: import.meta,
    flags,
})