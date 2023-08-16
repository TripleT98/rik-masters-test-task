import { Subject, Observable, BehaviorSubject } from 'rxjs';
import { pairwise, filter, map } from 'rxjs/operators'

abstract class RootState<T>{

  readonly stateObserver$ = new BehaviorSubject<T>(undefined as T);

  protected value:T;

  constructor(initialValue:T){
    this.value = initialValue;
  }

  public get(){
    return this.value;
  }

  protected abstract _patch(stateProps: Partial<T>):void;

  preAdd(prevState: T, newState: any): T{
    return newState;
  }

  preUpdate(prevItem: T, newItem: any): T{
    return newItem;
  }

  public set(newState: T){
    this._patch(this.preAdd(this.value, newState));
    this.emit();
  }

  public patch(stateProps: Partial<T>){
    this._patch(this.preAdd(this.value, stateProps));
    this.emit();
  }

  protected emit(){
    if(!this.value){return}
    this.stateObserver$.next(this.value);
  }

}

//Хранилище для оригиналов
abstract class State<T> extends RootState<T>{

    readonly propObserver$ = new Subject<T>();

    constructor(initialValue:T){
      super(initialValue);
    }

    protected _patch(stateProps: Partial<T>){
      for(let key in stateProps){
        if(Object.prototype.hasOwnProperty.call(this.value, key)){
          this.value[key] = stateProps[key] as T[Extract<keyof T, string>];
        }
      }
    }

}

//Хранилище для коллекций
export abstract class EntityState<T extends Record<string, any>> extends RootState<T[]>{


  public readonly upsertObserver$ = new Subject<Id>();

  public readonly idKey: Id;

  constructor(initialValue:T[], idKey: Id){
    super(initialValue);
    this.idKey = idKey;
  }

  public getItem(id: Id): T | undefined{
    return this.value.find(item=>item[this.idKey] === id);
  }

  public delete(id: Id): boolean{
    const deletedItem = this.getItem(id);
    if(deletedItem){
      const index = this.value.indexOf(deletedItem);
      this.value.splice(index,1);
      this.emit();
    }
    return !!deletedItem;
  }

  public upsert(entity: T){
    const id = entity[this.idKey];
    const currentEntity = this.getItem(id);
    if(currentEntity){
      this.value[this.value.indexOf(currentEntity)] = {...currentEntity, ...entity};
    }else{
      this.value.push(entity);
    }
    this.emitUpsert(id);
    this.emit();
  }

  protected emitUpsert(id: Id){
    this.upsertObserver$.next(id)
  }

  public getID$(id: Id): Observable<T | undefined>{
    return this.upsertObserver$.pipe(
      filter(changinItemId=>changinItemId === id),
      map(changinItemId=>this.getItem(changinItemId)),
      filter(item=>!!item)
    );
  }

  public get$(){
    return this.stateObserver$;
  }

  protected _patch(stateProps: T[]){
    stateProps.forEach(item=>this.upsert(item));
  }

}

export abstract class EntityStore<D extends Record<string,any>>{

  private readonly idKey: Id;
  public readonly name: string;
  private state: EntityState<D>;

  constructor(state: EntityState<D>, name: string){
    this.state = state;
    this.name = name;
    this.idKey = state.idKey;
  }

  public upsert(item: D){
     this.state.upsert(item);
  }

  public set(stateValue: D[]){
    this.state.set(stateValue);
  }

  public getID$(id: Id){
    return this.state.getID$(id);
  }

  public getID(id: Id){
    return this.state.getItem(id);
  }

  public getItems(){
    return this.state.get();
  }

  public get$(){
    return this.state.get$();
  }

}

export interface PreAdd<T> {
  preAdd?:(prevState: T, newState: any)=>T;
  preUpdate?:(prevState: T, newState: any)=>T;
}

export type Id = string | number;
