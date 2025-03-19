// Interface: define a operação que todas as fábricas/proxies devem implementar.
class IMonsterFactory {
    async createMonster(prefab) {
        throw new Error("Método createMonster() deve ser implementado.");
    }
}

// Real Subject: Fábrica real que cria os monstros.
class EntityFactory extends IMonsterFactory {
    constructor() {
        super();
        this.handlePrefabs = {
            spider: () => new Monster("spider", "Spider", 100, 20),
            spider_warrior: () => new Monster("spider_warrior", "Spider Warrior", 200, 40),
            spider_hider: () => new Monster("spider_hider", "Cave Spider", 600, 20)
        };
    }

    async createMonster(prefab) {
        console.log(`[Factory] Criando monstro: ${prefab}`);
        return this.handlePrefabs[prefab] ? this.handlePrefabs[prefab]() : null;
    }
}

// Classe base Monster
class Monster {
    constructor(prefab, name, maxhealth, damage) {
        this.prefab = prefab;
        this.name = name;
        this.maxhealth = maxhealth;
        this.damage = damage;
    }

    details() {
        console.log(`[Log] Informações de ${this.prefab}:\n  Nome: ${this.name}\n  Vida Máxima: ${this.maxhealth}\n  Dano: ${this.damage}`);
    }
}

// Proxy que simula acesso remoto (Remote Proxy)
class RemoteProxy extends IMonsterFactory {
    constructor(factory) {
        super();
        this.factory = factory;
    }

    async simulateRemote(prefab) {
        console.log(`[Remote Proxy] Buscando dados do monstro ${prefab} remotamente...`);
        return new Promise(resolve => {
            setTimeout(() => {
                console.log(`[Remote Proxy] Dados recebidos para ${prefab}.`);
                resolve();
            }, 2000);
        });
    }

    async createMonster(prefab) {
        await this.simulateRemote(prefab);
        return this.factory.createMonster(prefab);
    }
}

// Proxy que faz cache da criação (Virtual Proxy)
class VirtualProxy extends IMonsterFactory {
    constructor(factory) {
        super();
        this.factory = factory;
        this.monsterCache = {};
    }

    async createMonster(prefab) {
        if (!this.monsterCache[prefab]) {
            this.monsterCache[prefab] = await this.factory.createMonster(prefab);
        } else {
            console.log(`[Virtual Proxy] Retornando monstro em cache: ${prefab}`);
        }
        return this.monsterCache[prefab];
    }
}

// Proxy que controla acesso (Protection Proxy)
class ProtectionProxy extends IMonsterFactory {
    constructor(factory) {
        super();
        this.factory = factory;
    }

    // Aqui, o método recebe um parâmetro adicional: o perfil do usuário.
    async createProtectedMonster(prefab, userRole) {
        if (userRole !== 'admin' && prefab === 'spider_hider') {
            console.log(`[Protection Proxy] Acesso negado para criar ${prefab}. Requer privilégios de admin.`);
            return null;
        }
        return this.factory.createMonster(prefab);
    }

    // Para compatibilidade com a interface, caso não seja necessário controle.
    async createMonster(prefab) {
        // Sem verificação de perfil, delega a criação.
        return this.factory.createMonster(prefab);
    }
}

// Proxy que adiciona funcionalidades extras ao acessar o monstro (Smart Reference Proxy)
class SmartReferenceProxy extends IMonsterFactory {
    constructor(factory) {
        super();
        this.factory = factory;
    }

    async createMonster(prefab) {
        console.log(`[Smart Reference Proxy] O monstro ${prefab} foi acessado.`);
        return this.factory.createMonster(prefab);
    }
}


const realFactory = new EntityFactory();
const remoteProxy = new RemoteProxy(realFactory);
const virtualProxy = new VirtualProxy(remoteProxy);
const protectionProxy = new ProtectionProxy(virtualProxy);
const smartReferenceProxy = new SmartReferenceProxy(protectionProxy);

// Função de teste para demonstrar cada proxy.
(async () => {
    console.log("\n[TESTE] Criando 'spider' via cadeia de proxies");
    let spider = await smartReferenceProxy.createMonster('spider');
    spider.details();

    console.log("\n[TESTE] Criando 'spider' novamente para testar o cache (Virtual Proxy)");
    let spider2 = await smartReferenceProxy.createMonster('spider');
    spider2.details();

    console.log("\n[TESTE] Tentando criar 'spider_hider' com proteção (usuário: guest)");
    // Utilizando o ProtectionProxy diretamente para incluir a verificação de acesso.
    let spiderHider = await protectionProxy.createProtectedMonster('spider_hider', 'guest');
    if (spiderHider) {
        spiderHider.details();
    }

    console.log("\n[TESTE] Criando 'spider_hider' com proteção (usuário: admin)");
    let spiderHiderAdmin = await protectionProxy.createProtectedMonster('spider_hider', 'admin');
    if (spiderHiderAdmin) {
        spiderHiderAdmin.details();
    }

    console.log("\n[TESTE] Acessando 'spider' via Smart Reference Proxy");
    let accessedSpider = await smartReferenceProxy.createMonster('spider');
    accessedSpider.details();
})();
