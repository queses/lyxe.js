import { IKeyValueContextStorage } from '../key-value/IKeyValueContextStorage'
import { TransientService } from '../core/di/annotations/TransientService'
import { InjectService } from '../core/di/annotations/InjectService'
import { KeyValueContextStorageTkn } from '../key-value/luxe-key-value-tokens'
import { AppContainer } from '../core/di/AppContainer'
import { PromiseUtil } from '../core/lang/PromiseUtil'
import { AppInitActionTkn } from './luxe-app-init-tokens'
import { IAppInitAction } from './IAppInitAction'

@TransientService()
export class AppInitActionsRunner {
  @InjectService(KeyValueContextStorageTkn)
  private keyValue: IKeyValueContextStorage

  async run () {
    let actions: IAppInitAction[]
    try {
      actions = AppContainer.getMany(AppInitActionTkn)
    } catch (err) {
      return
    }

    await PromiseUtil.limitPromiseMap(8, actions, this.runAction.bind(this))
  }

  private async runAction (action: IAppInitAction) {
    const storageKey = `init-action-runner-performed-${action.getKey()}`
    if (await this.keyValue.has(storageKey)) {
      return
    }

    await action.run()
    await this.keyValue.set(storageKey, true)
  }
}
