import { Page } from './Page'
import { IHasId } from './IHasId'

export type TPersistenceId = number | string

export type TPersistenceConnectionName = 'default' | string

export type TPagePromise<T> = Promise<Page<T>>

export type TSortOrder = 'ASC' | 'DESC'

export type TUpdateEntityConfig <E extends IHasId<ID>, ID extends TPersistenceId, D extends Record<string, unknown>> =
  Array<TUpdateEntityFieldConfig<E, ID, D>>

export type TUpdateEntityResult <D extends Record<string, unknown>> = {
  [fieldName in keyof D]?: {
    oldValue: any
    newValue: any
  }
}

type TUpdateEntityFieldConfig <E extends IHasId<ID>, ID extends TPersistenceId, D extends Record<string, unknown>> = [
  TUpdateEntityFieldConfigFieldName<D>,
  TUpdateEntityFieldConfigGetter,
  TUpdateEntityFieldConfigSetter<E, ID>,
  TUpdateEntityFieldConfigTransform?
]

type TUpdateEntityFieldConfigFieldName <D> = keyof D
type TUpdateEntityFieldConfigGetter = () => any | Promise<any>
type TUpdateEntityFieldConfigSetter <E extends IHasId<ID>, ID extends TPersistenceId> = (value: any) => void | E
type TUpdateEntityFieldConfigTransform = (value: any, old: any) => any | Promise<any>