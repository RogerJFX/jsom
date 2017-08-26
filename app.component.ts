import { Component } from '@angular/core';

import {Http, Response, Request} from '@angular/http';

import 'rxjs/add/operator/map';
import { Observable } from "rxjs/Observable";

abstract class Serializable<T> {

  protected abstract doDeserialize(input:any):T;

  public deserialize(input:any):T {
    for (let field in this) {
      const fieldType = typeof this[field];
      if (fieldType !== "function" && fieldType !== typeof input[field]) {
        throw new TypeError("Incoming JSON does not match. Field: " + field + " in class " + this.constructor.name);
      }
    }
    return this.doDeserialize(input);
  }
}

export class Wrapper<T extends Serializable<T>> extends Serializable<Wrapper<T>> {
  data:T;
  authToken:string = "";

  constructor(t:T) {
    super();
    this.data = t;
  }

  protected doDeserialize(input:any):Wrapper<T> {
    this.data = this.data.deserialize(input["data"]);
    this.authToken = input["authToken"];
    return this;
  }
}

export class Child extends Serializable<Child> {
  name:string = "";

  protected doDeserialize(input:any):Child {
    this.name = input["name"];
    return this;
  }
}

export class Model extends Serializable<Model> {
  name:string = "";
  age:number = 0;
  child:Child = new Child();

  protected doDeserialize(input:any):Model {
    this.name = input["name"];
    this.age = input["age"];
    this.child = this.child.deserialize(input["child"]);
    return this;
  }
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  title = 'app';

  constructor(private http:Http) {
    this.getTestJson();
  }

  getSafeData<T extends Serializable<T>>(t:Serializable<T>):Observable<T> {
    return this.http.get("/assets/example.json").map((res:Response) => t.deserialize(res.json()));
  }

  getTestJson() {
    this.getSafeData<Wrapper<Model>>(new Wrapper<Model>(new Model())).subscribe(data => {
      console.log(data);
    }, error => {
      console.error(error);
      console.error(error.message);
    });
  }
}
