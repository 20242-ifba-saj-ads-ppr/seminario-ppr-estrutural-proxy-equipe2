// Interface comum (Subject)
class Graphic {
    details() {
        throw new Error("Método 'details' deve ser implementado.");
    }
}

// Objeto real (RealSubject)
class Monster extends Graphic {
    constructor(prefab, name, maxhealth, damage) {
        super();
        this.prefab = prefab;
        this.name = name;
        this.maxhealth = maxhealth;
        this.damage = damage;
    }

    details() {
        console.log(`[Monster] ${this.prefab} information:\n    Name: ${this.name}\n    Max Health: ${this.maxhealth}\n    Damage: ${this.damage}`);
    }
}

// Proxy (ImageProxy)
class MonsterProxy extends Graphic {
    constructor(prefab, factory) {
        super();
        this.prefab = prefab;
        this.factory = factory;
        this.realMonster = null;
    }

    _initialize() {
        if (!this.realMonster) {
            console.log(`[Proxy] Creating real monster instance: ${this.prefab}`);
            this.realMonster = this.factory.createRealMonster(this.prefab);
        }
    }

    details() {
        this._initialize();
        this.realMonster.details();
    }
}

// Fábrica de Entidades
class EntityFactory {
    constructor() {
        this.handlePrefabs = {
            spider: () => new Monster("spider", "Spider", 100, 20),
            spider_warrior: () => new Monster("spider_warrior", "Spider Warrior", 200, 40),
            spider_hider: () => new Monster("spider_hider", "Cave Spider", 600, 20)
        };
    }

    createRealMonster(prefab) {
        return this.handlePrefabs[prefab]();
    }

    createMonster(prefab) {
        return new MonsterProxy(prefab, this);
    }
}

// Teste do padrão Proxy
const factory = new EntityFactory();
const spiderProxy = factory.createMonster("spider");
const warriorProxy = factory.createMonster("spider_warrior");

console.log("Chamando detalhes do Proxy:");
spiderProxy.details();
warriorProxy.details();
