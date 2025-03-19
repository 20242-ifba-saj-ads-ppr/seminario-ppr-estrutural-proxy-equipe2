class Monster {
    constructor(prefab, name, maxhealth, damage) {
        this.prefab = prefab;
        this.name = name;
        this.maxhealth = maxhealth;
        this.damage = damage;
    }

    details() {
        console.log(`[Log] ${this.prefab} information:\n    name: ${this.name}\n    maxhealth: ${this.maxhealth}\n    damage: ${this.damage}`);
    }
}

class EntityFactory {
    constructor() {
        this.handlePrefabs = {
            spider: () => new Monster("spider", "Spider", 100, 20),
            spider_warrior: () => new Monster("spider_warrior", "Spider Warrior", 200, 40),
            spider_hider: () => new Monster("spider_hider", "Cave Spider", 600, 20)
        };
    }

    async createMonster(prefab) {
        console.log(`[Factory] Creating monster: ${prefab}`);
        return this.handlePrefabs[prefab] ? this.handlePrefabs[prefab]() : null;
    }
}

class ProxyEntityFactory {
    constructor() {
        this.realFactory = new EntityFactory();
        this.monsterCache = {};
    }

    // Remote Proxy
    async simulateRemote(prefab) {
        console.log(`[Remote Proxy] Fetching monster data remotely for ${prefab}...`);
        return new Promise(resolve => {
            setTimeout(() => {
                console.log(`[Remote Proxy] Data received for ${prefab}.`);
                resolve();
            }, 2000);
        });
    }

    // Virtual Proxy
    async createMonster(prefab) {
        if (!this.monsterCache[prefab]) {
            await this.simulateRemote(prefab);
            this.monsterCache[prefab] = await this.realFactory.createMonster(prefab);
        } else {
            console.log(`[Virtual Proxy] Returning cached monster: ${prefab}`);
        }
        return this.monsterCache[prefab];
    }

    // Protection Proxy
    async createProtectedMonster(prefab, userRole) {
        if (userRole !== 'admin' && prefab === 'spider_hider') {
            console.log(`[Protection Proxy] Access denied to create ${prefab}. Requires admin privileges.`);
            return null;
        }
        return await this.createMonster(prefab);
    }

    // Smart Reference Proxy
    async accessMonster(prefab) {
        console.log(`[Smart Reference] Monster ${prefab} was accessed.`);
        return await this.createMonster(prefab);
    }
}

(async () => {
    const proxyFactory = new ProxyEntityFactory();

    console.log("\n[TEST] Creating spider via proxy");
    const spider = await proxyFactory.createMonster('spider');

    console.log("\n[TEST] Creating spider again to test caching");
    const spider2 = await proxyFactory.createMonster('spider');

    console.log("\n[TEST] Creating spider_hider with protection proxy (user: guest)");
    const spiderHider = await proxyFactory.createProtectedMonster('spider_hider', 'guest');

    console.log("\n[TEST] Creating spider_hider with protection proxy (user: admin)");
    const spiderHiderAdmin = await proxyFactory.createProtectedMonster('spider_hider', 'admin');

    console.log("\n[TEST] Accessing spider via smart reference proxy");
    await proxyFactory.accessMonster('spider');
})();