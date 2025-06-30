import meowHelp from "cli-meow-help";

const commands = {
    list: {
        desc: "List all scenes",
    },
    switch: {
        desc: "Switch to a scene by name",
    },
    current: {
        desc: "Show the current scene",
    },
}

const flags = {
    help: {
        type: "boolean",
        shortFlag: "h",
        description: "Display help information"
    },
};

const sceneHelp = meowHelp({
    name: "meld-cli",
    flags,
    commands,
    description: "Manage scenes in Meld",
    defaults: false,
});

function sceneList(channel) {
    if (!channel.objects || !channel.objects.meld) {
        return Promise.reject(new Error("Meld object not found in channel."));
    }
    
    const meld = channel.objects.meld;
    const scenes = [];
    for (const [key, value] of Object.entries(meld.session.items)) {
        if (value.type === "scene") {
            scenes.push({ name: value.name, id: key });
        }
    }
    if (scenes.length === 0) {
        return Promise.reject(new Error("No scenes found."));
    }
    return Promise.resolve(scenes);
}

function sceneSwitch(channel, sceneName) {
    if (!channel.objects || !channel.objects.meld) {
        return Promise.reject(new Error("Meld object not found in channel."));
    }

    const meld = channel.objects.meld;
    let itemId;
    for (const [key, value] of Object.entries(meld.session.items)) {
        if (value.type === "scene" && value.name === sceneName) {
            itemId = key;
            break;
        }
    }
    if (!itemId) {
        return Promise.reject(new Error(`Scene "${sceneName}" not found.`));
    }

    return new Promise((resolve, reject) => {
        meld.showScene(itemId).then(() => {
            console.log(`Switched to scene: ${sceneName}`);
            resolve();
        }).catch(err => {
            reject(err);
        });
    });
}

function sceneCurrent(channel) {
    if (!channel.objects || !channel.objects.meld) {
        throw new Error("Meld object not found in channel.");
    }

    const meld = channel.objects.meld;
    for (const [key, value] of Object.entries(meld.session.items)) {
        if (value.type === "scene" && value.current) {
            return Promise.resolve({ name: value.name, id: key });
        }
    }
    return Promise.reject(new Error("No current scene found."));
}

export { sceneHelp, sceneList, sceneSwitch, sceneCurrent };