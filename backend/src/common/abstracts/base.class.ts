import { BeforeUpdate, CreateDateColumn, UpdateDateColumn } from 'typeorm';

export abstract class BaseAbstractClass {
  @CreateDateColumn({
    type: 'timestamptz',
  })
  created: Date;

  @UpdateDateColumn({
    type: 'timestamptz',
  })
  updated: Date;

  @BeforeUpdate()
  async setUpdatedDate() {
    this.updated = new Date();
  }
}
