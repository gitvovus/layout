import { computed, observable } from 'mobx';

import { ViewModel } from '@/modules/view-model';

export class Stat {
  @observable public type: 'none' | 'attack' | 'crit-rate' | 'crit-damage' = 'none';
  @observable public rank = 0;
  @computed public get base() {
    switch (this.type) {
      case 'none':
        return 0;
      case 'attack':
        return 7;
      case 'crit-rate':
        return 3.5;
      case 'crit-damage':
        return 7;
    }
  }
  @computed public get value() {
    return this.base * this.rank;
  }
}

export class Artifact {
  public readonly stats = [new Stat(), new Stat(), new Stat(), new Stat(), new Stat()];
}

export class Hero implements ViewModel {
  public readonly template = 'hero-view';
  public readonly key = Symbol();

  @observable public charAttack = 1000;
  @observable public weaponAttack = 500;
  @observable public weaponAttackBonus = 0;

  public readonly artifacts = [new Artifact(), new Artifact(), new Artifact(), new Artifact(), new Artifact()];

  @computed public get attackBonus() {
    let value = 0;
    this.artifacts.forEach(artifact => {
      artifact.stats.forEach(stat => {
        if (stat.type === 'attack') {
          value += stat.value;
        }
      });
    });
    return value;
  }

  @computed public get critRate() {
    let value = 0.05;
    this.artifacts.forEach(artifact => {
      artifact.stats.forEach(stat => {
        if (stat.type === 'crit-rate') {
          value += stat.value;
        }
      });
    });
    return value;
  }

  @computed public get critDamage() {
    let value = 0.5;
    this.artifacts.forEach(artifact => {
      artifact.stats.forEach(stat => {
        if (stat.type === 'crit-damage') {
          value += stat.value;
        }
      });
    });
    return value;
  }

  @computed get damage() {
    return (
      (this.charAttack + this.weaponAttack) *
      (1 + this.weaponAttackBonus + this.attackBonus) *
      (1 + this.critRate * this.critDamage)
    );
  }
}
